import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField, IconButton, Button, Card, CardContent, Grid,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';

function ConnexionForm(props) {
  const {
    senderId, receiverId, isSmall,
    start, startClick, hangupClick, senderChanged, receiverChanged,
  } = props;

  const clipboardCopy = (e) => {
    const textField = document.getElementById('sender');
    textField.select();
    document.execCommand('copy');
    e.target.focus();
  };

  return (
    <Card style={{ marginBottom: '10px' }}>
      <CardContent>
        <Grid container spacing={3} alignItems="center" justify="center">
          <Grid item xs={12} sm={isSmall ? 12 : 5} lg={isSmall ? 12 : 5}>
            <TextField
              id="sender"
              label="Sender"
              fullWidth
              value={senderId}
              onChange={senderChanged}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={clipboardCopy}>
                      <span className="material-icons">
                        content_copy
                      </span>
                    </IconButton>
                  </InputAdornment>),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={isSmall ? 12 : 5} lg={isSmall ? 12 : 5}>
            <TextField
              id="receiver"
              label="Receiver"
              fullWidth
              value={receiverId}
              onChange={receiverChanged}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={isSmall ? 12 : 2}>
            {start && (
            <Button variant="contained" color="secondary" size="large" fullWidth onClick={startClick}>
              Start
            </Button>
            )}
            {!start && (
            <Button variant="contained" color="secondary" size="large" fullWidth onClick={hangupClick}>
              HangUp
            </Button>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
export default ConnexionForm;

ConnexionForm.defaultProps = {
  isSmall: false,
};

ConnexionForm.propTypes = {
  isSmall: PropTypes.bool,
  senderId: PropTypes.string.isRequired,
  receiverId: PropTypes.string.isRequired,
  start: PropTypes.bool.isRequired,
  startClick: PropTypes.func.isRequired,
  hangupClick: PropTypes.func.isRequired,
  senderChanged: PropTypes.func.isRequired,
  receiverChanged: PropTypes.func.isRequired,
};
