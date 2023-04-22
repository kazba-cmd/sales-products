import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Modal,
  Typography,
  Stack,
  Button,
  IconButton,
  Autocomplete,
  TextField
} from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';

ModalPromocode.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

export default function ModalPromocode({ open, onClose }) {
  const defaultProps = {
    options: codes,
    getOptionLabel: (option) => option.title
  };

  const callbackClose = () => {
    onClose();
  };

  const RootStyle = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.customShadows.z24,
    outline: 'none',
    padding: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      width: '70vw'
    },
    [theme.breakpoints.down('sm')]: {
      width: '90vw'
    }
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <RootStyle>
        <Stack direction="column" spacing={3}>
          <Stack justifyContent="space-between" direction="row">
            <Typography variant="h4">Выберите Акцию</Typography>
            <IconButton onClick={callbackClose}>
              <Icon icon={closeFill} width={20} height={20} />
            </IconButton>
          </Stack>
          <Stack direction="column" spacing={5}>
            <Stack>
              <Autocomplete
                {...defaultProps}
                id="disable-close-on-select"
                renderInput={(params) => <TextField {...params} variant="standard" label="Акции" />}
              />
            </Stack>
            <Button fullWidth variant="contained">
              Применить
            </Button>
          </Stack>
        </Stack>
      </RootStyle>
    </Modal>
  );
}
const codes = [{ title: '2+1' }, { title: 'Кола+Трубочка' }, { title: '1+2=3' }];
