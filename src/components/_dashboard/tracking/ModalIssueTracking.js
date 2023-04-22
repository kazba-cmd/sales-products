import React from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Modal,
  Typography,
  Stack,
  Button,
  IconButton
} from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import axios from 'axios';
import { fCurrency } from 'utils/formatNumber';

import { REST_URL } from 'utils/constants';
import { formatISO } from 'date-fns';
// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  overflow: 'scroll',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 850,
  height: 700,
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

export default function ModalIssueTracking({ orderModalOpen, onClose, modalOrder }) {
  // TODO доделать как появится справочник заказа ВЫДАН
  const updateOrder = async (order) => {
    const modalOrderCopy = { ...order };
    modalOrderCopy.orderStatus = { id: 3 };
    await axios
      .put(`${REST_URL}/order`, { ...modalOrderCopy, givenTime: formatISO(new Date()) })
      .then(() => {
        onClose();
      });
  };
  const { currentTT } = useSelector((state) => state.SP);
  return (
    <Modal
      open={orderModalOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <RootStyle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {/* Заказ {nomer_zakaza_ru}-{kolichestvo_pozicii_ru} */}
          </Typography>
          <IconButton onClick={onClose}>
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
        </Stack>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{}} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Продукты</TableCell>
                <TableCell align="center">Кол-во</TableCell>
                <TableCell align="right">Опции</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {modalOrder?.orderCompositions?.map((row) =>
                row?.orderComboCompositions?.length === 0 ? (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="left" scope="row">
                      <b>{row.product.name}</b> {row.sauce && `${row.sauce.name}: 1 `}
                      {row.toppings.length
                        ? row.toppings.map((item) => `${item.product.name}: ${item.amount} `)
                        : ' '}
                    </TableCell>
                    <TableCell align="center">{row.amount}</TableCell>
                    <TableCell align="right">
                      {fCurrency(row.sum, currentTT.country.name)}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="left" scope="row">
                      <b>{row.combo?.name} </b>(
                      {row.orderComboCompositions.map((item) => (
                        <>
                          {item.product.name} , {item.sauce && `${item.sauce.name}: 1 `}
                          {item.toppings.length
                            ? item.toppings.map(
                                (items) => `${items.product.name}: ${items.amount} `
                              )
                            : ' '}
                        </>
                      ))}
                      )
                    </TableCell>
                    <TableCell align="center">{row.amount}</TableCell>
                    <TableCell align="right">
                      {fCurrency(row.sum, currentTT.country.name)}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 4 }}>
          <Typography variant="button" display="block" gutterBottom>
            Сумма : {fCurrency(modalOrder.sum, currentTT.country.name)}
          </Typography>
        </Stack>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          size="large"
          onClick={() => updateOrder(modalOrder)}
        >
          Выдано
        </Button>
      </RootStyle>
    </Modal>
  );
}

ModalIssueTracking.propTypes = {
  orderModalOpen: PropTypes.bool,
  onClose: PropTypes.func,
  modalOrder: PropTypes.object
};
