import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box, Card, CardContent, Grid, Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Background from '../../assets/whatsupbg.png';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  card: {
    height: '100%',
  },
  sender: {
    background: '#DCF8C6',
    color: 'black',
  },
  receiver: {
    background: 'white',
    color: 'black',
  },
}));

function MessagesList(props) {
  const classes = useStyles();
  const { messages } = props;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <Card style={{
      height: 'calc(100vh - 196px)', overflowY: 'scroll', backgroundColor: '#D3D3D3', background: `url(${Background})`,
    }}
    >
      <CardContent>
        <Grid container className={classes.root} spacing={0} direction="column">
          {messages.map((message) => (
            <Grid item width="100%">
              <Box display="flex" justifyContent={message.owner ? 'flex-end' : 'flex-start'}>
                <Box
                  m={1}
                  pl={2}
                  pr={2}
                  pt={1}
                  pb={1}
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
          <div ref={messagesEndRef} />
        </Grid>
      </CardContent>
    </Card>
  );
}

MessagesList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    owner: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
};

export default MessagesList;
