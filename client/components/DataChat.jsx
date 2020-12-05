import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField, IconButton, Button, Card, CardContent, CardActions, Collapse, Grid,
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
    maxWidth: 345,
  },
}));

function Chat() {
  const classes = useStyles();
  const monIdentifiant = 'moii';
  const [messages, setMessagesList] = useState([]);
  const [message, setMessage] = useState('');
  const [startAvailable, setStart] = useState(false);
  // const [sendAvailable, setSend] = useState(false);
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
    <Card className={classes.root}>
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
      <CardActions disableSpacing>
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
      </CardActions>
      <MessageLists messages={messages} monid={monIdentifiant} />
      <Collapse in={startAvailable} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container direction="row" justify="center" alignItems="baseline">
            <TextField id="message" label="Message..." multiline rows={2} rowsMax={2} variant="outlined" width="75%" value={message} onChange={handleOnMessageChange} />
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