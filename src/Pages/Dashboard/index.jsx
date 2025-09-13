import React from 'react';
import { Box } from '@mui/material';
import DashboardBoxes from '../../Components/DashboardBoxes';
import DashboardWelcome from '../../Components/DashboardWelcome';
import ProductsBox from '../../Components/ProductsBox';
import RecentOrders from '../../Components/RecentOrders';
import DashboardGraph from '../../Components/DashboardGraph';

const Dashboard = () => {
  return (
    <Box sx={{ '& > * + *': { marginTop: '24px' } }}>
      <DashboardWelcome />
      <DashboardBoxes />
      <DashboardGraph />
      <ProductsBox />
      <RecentOrders />
    </Box>
  );
};

export default Dashboard;