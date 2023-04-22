import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Card, Stack, Typography, useTheme } from '@material-ui/core';
// utils
import { isDarkTheme } from 'utils/helpers';

ProductCard.propTypes = {
  label: PropTypes.string,
  sous: PropTypes.array
  // quantity: PropTypes.number
};

export default function ProductCard({ label, sous = [], product, quantity, ...rest }) {
  const [active, setActive] = useState(false);
  const { palette } = useTheme();
  const handleClick = () => setActive((prev) => !prev);
  const activeColor = isDarkTheme(palette.mode) ? palette.primary.darker : palette.primary.lighter;
  return (
    <Card sx={{ height: '100%', background: active ? activeColor : '' }} onClick={handleClick}>
      <Stack direction="column" spacing={2} sx={{ p: 2 }} justifyContent="space-between">
        {product?.orderComboCompositions?.length === 0 ? (
          <>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1" noWrap>
                {product.product?.name} {product.amount}
              </Typography>
            </Stack>
            <Stack direction="row">
              {product.toppings?.map((topping) => (
                <Typography variant="caption" sx={{ mr: 0.5 }}>
                  {topping.product.name} {topping.amount}
                </Typography>
              ))}
            </Stack>
            <Stack direction="row">
              <Typography variant="caption" sx={{ mr: 0.5 }}>
                {product.sauce?.name} {product.amount}
              </Typography>
            </Stack>
          </>
        ) : (
          <>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1" noWrap>
                {product.combo?.name} {product.amount}
              </Typography>
            </Stack>
            {product.orderComboCompositions.map((item) => (
              <Stack direction="row">
                {item.product?.name} {item.amount}
                {item.toppings?.map((topping) => (
                  <Typography variant="caption" sx={{ mr: 0.5 }}>
                    {topping.product.name} {topping.amount}
                  </Typography>
                ))}
                <Typography variant="caption" sx={{ mr: 0.5 }}>
                  {item.sauce?.name}
                </Typography>
              </Stack>
            ))}
          </>
        )}
      </Stack>
    </Card>
  );
}
//   /* {sous.map((s, i) => (
//             <Typography variant="caption" sx={{ mr: 0.5 }} key={s}>
//               {s} {!isLast(sous, i + 1) && ','}
//             </Typography>
//           ))} */
