import React, { useState, useRef } from 'react';
import {
  Box, IconButton, Grid, Card, CardContent, Button,
} from '@material-ui/core';
import Peer from 'peerjs';
import debounce from 'lodash/debounce';
import CallIcon from '@material-ui/icons/Call';
import ConnexionForm from './ConnexionForm';
import MessagesList from './MessagesList';
import ChatSender from './ChatSender';
import InProgressConnection from './InProgressConnection';

const peer = new Peer({
  host: 'localhost',
  // host: 'tiw8-chat.herokuapp.com',
  port: 3000,
  path: '/mypeer',
  debug: 2,
});
let conn = null;

function Video() {
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [startAvailable, setStart] = useState(true);
  const [callAvailable, setCall] = useState(false);
  const [onCall, setOnCall] = useState(false);
  const [messages, setMessagesList] = useState([]);
  const [message, setMessage] = useState('');
  const [connectedToRemote, setConnectedToRemote] = useState(false);
  const [connexionStarted, setConnexionStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const localStreamRef = useRef();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localCallRef = useRef();

  const onConnectionStateChange = () => {
    localCallRef.current.peerConnection.onconnectionstatechange = () => {
      const state = localCallRef.current.peerConnection.connectionState;
      console.log(`state : ${state}`);
      if (state === 'disconnected' || state === 'failed') {
        localCallRef.current.close();
      }
    };
  };

  const onStream = () => {
    localCallRef.current.on('stream', (remoteStream) => {
      setOnCall(true);
      remoteVideoRef.current.srcObject = remoteStream;

      localCallRef.current.on('close', () => {
        remoteStream.getTracks().forEach((track) => {
          track.stop();
        });
      });
    });
  };

  peer.on('open', (id) => {
    setSenderId(id);
    peer.on('connection', (receivedConnexion) => {
      setConnectedToRemote(true);
      receivedConnexion.on('data', (data) => {
        setMessagesList((oldArray) => [...oldArray, data]);
      });
    });
    peer.on('call', (call) => {
      call.answer(localStreamRef.current);
      localCallRef.current = call;

      onConnectionStateChange();
      onStream();
    });
  });

  const gotStream = (stream) => {
    localStreamRef.current = stream;
    localVideoRef.current.srcObject = stream;
    setCall(true);
  };

  const start = () => {
    conn = peer.connect(receiverId);

    setStart(false);
    setConnexionStarted(true);

    navigator.mediaDevices
      .getUserMedia({
        // audio: true,
        video: true,
      })
      .then(gotStream)
      .catch((e) => { console.log(e); alert(`getUserMedia() error:${e.name}`); });
  };
  const send = (messageText) => {
    setMessagesList((oldArray) => [...oldArray, { owner: true, text: messageText }]);
    conn.send({ owner: false, text: messageText });
    setMessage(' ');
  };

  const hangup = () => {
    localCallRef.current.close();
    localStreamRef.current.getTracks().forEach((track) => {
      track.stop();
    });

    setStart(true);
    setCall(false);
    setOnCall(false);
  };

  const call = () => {
    localCallRef.current = peer.call(receiverId, localStreamRef.current);
    onConnectionStateChange();
    onStream();
  };

  const handleTyping = debounce(() => {
    setIsTyping(false);
  }, 500);

  const handleOnMessageChange = (e) => {
    setMessage(e.target.value);
    setIsTyping(true);
    handleTyping();
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
    <Box height="100%" width="100%" position="fixed">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3} lg={3}>
          {!(connectedToRemote && connexionStarted) && (
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
          )}
          <Card>
            <CardContent>
              <Button>
                HANG UP
              </Button>
              <IconButton>
                <CallIcon />
              </IconButton>
            </CardContent>
          </Card>
          {((connexionStarted || connectedToRemote) && !(connexionStarted && connectedToRemote)
            && <InProgressConnection />) }

          {connectedToRemote && connexionStarted && (<MessagesList messages={messages} />)}

          {connectedToRemote && connexionStarted && (
          <ChatSender
            send={send}
            message={message}
            isTyping={isTyping}
            handleOnMessageChange={handleOnMessageChange}
          />
          )}
        </Grid>
        <Grid item xs={12} sm={9} lg={9}>
          <Box height="90%" position="relative">
            {onCall && (
            <Box p={2}>
              <video ref={remoteVideoRef} autoPlay style={{ width: '100%', maxHeight: '100%' }}>
                <track kind="captions" srcLang="en" label="english_captions" />
              </video>
            </Box>
            )}
            <Box p={2} position="absolute" top="0px" right="0px" zIndex="tooltip" width={300}>
              <video ref={localVideoRef} autoPlay muted style={{ width: '100%' }}>
                <track kind="captions" srcLang="en" label="english_captions" />
              </video>
            </Box>
          </Box>
          {callAvailable && (
          <Box height="10%">
            <IconButton color="primary" onClick={call}>
              <CallIcon />
            </IconButton>
          </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Video;
