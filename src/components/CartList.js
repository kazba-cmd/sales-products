import React from 'react';
import { Box } from '@material-ui/core';
// redux
import { useSelector } from 'react-redux';
//
import { CartItem } from 'components';

function CartList() {
  const { cartList } = useSelector((state) => state.cart);
  return (
    <Box sx={{ px: 2, py: 2 }}>
      {cartList.map((cartItem, index) => (
        <CartItem key={index} product={cartItem} index={index} />
      ))}
    </Box>
  );
}

export default CartList;
