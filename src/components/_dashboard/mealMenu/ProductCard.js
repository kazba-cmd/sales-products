import React, { memo } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Card, Button, Typography, Stack } from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
// redux
import { useDispatch, useSelector } from 'react-redux';
// utils
// eslint-disable-next-line import/named
import { fCurrency } from 'utils/formatNumber';
//
import { addToCart } from 'features/cart/cartSlice';
import { FILE_API } from 'utils/constants';
// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  position: 'absolute'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
  handleOpen: PropTypes.func
};

function ShopProductCard({ product, handleOpen }) {
  const dispatch = useDispatch();
  const { currentTT } = useSelector((state) => state.SP);
  const handleAdd = () => {
    if (product?.productType?.key === 'PRODUCT' || product?.productType?.key === 'CHILDREN') {
      handleOpen(product);
    } else {
      dispatch(addToCart({ ...product, quantity: 1 }));
    }
  };
  return (
    <Card>
      <Box sx={{ pt: '75%', position: 'relative' }}>
        {/* {status && (
          <Label
            variant="filled"
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase'
            }}
          >
            {status}
          </Label>
        )} */}
        {product.imagePath && (
          <ProductImgStyle alt={product.name} src={`${FILE_API}/${product.imagePath}`} />
          // <ProductImgStyle alt={product.name_ru} src={`/static/${product.imageLink}`} />
        )}
      </Box>

      <Stack spacing={1} sx={{ p: 2 }}>
        <Typography variant="subtitle2" noWrap>
          {product.name}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2">
            {/* <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through'
              }}
            >
              {priceSale && fCurrency(priceSale)}
            </Typography> */}
            {fCurrency(product.price, currentTT.country.name)}
          </Typography>
        </Stack>
        <Button fullWidth variant="contained" onClick={handleAdd}>
          Добавить
        </Button>
      </Stack>
    </Card>
  );
}

export default memo(ShopProductCard);
