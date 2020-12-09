/* eslint-disable no-unused-vars */
import React from 'react';
import {
  TextField, IconButton, Button, Card, CardContent, CardActions, Collapse, Grid,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  mainForm: {
    display: 'inline-block',
    width: '100%',
    margin: '0%',
    padding: '0%',
  },
  startButton: {
    borderRadius: '0',
    fullWidth: true,
    size: 'large',
  },
  cards: {
    display: 'inline-block',
    width: '100%',
    margin: '0%',
    padding: '0%',
    position: 'fixed',
    bottom: 0,
  },

}));

function ChatSender(props) {
  const classes = useStyles();
  const {
    startAvailable, message, send, handleOnMessageChange, isTyping,
  } = props;
  return (
    <div>
      <Card className={classes.cards}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={11} sm={11}>
              <p className="user-typing">
                {isTyping && 'User is typing...'}
              </p>
              <TextField
                id="message"
                label="Message..."
                fullWidth
                multiline
                rows={3}
                rowsMax={3}
                variant="outlined"
                width="100%"
                value={message}
                onChange={handleOnMessageChange}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') {
                    send(message);
                  }
                }}
              />
            </Grid>
            <Grid xs={1} sm={1}>
              <IconButton color="primary" component="span" onClick={() => send(message)}>
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

ChatSender.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  startAvailable: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  message: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  send: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  handleOnMessageChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  handleTyping: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  isTyping: PropTypes.func.isRequired,
};

export default ChatSender;
