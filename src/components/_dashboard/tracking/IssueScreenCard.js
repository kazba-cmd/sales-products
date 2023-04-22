import { Card, Typography, Stack } from '@material-ui/core';
import PropTypes from 'prop-types';
// utils

IssueScreenCard.propTypes = {
  order: PropTypes.object
};

export default function IssueScreenCard({ order }) {
  return (
    <Card>
      {order && (
        <Stack direction="column" spacing={2} sx={{ p: 2 }} justifyContent="center">
          <Typography variant="h4" textAlign="center" noWrap>
            {order.orderNumber}-{order.orderCompositions.length}
          </Typography>
        </Stack>
      )}
    </Card>
  );
}
