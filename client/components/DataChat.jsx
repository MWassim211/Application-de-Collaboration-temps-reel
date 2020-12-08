import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField, IconButton, Button, Card, CardContent, Collapse, Grid,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Peer from 'peerjs';
import MessageLists from './MessagesList';

const peer = new Peer({
  host: 'localhost',
  port: 3000,
  path: '/mypeer',
  debug: 2,
});

let conn = null;

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

function Chat() {
  const classes = useStyles();
  const monIdentifiant = 'moii';
  const [messages, setMessagesList] = useState([]);
  const [message, setMessage] = useState('');
  const [startAvailable, setStart] = useState(false);
  const [sendAvailable, setSend] = useState(false);
  const [hangupAvailable, setHangup] = useState(false);
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');

  peer.on('open', (id) => {
    setSenderId(id);
    peer.on('connection', (receivedConnexion) => {
      receivedConnexion.on('data', (data) => {
        setMessagesList((oldArray) => [...oldArray, data]);
      });
    });
  });

  // Start Connection
  const start = () => {
    conn = peer.connect(receiverId);
    setStart(true);
    setHangup(true);
    setSend(true);
  };

  const send = (messageText) => {
    setMessagesList((oldArray) => [...oldArray, { owner: true, text: messageText }]);
    conn.send({ owner: false, text: messageText });
    setMessage('');
  };

  const hangup = () => {
    peer.disconnect();
    setStart(false);
    setHangup(false);
    setSend(false);
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

  const handleOnMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <Card width="100%">
      <CardContent>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={6} sm={5} lg={5}>
            <TextField
              id="sender"
              label="Sender"
              fullWidth
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={5} lg={5}>
            <TextField
              id="receiver"
              label="Receiver"
              fullWidth
              value={receiverId}
              onChange={handleOnRecieverIdChange}
            />
          </Grid>
          <Grid item xs={12} sm={2} lg={2}>
            {!startAvailable && (
            <Button variant="outlined" onClick={handleStartClick} endIcon={<KeyboardArrowRightIcon />} fullWidth>
              START
            </Button>
            )}
            {hangupAvailable && (
            <Button variant="outlined" onClick={handleHangUpClick} endIcon={<CloseIcon />} fullWidth>
              HANG UP
            </Button>
            )}
          </Grid>
        </Grid>
      </CardContent>
      <MessageLists messages={messages} monid={monIdentifiant} />
      <Collapse in={sendAvailable} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container direction="row" justify="center" alignItems="baseline">
            <TextField id="message" label="Message..." multiline rows={1} rowsMax={1} variant="outlined" width="90%" value={message} onChange={handleOnMessageChange} />
            <IconButton color="primary" component="span" onClick={() => send(message)}>
              <SendIcon />
            </IconButton>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default Chat;
