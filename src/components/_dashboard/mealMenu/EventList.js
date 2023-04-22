import React, { useState } from 'react';
// material
import { Grid } from '@material-ui/core';
import { useMealMenuContext } from 'components/_dashboard/mealMenu/mealMenuContext';
import EventModal from './EventModal';
import EventCard from './EventCard';

// ----------------------------------------------------------------------

EventList.propTypes = {};

export default function EventList() {
  const { events } = useMealMenuContext();
  const [checker, setChecker] = useState(false);

  const [showModal, setShowModal] = useState(false);
  // Product to display in modal
  const [modalProduct, setModalProduct] = useState({});

  const handleClose = () => setShowModal(false);
  // Accept product, then pass to modal
  const handleOpen = (event) => {
    setChecker(!checker);
    setModalProduct(event);
    setShowModal(true);
  };
  return (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid key={event.id} item xs={12} sm={4}>
          <EventCard event={event} handleOpen={handleOpen} />
        </Grid>
      ))}
      <EventModal
        open={showModal}
        handleClose={handleClose}
        checker={checker}
        event={modalProduct}
      />
    </Grid>
  );
}
