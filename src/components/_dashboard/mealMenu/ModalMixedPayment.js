import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { experimentalStyled as styled } from '@material-ui/core/styles';
//
import PropTypes from 'prop-types';
// material
import { Box, Button, IconButton, Modal, Stack, TextField, Typography } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import ModalConfirm from 'components/ModalConfirm';

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

SpicesModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  totalPrice: PropTypes.number
};

function SpicesModal({
  open,
  handleClose,
  totalPrice,
  createMixedOrder,
  setLoading,
  loading,
  openSnack,
  closeSnack,
  snackbarType,
  errorMessage
}) {
  const [card, setCard] = useState('');
  const [cash, setCash] = useState('');
  // const [openSnack, setOpenSnack] = useState(false);
  // const [snackbarType, setSnackbarType] = useState('success');
  // const [errorMessage, setErrorMessage] = useState('');
  const [mixedModal, setMixedModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = (e.target.value && parseInt(e.target.value, 10)) || '';

    switch (e.target.name) {
      case 'card':
        if (value <= totalPrice) {
          setCard(value);
        }
        break;
      case 'cash':
        setCash(value);
        break;
      default:
        break;
    }
  };

  const callbackClose = () => {
    handleClose('Mixed');
  };

  // При выборе соуса закрыть модалку и очистить соусы
  const submit = async () => {
    setMixedModal(true);
    // dispatch(addToCart({ ...product, quantity: 1, sauce }));
    // callbackClose();
  };

  const handleConfirm = async () => {
    const response = await createMixedOrder(cash - customerChange, card);
    if (response) {
      callbackClose();
      setTimeout(() => {
        navigate('/cash-box');
      }, 200);
    } else {
      setLoading(false);
    }
  };
  const customerChange = parseInt(card, 10) + parseInt(cash, 10) - totalPrice;

  return (
    <Modal open={open} onClose={callbackClose}>
      <RootStyle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Смешанный расчет</Typography>
          <IconButton onClick={callbackClose}>
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
        </Stack>
        <Stack sx={{ my: 1 }} direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="button" display="block" gutterBottom>
            Сумма Заказа
          </Typography>
          <Typography variant="button" display="block" gutterBottom>
            {totalPrice}
          </Typography>
        </Stack>
        <Stack spacing={2} sx={{ my: 2 }}>
          <TextField
            fullWidth
            label="Списать с карты"
            name="card"
            type="number"
            value={card}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Наличные"
            name="cash"
            type="number"
            value={cash}
            onChange={handleChange}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="button" display="block" gutterBottom>
            Сдача
          </Typography>
          <Typography variant="button" display="block" gutterBottom>
            {Number.isNaN(customerChange) || customerChange < 0
              ? 'Введите корректную сумму'
              : customerChange}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Button
            disabled={Number.isNaN(customerChange) || (customerChange < 0 && true)}
            fullWidth
            color="primary"
            variant="contained"
            onClick={submit}
          >
            Оплатить
          </Button>
        </Stack>
        <ModalConfirm
          label="Оформить заказ?"
          confirmText="Да"
          cancelText="Нет"
          handleClose={() => {
            setMixedModal(false);
          }}
          handleConfirm={handleConfirm}
          loading={loading}
          openSnack={openSnack}
          closeSnack={closeSnack}
          errorMessage={errorMessage}
          snackbarType={snackbarType}
          open={mixedModal}
        />
        {/* <Snackbar
          open={openSnack}
          autoHideDuration={6000}
          onClose={closeSnack}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={closeSnack} severity={snackbarType}>
            {errorMessage}
          </Alert>
        </Snackbar> */}
      </RootStyle>
    </Modal>
  );
}

export default SpicesModal;
