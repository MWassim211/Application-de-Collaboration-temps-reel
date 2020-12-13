import React, { useRef, useState, useEffect } from 'react';
import Peer from 'peerjs';
import PropTypes from 'prop-types';
import {
  Box, Grid, Button, IconButton, Typography,
  Dialog, DialogContent, DialogContentText, DialogActions,
} from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import { Call, CallEnd } from '@material-ui/icons';
import config from '../../config/PeerConfig';
import Chat from './Chat';
import '../../assets/Dots.css';
import Ringtone from '../../assets/ringtone_minimal.wav';

function CallingDialog({ open, caller, handleAnswer }) {
  const ring = new Audio(Ringtone);
  const handleClose = () => {
    handleAnswer(false);
  };
  const handleAction = (action) => {
    handleAnswer(action);
  };
  useEffect(() => {
    if (open) ring.play();
    else ring.pause();
  });

  return (
    <Dialog open={open} onClose={handleClose} style={{ backgroundColor: '#333', color: 'white' }}>
      <DialogContent>
        <DialogContentText>
          <Typography variant="h6" align="center">
            {caller}
            <br />
            is calling you!
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={() => handleAction(true)}>
          <Call fontSize="large" style={{ color: green[500] }} />
        </IconButton>
        <IconButton onClick={() => handleAction(false)}>
          <CallEnd fontSize="large" style={{ color: red[500] }} />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}

function Error({ open, setOpen, message }) {
  const handleClose = () => { setOpen(false); };
  return (
    <Dialog open={open} onClose={handleClose}>
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
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [connecting, setConnecting] = useState(false);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const localStreamRef = useRef();
  const callRef = useRef();

  const stopTracks = (stream) => {
    stream.getTracks().forEach((track) => track.stop());
  };

  const hangup = () => {
    callRef.current.close();
    if (localStreamRef.current) { stopTracks(localStreamRef.current); }
    setCall(true);
    setConnecting(false);
  };

  const onConnectionStateChange = () => {
    callRef.current.peerConnection.onconnectionstatechange = () => {
      const state = callRef.current.peerConnection.connectionState;

      if (state === 'connected') { setConnecting(false); }
      if (state === 'disconnected' || state === 'failed') { hangup(); }
    };
  };

  const gotStream = (stream) => {
    localStreamRef.current = stream;
    localVideoRef.current.srcObject = stream;
  };

  const onStream = () => {
    callRef.current.on('stream', (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;

      callRef.current.on('close', () => {
        stopTracks(remoteStream);
      });
    });
  };

  const getMedia = (func) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        gotStream(stream);
        func();
        onConnectionStateChange();
        onStream();
        setCall(false);
      })
      .catch((e) => {
        setErrorMessage(`getUserMedia() error:${e.name}`);
        setError(true);
      });
  };

  const start = () => {
    conn = peer.connect(receiverId);
    setConnectionStarted(true);
    setCall(true);
  };

  const stop = () => {
    conn.close();
    if (callRef.current) { hangup(); }
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
    getMedia(() => {
      callRef.current = peer.call(receiverId, localStreamRef.current);
      setConnecting(true);
    });
  };

  const handleAnswer = (ans) => {
    setOpen(false);
    if (ans) {
      getMedia(() => callRef.current.answer(localStreamRef.current));
    } else {
      hangup();
      conn.send('call-refused');
    }
  };

  peer.on('open', (id) => {
    setSenderId(id);
    peer.on('connection', (receivedConnexion) => {
      setConnectedToRemote(true);
      setCall(true);
      receivedConnexion.on('data', (data) => {
        if (data === 'call-refused') hangup();
        else setMessagesList((oldArray) => [...oldArray, data]);
      });

      receivedConnexion.on('close', () => {
        stop();
      });
    });

    peer.on('call', (receivedCall) => {
      callRef.current = receivedCall;
      setOpen(true);
    });
  });

  return (
    <Box height={1} width={1} position="fixed">
      {error && <Error open={error} setOpen={setError} message={errorMessage} />}
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
          <CallingDialog open={open} caller={receiverId} handleAnswer={handleAnswer} />
          <Box height="97%" width="97%" position="relative">
            {connecting && (
              <Box width={1} height={1} style={{ backgroundColor: '#333' }}>
                <Grid container justify="center" alignItems="center" style={{ height: '100%' }}>
                  <Grid item>
                    <div className="spinner">
                      <div className="bounce1" />
                      <div className="bounce2" />
                      <div className="bounce3" />
                    </div>
                  </Grid>
                </Grid>
              </Box>
            )}
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

Error.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

CallingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  caller: PropTypes.string.isRequired,
  handleAnswer: PropTypes.func.isRequired,
};
