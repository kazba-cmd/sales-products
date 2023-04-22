import React, { useEffect, useState } from 'react';
// redux
import { useDispatch, useSelector } from 'react-redux';
//
import PropTypes from 'prop-types';
// material
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Stack,
  Typography
} from '@material-ui/core';
// icons
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import roundClearAll from '@iconify/icons-ic/round-clear-all';
import roundLunchDining from '@iconify-icons/ic/round-lunch-dining';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import { experimentalStyled as styled } from '@material-ui/core/styles';
// utils
import { addAmazonToCart } from 'features/cart/cartSlice';
import { useMealMenuContext } from 'components/_dashboard/mealMenu/mealMenuContext';
import { fCurrency } from '../../../utils/formatNumber';

SpicesModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  product: PropTypes.object
};

function SpicesModal({ open, handleClose, product, drinks }) {
  const { currentTT } = useSelector((state) => state.SP);
  const dispatch = useDispatch();
  const [sauce, setSauce] = useState({});
  const [toppings, setToppings] = useState([]);
  const { Souses: saucesList, Topings: toppingList } = useMealMenuContext();
  const [disabled, setDisabled] = useState(false);
  const [availableSauces, setAvailableSauces] = useState([]);
  const [availableToppings, setAvailableToppings] = useState([]);
  const callbackClose = () => {
    resetSauces();
    resetToppings();
    handleClose();
    setDisabled(false);
  };
  useEffect(() => {
    init();
  }, [product]);
  const init = () => {
    checkAvailableSauces();
    checkAvailableToppings();
  };

  const resetSauces = () => setSauce({});
  const resetToppings = () => setToppings([]);
  // При выборе соуса закрыть модалку и очистить соусы
  const submitSauces = () => {
    dispatch(addAmazonToCart({ product, sauce, toppings }));
    callbackClose();
  };
  const checkAvailableSauces = () => {
    if (product?.allSaucesAvailable) {
      setAvailableSauces(saucesList);
    } else {
      setAvailableSauces(product?.availableSauces);
    }
  };
  const checkAvailableToppings = () => {
    if (product?.allToppingsAvailable) {
      setAvailableToppings(toppingList);
    } else {
      setAvailableToppings(product?.availableToppings);
    }
  };
  const handleIncrement = (id) => {
    if (Object.keys(sauce).length === 0 || !sauce.id === id) {
      const newSauce = availableSauces?.find((item) => item.id === id);
      setSauce(newSauce);
    }
  };
  const handleDecrement = (id) => {
    const newSauce = availableSauces?.find((item) => item.id === id);
    if (newSauce.amount > 1) {
      newSauce.amount -= 1;
      setSauce(newSauce);
    } else {
      setSauce({});
    }
  };
  const handleIncrementTopping = (id) => {
    if (!toppings.length || !toppings.some((topping) => topping?.product?.id === id)) {
      const availableToppingListCopy = [...availableToppings];
      const newTopping = {
        ...availableToppingListCopy?.find((item) => item?.id === id)
      };
      newTopping.amount = 1;
      // setToppings((prev) => [...prev, newTopping]);
      setToppings((prev) => [
        ...prev,
        {
          product: newTopping,
          amount: newTopping.amount,
          sum: newTopping.price * newTopping.amount
        }
      ]);
    } else {
      const newTopping = toppings.find((topping) => topping?.product?.id === id);
      newTopping.amount += 1;
      newTopping.sum = newTopping.amount * newTopping.product.price;
      setToppings((prev) => [...prev]);
    }
  };
  const handleDecrementTopping = (id) => {
    if (toppings.length) {
      const newTopping = toppings?.find((item) => item.product.id === id);
      if (newTopping && newTopping?.amount > 1) {
        newTopping.amount -= 1;
        setToppings((prev) => [...prev]);
      } else if (newTopping?.amount === 1) {
        const newTopping = toppings?.find((item) => item.product.id === id);
        toppings.indexOf(newTopping);
        toppings.splice(toppings.indexOf(newTopping), 1);
        setToppings((prev) => [...prev]);
      }
    }
  };

  const RootStyle = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.customShadows.z24,
    outline: 'none',
    overflow: 'scroll',
    height: 800,
    width: 600,
    padding: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      width: '70vw',
      height: '90vh'
    },
    [theme.breakpoints.down('sm')]: {
      width: '90vw'
    }
  }));
  return (
    <Modal open={open} onClose={callbackClose}>
      <RootStyle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Выберите соус</Typography>
          <IconButton onClick={callbackClose}>
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
        </Stack>
        <Divider />
        <List sx={{ width: '100%', my: 1, paddingTop: '1px', paddingBottom: '1px' }}>
          {/* eslint-disable-next-line array-callback-return */}
          {availableSauces?.map((item, id) => (
            // const itemIndex = getItemIndex(sauces, uuid);
            <Stack key={item.id} direction="column">
              <ListItem sx={{ paddingTop: '4px', paddingBottom: '4px' }}>
                <ListItemAvatar>
                  <Avatar>
                    <Icon icon={roundLunchDining} width={20} height={20} />
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={item.name}
                  secondary={fCurrency(item.price, currentTT.country.name) || 100}
                />
                <Stack direction="row" alignItems="center">
                  <IconButton
                    size="large"
                    onClick={() => {
                      handleDecrement(item.id);
                    }}
                  >
                    <Icon icon={minusFill} width={20} height={20} />
                  </IconButton>
                  <Typography variant="h6" sx={{ mx: 1 }}>
                    {/* {(itemIndex > -1 && sauces[itemIndex].quantity) || 0} */}
                    {item.id === sauce.id ? 1 : 0}
                  </Typography>
                  <IconButton
                    size="large"
                    disabled={disabled}
                    onClick={() => {
                      handleIncrement(item.id);
                    }}
                  >
                    <Icon icon={plusFill} width={20} height={20} />
                  </IconButton>
                </Stack>
              </ListItem>
            </Stack>
          ))}
          <Stack direction="column">
            <Typography variant="h6" paddingTop="10px">
              Выберите топпинг
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {/* eslint-disable-next-line array-callback-return */}
            {availableToppings?.map((topping) => (
              <ListItem key={topping.id} sx={{ paddingTop: '4px', paddingBottom: '4px' }}>
                <ListItemAvatar>
                  <Avatar>
                    <Icon icon={roundLunchDining} width={20} height={20} />
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={topping.name}
                  secondary={`${fCurrency(topping.price, currentTT.country.name) || 100}`}
                />
                <Stack direction="row" alignItems="center">
                  <IconButton
                    size="large"
                    onClick={() => {
                      handleDecrementTopping(topping.id);
                    }}
                  >
                    <Icon icon={minusFill} width={20} height={20} />
                  </IconButton>
                  <Typography variant="h6" sx={{ mx: 1 }}>
                    {/* {(itemIndex > -1 && sauces[itemIndex].quantity) || 0} */}
                    {(toppings.length &&
                      toppings.find((item) => item?.product?.id === topping?.id)?.amount) ||
                      0}
                  </Typography>
                  <IconButton
                    size="large"
                    onClick={() => {
                      handleIncrementTopping(topping.id);
                    }}
                  >
                    <Icon icon={plusFill} width={20} height={20} />
                  </IconButton>
                </Stack>
              </ListItem>
            ))}
          </Stack>
        </List>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={resetSauces}
            startIcon={<Icon icon={roundClearAll} />}
          >
            Удалить
          </Button>
          <Button fullWidth color="primary" variant="contained" onClick={submitSauces}>
            Добавить
          </Button>
        </Stack>
      </RootStyle>
    </Modal>
  );
}

export default SpicesModal;
