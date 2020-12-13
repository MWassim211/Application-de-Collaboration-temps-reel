/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Container,
} from '@material-ui/core';
import Peer from 'peerjs';
import MessagesList from './MessagesList';
import ChatSender from './ChatSender';
import InProgressConnection from './InProgressConnection';
import ConnexionForm from './ConnexionForm';
import Backgroundroot from '../assets/whatsupbg.png';
import config from '../config/PeerConfig';

const peer = new Peer(config);

let conn = null;

function Chat() {
  const [messages, setMessagesList] = useState([]);
  const [message, setMessage] = useState('');
  const [startAvailable, setStart] = useState(true);

  const [startDisable, setStartDisable] = useState(true);
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [connectedToRemote, setConnectedToRemote] = useState(false);
  const [connexionStarted, setConnexionStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const hangup = () => {
    // peer.disconnect();
    conn.close();
    setStart(true);
    setConnectedToRemote(false);
    setConnexionStarted(false);
    setReceiverId('');
    console.log(conn);
  };

  peer.on('open', (id) => {
    console.log('init');
    setSenderId(id);
    peer.on('connection', (receivedConnexion) => {
      setConnectedToRemote(true);
      receivedConnexion.on('data', (data) => {
        setMessagesList((oldArray) => [...oldArray, data]);
      });

      receivedConnexion.on('close', () => {
        hangup();
      });
    });
  });

  const start = () => {
    conn = peer.connect(receiverId);
    console.log(conn);
    setStart(false);
    setConnexionStarted(true);
  };

  const send = (messageText) => {
    if (messageText !== '') {
      setMessagesList((oldArray) => [...oldArray, { owner: true, text: messageText }]);
      conn.send({ owner: false, text: messageText });
      setMessage('');
    }
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
    setStartDisable(false);
  };

  const handleOnMessageChange = (e) => {
    setMessage(e.target.value);
    setIsTyping(true);
  };

  return (
    // <Container
    //   disableGutters
    //   style={{
    //     background: `url(${Backgroundroot})`,
    //   }}
    // >
    <div>
      <ConnexionForm
        senderId={senderId}
        receiverId={receiverId}
        start={startAvailable}
        startDisable={startDisable}
        startClick={handleStartClick}
        hangupClick={handleHangUpClick}
        senderChanged={handleOnSenderIdChange}
        receiverChanged={handleOnReceiverIdChange}
      />

      {((connexionStarted || connectedToRemote) && !(connexionStarted && connectedToRemote)
       && <InProgressConnection />) }

      {console.log(connectedToRemote && connexionStarted)}
      {connectedToRemote && connexionStarted && (<MessagesList messages={messages} />)}

      {connectedToRemote && connexionStarted && (
      <ChatSender
        send={send}
        message={message}
        isTyping={isTyping}
        handleOnMessageChange={handleOnMessageChange}
      />
      )}
    </div>
  // </Container>
  );
}

export default Chat;
