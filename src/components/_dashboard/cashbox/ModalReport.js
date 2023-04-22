import React from 'react';
import {
  Box,
  Modal,
  Typography,
  Stack,
  Button,
  IconButton,
  Alert,
  Snackbar
} from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useSelector } from 'react-redux';

const RootStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 850,
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

ModalReport.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

export default function ModalReport({ open, onClose }) {
  const callbackClose = () => {
    onClose();
  };
  const [openSnack, setOpenSnack] = React.useState(false);

  const showSnackbar = () => setOpenSnack(true);

  const handleClick = ({ target }) => {
    // check neither x or y
    // if (e.target.name === 'x') {
    // } else {
    // }
    showSnackbar();
  };

  const closeSnack = () => setOpenSnack(false);
  const user = useSelector((state) => state.user);
  const { currentTT } = useSelector((state) => state.SP);
  const XReport = async () => {
    await axios.post(
      'https://api.qkkmserver.ru/open/api/v1/print-documents',
      {
        creItemId: `${currentTT.creItemId}`,
        commands: [
          {
            type: 'xReport',
            tagCashierName: `${user.currentUser.userInfo.fullName}`,
            isPrintable: true
          }
        ]
      },
      {
        headers: {
          'X-Api-Key': currentTT.xapiKey
        }
      }
    );
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <RootStyle>
          <Stack direction="column" spacing={4}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h5">Выберите отчет</Typography>
              <IconButton onClick={callbackClose}>
                <Icon icon={closeFill} width={20} height={20} />
              </IconButton>
            </Stack>
            <Stack direction="column" justifyContent="space-between" spacing={3}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">X-отчет</Typography>
                <Button variant="outlined" color="secondary" name="xReport" onClick={XReport}>
                  Распечатать
                </Button>
              </Stack>
              {/* <Stack direction="row" justifyContent="space-between"> */}
              {/*  <Typography variant="h6">Z-отчет</Typography> */}
              {/*  <Button variant="outlined" color="secondary" name="z" onClick={handleClick}> */}
              {/*    Распечатать */}
              {/*  </Button> */}
              {/* </Stack> */}
            </Stack>
          </Stack>
        </RootStyle>
      </Modal>
      <Snackbar autoHideDuration={2000} onClose={closeSnack} open={openSnack}>
        <Alert onClose={closeSnack} severity="success" sx={{ width: '100%' }}>
          Отчет распечатан
        </Alert>
      </Snackbar>
    </>
  );
}
