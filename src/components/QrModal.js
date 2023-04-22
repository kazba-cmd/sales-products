import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import QrReader from 'react-qr-reader';
//
import PropTypes from 'prop-types';
// material
import { Box, Modal } from '@material-ui/core';
//
import { postUserLogin } from 'features/user/userSlice';
import { decryptAES } from '../utils/helpers';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  outline: 'none',
  p: 4,
  display: 'flex',
  alignItems: 'center'
};

QrModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

function QrModal({ open, handleClose }) {
  // redux
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // useState
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleLogin = async (values) => {
    const { error, ...rest } = await dispatch(postUserLogin(values));

    if (error) {
      setOpenSnackbar(true);
      return;
    }
    navigate('/', { replace: true });
    handleClose();
  };

  // Handle scan
  const handleScan = (data) => {
    if (data) {
      const username = decryptAES(data.split('     ')[0].toString(), '0');
      const password = decryptAES(data.split('     ')[0].toString(), '0');
      handleLogin({ username, password });
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} spacing={3}>
        <QrReader delay={500} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
      </Box>
    </Modal>
  );
}

export default QrModal;
