import React, { useState } from 'react';
import {
  Button, ButtonGroup,
} from '@material-ui/core';

function Video() {
  const [startAvailable, setStart] = useState(true);
  const [callAvailable, setCall] = useState(false);
  const [hangupAvailable, setHangup] = useState(false);

  const gotStream = (stream) => {
    localVideoRef.current.srcObject = stream;
    setCall(true); // On fait en sorte d'activer le bouton permettant de commencer un appel
    localStreamRef.current = stream;
  };

  const start = () => {
    setStart(false);
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(gotStream)
      .catch((e) => { console.log(e); alert(`getUserMedia() error:${e.name}`); });
  };

  const hangUp = () => {

  };
  return (
    <div>
      <video ref={localVideoRef} autoPlay muted>
        <track kind="captions" srcLang="en" label="english_captions" />
      </video>
      <video ref={remoteVideoRef} autoPlay>
        <track kind="captions" srcLang="en" label="english_captions" />
      </video>

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
    </div>
  );
}

export default Video;
