import React, { useState } from 'react';
// material
import { Grid } from '@material-ui/core';
import { useMealMenuContext } from 'components/_dashboard/mealMenu/mealMenuContext';
import ShopProductCard from './ProductCard';
import ModalBreadMeatAndCoffee from './ModalBreadMeatAndCoffee';

function BreadMeatAndCoffee() {
  const { products } = useMealMenuContext();

  const [showModal, setShowModal] = useState(false);
  // Product to display in modal
  const [modalProduct, setModalProduct] = useState({});

  const handleClose = () => setShowModal(false);

  // Accept product, then pass to modal
  const handleOpen = (product) => {
    setModalProduct(product);
    setShowModal(true);
  };

  const dataProducts = products?.filter(
    (el) => el.values.category_ru === 'Продукты ' // && !el.values?.name_ru.includes('ржаной') // && el.values?.name_ru !== 'Конина'
  );
  return (
    <Grid container spacing={3}>
      {dataProducts.map((product) => (
        <Grid key={product.uuid} item xs={12} sm={4}>
          <ShopProductCard product={product} handleOpen={handleOpen} />
        </Grid>
      ))}
      <ModalBreadMeatAndCoffee open={showModal} handleClose={handleClose} product={modalProduct} />
    </Grid>
  );
}

export default BreadMeatAndCoffee;
