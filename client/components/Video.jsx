import React, { useState, useRef } from 'react';
import {
  Button, ButtonGroup, Container, Grid,
} from '@material-ui/core';
import Peer from 'peerjs';
import ConnexionForm from './ConnexionForm';

const peer = new Peer({
  host: 'localhost',
  port: 3000,
  path: '/mypeer',
  debug: 2,
});

// navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function Video() {
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [startAvailable, setStart] = useState(true);
  const [callAvailable, setCall] = useState(false);
  const [hangupAvailable, setHangup] = useState(false);

  const localStreamRef = useRef();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localCallRef = useRef();

  peer.on('open', (id) => {
    setSenderId(id);
    peer.on('connection', (receivedConnexion) => {
      console.log('connexion ! ');
      console.log(receivedConnexion);
      setCall(true);
    });
  });

  peer.on('call', (callReceived) => {
    console.log('on call');
    localCallRef.current = callReceived;
    console.log(localCallRef.current);

    callReceived.answer(localStreamRef.current);

    callReceived.on('stream', (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
    });
  });

  peer.on('close', () => {
    console.log('WTF');
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  });

  const gotStream = (stream) => {
    localStreamRef.current = stream;
    localVideoRef.current.srcObject = stream;
    // setCall(true);
  };

  const start = () => {
    peer.connect(receiverId);
    setStart(false);
    setHangup(true);
    navigator.mediaDevices
      .getUserMedia({
        // audio: true,
        video: true,
      })
      .then(gotStream)
      .catch((e) => { console.log(e); alert(`getUserMedia() error:${e.name}`); });
  };

  const hangup = () => {
    console.log('hangup');
    // localCallRef.current.close();
    console.log(localCallRef.current);

    if (localCallRef.current) {
      console.log('closing local');
      localCallRef.current.close();
    }

    // if (localStreamRef.current) {
    //   localStreamRef.current.getTracks().forEach((track) => {
    //     track.stop();
    //   });
    // }

    // peer.disconnect();
    setStart(true);
    setHangup(false);
    setCall(false);
  };

  const call = () => {
    if (callAvailable) {
      console.log("i'm calling");
      localCallRef.current = peer.call(receiverId, localStreamRef.current);
      console.log(localCallRef.current);
      localCallRef.current.on('stream', (remoteStream) => {
        console.log('on stream local');
        remoteVideoRef.current.srcObject = remoteStream;
      });
    }
  };

  const handleStartClick = () => {
    start();
  };

  const handleHangUpClick = () => {
    hangup();
  };

  const handleOnSenderIdChange = (e) => {
    setSenderId(e.target.value);
  };

  const handleOnReceiverIdChange = (e) => {
    setReceiverId(e.target.value);
  };

  return (
    <Container disableGutters maxWidth={false}>
      <Grid container spacing={2}>
        <Grid item xs={3} sm={3} lg={3}>
          <ConnexionForm
            isSmall
            senderId={senderId}
            receiverId={receiverId}
            start={startAvailable}
            startClick={handleStartClick}
            hangupClick={handleHangUpClick}
            senderChanged={handleOnSenderIdChange}
            receiverChanged={handleOnReceiverIdChange}
          />
        </Grid>
        <Grid item xs={9} sm={9} lg={9}>
          <Grid container disableGutters maxWidth={false} direction="column">
            <Grid item>
              <video ref={localVideoRef} autoPlay muted>
                <track kind="captions" srcLang="en" label="english_captions" />
              </video>
              <video ref={remoteVideoRef} autoPlay>
                <track kind="captions" srcLang="en" label="english_captions" />
              </video>
            </Grid>
            <Grid item>
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
                <Button onClick={hangup} disabled={!hangupAvailable}>
                  Hang Up
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Video;
