import React, { useState, useRef } from 'react';
import {
  Button, ButtonGroup, Container, Grid,
} from '@material-ui/core';
import Peer from 'peerjs';
import ConnexionForm from './ConnexionForm';

const peer = new Peer({
  // host: 'localhost',
  host: 'tiw8-chat.herokuapp.com',
  // port: 3000,
  path: '/mypeer',
  debug: 2,
});

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
    // peer.on('connection', (receivedConnexion) => {
    //   console.log('connexion ! ');
    //   console.log(receivedConnexion);
    //   setCall(true);
    // });
    peer.on('call', (call) => {
      console.log('on call');

      console.log(localCallRef.current);

      call.answer(localStreamRef.current);

      localCallRef.current = call;
      localCallRef.current.peerConnection.onconnectionstatechange = () => {
        const state = localCallRef.current.peerConnection.connectionState;
        console.log(`state : ${state}`);
        if (state === 'disconnected' || state === 'failed') {
          localCallRef.current.close();
        }
        if (state === 'closed') console.log('closed on call');
      };

      localCallRef.current.on('stream', (remoteStream) => {
        console.log('on stream');
        remoteVideoRef.current.srcObject = remoteStream;

        localCallRef.current.on('close', () => {
          console.log('on close call received');
          remoteStream.getTracks().forEach((track) => {
            console.log('remote stream on call');
            track.stop();
          });
        });
      });
    });
  });

  const gotStream = (stream) => {
    // // eslint-disable-next-line no-param-reassign
    // stream.onremovetrack = () => console.log('removetrack local?');
    // // eslint-disable-next-line no-param-reassign
    // stream.oninactive = () => console.log('inactive local?');
    console.log('local stream');
    console.log(stream);
    localStreamRef.current = stream;
    localVideoRef.current.srcObject = stream;

    setCall(true);
  };

  const start = () => {
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
    console.log(localCallRef.current);

    localCallRef.current.close();
    localStreamRef.current.getTracks().forEach((track) => {
      track.stop();
    });

    // peer.disconnect();
    setStart(true);
    setHangup(false);
    setCall(false);
  };

  const call = () => {
    if (callAvailable) {
      console.log("i'm calling");
      localCallRef.current = peer.call(receiverId, localStreamRef.current);
      localCallRef.current.peerConnection.onconnectionstatechange = () => {
        const state = localCallRef.current.peerConnection.connectionState;
        console.log(`state : ${state}`);
        if (state === 'disconnected' || state === 'failed') {
          localCallRef.current.close();
        }
        if (state === 'closed') console.log('closed ');
      };
      console.log(localCallRef.current);
      localCallRef.current.on('stream', (remoteStream) => {
        console.log('on stream local');
        remoteVideoRef.current.srcObject = remoteStream;

        localCallRef.current.on('close', () => {
          console.log('on close call');
          remoteStream.getTracks().forEach((track) => {
            console.log('remote stram close');
            track.stop();
          });
        });
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
