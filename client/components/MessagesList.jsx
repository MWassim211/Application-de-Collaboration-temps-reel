import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  root: {
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

function MessagesList(props) {
  const classes = useStyles();
  const { messages } = props;
  return (
    <Grid container className={classes.root} spacing={2} direction="column">
      {messages.map((message) => (
        <Grid width="100%">
          <Box display="flex" justifyContent={message.owner ? 'flex-end' : 'flex-start'}>
            <Box
              m={1}
              pl={2}
              pr={2}
              borderRadius={16}
              className={message.owner ? classes.sender : classes.receiver}
            >
              <Typography gutterBottom display="inline">
                {message.text}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

MessagesList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    owner: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
};

export default MessagesList;
