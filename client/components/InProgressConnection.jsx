import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  circularpgs: {
    left: '50%',
    right: '50%',
    top: '50%',
    bottom: '50%',
  },
}));

function InProgressConnection() {
  const classes = useStyles();
  return (
    <div className={classes.circularpgs}>
      <p>Wainting connection with your remote</p>
      <CircularProgress />
    </div>
  );
}

export default InProgressConnection;
