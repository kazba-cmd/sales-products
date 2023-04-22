import React, { useEffect, useState } from 'react';
// redux
import { useDispatch, useSelector } from 'react-redux';
//
import PropTypes from 'prop-types';
// material
import {
  Modal,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  List,
  Avatar,
  ListItemAvatar,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert
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
import { addAmazonToCart, addEventToCart, addToCart } from 'features/cart/cartSlice';
import { getItemIndex } from 'utils/helpers';
import { useMealMenuContext } from 'components/_dashboard/mealMenu/mealMenuContext';
import { fCurrency } from '../../../utils/formatNumber';

EventModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  event: PropTypes.object,
  checker: PropTypes.bool
};

function EventModal({ open, handleClose, event, checker }) {
  const { currentTT } = useSelector((state) => state.SP);
  const dispatch = useDispatch();
  const { Souses: saucesList, Topings: toppingList } = useMealMenuContext();
  const getProducts = () => {
    event?.comboCompositions?.map((item, index) => {
      if (item?.amount === 1) {
        products.push(item);
      } else {
        for (let i = 0; i < item?.amount; i += 1) {
          const newItem = { ...item };
          newItem.amount = 1;
          newItem.id = newItem.id + i + 1000;
          products.push(newItem);
        }
      }
      return item;
    });
    setProducts((prev) => [...prev]);
  };
  const [sauce, setSauce] = useState({});
  const [products, setProducts] = useState([]);
  const [chosenProducts, setChosenProducts] = useState([]);
  const [snackbarError, setSnackbarError] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [disabled, setDisabled] = useState(false);
  const closeSnack = () => setSnackbarError(false);
  const callbackClose = () => {
    resetSauces();
    handleClose();
    setProducts([]);
    setChosenProducts([]);
    getProducts();
    setDisabled(false);
  };
  const resetSauces = () => setSauce({});
  // При выборе соуса закрыть модалку и очистить соусы
  const submitEvent = () => {
    // dispatch(addAmazonToCart({ product, sauce, toppings }));
    const eventSum = chosenProducts?.reduce((prev, cur) => {
      const sauceSum = cur?.sauce?.price ? cur.sauce.price : 0;
      const toppingsSum = cur.toppings
        ? cur.toppings.reduce((previous, current) => previous + current.sum, 0)
        : 0;
      return prev + cur?.product?.price + toppingsSum + sauceSum;
    }, 0);
    dispatch(
      addEventToCart({
        orderComboCompositions: chosenProducts,
        amount: 1,
        sum: eventSum,
        combo: { id: event?.id }
      })
    );
    callbackClose();
  };
  const handleIncrement = (comboId, productId) => {
    products?.map((product, index) => {
      if (product.id === comboId) {
        const a = product.products.find((prod) => prod.id === productId);
        if (chosenProducts) {
          setChosenProducts((prev) => [
            ...prev,
            { amount: 1, product: { ...a }, sauce: {}, toppings: [], comboId }
          ]);
        } else {
          setChosenProducts([{ product: { ...a }, sauce: {}, toppings: [], comboId }]);
        }
      }
      return product;
    });
  };
  const handleIncrementSauce = (comboId, sauceId) => {
    const combo = chosenProducts?.find((product) => product.comboId === comboId);
    if (combo) {
      const sauce = saucesList?.find((prod) => prod.id === sauceId);
      combo.sauce = sauce;
      setChosenProducts((prev) => [...prev]);
    } else {
      setSnackbarError(true);
      setSnackbarMessage('Сначала выберите продукт');
    }
    return combo;
  };
  const handleDecrementSauce = (comboId) => {
    const combo = chosenProducts?.find((product) => product.comboId === comboId);
    combo.sauce = {};
    setChosenProducts((prev) => [...prev]);
  };
  const handleIncrementTopping = (comboId, productId) => {
    const foundProduct = chosenProducts?.find((prod) => prod.comboId === comboId);
    if (foundProduct) {
      const foundTopping = toppingList?.find((topping) => topping.id === productId);
      const isAddedTopping = foundProduct?.toppings?.find(
        (top) => top.product.id === foundTopping?.id
      );
      if (isAddedTopping) {
        isAddedTopping.amount += 1;
        isAddedTopping.sum = isAddedTopping.amount * isAddedTopping.product.price;
      } else {
        foundProduct?.toppings?.push({
          product: { ...foundTopping },
          amount: 1,
          sum: foundTopping?.price
        });
      }
      setChosenProducts((prev) => [...prev]);
    } else {
      setSnackbarError(true);
      setSnackbarMessage('Сначала выберите продукт');
    }
  };
  const handleDecrementTopping = (comboId, productId) => {
    const foundProduct = chosenProducts?.find((prod) => prod.comboId === comboId);
    const foundTopping = toppingList?.find((topping) => topping.id === productId);
    const isAddedTopping = foundProduct?.toppings?.find(
      (top) => top.product.id === foundTopping?.id
    );
    if (isAddedTopping && isAddedTopping.amount > 1) {
      isAddedTopping.amount -= 1;
      isAddedTopping.sum = isAddedTopping.amount * isAddedTopping.product.price;
    } else {
      const toppingIndex = foundProduct?.toppings?.indexOf(isAddedTopping);
      foundProduct?.toppings?.splice(toppingIndex, 1);
    }
    setChosenProducts((prev) => [...prev]);
  };
  const handleDecrement = (comboId) => {
    setChosenProducts(chosenProducts?.product?.filter((product) => product.comboId !== comboId));
  };
  useEffect(() => {
    getProducts();
  }, [checker]);

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
        <IconButton onClick={callbackClose} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Icon icon={closeFill} width={20} height={20} />
        </IconButton>
        <Snackbar
          open={snackbarError}
          autoHideDuration={6000}
          onClose={closeSnack}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={closeSnack} severity="error" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        {products?.map((combo, index) => (
          <div key={index}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Выберите продукт {index + 1}</Typography>
            </Stack>
            <Divider />
            <List sx={{ width: '100%', my: 1, paddingTop: '1px', paddingBottom: '1px' }}>
              {/* eslint-disable-next-line array-callback-return */}
              {combo?.products?.map((item) => (
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
                      secondary={fCurrency(item?.price, currentTT?.country?.name) || 100}
                    />
                    <Stack direction="row" alignItems="center">
                      <IconButton
                        size="large"
                        onClick={() => {
                          handleDecrement(combo.id, item.id);
                        }}
                      >
                        <Icon icon={minusFill} width={20} height={20} />
                      </IconButton>
                      <Typography variant="h6" sx={{ mx: 1 }}>
                        {/* {(itemIndex > -1 && sauces[itemIndex].quantity) || 0} */}
                        {chosenProducts?.find((prod) => prod.comboId === combo.id)?.product?.id ===
                        item.id
                          ? 1
                          : 0}
                        {/* {item.id === sauce.id ? 1 : 0} */}
                      </Typography>
                      <IconButton
                        size="large"
                        disabled={chosenProducts?.some((prod) => prod.comboId === combo.id)}
                        onClick={() => {
                          handleIncrement(combo.id, item.id);
                        }}
                      >
                        <Icon icon={plusFill} width={20} height={20} />
                      </IconButton>
                    </Stack>
                  </ListItem>
                </Stack>
              ))}
            </List>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Выберите соус {index + 1}</Typography>
            </Stack>
            <Divider />
            <List sx={{ width: '100%', my: 1, paddingTop: '1px', paddingBottom: '1px' }}>
              {/* eslint-disable-next-line array-callback-return */}
              {saucesList?.map((item) => (
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
                      secondary={fCurrency(item?.price, currentTT?.country?.name) || 100}
                    />
                    <Stack direction="row" alignItems="center">
                      <IconButton
                        size="large"
                        onClick={() => {
                          handleDecrementSauce(combo.id);
                        }}
                      >
                        <Icon icon={minusFill} width={20} height={20} />
                      </IconButton>
                      <Typography variant="h6" sx={{ mx: 1 }}>
                        {chosenProducts?.find((prod) => prod?.comboId === combo.id)?.sauce?.id ===
                        item.id
                          ? 1
                          : 0}
                      </Typography>
                      <IconButton
                        size="large"
                        // disabled={chosenProducts?.some((prod) => prod.comboId === combo.id)}
                        onClick={() => {
                          handleIncrementSauce(combo.id, item.id);
                        }}
                      >
                        <Icon icon={plusFill} width={20} height={20} />
                      </IconButton>
                    </Stack>
                  </ListItem>
                </Stack>
              ))}
            </List>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Выберите топпинг {index + 1}</Typography>
            </Stack>
            <Divider />
            <List sx={{ width: '100%', my: 1, paddingTop: '1px', paddingBottom: '1px' }}>
              {/* eslint-disable-next-line array-callback-return */}
              {toppingList?.map((item) => (
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
                      secondary={fCurrency(item?.price, currentTT?.country?.name) || 100}
                    />
                    <Stack direction="row" alignItems="center">
                      <IconButton
                        size="large"
                        onClick={() => {
                          handleDecrementTopping(combo.id, item.id);
                        }}
                      >
                        <Icon icon={minusFill} width={20} height={20} />
                      </IconButton>
                      <Typography variant="h6" sx={{ mx: 1 }}>
                        {chosenProducts
                          ?.find((prod) => prod?.comboId === combo.id)
                          ?.toppings?.find((top) => top.product.id === item.id)?.amount || 0}
                      </Typography>
                      <IconButton
                        size="large"
                        // disabled={chosenProducts?.some((prod) => prod.comboId === combo.id)}
                        onClick={() => {
                          handleIncrementTopping(combo.id, item.id);
                        }}
                      >
                        <Icon icon={plusFill} width={20} height={20} />
                      </IconButton>
                    </Stack>
                  </ListItem>
                </Stack>
              ))}
            </List>
          </div>
        ))}
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
          <Button fullWidth color="primary" variant="contained" onClick={submitEvent}>
            Добавить
          </Button>
        </Stack>
      </RootStyle>
    </Modal>
  );
}

export default EventModal;
