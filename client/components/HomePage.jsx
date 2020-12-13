import React from 'react';
import DuoIcon from '@material-ui/icons/Duo';
import ChatIcon from '@material-ui/icons/Chat';
import Box from '@material-ui/core/Box';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  IconButton, Card, CardContent, Grid, Button,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  cards: {
    display: 'block',
    width: '15vw',
    transitionDuration: '0.3s',
    height: '15vw',
  },
  largeIcon: {
    '& svg': {
      fontSize: 120,
    },
  },
}));

function HomePage(props) {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const handleOnChatClick = () => {
    props.history.push('/chat');
    window.location.reload();
  };
  const handleOnVideoClick = () => {
    props.history.push('/video');
    window.location.reload();
  };
  return (
    <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
      <Grid container spacing={3} alignItems="center" justify="center">
        <Grid container spacing={3} alignItems="center" justify="center">
          <Grid item>
            <Card className={classes.cards}>
              <CardContent>
                <Grid container spacing={3} alignItems="center" justify="center">
                  <Grid item>
                    <Box justifyContent="center">
                      <IconButton className={classes.largeIcon} onClick={handleOnVideoClick}>
                        <DuoIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box justifyContent="center">
                      <Button variant="contained" color="secondary" size="large" fullWidth onClick={handleOnVideoClick} style={{ backgroundColor: '#075E54' }}>
                        Video call
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card className={classes.cards}>
              <CardContent alignItems="center" justify="center">
                <Grid container spacing={3} alignItems="center" justify="center">
                  <Grid item>
                    <Box justifyContent="center">
                      <IconButton className={classes.largeIcon} onClick={handleOnChatClick}>
                        <ChatIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box justifyContent="center">
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        fullWidth
                        onClick={handleOnChatClick}
                        style={{ backgroundColor: '#075E54' }}
                      >
                        CHAT DISCUSSION
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

HomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(HomePage);
