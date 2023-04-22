import React, { useState } from 'react';
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
import { getItemIndex } from 'utils/helpers';
import { useMealMenuContext } from 'components/_dashboard/mealMenu/mealMenuContext';
import { fCurrency } from '../../../utils/formatNumber';

ModalBreadMeatAndCoffee.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  product: PropTypes.object
};

function ModalBreadMeatAndCoffee({ open, handleClose, product }) {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [sauces, setSauces] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const { sauces: saucesList } = useMealMenuContext();
  const { drinks: drinksList } = useMealMenuContext();
  const dataCoffee = drinksList?.filter((el) => el.values.cena_ak);

  const callbackClose = () => {
    resetSauces();
    handleClose();
    setDrinks([]);
  };

  const resetSauces = () => setSauces([]);

  // При выборе соуса закрыть модалку и очистить соусы
  const submitSauces = () => {
    dispatch(addAmazonToCart({ ...product, quantity: 1, sauces, drinks }));
    // dispatch(addAmazonToCart({ ...product, quantity: 1 }));
    callbackClose();
  };

  const handleIncrement = (uuid) => {
    const itemIndex = getItemIndex(sauces, uuid);
    const sauceCount = sauces.reduce((a, b) => a + b.quantity || 0, 0);
    //
    if (itemIndex < 0) {
      setSauces((prev) => [
        ...prev,
        { ...saucesList.find((s) => s.uuid === uuid), quantity: 1, fixedQuantity: 1 }
      ]);
    } else {
      const updated = [...sauces];
      updated[itemIndex].quantity += 1;
      updated[itemIndex].fixedQuantity += 1;
      setSauces(updated);
    }
  };

  const handleDecrement = (uuid) => {
    const itemIndex = getItemIndex(sauces, uuid);
    if (itemIndex > -1) {
      if (sauces[itemIndex].quantity > 1) {
        const updated = [...sauces];
        updated[itemIndex].quantity -= 1;
        setSauces(updated);
      } else {
        const updated = [...sauces];
        updated.splice(itemIndex, 1);
        setSauces(updated);
      }
    }
  };

  const handleDrinksIncrement = (uuid) => {
    const itemIndex = getItemIndex(drinks, uuid);
    //
    if (itemIndex < 0) {
      setDrinks((prev) => [
        ...prev,
        { ...drinksList.find((s) => s.uuid === uuid), quantity: 1, fixedQuantity: 1 }
      ]);
    } else {
      const updated = [...drinks];
      updated[itemIndex].quantity += 1;
      updated[itemIndex].fixedQuantity += 1;
      setDrinks(updated);
    }
  };

  const handleDrinksDecrement = (uuid) => {
    const itemIndex = getItemIndex(drinks, uuid);
    if (itemIndex > -1) {
      if (drinks[itemIndex].quantity > 1) {
        const updated = [...drinks];
        updated[itemIndex].quantity -= 1;
        setDrinks(updated);
      } else {
        const updated = [...drinks];
        updated.splice(itemIndex, 1);
        setDrinks(updated);
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
    width: 600,
    padding: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      width: '70vw'
    },
    [theme.breakpoints.down('sm')]: {
      width: '90vw'
    }
  }));

  const drinksCounter = drinks?.length === 1;

  return (
    <Modal open={open} onClose={callbackClose}>
      <RootStyle sx={{ width: '80%' }}>
        <Stack direction="row" justifyContent="end">
          <IconButton onClick={callbackClose}>
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
        </Stack>
        <Stack direction="row">
          <List sx={{ width: '100%', my: 1, paddingTop: '1px', paddingBottom: '1px' }}>
            <Stack direction="column">
              <Typography variant="h6" paddingTop="10px">
                Выберите соус
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {/* eslint-disable-next-line array-callback-return */}
              {saucesList?.map(({ label, uuid, values }) => {
                if (values.type === 'sous') {
                  const itemIndex = getItemIndex(sauces, uuid);
                  return (
                    <Stack direction="column">
                      <ListItem key={uuid} sx={{ paddingTop: '4px', paddingBottom: '4px' }}>
                        <ListItemAvatar>
                          <Avatar>
                            <Icon icon={roundLunchDining} width={20} height={20} />
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={values.sous}
                          secondary={`${
                            fCurrency(values?.cena_ru, currentUser.userInfo.country) || 100
                          }`}
                        />
                        <Stack direction="row" alignItems="center">
                          <IconButton
                            size="large"
                            onClick={() => {
                              handleDecrement(uuid);
                            }}
                          >
                            <Icon icon={minusFill} width={20} height={20} />
                          </IconButton>
                          <Typography variant="h6" sx={{ mx: 1 }}>
                            {(itemIndex > -1 && sauces[itemIndex].quantity) || 0}
                          </Typography>
                          d
                          <IconButton
                            size="large"
                            onClick={() => {
                              handleIncrement(uuid);
                            }}
                          >
                            <Icon icon={plusFill} width={20} height={20} />
                          </IconButton>
                        </Stack>
                      </ListItem>
                    </Stack>
                  );
                }
              })}
            </Stack>
            <Stack direction="column">
              <Typography variant="h6" paddingTop="10px">
                Выберите топпинг
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {/* eslint-disable-next-line array-callback-return */}
              {saucesList.map(({ label, uuid, values }) => {
                if (values.type === 'topping') {
                  const itemIndex = getItemIndex(sauces, uuid);
                  return (
                    <ListItem key={uuid} sx={{ paddingTop: '4px', paddingBottom: '4px' }}>
                      <ListItemAvatar>
                        <Avatar>
                          <Icon icon={roundLunchDining} width={20} height={20} />
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={values.sous}
                        secondary={`${
                          fCurrency(values?.cena_ru, currentUser.userInfo.country) || 100
                        }`}
                      />
                      <Stack direction="row" alignItems="center">
                        <IconButton
                          size="large"
                          onClick={() => {
                            handleDecrement(uuid);
                          }}
                        >
                          <Icon icon={minusFill} width={20} height={20} />
                        </IconButton>
                        <Typography variant="h6" sx={{ mx: 1 }}>
                          {(itemIndex > -1 && sauces[itemIndex].quantity) || 0}
                        </Typography>
                        <IconButton
                          size="large"
                          onClick={() => {
                            handleIncrement(uuid);
                          }}
                        >
                          <Icon icon={plusFill} width={20} height={20} />
                        </IconButton>
                      </Stack>
                    </ListItem>
                  );
                }
              })}
            </Stack>
          </List>
          <List sx={{ width: '100%', my: 1, paddingTop: '1px', paddingBottom: '1px' }}>
            <Stack direction="column">
              <Typography variant="h6" paddingTop="10px">
                Выберите кофе
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {/* eslint-disable-next-line array-callback-return */}
              {dataCoffee.map(({ label, uuid, values }) => {
                const itemIndex = getItemIndex(drinks, uuid);
                return (
                  <ListItem key={uuid} sx={{ paddingTop: '4px', paddingBottom: '4px' }}>
                    <ListItemAvatar>
                      <Avatar>
                        <Icon icon={roundLunchDining} width={20} height={20} />
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={values.name_ru}
                      secondary={`${
                        fCurrency(values?.cena_ak, currentUser.userInfo.country) || 100
                      }`}
                    />
                    <Stack direction="row" alignItems="center">
                      <IconButton
                        size="large"
                        onClick={() => {
                          handleDrinksDecrement(uuid);
                        }}
                      >
                        <Icon icon={minusFill} width={20} height={20} />
                      </IconButton>
                      <Typography variant="h6" sx={{ mx: 1 }}>
                        {(itemIndex > -1 && drinks[itemIndex].quantity) || 0}
                      </Typography>
                      <IconButton
                        size="large"
                        onClick={() => {
                          handleDrinksIncrement(uuid);
                        }}
                        disabled={drinksCounter}
                      >
                        <Icon icon={plusFill} width={20} height={20} />
                      </IconButton>
                    </Stack>
                  </ListItem>
                );
              })}
            </Stack>
          </List>
        </Stack>
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

export default ModalBreadMeatAndCoffee;
