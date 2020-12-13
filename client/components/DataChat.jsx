import React, { useState, useRef } from 'react';
import {
  Container,
} from '@material-ui/core';
import Peer from 'peerjs';
import debounce from 'lodash/debounce';
import MessagesList from './MessagesList';
import ChatSender from './ChatSender';
import InProgressConnection from './InProgressConnection';
import ConnexionForm from './ConnexionForm';

const peer = new Peer({
  // host: 'tiw8-chat.herokuapp.com',
  host: 'localhost',
  port: 3000,
  path: '/mypeer',
  debug: 2,
});

let conn = null;

function Chat() {
  const [messages, setMessagesList] = useState([]);
  const [message, setMessage] = useState('');
  const [startAvailable, setStart] = useState(true);
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [connectedToRemote, setConnectedToRemote] = useState(false);
  const [connexionStarted, setConnexionStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const localCallRef = useRef(null);

  const onConnectionStateChange = () => {
    localCallRef.current.peerConnection.onconnectionstatechange = () => {
      const state = localCallRef.current.peerConnection.connectionState;
      console.log(`state : ${state}`);
      if (state === 'disconnected' || state === 'failed') {
        localCallRef.current.close();
      }
    };
  };
  peer.on('open', (id) => {
    setSenderId(id);
    peer.on('connection', (receivedConnexion) => {
      setConnectedToRemote(true);
      receivedConnexion.on('data', (data) => {
        setMessagesList((oldArray) => [...oldArray, data]);
      });
      localCallRef.current = receivedConnexion;
      onConnectionStateChange();
    });
  });

  const start = () => {
    conn = peer.connect(receiverId);
    console.log("l'objet connnexion");
    console.log(conn);
    localCallRef.current = conn;
    onConnectionStateChange();
    setStart(false);
    setConnexionStarted(true);
  };

  const send = (messageText) => {
    setMessagesList((oldArray) => [...oldArray, { owner: true, text: messageText }]);
    conn.send({ owner: false, text: messageText });
    setMessage(' ');
  };

  const hangup = () => {
    localCallRef.current.close();
    peer.disconnect();
    setStart(true);
    setConnectedToRemote(false);
    setConnexionStarted(false);
    setReceiverId('');
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
  const handleTyping = debounce(() => {
    setIsTyping(false);
  }, 500);

  const handleOnMessageChange = (e) => {
    setMessage(e.target.value);
    setIsTyping(true);
    handleTyping();
  };

  return (
    <Container disableGutters>
      <ConnexionForm
        senderId={senderId}
        receiverId={receiverId}
        start={startAvailable}
        startClick={handleStartClick}
        hangupClick={handleHangUpClick}
        senderChanged={handleOnSenderIdChange}
        receiverChanged={handleOnReceiverIdChange}
      />

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

    </Container>
  );
}

export default Chat;
