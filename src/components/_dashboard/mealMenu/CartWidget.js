import React, { useState, useEffect, createContext } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from 'features/cart/cartSlice';
import { changeCustomerName, clearCustomerName } from 'features/stuff/stuffSlice';

import { formatISO } from 'date-fns';

// material
import { Stack, Box, Divider, Typography, Button, TextField } from '@material-ui/core';
// Icons
import { Icon } from '@iconify/react';
import outlineFoodBank from '@iconify/icons-ic/outline-food-bank';
import baselineCreditCard from '@iconify/icons-ic/baseline-credit-card';
import baselineAttachMoney from '@iconify/icons-ic/baseline-attach-money';
import baselineAppRegistration from '@iconify/icons-ic/baseline-app-registration';
import baselineMoped from '@iconify/icons-ic/baseline-moped';
import roundClearAll from '@iconify/icons-ic/round-clear-all';

// components
import {
  CartButtons,
  ModalEmployeeLunch,
  ModalMixedPayment,
  ModalPromocode
} from 'components/_dashboard/mealMenu';
import { CartItem } from 'components';
import CartEventItem from 'components/CartEventItem';
import ModalConfirm from 'components/ModalConfirm';
import { fCurrency } from 'utils/formatNumber';
import { REST_URL } from 'utils/constants';
import { value } from 'lodash/seq';
import { fDateHyphen } from 'utils/formatTime';
import printJS from 'print-js';

const getIcon = (name) => {
  switch (name) {
    case 'Оплата картой':
      return baselineCreditCard;
    case 'Оплата наличными':
      return baselineAttachMoney;
    case 'Доставка':
      return baselineMoped;
    case 'Смешанная оплата':
      return baselineAppRegistration;

    default:
      return outlineFoodBank;
  }
};

function CardWidget() {
  const {
    currentUser: { userInfo }
  } = useSelector((state) => state.user);
  // navigate
  const navigate = useNavigate();
  // redux
  const dispatch = useDispatch();
  const {
    cart: { cartList, totalPrice },
    stuff: { customerName: reduxCustomerName, receptionStartTime },
    user
  } = useSelector((state) => state);
  const { currentTT } = useSelector((state) => state.SP);
  // useState
  const [paymentType, setPaymentType] = useState({});
  const [types, setTypes] = useState([]);

  const [loading, setLoading] = useState(false);
  //
  const [customerName, setCustomerName] = useState(reduxCustomerName);

  // modals
  const [lunchModal, setLunchModal] = useState(false);
  const [mixedModal, setMixedModal] = useState(false);
  const [beznalModal, setBeznalModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePaymentType = (name) => {
    setPaymentType(name);
  };

  // модалка акций
  const handleOpenPromocode = () => setOpen(true);
  const handleClosePromocode = () => setOpen(false);
  const handleCustomerName = (event) => {
    setCustomerName(event.target.value);
  };

  const closeSnack = () => setOpenSnack(false);

  const handleClear = () => dispatch(clearCart());

  const handleCloseModal = (type) => {
    switch (type) {
      // case 'Lunch':
      //   setLunchModal(false);
      //   break;

      case 'Mixed':
        setMixedModal(false);
        break;

      case 'Beznal':
        setBeznalModal(false);
        break;

      default:
    }
  };
  const handleSubmit = () => {
    dispatch(changeCustomerName(customerName));
    switch (paymentType.value) {
      case 'Оплата картой':
        setBeznalModal(true);
        return;
      case 'Оплата наличными':
        navigate('/cash-checkout');
        break;
      case 'Смешанная оплата':
        setMixedModal(true);
        break;
      default:
        break;
    }
  };

  const getSposobOplaty = async () => {
    // dispatch(clearCart());
    await axios.get(`${REST_URL}/payment/type`).then((resp) => {
      const arr = resp.data.map((type) => ({
        value: type.value,
        id: type.id,
        icon: getIcon(type.value)
      }));
      setPaymentType(arr[0]);
      setTypes(arr);
    });
  };

  useEffect(() => {
    getSposobOplaty();
  }, []);

  // success -- reset all
  const orderSuccess = () => {
    dispatch(clearCart());
    dispatch(clearCustomerName());
    setLoading(false);
    setTimeout(() => {
      navigate('/cash-box');
    }, 200);
  };

  // const getStatus = async (userID) => {
  //   const response = await axios.get(`${REST_URL}/api/shift/shiftStatus?id=${userID}`);
  //   return response.data.obsh_vremya_otkr_ru;
  // };
  // имя кассира
  const { fullName } = userInfo;
  const PrintCheckout = async (data) => {
    const body = {
      creItemId: currentTT.id,
      limit: 1,
      commands: [
        {
          amountCash: null,
          amountElectronic: totalPrice,
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
  // const { wktoken } = useSelector((state) => state.webKassa);
  // const PrintWebkassa = async (data) => {
  //   const body = {
  //     cashBoxUniqueNumber: userInfo.sellingPoints[0].cashBoxUniqueNumber,
  //     token: wktoken
  //   };
  //   await axios.post('https://devkkm.webkassa.kz/api/Ticket/PrintFormat', body);
  // };
  const createWriteOff = async (body) => {
    await axios.post(`${REST_URL}/order/write-off`, body);
  };
  // создать заказ
  const createOrder = async () => {
    setLoading(true);
    const body = {
      date: fDateHyphen(new Date()),
      paymentType: {
        id: paymentType.id
      },
      sum: totalPrice,
      orderStatus: {
        id:
          cartList?.some((order) => order?.product?.productType.key === 'PRODUCT') ||
          cartList?.some((order) =>
            order?.orderComboCompositions?.some(
              (orders) => orders?.product?.productType.key === 'PRODUCT'
            )
          )
            ? 1
            : 2
      },
      clientName: customerName,
      createdTime: formatISO(new Date()),
      receptionStartTime,
      cookingStartTime: formatISO(new Date()),
      cookingEndTime: cartList?.some((order) => order?.product?.productType.key !== 'PRODUCT')
        ? formatISO(new Date())
        : null,
      user: {
        id: userInfo.id
      },
      sellingPoint: {
        id: currentTT.id
      },
      orderCompositions: cartList
    };
    try {
      await axios.post(`${REST_URL}/order`, body).then((resp) => {
        if (resp.status === 201) {
          createWriteOff(resp.data);
          const s = formatISO(new Date()).replace('+', '%2B');
          // const wbkRes = axios.post(`https://devkkm.webkassa.kz/api/check`, resp.data);
          axios.post(`${REST_URL}/ok?shift=${s}`, body).then((res) => {
            console.log(res);
            const binaryString = window.atob(res?.data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i += 1) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'application/pdf' });

            const fileUrl = URL.createObjectURL(blob);
            const printCheck = () => {
              const newTab = window.open(fileUrl);
              newTab.open();
              newTab.print();
              setTimeout(() => {
                newTab.close();
              }, 7000);
              // const test = () => {
              //   newTab.close();
              // };
              // window.addEventListener('afterprint', test);
              // // onafterprint(newTab.close());
              // window.onafterprint = newTab.close();xs
            };
            printCheck();
            // window.addEventListener('beforeprint', windowOpen());
            // windowPrint();
            // printJS({
            //   printable: fileUrl,
            //   type: 'pdf'
            // });
            // printJS({
            //   printable: './mock.data',
            //   type: 'json'
            // });
          });
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
  // TODO починить снекбар
  // setIsOpenSnack(true)
  return (
    <>
      <Box sx={{ px: 2, py: 2 }}>
        {cartList.map((cartItem, index) => (
          <>
            {!Object.prototype.hasOwnProperty.call(cartItem, 'orderComboCompositions') ? (
              <CartItem key={index} product={cartItem} index={index} />
            ) : (
              <CartEventItem key={index} products={cartItem} index={index} />
            )}
          </>
        ))}

        <Divider orientation="horizontal" sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="button" display="block" gutterBottom>
            Сумма
          </Typography>
          <Typography variant="button" display="block" gutterBottom>
            {fCurrency(totalPrice, currentTT.country.name)}
          </Typography>
        </Stack>

        <Divider orientation="horizontal" sx={{ my: 2 }} />

        <Button
          fullWidth
          color="inherit"
          variant="outlined"
          onClick={handleClear}
          startIcon={<Icon icon={roundClearAll} />}
        >
          Очистить
        </Button>
        <Divider orientation="horizontal" sx={{ my: 2 }} />
        <Typography variant="body1">Тип оплаты: {paymentType.value}</Typography>

        <CartButtons options={types} paymentValue={paymentType} handleClick={handlePaymentType} />

        {/* <Divider orientation="horizontal" sx={{ my: 2 }} /> */}
        <TextField
          label="Имя покупателя"
          value={customerName}
          onChange={handleCustomerName}
          fullWidth
          sx={{ mb: 2 }}
          size="small"
        />
        {/* <Button variant="contained" fullWidth color="secondary" onClick={handleOpenPromocode}> */}
        {/*  Акции */}
        {/* </Button> */}
        <ModalPromocode open={open} onClose={handleClosePromocode} />
        {/* <Divider orientation="horizontal" sx={{ my: 2 }} /> */}

        <Button variant="contained" fullWidth onClick={handleSubmit} disabled={!cartList[0]}>
          Оплатить
        </Button>

        <ModalEmployeeLunch
          open={lunchModal}
          handleClose={handleCloseModal}
          totalPrice={totalPrice}
        />
        <ModalMixedPayment
          open={mixedModal}
          handleClose={handleCloseModal}
          totalPrice={totalPrice}
          createMixedOrder={createOrder}
          setLoading={setLoading}
          loading={loading}
          openSnack={openSnack}
          closeSnack={closeSnack}
          errorMessage={errorMessage}
          snackbarType={snackbarType}
        />

        {/* TODO вынести отдельным компонентом */}
        <ModalConfirm
          label="Оформить заказ?"
          confirmText="Да"
          cancelText="Нет"
          handleClose={() => {
            setBeznalModal(false);
          }}
          handleConfirm={createOrder}
          closeSnack={closeSnack}
          open={beznalModal}
          openSnack={openSnack}
          errorMessage={errorMessage}
          snackbarType={snackbarType}
          loading={loading}
        />
      </Box>
    </>
  );
}

export default CardWidget;
