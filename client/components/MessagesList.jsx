import React from 'react';
import PropTypes from 'prop-types';

function MessagesList(props) {
  const { messages, monid } = props;
  return (
    <div>
      <ul className="">
        {messages.map((message) => (
          <div>
            <div>
              {message.owner ? monid : 'user b '}
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
  monid: PropTypes.string.isRequired,
};

export default MessagesList;
