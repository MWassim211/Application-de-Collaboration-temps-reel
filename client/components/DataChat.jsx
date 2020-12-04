/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-diseable */
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Peer from 'peerjs';
import { ContactSupportOutlined } from '@material-ui/icons';

const peer = new Peer({
  host: 'localhost',
  port: 3000,
  path: '/mypeer',
});

let conn = null;

peer.on('connection', (receivedConn) => {
  conn = receivedConn;
  console.log('connexion etablished');
});

const useStyles = makeStyles((theme) => ({
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const start = (otherId) => {
  conn = peer.connect(otherId);
  console.log(conn);
  setTimeout(() => {
    console.log('time out ');
  });
  conn.on('data', (data) => {
    console.log('Received', data);
  });
};

const send = () => {
  console.log('data sent');
  conn.send('helloyyy');
};

function DataChat(props) {
  const classes = useStyles();
  const [startAvailable, setStart] = useState(true);
  const [sendAvailable, setSend] = useState(false);
  const [hangupAvailable, setHangup] = useState(false);
  const [myId, setmyId] = useState('');
  const [otherId, setOtherId] = useState('');

  peer.on('open', (id) => {
    setmyId(id);
    console.log(`My peer ID is: ${id}`);
  });

  return (
    <div>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField id="standard-basic" label="Standard" value={myId} onChange={(e) => setmyId(e.target.value)} />
        <TextField id="filled-basic" label="Filled" variant="filled" value={otherId} onChange={(e) => setOtherId(e.target.value)} />
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      </form>
      <ButtonGroup
        size="large"
        color="primary"
        aria-label="large outlined primary button group"
      >
        <Button onClick={() => start(otherId)}>
          Start
        </Button>
        <Button>
          Send
        </Button>
        <Button onClick={() => send()}>
          Hang Up

        </Button>
      </ButtonGroup>
    </div>
  );
}

export default DataChat;
