import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card, CardActions, CardContent,
  Grid, IconButton, TextField, InputAdornment, Box, Typography,
} from '@material-ui/core';
import Send from '@material-ui/icons/Send';

const useStyles = makeStyles(() => ({
  card: {
    overflow: 'scroll',
    height: '100%',
    maxHeight: '80vh',
  },
  grid: {
    flexGrow: 1,
  },
  sender: {
    background: '#8292ab',
    color: 'white',
  },
  receiver: {
    background: '#9ea0a3',
    color: 'white',
  },
}));

function ChatMessages(props) {
  const classes = useStyles();
  const {
    send, messages, message, setMessage,
  } = props;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <Box height="90%">
      <Grid container direction="column" style={{ height: '100%' }}>
        <Grid item style={{ height: '90%', width: '100%' }}>
          <Card className={classes.card}>
            <CardContent>
              <Grid container className={classes.grid} spacing={2} direction="column">
                {messages.map((messageItem) => (
                  <Grid item xs={12} sm={12} lg={12}>
                    <Box display="flex" justifyContent={messageItem.owner ? 'flex-end' : 'flex-start'}>
                      <Box
                        m={1}
                        pl={2}
                        pr={2}
                        pt={1}
                        pb={1}
                        borderRadius={16}
                        className={messageItem.owner ? classes.sender : classes.receiver}
                      >
                        <Typography gutterBottom display="inline">
                          {messageItem.text}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
                <div ref={messagesEndRef} />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item style={{ height: '10%', width: '100%' }}>
          <Card>
            <CardActions>
              <TextField
                label="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                variant="outlined"
                onKeyPress={(ev) => { if (ev.key === 'Enter') send(message); }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="primary" onClick={() => send(message)}>
                        <Send />
                      </IconButton>
                    </InputAdornment>),
                }}
              />
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChatMessages;

ChatMessages.propTypes = {
  send: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    owner: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  message: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
};
