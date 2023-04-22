import React from 'react';
// redux
import { useSelector } from 'react-redux';
//
import PropTypes from 'prop-types';
// material
import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography
} from '@material-ui/core';
// icons
import { Icon } from '@iconify/react';
import roundLunchDining from '@iconify-icons/ic/round-lunch-dining';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
// utils
import { getItemIndex } from 'utils/helpers';
import { useMealMenuContext } from 'components/_dashboard/mealMenu/mealMenuContext';
import { fCurrency } from '../../../utils/formatNumber';

SousModalRight.propTypes = {
  setSauces: PropTypes.func,
  sauces: PropTypes.array
};

function SousModalRight({ setSauces, sauces, disabledRight, setDisabledRight }) {
  const { sauces: saucesList } = useMealMenuContext();
  const { currentTT } = useSelector((state) => state.SP);

  const handleIncrement = (uuid) => {
    const itemIndex = getItemIndex(sauces, uuid);
    const sauceCount = sauces.reduce((a, b) => a + b.quantity || 0, 0);
    //
    if (itemIndex < 0) {
      setSauces((prev) => [
        ...prev,
        { ...saucesList.find((s) => s.uuid === uuid), quantity: 1, fixedQuantity: 1 }
      ]);
      setDisabledRight(true);
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
        setDisabledRight(false);
      }
    }
  };
  const handleIncrementTopping = (uuid) => {
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

  const handleDecrementTopping = (uuid) => {
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

  return (
    <List sx={{ width: '100%', my: 1, paddingTop: '1px', paddingBottom: '1px' }}>
      {/* eslint-disable-next-line array-callback-return */}
      {saucesList.map(({ label, uuid, values }) => {
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
                  secondary={`${fCurrency(values?.cena_ru, currentTT.country.name) || 100}`}
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
                    disabled={disabledRight}
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
      <Stack direction="column">
        <Typography variant="h6">Выберите топпинг</Typography>
        <Divider sx={{ mb: 0.5 }} />
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
                  secondary={`${fCurrency(values?.cena_ru, currentTT.country.name) || 100}`}
                />
                <Stack direction="row" alignItems="center">
                  <IconButton
                    size="large"
                    onClick={() => {
                      handleDecrementTopping(uuid);
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
                      handleIncrementTopping(uuid);
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
  );
}

export default SousModalRight;
