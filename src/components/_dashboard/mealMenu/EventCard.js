import React, { memo } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Button, Card, Stack, Typography } from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';
// redux
import { useDispatch, useSelector } from 'react-redux';
// utils
// eslint-disable-next-line import/named
import { fCurrency } from 'utils/formatNumber';
//
import { addToCart } from 'features/cart/cartSlice';
import { FILE_API } from 'utils/constants';

const cover = `/static/placeholder.png`;
// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

EventCard.propTypes = {
  event: PropTypes.object,
  handleOpen: PropTypes.func
};

function EventCard({ event, handleOpen }) {
  const dispatch = useDispatch();
  const currentTT = useSelector((state) => state.SP?.currentTT);
  const handleAdd = () => {
    handleOpen(event);
  };

  return (
    <Card>
      <Box sx={{ pt: '75%', position: 'relative' }}>
        {event.imagePath && (
          <ProductImgStyle alt={event.name} src={`${FILE_API}/${event.imagePath}`} />
        )}
      </Box>

      <Stack spacing={1} sx={{ p: 2 }}>
        <Typography variant="subtitle2" noWrap>
          {event?.name}
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
            {fCurrency(event?.price, currentTT?.country?.name)}
          </Typography>
        </Stack>
        <Button fullWidth variant="contained" onClick={handleAdd}>
          Добавить
        </Button>
      </Stack>
    </Card>
  );
}

export default memo(EventCard);
