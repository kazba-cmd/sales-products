import PropTypes from 'prop-types';

// material
import { CircularProgress, Grid } from '@material-ui/core';
// eslint-disable-next-line import/no-unresolved
import { Empty } from 'components';
import IssueTrackingCard from './IssueTrackingCard';

// ----------------------------------------------------------------------
CookingTrackingList.propTypes = {
  orders: PropTypes.array,
  handleOpen: PropTypes.func
};

const style = {
  position: 'absolute',
  top: '0',
  bottom: '0',
  right: '0',
  left: '0',
  margin: 'auto'
};

export default function CookingTrackingList({ orders, handleOpen, loading }) {
  if (loading) return <CircularProgress sx={style} />;
  return (
    <Grid container spacing={2}>
      {orders.length ? (
        orders?.map((order) => (
          // const { uuid } = order; (
          <Grid item xs={12} sm={4} key={order.uuid}>
            <IssueTrackingCard order={order} handleOpen={handleOpen} />
          </Grid>
        ))
      ) : (
        <Empty />
      )}
    </Grid>
  );
}
