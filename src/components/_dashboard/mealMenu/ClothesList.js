import React, { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Grid } from '@material-ui/core';
import { ModalSauce, ProductCard as ShopProductCard } from 'components/_dashboard/mealMenu';
import { useMealMenuContext } from 'components/_dashboard/mealMenu/mealMenuContext';

// ----------------------------------------------------------------------

ClothesList.propTypes = {};

export default function ClothesList() {
  const { clothes } = useMealMenuContext();
  return (
    <Grid container spacing={3}>
      {clothes.map((product) => (
        <Grid key={product.id} item xs={12} sm={4}>
          <ShopProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
