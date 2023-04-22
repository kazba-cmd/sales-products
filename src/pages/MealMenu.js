import React, { useEffect, useState } from 'react';
// material
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Drawer,
  Card,
  CardHeader,
  IconButton,
  Stack,
  Divider
} from '@material-ui/core';
// icons
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
// components
import Page from 'components/Page';
import { ProductCartWidget, CartWidget, TabGrid } from 'components/_dashboard/mealMenu';
import { MHidden } from 'components/@material-extend';
//
import Scrollbar from 'components/Scrollbar';
import { MealMenuContextProvider } from 'components/_dashboard/mealMenu/mealMenuContext';
import { formatISO } from 'date-fns';
import axios from 'axios';
import { REST_URL } from 'utils/constants';

// ----------------------------------------------------------------------

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function Menu() {
  // hooks
  const [activeTab, setActiveTab] = useState(0);
  const [showMobileCart, setShowMobileCart] = useState(false);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setShowMobileCart(open);
  };
  return (
    <MealMenuContextProvider>
      <Page title="Торговая точка">
        <Container maxWidth="xl">
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
            <Typography variant="h4" gutterBottom>
              Меню
            </Typography>
          </Stack>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Продукты" {...a11yProps(0)} />
            <Tab label="Напитки" {...a11yProps(1)} />
            {/* <Tab label="Акции" {...a11yProps(2)} /> */}
            <Tab label="Горячее" {...a11yProps(2)} />
            {/* <Tab label="Бредмит + кофе" {...a11yProps(3)} /> */}
            <Tab label="Одежда" {...a11yProps(3)} />
            {/* <Tab label="Детское меню" {...a11yProps(4)} /> */}
            {/* <Tab label="Соусы" {...a11yProps(3)} /> */}
          </Tabs>
          <Grid container spacing={2}>
            <TabGrid activeTab={activeTab} />
            <MHidden width="mdDown">
              <Grid item md={4}>
                <Card>
                  <CardHeader title="Корзина" />
                  <CartWidget />
                </Card>
              </Grid>
            </MHidden>
          </Grid>

          {/* Shows only on mobile */}
          <MHidden width="mdUp">
            <ProductCartWidget toggleDrawer={toggleDrawer} />
            <Drawer
              anchor="right"
              open={showMobileCart}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: { border: 'none', overflow: 'hidden' }
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 1, py: 2 }}
              >
                <Typography variant="subtitle1" sx={{ ml: 1 }}>
                  Корзина
                </Typography>
                <IconButton onClick={toggleDrawer(false)}>
                  <Icon icon={closeFill} width={20} height={20} />
                </IconButton>
              </Stack>

              <Divider />
              <Scrollbar>
                <CartWidget />
              </Scrollbar>
            </Drawer>
          </MHidden>
        </Container>
      </Page>
    </MealMenuContextProvider>
  );
}
