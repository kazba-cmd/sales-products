import React from 'react';
import {
  Box,
  IconButton,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';

// props
import PropTypes from 'prop-types';

// utils
import { fCurrency } from 'utils/formatNumber';
import { fTime } from 'utils/formatTime';
import { useSelector } from 'react-redux';
import ModalReport from './ModalReport';

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
ModalReport.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

export default function ModalIssueTracking({ open, onClose, order }) {
  const { currentTT } = useSelector((state) => state.SP);
  const callbackClose = () => {
    onClose();
  };
  const all = [];
  const filterProducts = () => {
    order?.orderCompositions?.map((rows, id) => {
      if (!all.length) {
        all.push({ name: rows.product.name, price: rows.product.price, amount: rows.amount });
      } else {
        const i = all.findIndex((rowProduct) => rowProduct?.name === rows.product.name);
        const indexOfSauce = all.findIndex((rowProduct) => rowProduct?.name === rows.sauce?.name);
        if (i >= 0) {
          all[i].amount = Number(all[i]?.amount) + Number(rows?.amount);
        } else {
          all.push({ name: rows.product.name, price: rows.product.price, amount: rows.amount });
        }
        if (rows.sauce !== null) {
          if (indexOfSauce >= 0) {
            all[indexOfSauce].amount = Number(all[indexOfSauce]?.amount) + Number(rows?.amount);
          } else {
            all.push({ name: rows.sauce?.name, price: rows.sauce?.price, amount: rows.amount });
          }
        }
        if (rows.toppings.length > 0) {
          rows.toppings.map((topping) => {
            const indexOfTopping = all.findIndex(
              (rowProduct) => rowProduct?.name === topping.product.name
            );
            if (indexOfTopping >= 0) {
              all[indexOfTopping].amount =
                Number(all[indexOfTopping]?.amount) + Number(topping.amount);
            } else {
              all.push({
                name: topping.product.name,
                price: topping.product.price,
                amount: topping.amount
              });
            }
            return '';
          });
        }
        return '';
      }
      return '';
    });
    return all;
  };
  const allofthesauses = filterProducts();
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <RootStyle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Заказ {order.orderNumber}</Typography>
          <IconButton onClick={callbackClose}>
            <Icon icon={closeFill} width={20} height={30} />
          </IconButton>
        </Stack>
        <Stack direction="column-reverse" spacing={2} justifyContent="space-between">
          <Box>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Продукты</TableCell>
                    <TableCell width="85px" align="left">
                      Кол-во
                    </TableCell>
                    <TableCell width="120px" align="right">
                      Цена
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order?.orderCompositions.map((drink, id) =>
                    drink?.orderComboCompositions?.length === 0 ? (
                      <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="left" scope="row">
                          <b>{drink.product.name}</b> {drink.sauce && `${drink.sauce.name} , `}
                          {drink.toppings.length
                            ? drink.toppings.map((item) => `${item.product.name}: ${item.amount} `)
                            : ' '}
                        </TableCell>
                        <TableCell align="center">{drink.amount}</TableCell>
                        <TableCell align="right">
                          {fCurrency(drink.sum, currentTT.country.name)}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow
                        key={drink.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell align="left" scope="row">
                          <b>{drink.combo?.name} </b>(
                          {drink.orderComboCompositions.map((item) => (
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
                        <TableCell align="center">{drink.amount}</TableCell>
                        <TableCell align="right">
                          {fCurrency(drink.sum, currentTT.country.name)}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography margin="10px 0" align="right">
              <b>Итого:</b> {fCurrency(order.sum, currentTT.country.name)}
            </Typography>
          </Box>
          <Stack paddingLeft="16px" direction="row" spacing={4}>
            <Stack direction="column" spacing={2}>
              {/* <Typography>Акции</Typography> */}
              <Typography>Имя клиента</Typography>
              <Typography>Статус</Typography>
              <Typography>Время принятия</Typography>
              <Typography>Способ оплаты</Typography>
              {/* <Typography>Скидка</Typography> */}
            </Stack>
            <Stack marginLeft="100px" direction="column" spacing={2}>
              {/* <Typography>{formattedData || 'Нет Акции'}</Typography> */}
              <Typography>{order.clientName ? order.clientName : 'не указано'}</Typography>
              <Typography>{order.orderStatus.value}</Typography>
              <Typography>{fTime(order.cookingStartTime)}</Typography>
              <Typography>{order.paymentType.value}</Typography>
              {/* <Typography>{fCurrency(0, userInfo.country)}</Typography> */}
            </Stack>
          </Stack>
        </Stack>
      </RootStyle>
    </Modal>
  );
}
