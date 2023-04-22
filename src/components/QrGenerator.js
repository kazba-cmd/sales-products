import React, { useState } from 'react';
//
import PropTypes from 'prop-types';
// material
import { Box, Button, IconButton, Modal, Stack, TextField, Typography } from '@material-ui/core';
//
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { encryptAES } from '../utils/helpers';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  boxShadow: 24,
  outline: 'none',
  p: 4,
  display: 'flex',
  alignItems: 'center'
};

QrGenerator.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

function QrGenerator({ open, handleClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [generated, setGenerated] = useState(false);
  const callbackClose = () => {
    handleClose();
    setUsername('');
    setPassword('');
    setGenerated(false);
  };
  return (
    <Modal
      open={open}
      onClose={callbackClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack direction="column" spacing={2}>
          <Stack justifyContent="space-between" direction="row">
            <Typography variant="h4">Генератор QR-кода</Typography>
            <IconButton onClick={callbackClose}>
              <Icon icon={closeFill} width={20} height={20} />
            </IconButton>
          </Stack>
          <TextField
            placeholder="Логин"
            type="username"
            size="small"
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            placeholder="Пароль"
            type="password"
            size="small"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" onClick={() => setGenerated(true)}>
            Создать
          </Button>
          {generated && (
            <img
              src={`http://qrcoder.ru/code/?${encryptAES(username, '0')}+++++${encryptAES(
                password,
                '0'
              )}&10&0`}
              width="290"
              height="290"
              border="0"
              alt="QR код"
            />
          )}
        </Stack>
      </Box>
    </Modal>
  );
}

export default QrGenerator;
