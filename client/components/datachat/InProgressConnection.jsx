import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  circularpgs: {
    left: '50%',
    right: '50%',
    top: '50%',
    bottom: '50%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cmpt: {
    textAlign: 'center',

  },
}));

function InProgressConnection() {
  const classes = useStyles();
  return (
    <div className={classes.circularpgs}>
      <Grid item xs={12} className={classes.cmpt}>
        <p>Wainting connection with your remote</p>
        <CircularProgress />
      </Grid>
    </div>
  );
}

export default InProgressConnection;
