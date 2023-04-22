import React, { useState } from 'react';
// material
import { Grid } from '@material-ui/core';
import { ModalSauce, ProductCard as ShopProductCard } from 'components/_dashboard/mealMenu';
import { useMealMenuContext } from 'components/_dashboard/mealMenu/mealMenuContext';

// ----------------------------------------------------------------------

ChildMenuList.propTypes = {};

export default function ChildMenuList() {
  const { childMenu } = useMealMenuContext();

  const [showModal, setShowModal] = useState(false);
  // Product to display in modal
  const [modalProduct, setModalProduct] = useState({});

  const handleClose = () => setShowModal(false);

  // Accept product, then pass to modal
  const handleOpen = (product) => {
    setModalProduct(product);
    setShowModal(true);
  };
  return (
    <Grid container spacing={3}>
      {childMenu.map((product) => (
        <Grid key={product.id} item xs={12} sm={4}>
          <ShopProductCard product={product} handleOpen={handleOpen} />
        </Grid>
      ))}
      <ModalSauce open={showModal} handleClose={handleClose} product={modalProduct} />
    </Grid>
  );
}
