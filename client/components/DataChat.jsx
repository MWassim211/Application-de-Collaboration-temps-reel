import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField, IconButton, Button, Card, CardContent, CardActions, Collapse, Grid,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Peer from 'peerjs';

const peer = new Peer({
  host: 'localhost',
  port: 3000,
  path: '/mypeer',
  debug: 2,
});

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 345,
  },
}));

function Chat() {
  const classes = useStyles();
  const [startAvailable, setStart] = useState(false);
  const [sendAvailable, setSend] = useState(false);
  const [hangupAvailable, setHangup] = useState(false);
  const [conn, setConn] = useState(null);
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');

  peer.on('open', (id) => {
    console.log(`My peer ID is: ${id}`);
    setSenderId(id);
  });

  peer.on('connection', (receivedConn) => {
    setConn(receivedConn);
    console.log('connexion etablished');
    console.log(conn);
    setSend(true);
    setHangup(true);
  });

  if (conn !== null) {
    conn.on('data', (data) => {
      console.log('Received', data);
    });
  }

  const start = () => {
    if (receiverId) {
      setConn(peer.connect(receiverId));
      setStart(true);
      console.log('connexion start');
      console.log(conn);
    }
  };

  const send = () => {
    console.log(`sendAvailable ${sendAvailable}`);
    conn.send('helloyyy');
    console.log('data sent');
  };

  const hangup = () => {
    peer.disconnect();
    setStart(false);
    setSend(false);
    setHangup(false);
    console.log('disconnect');
  };

  const handleStartClick = () => {
    start();
  };

  const handleSendClick = () => {
    send();
  };

  const handleHangUpClick = () => {
    hangup();
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
          onChange={(e) => setReceiverId(e.target.value)}
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
      <Collapse in={startAvailable} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container direction="row" justify="center" alignItems="baseline">
            <TextField id="message" label="Message..." multiline rows={2} rowsMax={2} variant="outlined" width="75%" />
            <IconButton color="primary" component="span" onClick={handleSendClick}>
              <SendIcon />
            </IconButton>
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default Chat;
