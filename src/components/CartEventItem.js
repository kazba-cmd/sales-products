import React from 'react';
import PropTypes from 'prop-types';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Stack, Typography, IconButton, Divider } from '@material-ui/core';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
// redux
import { useDispatch, useSelector } from 'react-redux';
import {
  incrementAmount,
  decrementAmount,
  incrementAmazonAmount,
  decrementAmazonAmount
} from 'features/cart/cartSlice';
//
import { fCurrency } from 'utils/formatNumber';
import { isArray } from 'utils/helpers';

//
const ProductImg = styled('img')({
  width: '64px'
});

CartEventItem.propTypes = {
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

function CartEventItem({ products }) {
  const dispatch = useDispatch();
  const { currentTT } = useSelector((state) => state.SP);

  const handleIncrement = () => {
    dispatch(incrementAmount(products));
  };

  const handleDecrement = () => {
    dispatch(decrementAmount(products));
  };

  return (
    <>
      <Divider orientation="horizontal" />
      {products.orderComboCompositions.map((product, index) => (
        <Stack key={index} flex direction="column" alignItems="center" sx={{ my: 2 }}>
          <Stack flex direction="row" alignItems="center" sx={{ width: '100%' }}>
            <Stack>
              <Typography variant="body1" noWrap>
                {product.product.name}
              </Typography>
              <Stack direction="column" sx={{ flexWrap: 'wrap' }}>
                <Stack direction="column" alignItems="center">
                  <Typography variant="caption" key={product.sauce.id} sx={{ width: '100%' }}>
                    {product?.sauce?.name ? `${product.sauce.name}: 1` : ''}
                  </Typography>
                </Stack>
                <Stack flex direction="row" alignItems="center" sx={{ flexWrap: 'wrap' }}>
                  {product.toppings?.map((topping) => (
                    <Typography variant="caption" sx={{ mr: 0.5 }} key={topping?.product?.id}>
                      {topping?.product?.name} {topping?.amount}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      ))}
      <Box>
        <IconButton variant="contained" onClick={handleDecrement}>
          <Icon icon={minusFill} width={20} height={20} />
        </IconButton>
        {products?.amount}
        <IconButton color="inherit" onClick={handleIncrement}>
          <Icon icon={plusFill} width={20} height={20} />
        </IconButton>
      </Box>
      <Stack
        flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: '100%', mt: 1 }}
      >
        <Box sx={{ ml: 'auto' }}>{fCurrency(products?.sum, currentTT.country.name)} </Box>
      </Stack>
    </>
  );
}

export default CartEventItem;
