import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  Card, CardActions, CardContent,
  IconButton, Button, TextField, Grid, InputAdornment, Collapse,
} from '@material-ui/core';
import {
  Call, CallEnd, ExpandMore, PowerSettingsNew,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  cardContent: {
    paddingBottom: '10px',
  },
}));

function ChatActions(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(true);
  const {
    senderId, receiverId,
    start, stop, call, hangup, setSenderId, setReceiverId,
    connectionStarted, callAvailable,
    sm, lg,
  } = props;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleStartClick = () => {
    start();
    setExpanded(false);
  };

  const clipboardCopy = (e) => {
    const textField = document.getElementById('sender');
    textField.select();
    document.execCommand('copy');
    e.target.focus();
  };

  return (
    <Card>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className={classes.cardContent}>
          <Grid container spacing={1} alignItems="center" justify="center">
            <Grid item sm={sm} lg={lg}>
              <TextField
                id="sender"
                label="Sender"
                value={senderId}
                onChange={setSenderId}
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={clipboardCopy}>
                        <span className="material-icons">content_copy</span>
                      </IconButton>
                    </InputAdornment>),
                }}
                // size="small"
              />
            </Grid>
            <Grid item sm={sm} lg={lg}>
              <TextField
                id="receiver"
                label="Receiver"
                value={receiverId}
                onChange={setReceiverId}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
        </CardContent>
      </Collapse>
      <CardActions disableSpacing>
        {!connectionStarted && (
          <Button onClick={handleStartClick} variant="contained" color="primary" startIcon={<PowerSettingsNew />}>
            START
          </Button>
        )}
        {connectionStarted && (
          <Button onClick={stop} variant="contained" color="secondary" startIcon={<PowerSettingsNew />}>
            STOP
          </Button>
        )}
        {connectionStarted && callAvailable && (
          <IconButton onClick={call}><Call /></IconButton>
        )}
        {connectionStarted && !callAvailable && (
          <IconButton onClick={hangup}><CallEnd /></IconButton>
        )}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
        >
          <ExpandMore />
        </IconButton>

      </CardActions>
    </Card>
  );
}

export default ChatActions;

ChatActions.propTypes = {
  senderId: PropTypes.string.isRequired,
  receiverId: PropTypes.string.isRequired,
  start: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  call: PropTypes.func.isRequired,
  hangup: PropTypes.func.isRequired,
  setSenderId: PropTypes.func.isRequired,
  setReceiverId: PropTypes.func.isRequired,
  connectionStarted: PropTypes.bool.isRequired,
  callAvailable: PropTypes.bool.isRequired,
  sm: PropTypes.number.isRequired,
  lg: PropTypes.number.isRequired,
};
