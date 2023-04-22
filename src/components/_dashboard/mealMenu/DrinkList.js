// material
import { Grid, Typography } from '@material-ui/core';
import { useMealMenuContext } from 'components/_dashboard/mealMenu/mealMenuContext';
import ShopProductCard from './ProductCard';

// ----------------------------------------------------------------------

export default function DrinkList() {
  const { drinks } = useMealMenuContext();
  return (
    <Grid spacing={3}>
      <Typography variant="h4" my="20px">
        Холодные напитки
      </Typography>
      <Grid container spacing={3}>
        {drinks.map(
          (product) =>
            product.productCategory?.key === 'COLD' && (
              <Grid item sm={4} xs={12} key={product.uuid}>
                <ShopProductCard product={product} />
              </Grid>
            )
        )}
      </Grid>
      <Typography variant="h4" my="20px">
        Газированные напитки
      </Typography>
      <Grid container spacing={3}>
        {drinks.map(
          (product) =>
            product?.productCategory?.key === 'CARBONATED' && (
              <Grid item sm={4} xs={12} key={product.uuid}>
                <ShopProductCard product={product} />
              </Grid>
            )
        )}
      </Grid>
      <Typography variant="h4" my="20px">
        Горячие напитки
      </Typography>
      <Grid container spacing={3}>
        {drinks.map(
          (product) =>
            product?.productCategory?.key === 'HOT' && (
              <Grid item sm={4} xs={12} key={product.uuid}>
                <ShopProductCard product={product} />
              </Grid>
            )
        )}
      </Grid>
      <Typography variant="h4" my="20px">
        Морс
      </Typography>
      <Grid container spacing={3}>
        {drinks.map(
          (product) =>
            product.productCategory?.key === 'FRUIT' && (
              <Grid item sm={4} xs={12} key={product.uuid}>
                <ShopProductCard product={product} />
              </Grid>
            )
        )}
      </Grid>
      <Typography variant="h4" my="20px">
        Молочные напитки
      </Typography>
      <Grid container spacing={3}>
        {drinks.map(
          (product) =>
            product.productCategory?.key === 'MILK' && (
              <Grid item sm={4} xs={12} key={product.uuid}>
                <ShopProductCard product={product} />
              </Grid>
            )
        )}
      </Grid>
      <Typography variant="h4" my="20px">
        Вода
      </Typography>
      <Grid container spacing={3}>
        {drinks.map(
          (product) =>
            product.productCategory?.key === 'WATER' && (
              <Grid item sm={4} xs={12} key={product.uuid}>
                <ShopProductCard product={product} />
              </Grid>
            )
        )}
      </Grid>
      <Typography variant="h4" my="20px">
        Соки
      </Typography>
      <Grid container spacing={3}>
        {drinks.map(
          (product) =>
            product.productCategory !== null &&
            product.productCategory?.key === 'JUICE' && (
              <Grid item sm={4} xs={12} key={product.uuid}>
                <ShopProductCard product={product} />
              </Grid>
            )
        )}
      </Grid>
      {/* <Typography variant="h4" my="20px">
        Просто напитки без типа
      </Typography>
      <Grid container spacing={3}>
        {drinks.map(
          (product) =>
            product.productCategory === null && (
              <Grid item sm={4} xs={12} key={product.uuid}>
                <ShopProductCard product={product} />
              </Grid>
            )
        )}
      </Grid> */}
    </Grid>
  );
}
