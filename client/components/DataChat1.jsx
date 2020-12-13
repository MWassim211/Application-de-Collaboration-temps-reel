import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import Peer from 'peerjs';
// import debounce from 'lodash/debounce';
import Chat from './chat/Chat';

const peer = new Peer({
  // host: 'tiw8-chat.herokuapp.com',
  host: 'localhost',
  port: 3000,
  path: '/mypeer',
  debug: 2,
});

let conn = null;

function DataChat1() {
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');

  const [connectionStarted, setConnectionStarted] = useState(false);
  const [connectedToRemote, setConnectedToRemote] = useState(false);

  const [messages, setMessagesList] = useState([]);
  const [message, setMessage] = useState('');
  // const [isTyping, setIsTyping] = useState(false);

  peer.on('open', (id) => {
    setSenderId(id);
    peer.on('connection', (receivedConnexion) => {
      setConnectedToRemote(true);
      receivedConnexion.on('data', (data) => {
        setMessagesList((oldArray) => [...oldArray, data]);
      });
    });
  });

  const start = () => {
    conn = peer.connect(receiverId);
    setConnectionStarted(true);
  };

  const stop = () => {
    conn.close();
    setConnectedToRemote(false);
    setConnectionStarted(false);
  };

  const send = (messageText) => {
    setMessagesList((oldArray) => [...oldArray, { owner: true, text: messageText }]);
    conn.send({ owner: false, text: messageText });
    setMessage(' ');
  };

  // const handleTyping = debounce(() => {
  //   setIsTyping(false);
  // }, 500);

  // const handleOnMessageChange = (e) => {
  //   setMessage(e.target.value);
  //   setIsTyping(true);
  //   handleTyping();
  // };

  return (
    <Box width={1} height={1}>
      <Chat
        senderId={senderId}
        receiverId={receiverId}
        start={start}
        stop={stop}
        send={send}
        setSenderId={setSenderId}
        setReceiverId={setReceiverId}
        connectionStarted={connectionStarted}
        connectedToRemote={connectedToRemote}
        callAvailable={false}
        call={() => console.log('call')}
        hangup={() => console.log('hangup')}
        messages={messages}
        message={message}
        setMessage={setMessage}
      />
    </Box>
  );
}

export default DataChat1;
