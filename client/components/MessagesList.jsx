import React from 'react';
// import {
//   IconButton, Button, Card, CardContent, CardActions, Collapse, Grid,
// } from '@material-ui/core';
import PropTypes from 'prop-types';

function MessagesList(props) {
  const { messages, myId } = props;
  return (
    <div>
      <ul className="">
        {messages.map((message) => (
          <div>
            <div>
              {message.owner ? myId : 'user b '}
            </div>
            <div>
              {message.text}
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

MessagesList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    owner: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  myId: PropTypes.string.isRequired,
};

export default MessagesList;
