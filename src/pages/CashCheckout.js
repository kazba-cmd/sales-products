import { useState } from 'react';
import axios from 'axios';
// material
import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Typography
} from '@material-ui/core';
import { MHidden } from 'components/@material-extend';
import { useNavigate } from 'react-router-dom';
import { formatISO } from 'date-fns';
import { fDateHyphen } from 'utils/formatTime';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from 'features/cart/cartSlice';
import { clearCustomerName } from 'features/stuff/stuffSlice';

// components
import Page from 'components/Page';
import { Calculator, CashSummary } from 'components/_dashboard/cashcheckout';
import { CartList } from 'components';
import BackDrop from 'components/BackDrop';
import { REST_URL } from '../utils/constants';
// import ModalRawError from 'components/ModalRawError';

// ----------------------------------------------------------------------

export default function CashCheckout() {
  // useState hooks
  const [customerCash, setCustomerCash] = useState(0);
  const [customerChange, setCustomerChange] = useState(0);
  const [isCashEnough, setIsCashEnough] = useState(false);
  // const [nalModal, setNalModal] = useState(false);
  // снэкбар
  const [snackbarType, setSnackbarType] = useState('success');
  const [openSnack, setOpenSnack] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentTT } = useSelector((state) => state.SP);
  const closeSnack = () => setOpenSnack(false);

  // TODO добавить алерт

  // redux
  const dispatch = useDispatch();
  const {
    user,
    stuff,
    cart: { totalPrice, cartList }
  } = useSelector((state) => state);

  const navigate = useNavigate();
  const inputDigit = (e) => {
    const { name } = e.target;
    // setIsCashEnough
    const cash = customerCash === 0 ? parseInt(name, 10) : parseInt(customerCash + name, 10);
    setCustomerCash(cash);
    const change = cash - totalPrice;
    setCustomerChange(change);
    setIsCashEnough(change >= 0);
  };

  const handleClear = () => {
    setCustomerCash(0);
    setIsCashEnough(false);
  };

  const handleCancel = () => {
    navigate('/cash-box');
    dispatch(clearCart());
    dispatch(clearCustomerName());
  };

  // имя кассира
  const { customerName, receptionStartTime } = stuff;
  const { fullName } = user.currentUser.userInfo;
  const PrintCheckout = async (data) => {
    const body = {
      creItemId: currentTT.id,
      limit: 1,
      commands: [
        {
          amountCash: totalPrice,
          amountElectronic: null,
          amountTotal: totalPrice,
          useAcquiringTerminal: false,
          type: 'sale',
          tagCashierName: fullName,
          isPrintable: true,
          lines: data.map((prod) => ({
            quantity: prod.amount,
            tax: 'vat_0',
            psr: 'full_settle',
            price: prod.sum / prod.amount,
            total: prod.sum
          }))
        }
      ]
    };
    await axios.post('https://api.qkkmserver.ru/open/api/v1/print-documents', body);
  };
  const createWriteOff = async (body) => {
    await axios.post(`${REST_URL}/order/write-off`, body);
  };
  // создать заказ
  const createOrder = async () => {
    setLoading(true);
    const body = {
      date: fDateHyphen(new Date()),
      paymentType: {
        id: 2
      },
      sum: totalPrice,
      orderStatus: {
        id: cartList?.some((order) => order?.product?.productType.key === 'PRODUCT') ? 1 : 2
      },
      clientName: customerName,
      createdTime: formatISO(new Date()),
      receptionStartTime,
      cookingStartTime: formatISO(new Date()),
      user: {
        id: user.currentUser.userInfo.id
      },
      sellingPoint: {
        id: currentTT?.id
      },
      orderCompositions: cartList
    };
    try {
      await axios.post(`${REST_URL}/order`, body).then((resp) => {
        if (resp.status === 201) {
          createWriteOff(resp.data);
          // PrintCheckout(resp.data.order.orderCompositions);
          orderSuccess();
        }
      });
    } catch (e) {
      setOpenSnack(true);
      setSnackbarType('error');
      setErrorMessage(e.response?.data?.message);
      setLoading(false);
    }
  };

  // success -- reset all
  const orderSuccess = () => {
    dispatch(clearCart());
    dispatch(clearCustomerName());
    setLoading(false);
    setSnackbarType('success');
    setTimeout(() => {
      navigate('/cash-box');
    }, 200);
  };

  // проверяет если продукт аузти
  const goBack = () => navigate(-1);
  return (
    <Page title="Оплата наличными">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" gutterBottom>
            Оплата заказа
          </Typography>
          <Button variant="contained" color="secondary" onClick={goBack}>
            Назад
          </Button>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <CashSummary
                customerCash={customerCash}
                totalPrice={totalPrice}
                isCashEnough={isCashEnough}
                customerChange={customerChange}
              />
              <Calculator inputDigit={inputDigit} clear={handleClear} customerCash={customerCash} />
            </Paper>
          </Grid>

          <MHidden width="mdDown">
            <Grid item md={4}>
              <Card>
                <Stack direction="row" justifyContent="space-between">
                  <CardHeader title="Корзина" />
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    sx={{ mr: 3, mt: 3 }}
                    onClick={handleCancel}
                  >
                    Отменить заказ
                  </Button>
                </Stack>
                <CartList />
                <Box sx={{ px: 2, py: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!isCashEnough}
                    onClick={createOrder}
                  >
                    Оформить заказ
                  </Button>
                </Box>
              </Card>
            </Grid>
          </MHidden>
        </Grid>
        <Snackbar
          open={openSnack}
          autoHideDuration={6000}
          onClose={closeSnack}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={closeSnack} severity={snackbarType}>
            {errorMessage}
          </Alert>
        </Snackbar>
        <BackDrop open={loading} />
      </Container>
    </Page>
  );
}
