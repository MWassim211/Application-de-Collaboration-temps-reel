import React from 'react';
import {
  TextField, IconButton, Card, CardContent, Grid, InputAdornment,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import PropTypes from 'prop-types';

function ChatSender(props) {
  const {
    message, send, handleOnMessageChange, isTyping, sendAvailable,
  } = props;
  return (
    <Card style={{ marginTop: '10px' }}>
      <CardContent>
        <Grid container spacing={3} alignItems="center" justify="center">
          <Grid item xs={11} sm={11}>
            <p className="user-typing">
              {isTyping && 'User is typing...'}
            </p>
            <TextField
              id="message"
              label="Message..."
              fullWidth
              variant="outlined"
              value={message}
              onChange={handleOnMessageChange}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') { send(message); }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary" component="span" onClick={() => send(message)} disabled={sendAvailable}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>),
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

ChatSender.propTypes = {
  message: PropTypes.string.isRequired,
  send: PropTypes.func.isRequired,
  handleOnMessageChange: PropTypes.func.isRequired,
  isTyping: PropTypes.func.isRequired,
  sendAvailable: PropTypes.bool.isRequired,
};

export default ChatSender;
