import React from 'react';
import PropTypes from 'prop-types';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Divider, IconButton, Stack, Typography } from '@material-ui/core';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
// redux
import { useDispatch, useSelector } from 'react-redux';
import {
  decrementAmount,
  decrementAmazonAmount,
  incrementAmount,
  incrementAmazonAmount
} from 'features/cart/cartSlice';
//
import { fCurrency } from 'utils/formatNumber';

//

const ProductImg = styled('img')({
  width: '64px'
});

CartItem.propTypes = {
  product: PropTypes.shape({
    cover: PropTypes.string,
    name: PropTypes.string,
    amount: PropTypes.number,
    price: PropTypes.number,
    index: PropTypes.number,
    type: PropTypes.string,
    sauces: PropTypes.array
  })
};

function CartItem({ product }) {
  const { cover, name, index, type, drinks } = product?.product;
  const { sauce, toppings, amount } = product;
  const dispatch = useDispatch();
  const { currentTT } = useSelector((state) => state.SP);
  const finalPrice =
    product?.amount *
    (product?.product?.price +
      (Object.keys(sauce).length ? sauce?.price : 0) +
      (toppings.length ? toppings.reduce((a, b) => a + b.product.price * b.amount, 0) : 0));
  const handleIncrement = () => {
    if (product?.product?.productType?.key === 'PRODUCT') {
      dispatch(incrementAmazonAmount(product));
    } else {
      dispatch(incrementAmount(product));
    }
  };

  const handleDecrement = () => {
    if (product?.product?.productType?.key === 'PRODUCT') {
      dispatch(decrementAmazonAmount(product));
    } else {
      dispatch(decrementAmount(product));
    }
  };

  return (
    <>
      {index !== 0 && <Divider orientation="horizontal" />}

      <Stack flex direction="column" alignItems="center" sx={{ my: 2 }}>
        <Stack flex direction="row" alignItems="center" sx={{ width: '100%' }}>
          <Stack>
            <Typography variant="body1" noWrap>
              {name}
            </Typography>
            <Stack direction="column" sx={{ flexWrap: 'wrap' }}>
              <Stack direction="column" alignItems="center">
                <Typography variant="caption" key={sauce?.id} sx={{ width: '100%' }}>
                  {Object.keys(sauce).length ? `${sauce?.name} 1` : ''}
                </Typography>
              </Stack>
              <Stack flex direction="row" alignItems="center" sx={{ flexWrap: 'wrap' }}>
                {toppings?.map((topping) => (
                  <Typography variant="caption" sx={{ mr: 0.5 }} key={topping?.product?.id}>
                    {topping?.product?.name} {topping?.amount}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%', mt: 1 }}
        >
          <Box>
            <IconButton variant="contained" onClick={handleDecrement}>
              <Icon icon={minusFill} width={20} height={20} />
            </IconButton>
            {amount}
            <IconButton color="inherit" onClick={handleIncrement}>
              <Icon icon={plusFill} width={20} height={20} />
            </IconButton>
          </Box>
          <Box sx={{ ml: 'auto' }}>{fCurrency(finalPrice, currentTT.country.name)} </Box>
        </Stack>
      </Stack>
    </>
  );
}

export default CartItem;
