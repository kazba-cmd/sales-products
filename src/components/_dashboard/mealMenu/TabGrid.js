import React from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Grid } from '@material-ui/core';
// components
import { ProductList, DrinkList, ClothesList } from 'components/_dashboard/mealMenu';
//
import EventList from './EventList';
import ChildMenuList from './ChildMenuList';
import HotDishList from './HotDishList';

function TabGrid({ activeTab }) {
  return (
    <Grid container item xs={12} md={8}>
      <TabPanel value={activeTab} index={0} component="div">
        <ProductList />
      </TabPanel>
      <TabPanel value={activeTab} index={1} component="div">
        <DrinkList />
      </TabPanel>
      {/* <TabPanel value={activeTab} index={2} component="div">
        <EventList />
      </TabPanel> */}
      <TabPanel value={activeTab} index={2} component="div">
        <HotDishList />
      </TabPanel>
      <TabPanel value={activeTab} index={3} component="div">
        <ClothesList />
      </TabPanel>
      {/* <TabPanel value={activeTab} index={4} component="div">
        <ChildMenuList />
      </TabPanel> */}
      {/* <TabPanel value={activeTab} index={4} component="div">
        <ClothesList />
      </TabPanel> */}
      {/* <TabPanel value={activeTab} index={3} component="div"> */}
      {/*  Соусы */}
      {/* </TabPanel> */}
    </Grid>
  );
}

export default TabGrid;

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
