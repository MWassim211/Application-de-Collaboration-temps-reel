import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import ChatActions from './ChatActions';
import ChatMessages from './ChatMessages';
import InProgressConnection from '../datachat/InProgressConnection';

function Chat(props) {
  const {
    senderId, receiverId,
    start, stop, send, call, hangup, setSenderId, setReceiverId,
    connectionStarted, callAvailable, connectedToRemote,
    messages, message, setMessage,
    sm, lg,
  } = props;

  const handleOnSenderIdChange = (e) => {
    setSenderId(e.target.value);
  };

  const handleOnReceiverIdChange = (e) => {
    setReceiverId(e.target.value);
  };

  return (
    <Box width={1} height={1}>
      <ChatActions
        senderId={senderId}
        receiverId={receiverId}
        connectionStarted={connectionStarted}
        callAvailable={callAvailable}
        start={start}
        stop={stop}
        call={call}
        hangup={hangup}
        setSenderId={handleOnSenderIdChange}
        setReceiverId={handleOnReceiverIdChange}
        sm={sm}
        lg={lg}
      />
      {((connectionStarted || connectedToRemote) && !(connectionStarted && connectedToRemote))
      && (<InProgressConnection />)}

      {connectionStarted && connectedToRemote && (
      <ChatMessages
        send={send}
        messages={messages}
        message={message}
        setMessage={setMessage}
      />
      )}
    </Box>
  );
}

export default Chat;

Chat.defaultProps = {
  sm: 5,
  lg: 5,
};

Chat.propTypes = {
  senderId: PropTypes.string.isRequired,
  receiverId: PropTypes.string.isRequired,
  start: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  send: PropTypes.func.isRequired,
  call: PropTypes.func.isRequired,
  hangup: PropTypes.func.isRequired,
  setSenderId: PropTypes.func.isRequired,
  setReceiverId: PropTypes.func.isRequired,
  connectionStarted: PropTypes.bool.isRequired,
  callAvailable: PropTypes.bool.isRequired,
  connectedToRemote: PropTypes.bool.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    owner: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  message: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
  sm: PropTypes.number,
  lg: PropTypes.number,
};
