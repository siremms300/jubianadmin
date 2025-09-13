import React from 'react';
import ProductsBox from '../../Components/ProductsBox';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Home,
  Inventory
} from '@mui/icons-material';

const ProductList = () => {
  return (
    <Box>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
          href="/"
        >
          <Home sx={{ mr: 0.5, fontSize: 20 }} />
          Dashboard
        </Link>
        <Typography
          sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}
        >
          <Inventory sx={{ mr: 0.5, fontSize: 20 }} />
          Products
        </Typography>
      </Breadcrumbs>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
      {/* <Typography variant="h4" component="h1" sx={{ 
        fontWeight: 600, 
        color: 'grey.800',
        mb: 3
      }}>
        Product Management
      </Typography> */}

      {/* Page Description */}
      <Typography variant="body1" sx={{ 
        color: 'grey.600',
        mb: 4,
        maxWidth: '800px'
      }}>
        Manage your product catalog, inventory, pricing, and wholesale settings. 
        Add new products, update existing ones, and configure wholesale options.
      </Typography>

      {/* Products Table Component */}
      <ProductsBox />
    </Box>
  );
};

export default ProductList;