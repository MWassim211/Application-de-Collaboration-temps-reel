import React, { useRef, useState } from 'react';
import Peer from 'peerjs';
import PropTypes from 'prop-types';
import {
  Box, Grid, Button,
  Dialog, DialogContent, DialogContentText, DialogActions, IconButton,
} from '@material-ui/core';
import { Call, CallEnd } from '@material-ui/icons';
import config from '../config/PeerConfig';
import Chat from './chat/Chat';

function CallingDialog({ caller, handleAnswer }) {
  const [isOpen, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    handleAnswer(false);
  };
  const handleAction = (action) => {
    setOpen(false);
    handleAnswer(action);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogContent>
        <DialogContentText>
          {caller}
          {' '}
          is calling you!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={() => handleAction(true)}>
          <Call />
        </IconButton>
        <IconButton onClick={() => handleAction(false)}>
          <CallEnd />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}

function Error({ open, message }) {
  const [isOpen, setOpen] = useState(open);
  const handleClose = () => { setOpen(false); };
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const peer = new Peer(config);
let conn = null;

function VideoChat() {
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');

  const [connectionStarted, setConnectionStarted] = useState(false);
  const [connectedToRemote, setConnectedToRemote] = useState(false);
  const [callAvailable, setCall] = useState(false);

  const [messages, setMessagesList] = useState([]);
  const [message, setMessage] = useState('');

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const localStreamRef = useRef();
  const callRef = useRef();

  const stopTracks = (stream) => {
    stream.getTracks().forEach((track) => track.stop());
  };

  const onConnectionStateChange = () => {
    callRef.current.peerConnection.onconnectionstatechange = () => {
      const state = callRef.current.peerConnection.connectionState;
      console.log(`state : ${state}`);

      switch (state) {
        case 'connecting':
          console.log(state);
          break;
        case 'connected':
          console.log(state);
          break;
        case 'disconnected':
        case 'failed':
          callRef.current.close();
          break;
        default:
          break;
      }
    };
  };

  const onStream = () => {
    callRef.current.on('stream', (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;

      callRef.current.on('close', () => {
        stopTracks(remoteStream);
      });
    });
  };

  const handleAnswer = (answer) => {

  };

  peer.on('open', (id) => {
    setSenderId(id);

    peer.on('connection', (receivedConnexion) => {
      setConnectedToRemote(true);
      setCall(true);
      receivedConnexion.on('data', (data) => {
        setMessagesList((oldArray) => [...oldArray, data]);
      });
    });

    peer.on('call', (receivedCall) => {
      <CallingDialog />;
      receivedCall.answer(localStreamRef.current);
      callRef.current = receivedCall;

      onConnectionStateChange();
      onStream();
    });
  });

  peer.on('error', (error) => {
    console.log(error.type);
  });

  const start = () => {
    conn = peer.connect(receiverId);
    setConnectionStarted(true);
    setCall(true);
  };

  const stop = () => {
    conn.close();
    setConnectedToRemote(false);
    setConnectionStarted(false);
  };

  const send = (messageText) => {
    messageText.trim();
    if (messageText !== '') {
      setMessagesList((oldArray) => [...oldArray, { owner: true, text: messageText }]);
      conn.send({ owner: false, text: messageText });
      setMessage(' ');
    }
  };

  const call = () => {
    navigator.mediaDevices
      .getUserMedia({
        // audio: true,
        video: true,
      })
      .then((stream) => {
        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;
        callRef.current = peer.call(receiverId, localStreamRef.current);
      })
      .catch((e) => {
        console.log(e); alert(`getUserMedia() error:${e.name}`);
      });
  };

  const hangup = () => {
    localStreamRef.current.close();
    stopTracks(localStreamRef.current);
    setCall(false);
  };

  return (
    <Box height={1} width={1} position="fixed">
      <Grid container spacing={1} style={{ height: '100%' }}>
        <Grid item sm={3} lg={3}>
          <Chat
            senderId={senderId}
            receiverId={receiverId}
            start={start}
            stop={stop}
            send={send}
            call={call}
            hangup={hangup}
            setSenderId={setSenderId}
            setReceiverId={setReceiverId}
            connectionStarted={connectionStarted}
            callAvailable={callAvailable}
            connectedToRemote={connectedToRemote}
            messages={messages}
            message={message}
            setMessage={setMessage}
            sm={12}
            lg={12}
          />
        </Grid>
        <Grid item sm={9} lg={9}>
          <Box height={1} width={1} position="relative">
            <Box p={2}>
              <video ref={remoteVideoRef} autoPlay style={{ width: '100%', maxHeight: '100%' }}>
                <track kind="captions" srcLang="en" label="english_captions" />
              </video>
            </Box>
            <Box p={2} position="absolute" top="0px" right="0px" zIndex="tooltip" width={300}>
              <video ref={localVideoRef} autoPlay muted style={{ width: '100%' }}>
                <track kind="captions" srcLang="en" label="english_captions" />
              </video>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default VideoChat;
// const {
//   senderId, receiverId,
//   start, stop, call, hangup, setSenderId, setReceiverId,
//   connectionStarted, callAvailable, connectedToRemote,
//   messages,
// } = props;

// VideoChat.propTypes = {
//   senderId: PropTypes.string.isRequired,
//   receiverId: PropTypes.string.isRequired,
//   start: PropTypes.func.isRequired,
//   stop: PropTypes.func.isRequired,
//   call: PropTypes.func.isRequired,
//   hangup: PropTypes.func.isRequired,
//   setSenderId: PropTypes.func.isRequired,
//   setReceiverId: PropTypes.func.isRequired,
//   connectionStarted: PropTypes.bool.isRequired,
//   callAvailable: PropTypes.bool.isRequired,
//   connectedToRemote: PropTypes.bool.isRequired,
//   messages: PropTypes.arrayOf(PropTypes.shape({
//     owner: PropTypes.bool.isRequired,
//     text: PropTypes.string.isRequired,
//   })).isRequired,
// };

Error.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};

CallingDialog.propTypes = {
  caller: PropTypes.string.isRequired,
  handleAnswer: PropTypes.func.isRequired,
};
