import React, { useState, useRef } from 'react';
import {
  Button, ButtonGroup, Container, Grid,
} from '@material-ui/core';
import DataChat from './DataChat';

function Video() {
  const [startAvailable, setStart] = useState(true);
  const [callAvailable, setCall] = useState(false);
  const [hangupAvailable, setHangup] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const gotStream = (stream) => {
    window.stream = stream;
    console.log(localVideoRef);
    localVideoRef.current.srcObject = stream;
    setCall(true); // On fait en sorte d'activer le bouton permettant de commencer un appel
    // localStreamRef.current = stream;
  };

  const start = () => {
    setStart(false);
    setHangup(true);
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(gotStream)
      .catch((e) => { console.log(e); alert(`getUserMedia() error:${e.name}`); });
  };

  const hangUp = () => {
    console.log('hangup');
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    setStart(true);
    setHangup(false);
    setCall(false);
  };

  const call = () => {
    console.log('call');
  };

  return (
    <Container disableGutters="true" maxWidth="false">
      <Grid container spacing={2}>
        <Grid item xs={3} sm={3} lg={3}>
          <DataChat isSmall="true" />
        </Grid>
        <Grid item xs={9} sm={9} lg={9}>
          <Grid container disableGutters="true" maxWidth="false" direction="column">
            <Grid item>

              <video ref={localVideoRef} autoPlay muted>
                <track kind="captions" srcLang="en" label="english_captions" />
              </video>
              <video ref={remoteVideoRef} autoPlay>
                <track kind="captions" srcLang="en" label="english_captions" />
              </video>
            </Grid>

            <ButtonGroup
              size="large"
              color="primary"
              aria-label="large outlined primary button group"
            >
              <Button onClick={start} disabled={!startAvailable}>
                Start
              </Button>
              <Button onClick={call} disabled={!callAvailable}>
                Call
              </Button>
              <Button onClick={hangUp} disabled={!hangupAvailable}>
                Hang Up
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Video;
