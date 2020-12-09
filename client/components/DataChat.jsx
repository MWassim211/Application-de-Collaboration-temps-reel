/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField, IconButton, Button, Card, CardContent, CardActions, Collapse, Grid,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Peer from 'peerjs';
import InputAdornment from '@material-ui/core/InputAdornment';
import debounce from 'lodash/debounce';
import MessageLists from './MessagesList';
import ChatSender from './ChatSender';
import ChatCorp from './ChatCorp';

const peer = new Peer({
  host: 'localhost',
  port: 3000,
  path: '/mypeer',
  debug: 2,
});

let conn = null;

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 345,
  },
  mainForm: {
    display: 'inline-block',
    width: '100%',
    margin: '0%',
    padding: '0%',
    position: 'fixed',
  },
  startButton: {
    borderRadius: '0',
    fullWidth: true,
    size: 'large',
  },
}));

function Chat() {
  const classes = useStyles();
  const monIdentifiant = 'moii';
  const [messages, setMessagesList] = useState([]);
  const [message, setMessage] = useState('');
  const [startAvailable, setStart] = useState(true);
  // const [sendAvailable, setSend] = useState(false);
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
    setStart(false);
    setHangup(true);
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
    <div>
      <Card className={classes.mainForm}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={10} sm={5}>
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
            <Grid item xs={10} sm={5}>
              <TextField
                className={classes.inputs}
                id="receiver"
                label="Receiver"
                fullWidth
                value={receiverId}
                onChange={handleOnRecieverIdChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={2} sm={2}>
              {startAvailable && (
              <Button variant="contained" color="secondary" onClick={handleStartClick}>
                Start
              </Button>
              )}
              {hangupAvailable && (
              <Button variant="contained" color="secondary" onClick={handleHangUpClick}>
                HangUp
              </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* {((connexionStarted) && <ChatCorp />) || ((connectedToRemote) && <ChatCorp />)} */}
      {((connexionStarted || connectedToRemote) && !(connexionStarted && connectedToRemote)
       && <ChatCorp />) }
      {connectedToRemote && connexionStarted && <MessageLists messages={messages} />}
      {/* <Card className={classes.root}>
        <CardContent>
          <TextField
            id="sender"
            label="Sender"
            fullWidth
            value={senderId}
            onChange={(e) => setSenderId(e.target.value)}
          />
          <TextField
            id="receiver"
            label="Receiver"
            fullWidth
            value={receiverId}
            onChange={handleOnRecieverIdChange}
          />
        </CardContent>
        {

        }
        {!connectedToRemote && !startAvailable ? <p>yout tmote is connecting</p> : <p> </p>}
        <CardActions disableSpacing>
          {startAvailable && (
          <Button variant="outlined" onClick={handleStartClick}
          endIcon={<KeyboardArrowRightIcon />} fullWidth>
            START
          </Button>
          )}
          {hangupAvailable && (
          <Button variant="outlined" onClick={handleHangUpClick} endIcon={<CloseIcon />} fullWidth>
            HANG UP
          </Button>
          )}
        </CardActions>
        <MessageLists messages={messages} monid={monIdentifiant} />
        <Collapse in={startAvailable} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container direction="row" justify="center" alignItems="baseline">
              <TextField id="message" label="Message..." multiline rows={2}
               rowsMax={2} variant="outlined" width="75%" value={message}
                onChange={handleOnMessageChange} />
              <IconButton color="primary" component="span" onClick={() => send(message)}>
                <SendIcon />
              </IconButton>
            </Grid>
          </CardContent>
        </Collapse>
      </Card> */}
      {connectedToRemote && connexionStarted && (
      <ChatSender
        startAvailable={startAvailable}
        message={message}
        send={send}
        isTyping={isTyping}
        handleOnMessageChange={handleOnMessageChange}
        handleTyping={handleTyping}
      />
      )}
    </div>
  );
}

export default Chat;
