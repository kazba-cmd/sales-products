import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar, Alert } from '@material-ui/core';

SnackbarErrorLogin.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

function SnackbarErrorLogin({ open = false, title, handleClose = () => {} }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {title}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarErrorLogin;
