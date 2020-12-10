import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, IconButton, Button, Card, CardContent, Grid, Container,
} from '@material-ui/core';
import Peer from 'peerjs';
import InputAdornment from '@material-ui/core/InputAdornment';
import debounce from 'lodash/debounce';
import MessageLists from './MessagesList';
import ChatSender from './ChatSender';
import InProgressConnection from './InProgressConnection';

const peer = new Peer({
  host: 'localhost',
  port: 3000,
  path: '/mypeer',
  debug: 2,
});

let conn = null;

function Chat({ isSmall }) {
  const [messages, setMessagesList] = useState([]);
  const [message, setMessage] = useState('');
  const [startAvailable, setStart] = useState(true);
  const [hangupAvailable, setHangup] = useState(false);
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [connectedToRemote, setConnectedToRemote] = useState(false);
  const [connexionStarted, setConnexionStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  peer.on('open', (id) => {
    setSenderId(id);
    peer.on('connection', (receivedConnexion) => {
      console.log('done ! ');
      setConnectedToRemote(true);
      console.log(connectedToRemote);
      console.log('normelement en true;');
      receivedConnexion.on('data', (data) => {
        setMessagesList((oldArray) => [...oldArray, data]);
      });
    });
  });

  // Start Connection
  const start = () => {
    conn = peer.connect(receiverId);
    setStart(false);
    setConnexionStarted(true);
    setHangup(true);
  };

  const send = (messageText) => {
    setMessagesList((oldArray) => [...oldArray, { owner: true, text: messageText }]);
    conn.send({ owner: false, text: messageText });
    setMessage(' ');
  };

  const hangup = () => {
    peer.disconnect();
    setStart(false);
    setHangup(false);
  };

  const handleStartClick = () => {
    start();
  };

  const handleHangUpClick = () => {
    hangup();
  };

  const handleOnRecieverIdChange = (e) => {
    setReceiverId(e.target.value);
  };

  const handleTyping = debounce(() => {
    setIsTyping(false);
  }, 500);

  const handleOnMessageChange = (e) => {
    setMessage(e.target.value);
    setIsTyping(true);
    handleTyping();
  };

  const clipboardCopy = (e) => {
    const textField = document.getElementById('sender');
    textField.select();
    document.execCommand('copy');
    e.target.focus();
  };

  return (
    <Container disableGutters="true" width="300px">
      <Card disableSpacing="true" style={{ marginBottom: '10px' }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center" justify="center">
            <Grid item xs={12} sm={isSmall ? 12 : 5} lg={isSmall ? 12 : 5}>
              <TextField
                id="sender"
                label="Sender"
                fullWidth
                value={senderId}
                onChange={(e) => setSenderId(e.target.value)}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={clipboardCopy}>
                        <span className="material-icons">
                          content_copy
                        </span>
                      </IconButton>
                    </InputAdornment>),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={isSmall ? 12 : 5} lg={isSmall ? 12 : 5}>
              <TextField
                id="receiver"
                label="Receiver"
                fullWidth
                value={receiverId}
                onChange={handleOnRecieverIdChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={isSmall ? 12 : 2}>
              {startAvailable && (
                <Button variant="contained" color="secondary" size="large" fullWidth onClick={handleStartClick}>
                  Start
                </Button>
              )}
              {hangupAvailable && (
                <Button variant="contained" color="secondary" size="large" fullWidth onClick={handleHangUpClick}>
                  HangUp
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {((connexionStarted || connectedToRemote) && !(connexionStarted && connectedToRemote)
       && <InProgressConnection />) }

      {connectedToRemote && connexionStarted && (<MessageLists messages={messages} />)}

      {connectedToRemote && connexionStarted && (
      <ChatSender
        message={message}
        send={send}
        isTyping={isTyping}
        handleOnMessageChange={handleOnMessageChange}
      />
      )}

    </Container>
  );
}

export default Chat;

Chat.defaultProps = {
  isSmall: false,
};

Chat.propTypes = {
  isSmall: PropTypes.bool,
};
