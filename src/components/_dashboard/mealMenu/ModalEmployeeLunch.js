import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import { experimentalStyled as styled } from '@material-ui/core/styles';
//
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
// material
import {
  Modal,
  Box,
  Button,
  IconButton,
  FormControl,
  MenuItem,
  Stack,
  Typography,
  InputLabel,
  Select
} from '@material-ui/core';

//
import { fCurrency } from 'utils/formatNumber';

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
  handleClose: PropTypes.func
};

const USERS = ['Мадияр', 'Камила', 'FАлдияр', 'Асиин', 'Айбар'];

function SpicesModal({ open, handleClose }) {
  const { currentTT } = useSelector((state) => state.SP);
  const [employee, setEmployee] = useState('');

  const { totalPrice } = useSelector((state) => state.cart);

  const handleChange = (event) => setEmployee(event.target.value);

  const callbackClose = () => {
    resetEmployee();
    handleClose('Lunch');
  };

  const resetEmployee = () => setEmployee();

  // При выборе соуса закрыть модалку и очистить соусы
  const submit = () => {
    // dispatch(addToCart({ ...product, quantity: 1, sauce }));
    // callbackClose();
  };

  return (
    <Modal open={open} onClose={callbackClose}>
      <RootStyle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Обед</Typography>
          <IconButton onClick={callbackClose}>
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
        </Stack>
        <FormControl fullWidth sx={{ my: 2 }} size="small">
          <InputLabel id="demo-simple-select-label">Выберите сотрудника</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={employee}
            label="Выберите сотрудника"
            onChange={handleChange}
          >
            {USERS.map((u) => (
              <MenuItem value={u} key={u}>
                {u}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="button" display="block" gutterBottom>
            Сумма
          </Typography>
          <Typography variant="button" display="block" gutterBottom>
            {totalPrice}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 2 }}>
          <Typography variant="button" display="block" gutterBottom>
            Доступная сумма
          </Typography>
          <Typography variant="button" display="block" gutterBottom>
            {fCurrency(5000, currentTT.country.name)}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Button fullWidth color="primary" variant="contained" onClick={submit}>
            Подтвердить
          </Button>
        </Stack>
      </RootStyle>
    </Modal>
  );
}

export default SpicesModal;
