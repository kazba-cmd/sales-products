import React, { Fragment } from 'react';
//
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
// material
import { Stack, IconButton } from '@material-ui/core';

CartButtons.propTypes = {
  options: PropTypes.array,
  paymentValue: PropTypes.object,
  handleClick: PropTypes.func
};
function CartButtons({ options, paymentValue, handleClick }) {
  return (
    <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ my: 2 }}>
      {options.map((option, id) => {
        const { value, icon } = option;
        return (
          <Fragment key={id}>
            {value !== 'Доставка' && (
              <IconButton
                key={value}
                onClick={() => {
                  handleClick(option);
                }}
                variant="contained"
                color={value === paymentValue.value ? 'primary' : 'inherit'}
              >
                <Icon icon={icon} width={30} height={30} />
              </IconButton>
            )}
          </Fragment>
        );
      })}
    </Stack>
  );
}

export default CartButtons;
