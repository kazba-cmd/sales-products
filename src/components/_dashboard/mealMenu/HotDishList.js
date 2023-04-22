// material
import { Grid, Typography } from '@material-ui/core';
import { useMealMenuContext } from 'components/_dashboard/mealMenu/mealMenuContext';
import ShopProductCard from './ProductCard';

// ----------------------------------------------------------------------

export default function HotDishList() {
  const { hotDish, drinks } = useMealMenuContext();
  console.log(hotDish);
  console.log(drinks);
  return (
    <Grid spacing={3}>
      <Typography variant="h4" my="20px">
        Паста
      </Typography>
      <Grid container spacing={3}>
        {hotDish.map(
          (product) =>
            product.productCategory?.key === 'PASTE' && (
              <Grid item sm={4} xs={12} key={product.uuid}>
                <ShopProductCard product={product} />
              </Grid>
            )
        )}
      </Grid>
      <Typography variant="h4" my="20px">
        Мезе
      </Typography>
      <Grid container spacing={3}>
        {hotDish.map(
          (product) =>
            product.productCategory?.key === 'MEZE' && (
              <Grid item sm={4} xs={12} key={product.uuid}>
                <ShopProductCard product={product} />
              </Grid>
            )
        )}
      </Grid>
      <Typography variant="h4" my="20px">
        Фри
      </Typography>
      <Grid container spacing={3}>
        {hotDish.map(
          (product) =>
            product.productCategory?.key === 'DEEP_FRIED' && (
              <Grid item sm={4} xs={12} key={product.uuid}>
                <ShopProductCard product={product} />
              </Grid>
            )
        )}
      </Grid>
      <Typography variant="h4" my="20px">
        Десерт
      </Typography>
      <Grid container spacing={3}>
        {hotDish.map(
          (product) =>
            product.productCategory?.key === 'DESSERT' && (
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
