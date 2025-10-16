import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Menu,
  Link,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Visibility,
  Delete,
  Business,
  Storefront,
  Image as ImageIcon,
  Download,
  Refresh
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../utils/productApi';
import { toast } from 'react-toastify';

const ProductsBox = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    subCategory: '',
    pricingTier: '',
    status: '',
    featured: '',
    minPrice: '',
    maxPrice: ''
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await productApi.getProducts(params);
      if (response.success) {
        setProducts(response.data);
        setTotalProducts(response.pagination.totalProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddProduct = () => {
    navigate('/product/upload');
  };

  const handleExport = () => {
    toast.info('Export feature coming soon!');
  };

  const handleMenuOpen = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleEdit = (product) => {
    navigate(`/product/edit/${product._id}`);
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product._id}`);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        const response = await productApi.deleteProduct(product._id);
        if (response.success) {
          toast.success('Product deleted successfully');
          fetchProducts(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
    handleMenuClose();
  };

  const handleProductClick = (product) => {
    handleViewDetails(product);
  };

  const handleWholesaleToggle = async (product, event) => {
    event.stopPropagation();
    try {
      const formData = new FormData();
      const updatedData = {
        wholesaleEnabled: event.target.checked
      };
      formData.append('productData', JSON.stringify(updatedData));
      
      const response = await productApi.updateProduct(product._id, formData);
      if (response.success) {
        toast.success(`Wholesale ${event.target.checked ? 'enabled' : 'disabled'} successfully`);
        fetchProducts(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating wholesale status:', error);
      toast.error('Failed to update wholesale status');
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPage(0); // Reset to first page when filters change
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  // Function to handle image loading errors
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = 'flex';
    }
  };

  const getPricingTierLabel = (tier) => {
    switch (tier) {
      case 'Basic': return 'Basic';
      case 'Standard': return 'Standard';
      case 'Premium': return 'Premium';
      case 'Enterprise': return 'Enterprise';
      default: return 'Standard';
    }
  };

  const getPricingTierColor = (tier) => {
    switch (tier) {
      case 'Basic': return 'default';
      case 'Standard': return 'primary';
      case 'Premium': return 'secondary';
      case 'Enterprise': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      case 'Draft': return 'warning';
      case 'Out of Stock': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Card 
        sx={{ 
          borderRadius: '12px', 
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          marginTop: '24px',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ padding: 0 }}>
          {/* Header with Add Product Button */}
          <Box sx={{ 
            padding: '16px', 
            borderBottom: '1px solid', 
            borderColor: 'grey.100',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
              Products ({totalProducts})
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  borderColor: 'grey.300',
                  color: 'grey.700',
                  '&:hover': {
                    borderColor: 'grey.400',
                    backgroundColor: 'grey.50'
                  },
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExport}
                sx={{
                  borderColor: '#ef7921',
                  color: '#ef7921',
                  '&:hover': {
                    borderColor: '#e06b15',
                    backgroundColor: 'rgba(239, 121, 33, 0.04)'
                  },
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddProduct}
                sx={{
                  backgroundColor: '#ef7921',
                  '&:hover': {
                    backgroundColor: '#e06b15',
                  },
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Add Product
              </Button>
            </Box>
          </Box>

          {/* Filters */}
          <Box sx={{ 
            padding: '16px', 
            borderBottom: '1px solid', 
            borderColor: 'grey.100',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: '16px'
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              gap: '16px',
              flex: 1
            }}>
              <TextField
                size="small"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'grey.400' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 200 }}
              />

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Status</InputLabel>
                <Select 
                  label="Status" 
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Featured</InputLabel>
                <Select 
                  label="Featured" 
                  value={filters.featured}
                  onChange={(e) => handleFilterChange('featured', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Featured</MenuItem>
                  <MenuItem value="false">Not Featured</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Scrollable Table Container */}
          <Box sx={{ width: '100%', overflow: 'auto' }}>
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 1400 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.50' }}>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 300 }}>PRODUCT</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>CATEGORY</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>PRICE</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>WHOLESALE PRICE</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>MOQ</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>PRICING TIER</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>STOCK</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>RATING</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>WHOLESALE</TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                        <CircularProgress />
                        <Typography variant="body2" sx={{ mt: 1, color: 'grey.600' }}>
                          Loading products...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                          No products found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product._id} hover>
                        <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell>
                        <TableCell sx={{ minWidth: 300 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                backgroundColor: 'grey.100',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                position: 'relative'
                              }}
                            >
                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0].url} 
                                  alt={product.name}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                  }}
                                  onError={handleImageError}
                                />
                              ) : null}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  display: product.images && product.images.length > 0 ? 'none' : 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: 'grey.100',
                                  borderRadius: '8px'
                                }}
                              >
                                <ImageIcon sx={{ color: 'grey.400', fontSize: 24 }} />
                              </Box>
                            </Box>
                            <Box>
                              <Link
                                component="button"
                                variant="body2"
                                onClick={() => handleProductClick(product)}
                                sx={{
                                  fontWeight: 500,
                                  color: 'primary.main',
                                  textDecoration: 'none',
                                  '&:hover': {
                                    textDecoration: 'underline',
                                    color: 'primary.dark'
                                  },
                                  textAlign: 'left'
                                }}
                              >
                                {product.name}
                              </Link>
                              <Typography variant="caption" sx={{ color: 'grey.500', display: 'block' }}>
                                {product.brand}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ minWidth: 120 }}>
                          <Chip
                            label={product.category?.name || 'Uncategorized'}
                            size="small"
                            sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 120 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669' }}>
                            ${product.price}
                          </Typography>
                          {product.oldPrice && product.oldPrice > product.price && (
                            <Typography variant="caption" sx={{ color: 'grey.500', textDecoration: 'line-through' }}>
                              ${product.oldPrice}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ minWidth: 120 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: product.wholesalePrice ? '#dc2626' : 'grey.500' }}>
                              {product.wholesalePrice ? `$${product.wholesalePrice}` : 'N/A'}
                            </Typography>
                            {product.wholesaleEnabled && (
                              <Business fontSize="small" sx={{ color: '#ef7921' }} />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ minWidth: 100 }}>
                          <Chip
                            label={product.moq || 1}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              backgroundColor: product.wholesaleEnabled ? '#fffbeb' : 'grey.100',
                              color: product.wholesaleEnabled ? '#d97706' : 'grey.500',
                              borderColor: product.wholesaleEnabled ? '#f59e0b' : 'grey.300'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 120 }}>
                          <Chip
                            label={getPricingTierLabel(product.pricingTier)}
                            size="small"
                            color={getPricingTierColor(product.pricingTier)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 100 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: product.stock > 0 ? 'grey.600' : 'error.main',
                              fontWeight: product.stock === 0 ? 600 : 400
                            }}
                          >
                            {product.stock.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ minWidth: 100 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.800', mr: 0.5 }}>
                              {product.rating || 0}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#fbbf24' }}>
                              ★
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ minWidth: 100 }}>
                          <Chip
                            label={product.status}
                            size="small"
                            color={getStatusColor(product.status)}
                            variant="filled"
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 120 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={product.wholesaleEnabled || false}
                                onChange={(e) => handleWholesaleToggle(product, e)}
                                size="small"
                                color="success"
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {product.wholesaleEnabled ? (
                                  <>
                                    <Business fontSize="small" />
                                    <Typography variant="caption">Enabled</Typography>
                                  </>
                                ) : (
                                  <>
                                    <Storefront fontSize="small" />
                                    <Typography variant="caption">Disabled</Typography>
                                  </>
                                )}
                              </Box>
                            }
                            sx={{ margin: 0, '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 150 }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: 'primary.main',
                                backgroundColor: 'primary.50',
                                '&:hover': { backgroundColor: 'primary.100' }
                              }}
                              onClick={() => handleViewDetails(product)}
                              title="View Details"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: 'success.main',
                                backgroundColor: 'success.50',
                                '&:hover': { backgroundColor: 'success.100' }
                              }}
                              onClick={() => handleEdit(product)}
                              title="Edit"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: 'error.main',
                                backgroundColor: 'error.50',
                                '&:hover': { backgroundColor: 'error.100' }
                              }}
                              onClick={() => handleDelete(product)}
                              title="Delete"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Pagination */}
          <Box sx={{ 
            padding: '16px', 
            borderTop: '1px solid', 
            borderColor: 'grey.100',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2" sx={{ color: 'grey.600' }}>
              Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, totalProducts)} of {totalProducts} products
            </Typography>
            <TablePagination
              component="div"
              count={totalProducts}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ flex: '0 1 auto', padding: 0 }}
            />
          </Box>

          {/* Action Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleViewDetails(selectedProduct)}>
              <Visibility sx={{ mr: 1, fontSize: '18px', color: 'primary.main' }} />
              View Details
            </MenuItem>
            <MenuItem onClick={() => handleEdit(selectedProduct)}>
              <Edit sx={{ mr: 1, fontSize: '18px', color: 'success.main' }} />
              Edit
            </MenuItem>
            <MenuItem onClick={() => handleDelete(selectedProduct)}>
              <Delete sx={{ mr: 1, fontSize: '18px', color: 'error.main' }} />
              Delete
            </MenuItem>
          </Menu>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductsBox;
































// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   InputAdornment,
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   TablePagination,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Menu,
//   Link,
//   Switch,
//   FormControlLabel
// } from '@mui/material';
// import {
//   Search,
//   Add,
//   Edit,
//   Visibility,
//   Delete,
//   Business,
//   Storefront,
//   Image as ImageIcon,
//   Download
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

// const ProductsBox = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const navigate = useNavigate()

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleAddProduct = () => {
//     navigate('/product/upload')
//     console.log('Add product clicked');
//     // Add your add product logic here
//   };

//   const handleExport = () => {
//     console.log('Export clicked');
//     // Add your export logic here
//     // This could export to CSV, Excel, PDF, etc.
//   };

//   const handleMenuOpen = (event, product) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProduct(product);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedProduct(null);
//   };

//   const handleEdit = (product) => {
//     console.log('Edit product:', product);
//     // Add edit logic here
//   };

//   const handleViewDetails = (product) => {
//     console.log('View details:', product);
//     // Add view details logic here
//   };

//   const handleDelete = (product) => {
//     console.log('Delete product:', product);
//     // Add delete logic here
//   };

//   const handleProductClick = (product) => {
//     console.log('Product clicked:', product);
//     // Navigate to product details page
//   };

//   const handleWholesaleToggle = (productId, event) => {
//     event.stopPropagation();
//     console.log('Wholesale toggle for product:', productId, event.target.checked);
//     // Update wholesale status logic here
//   };

//   // Function to handle image loading errors
//   const handleImageError = (e) => {
//     e.target.style.display = 'none';
//     e.target.nextSibling.style.display = 'flex';
//   };

//   // Sample data with wholesale/retail information
//   const products = [
//     {
//       id: 1,
//       name: 'Women Black Cotton Blend Top',
//       category: 'Fashion',
//       subCategory: 'Women',
//       retailPrice: '$1,560.00',
//       wholesalePrice: '$1,400.00',
//       moq: 10,
//       sales: '$1,750.00',
//       stock: 85733,
//       rating: 4,
//       salesCount: 15,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/beauty.jpg'
//     },
//     {
//       id: 2,
//       name: 'Men\'s Casual Shirt',
//       category: 'Fashion',
//       subCategory: 'Men',
//       retailPrice: '$45.00',
//       wholesalePrice: '$38.00',
//       moq: 5,
//       sales: '$890.00',
//       stock: 23456,
//       rating: 5,
//       salesCount: 32,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/mens-shirt.jpg'
//     },
//     {
//       id: 3,
//       name: 'Wireless Headphones Premium Edition',
//       category: 'Electronics',
//       subCategory: 'Audio',
//       retailPrice: '$129.99',
//       wholesalePrice: '$110.00',
//       moq: 3,
//       sales: '$2,599.80',
//       stock: 12345,
//       rating: 4,
//       salesCount: 20,
//       isWholesaleEnabled: false,
//       pricingTier: 'retail',
//       image: '/images/headphones.jpg'
//     },
//     {
//       id: 4,
//       name: 'Designer Handbag Luxury Leather',
//       category: 'Fashion',
//       subCategory: 'Accessories',
//       retailPrice: '$299.99',
//       wholesalePrice: '$250.00',
//       moq: 2,
//       sales: '$1,499.95',
//       stock: 5678,
//       rating: 4.8,
//       salesCount: 5,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/handbag.jpg'
//     }
//   ];

//   const getPricingTierLabel = (tier) => {
//     switch (tier) {
//       case 'both': return 'Both';
//       case 'retail': return 'Retail';
//       case 'wholesale': return 'Wholesale Only';
//       default: return 'Both';
//     }
//   };

//   const getPricingTierColor = (tier) => {
//     switch (tier) {
//       case 'both': return 'primary';
//       case 'retail': return 'secondary';
//       case 'wholesale': return 'success';
//       default: return 'default';
//     }
//   };

//   return (
//     <Box sx={{ width: '100%', overflow: 'hidden' }}>
//       <Card 
//         sx={{ 
//           borderRadius: '12px', 
//           boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//           marginTop: '24px',
//           overflow: 'hidden'
//         }}
//       >
//         <CardContent sx={{ padding: 0 }}>
//           {/* Header with Add Product Button */}
//           <Box sx={{ 
//             padding: '16px', 
//             borderBottom: '1px solid', 
//             borderColor: 'grey.100',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}>
//             <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
//               Products
//             </Typography>
//             <Box sx={{ display: 'flex', gap: 2 }}>
//               <Button
//                 variant="outlined"
//                 startIcon={<Download />}
//                 onClick={handleExport}
//                 sx={{
//                   borderColor: '#ef7921',
//                   color: '#ef7921',
//                   '&:hover': {
//                     borderColor: '#e06b15',
//                     backgroundColor: 'rgba(239, 121, 33, 0.04)'
//                   },
//                   borderRadius: '8px',
//                   textTransform: 'none',
//                   fontWeight: 500
//                 }}
//               >
//                 Export
//               </Button>
//               <Button
//                 variant="contained"
//                 startIcon={<Add />}
//                 onClick={handleAddProduct}
//                 sx={{
//                   backgroundColor: '#ef7921',
//                   '&:hover': {
//                     backgroundColor: '#e06b15',
//                   },
//                   borderRadius: '8px',
//                   textTransform: 'none',
//                   fontWeight: 500
//                 }}
//               >
//                 Add Product
//               </Button>
//             </Box>
//           </Box>

//           {/* Filters */}
//           <Box sx={{ 
//             padding: '16px', 
//             borderBottom: '1px solid', 
//             borderColor: 'grey.100',
//             display: 'flex',
//             flexDirection: { xs: 'column', md: 'row' },
//             gap: '16px'
//           }}>
//             <Box sx={{ 
//               display: 'flex', 
//               flexDirection: { xs: 'column', md: 'row' }, 
//               gap: '16px',
//               flex: 1
//             }}>
//               <FormControl size="small" sx={{ minWidth: 180 }}>
//                 <InputLabel>Category By</InputLabel>
//                 <Select label="Category By" defaultValue="">
//                   <MenuItem value="">All Categories</MenuItem>
//                   <MenuItem value="fashion">Fashion</MenuItem>
//                   <MenuItem value="electronics">Electronics</MenuItem>
//                   <MenuItem value="sports">Sports</MenuItem>
//                   <MenuItem value="beauty">Beauty</MenuItem>
//                   <MenuItem value="home">Home</MenuItem>
//                 </Select>
//               </FormControl>

//               <FormControl size="small" sx={{ minWidth: 180 }}>
//                 <InputLabel>Sub Category By</InputLabel>
//                 <Select label="Sub Category By" defaultValue="">
//                   <MenuItem value="">All Subcategories</MenuItem>
//                   <MenuItem value="women">Women</MenuItem>
//                   <MenuItem value="men">Men</MenuItem>
//                   <MenuItem value="audio">Audio</MenuItem>
//                   <MenuItem value="accessories">Accessories</MenuItem>
//                   <MenuItem value="footwear">Footwear</MenuItem>
//                   <MenuItem value="skincare">Skincare</MenuItem>
//                   <MenuItem value="kitchen">Kitchen</MenuItem>
//                   <MenuItem value="unisex">Unisex</MenuItem>
//                 </Select>
//               </FormControl>

//               <FormControl size="small" sx={{ minWidth: 180 }}>
//                 <InputLabel>Pricing Tier</InputLabel>
//                 <Select label="Pricing Tier" defaultValue="">
//                   <MenuItem value="">All Tiers</MenuItem>
//                   <MenuItem value="both">Both (Retail + Wholesale)</MenuItem>
//                   <MenuItem value="retail">Retail Only</MenuItem>
//                   <MenuItem value="wholesale">Wholesale Only</MenuItem>
//                 </Select>
//               </FormControl>

//               <FormControl size="small" sx={{ minWidth: 180 }}>
//                 <InputLabel>Status</InputLabel>
//                 <Select label="Status" defaultValue="">
//                   <MenuItem value="">All Status</MenuItem>
//                   <MenuItem value="active">Active</MenuItem>
//                   <MenuItem value="inactive">Inactive</MenuItem>
//                   <MenuItem value="out-of-stock">Out of Stock</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>

//             <TextField
//               size="small"
//               placeholder="Search products..."
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search sx={{ color: 'grey.400' }} />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ minWidth: 200 }}
//             />
//           </Box>

//           {/* Scrollable Table Container */}
//           <Box sx={{ width: '100%', overflow: 'auto' }}>
//             <TableContainer component={Paper} elevation={0}>
//               <Table sx={{ minWidth: 1400 }}>
//                 <TableHead>
//                   <TableRow sx={{ backgroundColor: 'grey.50' }}>
//                     <TableCell padding="checkbox">
//                       <Checkbox />
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 300 }}>PRODUCT</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>CATEGORY</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>SUB CATEGORY</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>RETAIL PRICE</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>WHOLESALE PRICE</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>MOQ</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>PRICING TIER</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>SALES</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>STOCK</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>RATING</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>WHOLESALE</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>ACTIONS</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
//                     <TableRow key={product.id} hover>
//                       <TableCell padding="checkbox">
//                         <Checkbox />
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 300 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                           <Box
//                             sx={{
//                               width: 60,
//                               height: 60,
//                               backgroundColor: 'grey.100',
//                               borderRadius: '8px',
//                               display: 'flex',
//                               alignItems: 'center',
//                               justifyContent: 'center',
//                               flexShrink: 0,
//                               position: 'relative'
//                             }}
//                           >
//                             <img 
//                               src={product.image} 
//                               alt={product.name}
//                               style={{
//                                 width: '100%',
//                                 height: '100%',
//                                 objectFit: 'cover',
//                                 borderRadius: '8px'
//                               }}
//                               onError={handleImageError}
//                             />
//                             <Box
//                               sx={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 left: 0,
//                                 right: 0,
//                                 bottom: 0,
//                                 display: 'none',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 backgroundColor: 'grey.100',
//                                 borderRadius: '8px'
//                               }}
//                             >
//                               <ImageIcon sx={{ color: 'grey.400', fontSize: 24 }} />
//                             </Box>
//                           </Box>
//                           <Link
//                             component="button"
//                             variant="body2"
//                             onClick={() => handleProductClick(product)}
//                             sx={{
//                               fontWeight: 500,
//                               color: 'primary.main',
//                               textDecoration: 'none',
//                               '&:hover': {
//                                 textDecoration: 'underline',
//                                 color: 'primary.dark'
//                               },
//                               textAlign: 'left'
//                             }}
//                           >
//                             {product.name}
//                           </Link>
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 120 }}>
//                         <Chip
//                           label={product.category}
//                           size="small"
//                           sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 140 }}>
//                         <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                           {product.subCategory}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 120 }}>
//                         <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669' }}>
//                           {product.retailPrice}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 120 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                           <Typography variant="body2" sx={{ fontWeight: 500, color: '#dc2626' }}>
//                             {product.wholesalePrice}
//                           </Typography>
//                           {product.isWholesaleEnabled && (
//                             <Business fontSize="small" sx={{ color: '#ef7921' }} />
//                           )}
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 100 }}>
//                         <Chip
//                           label={product.moq}
//                           size="small"
//                           variant="outlined"
//                           sx={{ 
//                             backgroundColor: product.isWholesaleEnabled ? '#fffbeb' : 'grey.100',
//                             color: product.isWholesaleEnabled ? '#d97706' : 'grey.500',
//                             borderColor: product.isWholesaleEnabled ? '#f59e0b' : 'grey.300'
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 120 }}>
//                         <Chip
//                           label={getPricingTierLabel(product.pricingTier)}
//                           size="small"
//                           color={getPricingTierColor(product.pricingTier)}
//                           variant="outlined"
//                         />
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 140 }}>
//                         <Box>
//                           <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                             {product.sales}
//                           </Typography>
//                           <Typography variant="caption" sx={{ color: 'grey.500' }}>
//                             {product.salesCount} sales
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 100 }}>
//                         <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                           {product.stock.toLocaleString()}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 100 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.800', mr: 0.5 }}>
//                             {product.rating}
//                           </Typography>
//                           <Typography variant="body2" sx={{ color: '#fbbf24' }}>
//                             ★
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 120 }}>
//                         <FormControlLabel
//                           control={
//                             <Switch
//                               checked={product.isWholesaleEnabled}
//                               onChange={(e) => handleWholesaleToggle(product.id, e)}
//                               size="small"
//                               color="success"
//                             />
//                           }
//                           label={
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                               {product.isWholesaleEnabled ? (
//                                 <>
//                                   <Business fontSize="small" />
//                                   <Typography variant="caption">Enabled</Typography>
//                                 </>
//                               ) : (
//                                 <>
//                                   <Storefront fontSize="small" />
//                                   <Typography variant="caption">Disabled</Typography>
//                                 </>
//                               )}
//                             </Box>
//                           }
//                           sx={{ margin: 0, '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 150 }}>
//                         <Box sx={{ display: 'flex', gap: 1 }}>
//                           <IconButton 
//                             size="small" 
//                             sx={{ 
//                               color: 'primary.main',
//                               backgroundColor: 'primary.50',
//                               '&:hover': { backgroundColor: 'primary.100' }
//                             }}
//                             onClick={() => handleViewDetails(product)}
//                             title="View Details"
//                           >
//                             <Visibility fontSize="small" />
//                           </IconButton>
//                           <IconButton 
//                             size="small" 
//                             sx={{ 
//                               color: 'success.main',
//                               backgroundColor: 'success.50',
//                               '&:hover': { backgroundColor: 'success.100' }
//                             }}
//                             onClick={() => handleEdit(product)}
//                             title="Edit"
//                           >
//                             <Edit fontSize="small" />
//                           </IconButton>
//                           <IconButton 
//                             size="small" 
//                             sx={{ 
//                               color: 'error.main',
//                               backgroundColor: 'error.50',
//                               '&:hover': { backgroundColor: 'error.100' }
//                             }}
//                             onClick={() => handleDelete(product)}
//                             title="Delete"
//                           >
//                             <Delete fontSize="small" />
//                           </IconButton>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>

//           {/* Pagination */}
//           <Box sx={{ 
//             padding: '16px', 
//             borderTop: '1px solid', 
//             borderColor: 'grey.100',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}>
//             <Typography variant="body2" sx={{ color: 'grey.600' }}>
//               Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, products.length)} of {products.length} products
//             </Typography>
//             <TablePagination
//               component="div"
//               count={products.length}
//               page={page}
//               onPageChange={handleChangePage}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//               rowsPerPageOptions={[10, 25, 50]}
//               sx={{ flex: '0 1 auto', padding: 0 }}
//             />
//           </Box>

//           {/* Action Menu */}
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//           >
//             <MenuItem onClick={() => handleViewDetails(selectedProduct)}>
//               <Visibility sx={{ mr: 1, fontSize: '18px', color: 'primary.main' }} />
//               View Details
//             </MenuItem>
//             <MenuItem onClick={() => handleEdit(selectedProduct)}>
//               <Edit sx={{ mr: 1, fontSize: '18px', color: 'success.main' }} />
//               Edit
//             </MenuItem>
//             <MenuItem onClick={() => handleDelete(selectedProduct)}>
//               <Delete sx={{ mr: 1, fontSize: '18px', color: 'error.main' }} />
//               Delete
//             </MenuItem>
//           </Menu>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default ProductsBox;






















































































// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   InputAdornment,
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   TablePagination,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Menu,
//   Link,
//   Switch,
//   FormControlLabel
// } from '@mui/material';
// import {
//   Search,
//   Add,
//   Edit,
//   Visibility,
//   Delete,
//   Business,
//   Storefront,
//   Image as ImageIcon
// } from '@mui/icons-material';

// const ProductsBox = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleAddProduct = () => {
//     console.log('Add product clicked');
//     // Add your add product logic here
//   };

//   const handleMenuOpen = (event, product) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProduct(product);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedProduct(null);
//   };

//   const handleEdit = (product) => {
//     console.log('Edit product:', product);
//     // Add edit logic here
//   };

//   const handleViewDetails = (product) => {
//     console.log('View details:', product);
//     // Add view details logic here
//   };

//   const handleDelete = (product) => {
//     console.log('Delete product:', product);
//     // Add delete logic here
//   };

//   const handleProductClick = (product) => {
//     console.log('Product clicked:', product);
//     // Navigate to product details page
//   };

//   const handleWholesaleToggle = (productId, event) => {
//     event.stopPropagation();
//     console.log('Wholesale toggle for product:', productId, event.target.checked);
//     // Update wholesale status logic here
//   };

//   // Function to handle image loading errors
//   const handleImageError = (e) => {
//     e.target.style.display = 'none';
//     e.target.nextSibling.style.display = 'flex';
//   };

//   // Sample data with wholesale/retail information
//   const products = [
//     {
//       id: 1,
//       name: 'Women Black Cotton Blend Top',
//       category: 'Fashion',
//       subCategory: 'Women',
//       retailPrice: '$1,560.00',
//       wholesalePrice: '$1,400.00',
//       moq: 10,
//       sales: '$1,750.00',
//       stock: 85733,
//       rating: 4,
//       salesCount: 15,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/beauty.jpg'
//     },
//     {
//       id: 2,
//       name: 'Men\'s Casual Shirt',
//       category: 'Fashion',
//       subCategory: 'Men',
//       retailPrice: '$45.00',
//       wholesalePrice: '$38.00',
//       moq: 5,
//       sales: '$890.00',
//       stock: 23456,
//       rating: 5,
//       salesCount: 32,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/mens-shirt.jpg'
//     },
//     {
//       id: 3,
//       name: 'Wireless Headphones Premium Edition',
//       category: 'Electronics',
//       subCategory: 'Audio',
//       retailPrice: '$129.99',
//       wholesalePrice: '$110.00',
//       moq: 3,
//       sales: '$2,599.80',
//       stock: 12345,
//       rating: 4,
//       salesCount: 20,
//       isWholesaleEnabled: false,
//       pricingTier: 'retail',
//       image: '/images/headphones.jpg'
//     },
//     {
//       id: 4,
//       name: 'Designer Handbag Luxury Leather',
//       category: 'Fashion',
//       subCategory: 'Accessories',
//       retailPrice: '$299.99',
//       wholesalePrice: '$250.00',
//       moq: 2,
//       sales: '$1,499.95',
//       stock: 5678,
//       rating: 4.8,
//       salesCount: 5,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/handbag.jpg'
//     },
//     {
//       id: 5,
//       name: 'Running Shoes Professional Athletic',
//       category: 'Sports',
//       subCategory: 'Footwear',
//       retailPrice: '$89.99',
//       wholesalePrice: '$75.00',
//       moq: 4,
//       sales: '$1,799.80',
//       stock: 9876,
//       rating: 4.3,
//       salesCount: 20,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/running-shoes.jpg'
//     },
//     {
//       id: 6,
//       name: 'Smart Watch Series 5 Advanced Fitness Tracker',
//       category: 'Electronics',
//       subCategory: 'Wearables',
//       retailPrice: '$249.99',
//       wholesalePrice: '$210.00',
//       moq: 3,
//       sales: '$4,999.80',
//       stock: 3456,
//       rating: 4.6,
//       salesCount: 20,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/smartwatch.jpg'
//     },
//     {
//       id: 7,
//       name: 'Leather Wallet Premium Quality',
//       category: 'Fashion',
//       subCategory: 'Accessories',
//       retailPrice: '$49.99',
//       wholesalePrice: '$42.00',
//       moq: 6,
//       sales: '$999.80',
//       stock: 7890,
//       rating: 4.2,
//       salesCount: 20,
//       isWholesaleEnabled: false,
//       pricingTier: 'retail',
//       image: '/images/wallet.jpg'
//     },
//     {
//       id: 8,
//       name: 'Yoga Mat Premium Non-Slip Exercise Mat',
//       category: 'Sports',
//       subCategory: 'Fitness',
//       retailPrice: '$39.99',
//       wholesalePrice: '$32.00',
//       moq: 8,
//       sales: '$799.80',
//       stock: 1234,
//       rating: 4.4,
//       salesCount: 20,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/yoga-mat.jpg'
//     },
//     {
//       id: 9,
//       name: 'Organic Face Cream with Vitamin E',
//       category: 'Beauty',
//       subCategory: 'Skincare',
//       retailPrice: '$29.99',
//       wholesalePrice: '$24.00',
//       moq: 12,
//       sales: '$1,199.76',
//       stock: 4567,
//       rating: 4.7,
//       salesCount: 40,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/face-cream.jpg'
//     },
//     {
//       id: 10,
//       name: 'Stainless Steel Water Bottle 1L',
//       category: 'Home',
//       subCategory: 'Kitchen',
//       retailPrice: '$24.99',
//       wholesalePrice: '$20.00',
//       moq: 15,
//       sales: '$1,499.40',
//       stock: 8765,
//       rating: 4.5,
//       salesCount: 60,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/water-bottle.jpg'
//     },
//     {
//       id: 11,
//       name: 'Wireless Phone Charger Fast Charging',
//       category: 'Electronics',
//       subCategory: 'Accessories',
//       retailPrice: '$39.99',
//       wholesalePrice: '$32.00',
//       moq: 8,
//       sales: '$1,279.68',
//       stock: 6543,
//       rating: 4.1,
//       salesCount: 32,
//       isWholesaleEnabled: false,
//       pricingTier: 'retail',
//       image: '/images/charger.jpg'
//     },
//     {
//       id: 12,
//       name: 'Cotton T-Shirt Unisex Basic',
//       category: 'Fashion',
//       subCategory: 'Unisex',
//       retailPrice: '$19.99',
//       wholesalePrice: '$15.00',
//       moq: 20,
//       sales: '$1,199.40',
//       stock: 23456,
//       rating: 4.0,
//       salesCount: 60,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/tshirt.jpg'
//     }
//   ];

//   const getPricingTierLabel = (tier) => {
//     switch (tier) {
//       case 'both': return 'Both';
//       case 'retail': return 'Retail';
//       case 'wholesale': return 'Wholesale Only';
//       default: return 'Both';
//     }
//   };

//   const getPricingTierColor = (tier) => {
//     switch (tier) {
//       case 'both': return 'primary';
//       case 'retail': return 'secondary';
//       case 'wholesale': return 'success';
//       default: return 'default';
//     }
//   };

//   return (
//     <Box sx={{ width: '100%', overflow: 'hidden' }}>
//       <Card 
//         sx={{ 
//           borderRadius: '12px', 
//           boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//           marginTop: '24px',
//           overflow: 'hidden'
//         }}
//       >
//         <CardContent sx={{ padding: 0 }}>
//           {/* Header with Add Product Button */}
//           <Box sx={{ 
//             padding: '16px', 
//             borderBottom: '1px solid', 
//             borderColor: 'grey.100',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}>
//             <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
//               Products
//             </Typography>
//             <Button
//               variant="contained"
//               startIcon={<Add />}
//               onClick={handleAddProduct}
//               sx={{
//                 backgroundColor: '#ef7921',
//                 '&:hover': {
//                   backgroundColor: '#e06b15',
//                 },
//                 borderRadius: '8px',
//                 textTransform: 'none',
//                 fontWeight: 500
//               }}
//             >
//               Add Product
//             </Button>
//           </Box>

//           {/* Filters */}
//           <Box sx={{ 
//             padding: '16px', 
//             borderBottom: '1px solid', 
//             borderColor: 'grey.100',
//             display: 'flex',
//             flexDirection: { xs: 'column', md: 'row' },
//             gap: '16px'
//           }}>
//             <Box sx={{ 
//               display: 'flex', 
//               flexDirection: { xs: 'column', md: 'row' }, 
//               gap: '16px',
//               flex: 1
//             }}>
//               <FormControl size="small" sx={{ minWidth: 180 }}>
//                 <InputLabel>Category By</InputLabel>
//                 <Select label="Category By" defaultValue="">
//                   <MenuItem value="">All Categories</MenuItem>
//                   <MenuItem value="fashion">Fashion</MenuItem>
//                   <MenuItem value="electronics">Electronics</MenuItem>
//                   <MenuItem value="sports">Sports</MenuItem>
//                   <MenuItem value="beauty">Beauty</MenuItem>
//                   <MenuItem value="home">Home</MenuItem>
//                 </Select>
//               </FormControl>

//               <FormControl size="small" sx={{ minWidth: 180 }}>
//                 <InputLabel>Sub Category By</InputLabel>
//                 <Select label="Sub Category By" defaultValue="">
//                   <MenuItem value="">All Subcategories</MenuItem>
//                   <MenuItem value="women">Women</MenuItem>
//                   <MenuItem value="men">Men</MenuItem>
//                   <MenuItem value="audio">Audio</MenuItem>
//                   <MenuItem value="accessories">Accessories</MenuItem>
//                   <MenuItem value="footwear">Footwear</MenuItem>
//                   <MenuItem value="skincare">Skincare</MenuItem>
//                   <MenuItem value="kitchen">Kitchen</MenuItem>
//                   <MenuItem value="unisex">Unisex</MenuItem>
//                 </Select>
//               </FormControl>

//               <FormControl size="small" sx={{ minWidth: 180 }}>
//                 <InputLabel>Pricing Tier</InputLabel>
//                 <Select label="Pricing Tier" defaultValue="">
//                   <MenuItem value="">All Tiers</MenuItem>
//                   <MenuItem value="both">Both (Retail + Wholesale)</MenuItem>
//                   <MenuItem value="retail">Retail Only</MenuItem>
//                   <MenuItem value="wholesale">Wholesale Only</MenuItem>
//                 </Select>
//               </FormControl>

//               <FormControl size="small" sx={{ minWidth: 180 }}>
//                 <InputLabel>Status</InputLabel>
//                 <Select label="Status" defaultValue="">
//                   <MenuItem value="">All Status</MenuItem>
//                   <MenuItem value="active">Active</MenuItem>
//                   <MenuItem value="inactive">Inactive</MenuItem>
//                   <MenuItem value="out-of-stock">Out of Stock</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>

//             <TextField
//               size="small"
//               placeholder="Search products..."
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search sx={{ color: 'grey.400' }} />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ minWidth: 200 }}
//             />
//           </Box>

//           {/* Scrollable Table Container */}
//           <Box sx={{ width: '100%', overflowX: 'auto' }}>
//             <TableContainer component={Paper} elevation={0} sx={{ minWidth: 1400 }}>
//               <Table sx={{ minWidth: 1400 }}>
//                 <TableHead>
//                   <TableRow sx={{ backgroundColor: 'grey.50' }}>
//                     <TableCell padding="checkbox">
//                       <Checkbox />
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 300 }}>PRODUCT</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>CATEGORY</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>SUB CATEGORY</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>RETAIL PRICE</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>WHOLESALE PRICE</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>MOQ</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>PRICING TIER</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>SALES</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>STOCK</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>RATING</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>WHOLESALE</TableCell>
//                     <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>ACTIONS</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
//                     <TableRow key={product.id} hover>
//                       <TableCell padding="checkbox">
//                         <Checkbox />
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 300 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                           <Box
//                             sx={{
//                               width: 60,
//                               height: 60,
//                               backgroundColor: 'grey.100',
//                               borderRadius: '8px',
//                               display: 'flex',
//                               alignItems: 'center',
//                               justifyContent: 'center',
//                               flexShrink: 0,
//                               position: 'relative'
//                             }}
//                           >
//                             <img 
//                               src={product.image} 
//                               alt={product.name}
//                               style={{
//                                 width: '100%',
//                                 height: '100%',
//                                 objectFit: 'cover',
//                                 borderRadius: '8px'
//                               }}
//                               onError={handleImageError}
//                             />
//                             <Box
//                               sx={{
//                                 position: 'absolute',
//                                 top: 0,
//                                 left: 0,
//                                 right: 0,
//                                 bottom: 0,
//                                 display: 'none',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 backgroundColor: 'grey.100',
//                                 borderRadius: '8px'
//                               }}
//                             >
//                               <ImageIcon sx={{ color: 'grey.400', fontSize: 24 }} />
//                             </Box>
//                           </Box>
//                           <Link
//                             component="button"
//                             variant="body2"
//                             onClick={() => handleProductClick(product)}
//                             sx={{
//                               fontWeight: 500,
//                               color: 'primary.main',
//                               textDecoration: 'none',
//                               '&:hover': {
//                                 textDecoration: 'underline',
//                                 color: 'primary.dark'
//                               },
//                               textAlign: 'left'
//                             }}
//                           >
//                             {product.name}
//                           </Link>
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 120 }}>
//                         <Chip
//                           label={product.category}
//                           size="small"
//                           sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 140 }}>
//                         <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                           {product.subCategory}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 120 }}>
//                         <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669' }}>
//                           {product.retailPrice}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 120 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                           <Typography variant="body2" sx={{ fontWeight: 500, color: '#dc2626' }}>
//                             {product.wholesalePrice}
//                           </Typography>
//                           {product.isWholesaleEnabled && (
//                             <Business fontSize="small" sx={{ color: '#ef7921' }} />
//                           )}
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 100 }}>
//                         <Chip
//                           label={product.moq}
//                           size="small"
//                           variant="outlined"
//                           sx={{ 
//                             backgroundColor: product.isWholesaleEnabled ? '#fffbeb' : 'grey.100',
//                             color: product.isWholesaleEnabled ? '#d97706' : 'grey.500',
//                             borderColor: product.isWholesaleEnabled ? '#f59e0b' : 'grey.300'
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 120 }}>
//                         <Chip
//                           label={getPricingTierLabel(product.pricingTier)}
//                           size="small"
//                           color={getPricingTierColor(product.pricingTier)}
//                           variant="outlined"
//                         />
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 140 }}>
//                         <Box>
//                           <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                             {product.sales}
//                           </Typography>
//                           <Typography variant="caption" sx={{ color: 'grey.500' }}>
//                             {product.salesCount} sales
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 100 }}>
//                         <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                           {product.stock.toLocaleString()}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 100 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.800', mr: 0.5 }}>
//                             {product.rating}
//                           </Typography>
//                           <Typography variant="body2" sx={{ color: '#fbbf24' }}>
//                             ★
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 120 }}>
//                         <FormControlLabel
//                           control={
//                             <Switch
//                               checked={product.isWholesaleEnabled}
//                               onChange={(e) => handleWholesaleToggle(product.id, e)}
//                               size="small"
//                               color="success"
//                             />
//                           }
//                           label={
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                               {product.isWholesaleEnabled ? (
//                                 <>
//                                   <Business fontSize="small" />
//                                   <Typography variant="caption">Enabled</Typography>
//                                 </>
//                               ) : (
//                                 <>
//                                   <Storefront fontSize="small" />
//                                   <Typography variant="caption">Disabled</Typography>
//                                 </>
//                               )}
//                             </Box>
//                           }
//                           sx={{ margin: 0, '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ minWidth: 150 }}>
//                         <Box sx={{ display: 'flex', gap: 1 }}>
//                           <IconButton 
//                             size="small" 
//                             sx={{ 
//                               color: 'primary.main',
//                               backgroundColor: 'primary.50',
//                               '&:hover': { backgroundColor: 'primary.100' }
//                             }}
//                             onClick={() => handleViewDetails(product)}
//                             title="View Details"
//                           >
//                             <Visibility fontSize="small" />
//                           </IconButton>
//                           <IconButton 
//                             size="small" 
//                             sx={{ 
//                               color: 'success.main',
//                               backgroundColor: 'success.50',
//                               '&:hover': { backgroundColor: 'success.100' }
//                             }}
//                             onClick={() => handleEdit(product)}
//                             title="Edit"
//                           >
//                             <Edit fontSize="small" />
//                           </IconButton>
//                           <IconButton 
//                             size="small" 
//                             sx={{ 
//                               color: 'error.main',
//                               backgroundColor: 'error.50',
//                               '&:hover': { backgroundColor: 'error.100' }
//                             }}
//                             onClick={() => handleDelete(product)}
//                             title="Delete"
//                           >
//                             <Delete fontSize="small" />
//                           </IconButton>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>

//           {/* Pagination */}
//           <Box sx={{ 
//             padding: '16px', 
//             borderTop: '1px solid', 
//             borderColor: 'grey.100',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}>
//             <Typography variant="body2" sx={{ color: 'grey.600' }}>
//               Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, products.length)} of {products.length} products
//             </Typography>
//             <TablePagination
//               component="div"
//               count={products.length}
//               page={page}
//               onPageChange={handleChangePage}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//               rowsPerPageOptions={[10, 25, 50]}
//               sx={{ flex: '0 1 auto', padding: 0 }}
//             />
//           </Box>

//           {/* Action Menu */}
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//           >
//             <MenuItem onClick={() => handleViewDetails(selectedProduct)}>
//               <Visibility sx={{ mr: 1, fontSize: '18px', color: 'primary.main' }} />
//               View Details
//             </MenuItem>
//             <MenuItem onClick={() => handleEdit(selectedProduct)}>
//               <Edit sx={{ mr: 1, fontSize: '18px', color: 'success.main' }} />
//               Edit
//             </MenuItem>
//             <MenuItem onClick={() => handleDelete(selectedProduct)}>
//               <Delete sx={{ mr: 1, fontSize: '18px', color: 'error.main' }} />
//               Delete
//             </MenuItem>
//           </Menu>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default ProductsBox;






















// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   InputAdornment,
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   TablePagination,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Menu,
//   Link,
//   Switch,
//   FormControlLabel,
//   Avatar
// } from '@mui/material';
// import {
//   Search,
//   Add,
//   Edit,
//   Visibility,
//   Delete,
//   Business,
//   Storefront,
//   Image as ImageIcon
// } from '@mui/icons-material';

// const ProductsBox = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleAddProduct = () => {
//     console.log('Add product clicked');
//     // Add your add product logic here
//   };

//   const handleMenuOpen = (event, product) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProduct(product);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedProduct(null);
//   };

//   const handleEdit = (product) => {
//     console.log('Edit product:', product);
//     // Add edit logic here
//   };

//   const handleViewDetails = (product) => {
//     console.log('View details:', product);
//     // Add view details logic here
//   };

//   const handleDelete = (product) => {
//     console.log('Delete product:', product);
//     // Add delete logic here
//   };

//   const handleProductClick = (product) => {
//     console.log('Product clicked:', product);
//     // Navigate to product details page
//   };

//   const handleWholesaleToggle = (productId, event) => {
//     event.stopPropagation();
//     console.log('Wholesale toggle for product:', productId, event.target.checked);
//     // Update wholesale status logic here
//   };

//   // Function to handle image loading errors
//   const handleImageError = (e) => {
//     e.target.style.display = 'none';
//     e.target.nextSibling.style.display = 'flex';
//   };

//   // Sample data with wholesale/retail information
//   const products = [
//     {
//       id: 1,
//       name: 'Women Black Cotton Blend Top',
//       category: 'Fashion',
//       subCategory: 'Women',
//       retailPrice: '$1,560.00',
//       wholesalePrice: '$1,400.00',
//       moq: 10,
//       sales: '$1,750.00',
//       stock: 85733,
//       rating: 4,
//       salesCount: 15,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/beauty.jpg'
//     },
//     {
//       id: 2,
//       name: 'Men\'s Casual Shirt',
//       category: 'Fashion',
//       subCategory: 'Men',
//       retailPrice: '$45.00',
//       wholesalePrice: '$38.00',
//       moq: 5,
//       sales: '$890.00',
//       stock: 23456,
//       rating: 5,
//       salesCount: 32,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/mens-shirt.jpg'
//     },
//     {
//       id: 3,
//       name: 'Wireless Headphones Premium Edition',
//       category: 'Electronics',
//       subCategory: 'Audio',
//       retailPrice: '$129.99',
//       wholesalePrice: '$110.00',
//       moq: 3,
//       sales: '$2,599.80',
//       stock: 12345,
//       rating: 4,
//       salesCount: 20,
//       isWholesaleEnabled: false,
//       pricingTier: 'retail',
//       image: '/images/headphones.jpg'
//     },
//     {
//       id: 4,
//       name: 'Designer Handbag Luxury Leather',
//       category: 'Fashion',
//       subCategory: 'Accessories',
//       retailPrice: '$299.99',
//       wholesalePrice: '$250.00',
//       moq: 2,
//       sales: '$1,499.95',
//       stock: 5678,
//       rating: 4.8,
//       salesCount: 5,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/handbag.jpg'
//     },
//     {
//       id: 5,
//       name: 'Running Shoes Professional Athletic',
//       category: 'Sports',
//       subCategory: 'Footwear',
//       retailPrice: '$89.99',
//       wholesalePrice: '$75.00',
//       moq: 4,
//       sales: '$1,799.80',
//       stock: 9876,
//       rating: 4.3,
//       salesCount: 20,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/running-shoes.jpg'
//     },
//     {
//       id: 6,
//       name: 'Smart Watch Series 5 Advanced Fitness Tracker',
//       category: 'Electronics',
//       subCategory: 'Wearables',
//       retailPrice: '$249.99',
//       wholesalePrice: '$210.00',
//       moq: 3,
//       sales: '$4,999.80',
//       stock: 3456,
//       rating: 4.6,
//       salesCount: 20,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/smartwatch.jpg'
//     },
//     {
//       id: 7,
//       name: 'Leather Wallet Premium Quality',
//       category: 'Fashion',
//       subCategory: 'Accessories',
//       retailPrice: '$49.99',
//       wholesalePrice: '$42.00',
//       moq: 6,
//       sales: '$999.80',
//       stock: 7890,
//       rating: 4.2,
//       salesCount: 20,
//       isWholesaleEnabled: false,
//       pricingTier: 'retail',
//       image: '/images/wallet.jpg'
//     },
//     {
//       id: 8,
//       name: 'Yoga Mat Premium Non-Slip Exercise Mat',
//       category: 'Sports',
//       subCategory: 'Fitness',
//       retailPrice: '$39.99',
//       wholesalePrice: '$32.00',
//       moq: 8,
//       sales: '$799.80',
//       stock: 1234,
//       rating: 4.4,
//       salesCount: 20,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/yoga-mat.jpg'
//     },
//     {
//       id: 9,
//       name: 'Organic Face Cream with Vitamin E',
//       category: 'Beauty',
//       subCategory: 'Skincare',
//       retailPrice: '$29.99',
//       wholesalePrice: '$24.00',
//       moq: 12,
//       sales: '$1,199.76',
//       stock: 4567,
//       rating: 4.7,
//       salesCount: 40,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/face-cream.jpg'
//     },
//     {
//       id: 10,
//       name: 'Stainless Steel Water Bottle 1L',
//       category: 'Home',
//       subCategory: 'Kitchen',
//       retailPrice: '$24.99',
//       wholesalePrice: '$20.00',
//       moq: 15,
//       sales: '$1,499.40',
//       stock: 8765,
//       rating: 4.5,
//       salesCount: 60,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/water-bottle.jpg'
//     },
//     {
//       id: 11,
//       name: 'Wireless Phone Charger Fast Charging',
//       category: 'Electronics',
//       subCategory: 'Accessories',
//       retailPrice: '$39.99',
//       wholesalePrice: '$32.00',
//       moq: 8,
//       sales: '$1,279.68',
//       stock: 6543,
//       rating: 4.1,
//       salesCount: 32,
//       isWholesaleEnabled: false,
//       pricingTier: 'retail',
//       image: '/images/charger.jpg'
//     },
//     {
//       id: 12,
//       name: 'Cotton T-Shirt Unisex Basic',
//       category: 'Fashion',
//       subCategory: 'Unisex',
//       retailPrice: '$19.99',
//       wholesalePrice: '$15.00',
//       moq: 20,
//       sales: '$1,199.40',
//       stock: 23456,
//       rating: 4.0,
//       salesCount: 60,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/tshirt.jpg'
//     }
//   ];

//   const getPricingTierLabel = (tier) => {
//     switch (tier) {
//       case 'both': return 'Both';
//       case 'retail': return 'Retail';
//       case 'wholesale': return 'Wholesale Only';
//       default: return 'Both';
//     }
//   };

//   const getPricingTierColor = (tier) => {
//     switch (tier) {
//       case 'both': return 'primary';
//       case 'retail': return 'secondary';
//       case 'wholesale': return 'success';
//       default: return 'default';
//     }
//   };

//   return (
//     <Card 
//       sx={{ 
//         borderRadius: '12px', 
//         boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//         marginTop: '24px',
//         overflow: 'hidden'
//       }}
//     >
//       <CardContent sx={{ padding: 0 }}>
//         {/* Header with Add Product Button */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderBottom: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
//             Products
//           </Typography>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleAddProduct}
//             sx={{
//               backgroundColor: '#ef7921',
//               '&:hover': {
//                 backgroundColor: '#e06b15',
//               },
//               borderRadius: '8px',
//               textTransform: 'none',
//               fontWeight: 500
//             }}
//           >
//             Add Product
//           </Button>
//         </Box>

//         {/* Filters */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderBottom: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           flexDirection: { xs: 'column', md: 'row' },
//           gap: '16px'
//         }}>
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: { xs: 'column', md: 'row' }, 
//             gap: '16px',
//             flex: 1
//           }}>
//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Category By</InputLabel>
//               <Select label="Category By" defaultValue="">
//                 <MenuItem value="">All Categories</MenuItem>
//                 <MenuItem value="fashion">Fashion</MenuItem>
//                 <MenuItem value="electronics">Electronics</MenuItem>
//                 <MenuItem value="sports">Sports</MenuItem>
//                 <MenuItem value="beauty">Beauty</MenuItem>
//                 <MenuItem value="home">Home</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Sub Category By</InputLabel>
//               <Select label="Sub Category By" defaultValue="">
//                 <MenuItem value="">All Subcategories</MenuItem>
//                 <MenuItem value="women">Women</MenuItem>
//                 <MenuItem value="men">Men</MenuItem>
//                 <MenuItem value="audio">Audio</MenuItem>
//                 <MenuItem value="accessories">Accessories</MenuItem>
//                 <MenuItem value="footwear">Footwear</MenuItem>
//                 <MenuItem value="skincare">Skincare</MenuItem>
//                 <MenuItem value="kitchen">Kitchen</MenuItem>
//                 <MenuItem value="unisex">Unisex</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Pricing Tier</InputLabel>
//               <Select label="Pricing Tier" defaultValue="">
//                 <MenuItem value="">All Tiers</MenuItem>
//                 <MenuItem value="both">Both (Retail + Wholesale)</MenuItem>
//                 <MenuItem value="retail">Retail Only</MenuItem>
//                 <MenuItem value="wholesale">Wholesale Only</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Status</InputLabel>
//               <Select label="Status" defaultValue="">
//                 <MenuItem value="">All Status</MenuItem>
//                 <MenuItem value="active">Active</MenuItem>
//                 <MenuItem value="inactive">Inactive</MenuItem>
//                 <MenuItem value="out-of-stock">Out of Stock</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>

//           <TextField
//             size="small"
//             placeholder="Search products..."
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search sx={{ color: 'grey.400' }} />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ minWidth: 200 }}
//           />
//         </Box>

//         {/* Scrollable Table Container */}
//         <TableContainer component={Paper} elevation={0} sx={{ minWidth: 1200 }}>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: 'grey.50' }}>
//                 <TableCell padding="checkbox">
//                   <Checkbox />
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 300 }}>PRODUCT</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>CATEGORY</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>SUB CATEGORY</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>RETAIL PRICE</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>WHOLESALE PRICE</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>MOQ</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>PRICING TIER</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>SALES</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>STOCK</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>RATING</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>WHOLESALE</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>ACTIONS</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
//                 <TableRow key={product.id} hover>
//                   <TableCell padding="checkbox">
//                     <Checkbox />
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 300 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                       <Box
//                         sx={{
//                           width: 60,
//                           height: 60,
//                           backgroundColor: 'grey.100',
//                           borderRadius: '8px',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           flexShrink: 0,
//                           position: 'relative'
//                         }}
//                       >
//                         <img 
//                           src={product.image} 
//                           alt={product.name}
//                           style={{
//                             width: '100%',
//                             height: '100%',
//                             objectFit: 'cover',
//                             borderRadius: '8px'
//                           }}
//                           onError={handleImageError}
//                         />
//                         <Box
//                           sx={{
//                             position: 'absolute',
//                             top: 0,
//                             left: 0,
//                             right: 0,
//                             bottom: 0,
//                             display: 'none',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             backgroundColor: 'grey.100',
//                             borderRadius: '8px'
//                           }}
//                         >
//                           <ImageIcon sx={{ color: 'grey.400', fontSize: 24 }} />
//                         </Box>
//                       </Box>
//                       <Link
//                         component="button"
//                         variant="body2"
//                         onClick={() => handleProductClick(product)}
//                         sx={{
//                           fontWeight: 500,
//                           color: 'primary.main',
//                           textDecoration: 'none',
//                           '&:hover': {
//                             textDecoration: 'underline',
//                             color: 'primary.dark'
//                           },
//                           textAlign: 'left'
//                         }}
//                       >
//                         {product.name}
//                       </Link>
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 120 }}>
//                     <Chip
//                       label={product.category}
//                       size="small"
//                       sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
//                     />
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 140 }}>
//                     <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                       {product.subCategory}
//                     </Typography>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 120 }}>
//                     <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669' }}>
//                       {product.retailPrice}
//                     </Typography>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 120 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                       <Typography variant="body2" sx={{ fontWeight: 500, color: '#dc2626' }}>
//                         {product.wholesalePrice}
//                       </Typography>
//                       {product.isWholesaleEnabled && (
//                         <Business fontSize="small" sx={{ color: '#ef7921' }} />
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 100 }}>
//                     <Chip
//                       label={product.moq}
//                       size="small"
//                       variant="outlined"
//                       sx={{ 
//                         backgroundColor: product.isWholesaleEnabled ? '#fffbeb' : 'grey.100',
//                         color: product.isWholesaleEnabled ? '#d97706' : 'grey.500',
//                         borderColor: product.isWholesaleEnabled ? '#f59e0b' : 'grey.300'
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 120 }}>
//                     <Chip
//                       label={getPricingTierLabel(product.pricingTier)}
//                       size="small"
//                       color={getPricingTierColor(product.pricingTier)}
//                       variant="outlined"
//                     />
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 140 }}>
//                     <Box>
//                       <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                         {product.sales}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: 'grey.500' }}>
//                         {product.salesCount} sales
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 100 }}>
//                     <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                       {product.stock.toLocaleString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 100 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.800', mr: 0.5 }}>
//                         {product.rating}
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: '#fbbf24' }}>
//                         ★
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 120 }}>
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={product.isWholesaleEnabled}
//                           onChange={(e) => handleWholesaleToggle(product.id, e)}
//                           size="small"
//                           color="success"
//                         />
//                       }
//                       label={
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                           {product.isWholesaleEnabled ? (
//                             <>
//                               <Business fontSize="small" />
//                               <Typography variant="caption">Enabled</Typography>
//                             </>
//                           ) : (
//                             <>
//                               <Storefront fontSize="small" />
//                               <Typography variant="caption">Disabled</Typography>
//                             </>
//                           )}
//                         </Box>
//                       }
//                       sx={{ margin: 0, '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
//                     />
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 150 }}>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <IconButton 
//                         size="small" 
//                         sx={{ 
//                           color: 'primary.main',
//                           backgroundColor: 'primary.50',
//                           '&:hover': { backgroundColor: 'primary.100' }
//                         }}
//                         onClick={() => handleViewDetails(product)}
//                         title="View Details"
//                       >
//                         <Visibility fontSize="small" />
//                       </IconButton>
//                       <IconButton 
//                         size="small" 
//                         sx={{ 
//                           color: 'success.main',
//                           backgroundColor: 'success.50',
//                           '&:hover': { backgroundColor: 'success.100' }
//                         }}
//                         onClick={() => handleEdit(product)}
//                         title="Edit"
//                       >
//                         <Edit fontSize="small" />
//                       </IconButton>
//                       <IconButton 
//                         size="small" 
//                         sx={{ 
//                           color: 'error.main',
//                           backgroundColor: 'error.50',
//                           '&:hover': { backgroundColor: 'error.100' }
//                         }}
//                         onClick={() => handleDelete(product)}
//                         title="Delete"
//                       >
//                         <Delete fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Pagination */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderTop: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography variant="body2" sx={{ color: 'grey.600' }}>
//             Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, products.length)} of {products.length} products
//           </Typography>
//           <TablePagination
//             component="div"
//             count={products.length}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             rowsPerPageOptions={[10, 25, 50]}
//             sx={{ flex: '0 1 auto', padding: 0 }}
//           />
//         </Box>

//         {/* Action Menu */}
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem onClick={() => handleViewDetails(selectedProduct)}>
//             <Visibility sx={{ mr: 1, fontSize: '18px', color: 'primary.main' }} />
//             View Details
//           </MenuItem>
//           <MenuItem onClick={() => handleEdit(selectedProduct)}>
//             <Edit sx={{ mr: 1, fontSize: '18px', color: 'success.main' }} />
//             Edit
//           </MenuItem>
//           <MenuItem onClick={() => handleDelete(selectedProduct)}>
//             <Delete sx={{ mr: 1, fontSize: '18px', color: 'error.main' }} />
//             Delete
//           </MenuItem>
//         </Menu>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductsBox;









































































// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   InputAdornment,
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   TablePagination,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Menu,
//   Link,
//   Switch,
//   FormControlLabel,
//   Avatar
// } from '@mui/material';
// import {
//   Search,
//   Add,
//   Edit,
//   Visibility,
//   Delete,
//   Business,
//   Storefront,
//   Image as ImageIcon
// } from '@mui/icons-material';

// const ProductsBox = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleAddProduct = () => {
//     console.log('Add product clicked');
//     // Add your add product logic here
//   };

//   const handleMenuOpen = (event, product) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProduct(product);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedProduct(null);
//   };

//   const handleEdit = (product) => {
//     console.log('Edit product:', product);
//     // Add edit logic here
//   };

//   const handleViewDetails = (product) => {
//     console.log('View details:', product);
//     // Add view details logic here
//   };

//   const handleDelete = (product) => {
//     console.log('Delete product:', product);
//     // Add delete logic here
//   };

//   const handleProductClick = (product) => {
//     console.log('Product clicked:', product);
//     // Navigate to product details page
//   };

//   const handleWholesaleToggle = (productId, event) => {
//     event.stopPropagation();
//     console.log('Wholesale toggle for product:', productId, event.target.checked);
//     // Update wholesale status logic here
//   };

//   // Function to handle image loading errors
//   const handleImageError = (e) => {
//     e.target.style.display = 'none';
//     e.target.nextSibling.style.display = 'flex';
//   };

//   // Sample data with wholesale/retail information
//   const products = [
//     {
//       id: 1,
//       name: 'Women Black Cotton Blend Top',
//       category: 'Fashion',
//       subCategory: 'Women',
//       retailPrice: '$1,560.00',
//       wholesalePrice: '$1,400.00',
//       moq: 10,
//       sales: '$1,750.00',
//       stock: 85733,
//       rating: 4,
//       salesCount: 15,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/beauty.jpg'
//     },
//     {
//       id: 2,
//       name: 'Men\'s Casual Shirt',
//       category: 'Fashion',
//       subCategory: 'Men',
//       retailPrice: '$45.00',
//       wholesalePrice: '$38.00',
//       moq: 5,
//       sales: '$890.00',
//       stock: 23456,
//       rating: 5,
//       salesCount: 32,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/api/placeholder/60/60'
//     },
//     // ... other products
//   ];

//   const getPricingTierLabel = (tier) => {
//     switch (tier) {
//       case 'both': return 'Both';
//       case 'retail': return 'Retail';
//       case 'wholesale': return 'Wholesale Only';
//       default: return 'Both';
//     }
//   };

//   const getPricingTierColor = (tier) => {
//     switch (tier) {
//       case 'both': return 'primary';
//       case 'retail': return 'secondary';
//       case 'wholesale': return 'success';
//       default: return 'default';
//     }
//   };

//   return (
//     <Card 
//       sx={{ 
//         borderRadius: '12px', 
//         boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//         marginTop: '24px',
//         overflow: 'hidden'
//       }}
//     >
//       <CardContent sx={{ padding: 0 }}>
//         {/* Header with Add Product Button */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderBottom: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
//             Products
//           </Typography>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleAddProduct}
//             sx={{
//               backgroundColor: '#ef7921',
//               '&:hover': {
//                 backgroundColor: '#e06b15',
//               },
//               borderRadius: '8px',
//               textTransform: 'none',
//               fontWeight: 500
//             }}
//           >
//             Add Product
//           </Button>
//         </Box>

//         {/* Filters */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderBottom: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           flexDirection: { xs: 'column', md: 'row' },
//           gap: '16px'
//         }}>
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: { xs: 'column', md: 'row' }, 
//             gap: '16px',
//             flex: 1
//           }}>
//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Category By</InputLabel>
//               <Select label="Category By" defaultValue="">
//                 <MenuItem value="">All Categories</MenuItem>
//                 <MenuItem value="fashion">Fashion</MenuItem>
//                 <MenuItem value="electronics">Electronics</MenuItem>
//                 <MenuItem value="sports">Sports</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Sub Category By</InputLabel>
//               <Select label="Sub Category By" defaultValue="">
//                 <MenuItem value="">All Subcategories</MenuItem>
//                 <MenuItem value="women">Women</MenuItem>
//                 <MenuItem value="men">Men</MenuItem>
//                 <MenuItem value="audio">Audio</MenuItem>
//                 <MenuItem value="accessories">Accessories</MenuItem>
//                 <MenuItem value="footwear">Footwear</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Pricing Tier</InputLabel>
//               <Select label="Pricing Tier" defaultValue="">
//                 <MenuItem value="">All Tiers</MenuItem>
//                 <MenuItem value="both">Both (Retail + Wholesale)</MenuItem>
//                 <MenuItem value="retail">Retail Only</MenuItem>
//                 <MenuItem value="wholesale">Wholesale Only</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Status</InputLabel>
//               <Select label="Status" defaultValue="">
//                 <MenuItem value="">All Status</MenuItem>
//                 <MenuItem value="active">Active</MenuItem>
//                 <MenuItem value="inactive">Inactive</MenuItem>
//                 <MenuItem value="out-of-stock">Out of Stock</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>

//           <TextField
//             size="small"
//             placeholder="Search products..."
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search sx={{ color: 'grey.400' }} />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ minWidth: 200 }}
//           />
//         </Box>

//         {/* Scrollable Table Container */}
//         <TableContainer component={Paper} elevation={0} sx={{ minWidth: 1200 }}>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: 'grey.50' }}>
//                 <TableCell padding="checkbox">
//                   <Checkbox />
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 300 }}>PRODUCT</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>CATEGORY</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>SUB CATEGORY</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>RETAIL PRICE</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>WHOLESALE PRICE</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>MOQ</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>PRICING TIER</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>SALES</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>STOCK</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>RATING</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>WHOLESALE</TableCell>
//                 <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>ACTIONS</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
//                 <TableRow key={product.id} hover>
//                   <TableCell padding="checkbox">
//                     <Checkbox />
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 300 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                       <Box
//                         sx={{
//                           width: 60,
//                           height: 60,
//                           backgroundColor: 'grey.100',
//                           borderRadius: '8px',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           flexShrink: 0,
//                           position: 'relative'
//                         }}
//                       >
//                         <img 
//                           src={product.image} 
//                           alt={product.name}
//                           style={{
//                             width: '100%',
//                             height: '100%',
//                             objectFit: 'cover',
//                             borderRadius: '8px'
//                           }}
//                           onError={handleImageError}
//                         />
//                         <Box
//                           sx={{
//                             position: 'absolute',
//                             top: 0,
//                             left: 0,
//                             right: 0,
//                             bottom: 0,
//                             display: 'none',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             backgroundColor: 'grey.100',
//                             borderRadius: '8px'
//                           }}
//                         >
//                           <ImageIcon sx={{ color: 'grey.400', fontSize: 24 }} />
//                         </Box>
//                       </Box>
//                       <Link
//                         component="button"
//                         variant="body2"
//                         onClick={() => handleProductClick(product)}
//                         sx={{
//                           fontWeight: 500,
//                           color: 'primary.main',
//                           textDecoration: 'none',
//                           '&:hover': {
//                             textDecoration: 'underline',
//                             color: 'primary.dark'
//                           },
//                           textAlign: 'left'
//                         }}
//                       >
//                         {product.name}
//                       </Link>
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 120 }}>
//                     <Chip
//                       label={product.category}
//                       size="small"
//                       sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
//                     />
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 140 }}>
//                     <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                       {product.subCategory}
//                     </Typography>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 120 }}>
//                     <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669' }}>
//                       {product.retailPrice}
//                     </Typography>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 120 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                       <Typography variant="body2" sx={{ fontWeight: 500, color: '#dc2626' }}>
//                         {product.wholesalePrice}
//                       </Typography>
//                       {product.isWholesaleEnabled && (
//                         <Business fontSize="small" sx={{ color: '#ef7921' }} />
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 100 }}>
//                     <Chip
//                       label={product.moq}
//                       size="small"
//                       variant="outlined"
//                       sx={{ 
//                         backgroundColor: product.isWholesaleEnabled ? '#fffbeb' : 'grey.100',
//                         color: product.isWholesaleEnabled ? '#d97706' : 'grey.500',
//                         borderColor: product.isWholesaleEnabled ? '#f59e0b' : 'grey.300'
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 120 }}>
//                     <Chip
//                       label={getPricingTierLabel(product.pricingTier)}
//                       size="small"
//                       color={getPricingTierColor(product.pricingTier)}
//                       variant="outlined"
//                     />
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 140 }}>
//                     <Box>
//                       <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                         {product.sales}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: 'grey.500' }}>
//                         {product.salesCount} sales
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 100 }}>
//                     <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                       {product.stock.toLocaleString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 100 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.800', mr: 0.5 }}>
//                         {product.rating}
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: '#fbbf24' }}>
//                         ★
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 120 }}>
//                     <FormControlLabel
//                       control={
//                         <Switch
//                           checked={product.isWholesaleEnabled}
//                           onChange={(e) => handleWholesaleToggle(product.id, e)}
//                           size="small"
//                           color="success"
//                         />
//                       }
//                       label={
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                           {product.isWholesaleEnabled ? (
//                             <>
//                               <Business fontSize="small" />
//                               <span>Enabled</span>
//                             </>
//                           ) : (
//                             <>
//                               <Storefront fontSize="small" />
//                               <span>Disabled</span>
//                             </>
//                           )}
//                         </Box>
//                       }
//                       sx={{ margin: 0 }}
//                     />
//                   </TableCell>
//                   <TableCell sx={{ minWidth: 150 }}>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <IconButton 
//                         size="small" 
//                         sx={{ color: 'primary.main' }}
//                         onClick={() => handleEdit(product)}
//                         title="Edit"
//                       >
//                         <Edit fontSize="small" />
//                       </IconButton>
//                       <IconButton 
//                         size="small" 
//                         sx={{ color: 'grey.600' }}
//                         onClick={() => handleViewDetails(product)}
//                         title="View Details"
//                       >
//                         <Visibility fontSize="small" />
//                       </IconButton>
//                       <IconButton 
//                         size="small" 
//                         sx={{ color: 'error.main' }}
//                         onClick={() => handleDelete(product)}
//                         title="Delete"
//                       >
//                         <Delete fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Pagination */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderTop: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography variant="body2" sx={{ color: 'grey.600' }}>
//             Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, products.length)} of {products.length} products
//           </Typography>
//           <TablePagination
//             component="div"
//             count={products.length}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             rowsPerPageOptions={[10, 25, 50]}
//             sx={{ flex: '0 1 auto', padding: 0 }}
//           />
//         </Box>

//         {/* Action Menu */}
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem onClick={() => handleEdit(selectedProduct)}>
//             <Edit sx={{ mr: 1, fontSize: '18px', color: 'primary.main' }} />
//             Edit
//           </MenuItem>
//           <MenuItem onClick={() => handleViewDetails(selectedProduct)}>
//             <Visibility sx={{ mr: 1, fontSize: '18px', color: 'grey.600' }} />
//             View Details
//           </MenuItem>
//           <MenuItem onClick={() => handleDelete(selectedProduct)}>
//             <Delete sx={{ mr: 1, fontSize: '18px', color: 'error.main' }} />
//             Delete
//           </MenuItem>
//         </Menu>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductsBox; 






















































// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   InputAdornment,
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   TablePagination,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Menu,
//   Link,
//   Switch,
//   FormControlLabel
// } from '@mui/material';
// import {
//   Search,
//   Add,
//   Edit,
//   Visibility,
//   Delete,
//   Business,
//   Storefront
// } from '@mui/icons-material';

// const ProductsBox = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleAddProduct = () => {
//     console.log('Add product clicked');
//     // Add your add product logic here
//   };

//   const handleMenuOpen = (event, product) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProduct(product);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedProduct(null);
//   };

//   const handleEdit = (product) => {
//     console.log('Edit product:', product);
//     // Add edit logic here
//   };

//   const handleViewDetails = (product) => {
//     console.log('View details:', product);
//     // Add view details logic here
//   };

//   const handleDelete = (product) => {
//     console.log('Delete product:', product);
//     // Add delete logic here
//   };

//   const handleProductClick = (product) => {
//     console.log('Product clicked:', product);
//     // Navigate to product details page
//   };

//   const handleWholesaleToggle = (productId, event) => {
//     event.stopPropagation();
//     console.log('Wholesale toggle for product:', productId, event.target.checked);
//     // Update wholesale status logic here
//   };

//   // Sample data with wholesale/retail information
//   const products = [
//     {
//       id: 1,
//       name: 'Women Black Cotton Blend Top',
//       category: 'Fashion',
//       subCategory: 'Women',
//       retailPrice: '$1,560.00',
//       wholesalePrice: '$1,400.00',
//       moq: 10,
//       sales: '$1,750.00',
//       stock: 85733,
//       rating: 4,
//       salesCount: 15,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/images/beauty.jpg'
//     },
//     {
//       id: 2,
//       name: 'Men\'s Casual Shirt',
//       category: 'Fashion',
//       subCategory: 'Men',
//       retailPrice: '$45.00',
//       wholesalePrice: '$38.00',
//       moq: 5,
//       sales: '$890.00',
//       stock: 23456,
//       rating: 5,
//       salesCount: 32,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/api/placeholder/60/60'
//     },
//     {
//       id: 3,
//       name: 'Wireless Headphones Premium Edition',
//       category: 'Electronics',
//       subCategory: 'Audio',
//       retailPrice: '$129.99',
//       wholesalePrice: '$110.00',
//       moq: 3,
//       sales: '$2,599.80',
//       stock: 12345,
//       rating: 4,
//       salesCount: 20,
//       isWholesaleEnabled: false,
//       pricingTier: 'retail',
//       image: '/api/placeholder/60/60'
//     },
//     {
//       id: 4,
//       name: 'Designer Handbag Luxury Leather',
//       category: 'Fashion',
//       subCategory: 'Accessories',
//       retailPrice: '$299.99',
//       wholesalePrice: '$250.00',
//       moq: 2,
//       sales: '$1,499.95',
//       stock: 5678,
//       rating: 4.8,
//       salesCount: 5,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/api/placeholder/60/60'
//     },
//     {
//       id: 5,
//       name: 'Running Shoes Professional Athletic',
//       category: 'Sports',
//       subCategory: 'Footwear',
//       retailPrice: '$89.99',
//       wholesalePrice: '$75.00',
//       moq: 4,
//       sales: '$1,799.80',
//       stock: 9876,
//       rating: 4.3,
//       salesCount: 20,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/api/placeholder/60/60'
//     },
//     {
//       id: 6,
//       name: 'Smart Watch Series 5 Advanced Fitness Tracker',
//       category: 'Electronics',
//       subCategory: 'Wearables',
//       retailPrice: '$249.99',
//       wholesalePrice: '$210.00',
//       moq: 3,
//       sales: '$4,999.80',
//       stock: 3456,
//       rating: 4.6,
//       salesCount: 20,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/api/placeholder/60/60'
//     },
//     {
//       id: 7,
//       name: 'Leather Wallet Premium Quality',
//       category: 'Fashion',
//       subCategory: 'Accessories',
//       retailPrice: '$49.99',
//       wholesalePrice: '$42.00',
//       moq: 6,
//       sales: '$999.80',
//       stock: 7890,
//       rating: 4.2,
//       salesCount: 20,
//       isWholesaleEnabled: false,
//       pricingTier: 'retail',
//       image: '/src/assets/images/handbag.jpg'
//     },
//     {
//       id: 8,
//       name: 'Yoga Mat Premium Non-Slip Exercise Mat',
//       category: 'Sports',
//       subCategory: 'Fitness',
//       retailPrice: '$39.99',
//       wholesalePrice: '$32.00',
//       moq: 8,
//       sales: '$799.80',
//       stock: 1234,
//       rating: 4.4,
//       salesCount: 20,
//       isWholesaleEnabled: true,
//       pricingTier: 'both',
//       image: '/src/assets/images/handbag.jpg'
//     }
//   ];

//   const getPricingTierLabel = (tier) => {
//     switch (tier) {
//       case 'both': return 'Both';
//       case 'retail': return 'Retail';
//       case 'wholesale': return 'Wholesale Only';
//       default: return 'Both';
//     }
//   };

//   const getPricingTierColor = (tier) => {
//     switch (tier) {
//       case 'both': return 'primary';
//       case 'retail': return 'secondary';
//       case 'wholesale': return 'success';
//       default: return 'default';
//     }
//   };

//   return (
//     <Card 
//       sx={{ 
//         borderRadius: '12px', 
//         boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//         marginTop: '24px',
//         overflow: 'hidden'
//       }}
//     >
//       <CardContent sx={{ padding: 0 }}>
//         {/* Header with Add Product Button */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderBottom: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
//             Products
//           </Typography>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleAddProduct}
//             sx={{
//               backgroundColor: '#ef7921',
//               '&:hover': {
//                 backgroundColor: '#e06b15',
//               },
//               borderRadius: '8px',
//               textTransform: 'none',
//               fontWeight: 500
//             }}
//           >
//             Add Product
//           </Button>
//         </Box>

//         {/* Filters */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderBottom: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           flexDirection: { xs: 'column', md: 'row' },
//           gap: '16px'
//         }}>
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: { xs: 'column', md: 'row' }, 
//             gap: '16px',
//             flex: 1
//           }}>
//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Category By</InputLabel>
//               <Select label="Category By" defaultValue="">
//                 <MenuItem value="">All Categories</MenuItem>
//                 <MenuItem value="fashion">Fashion</MenuItem>
//                 <MenuItem value="electronics">Electronics</MenuItem>
//                 <MenuItem value="sports">Sports</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Sub Category By</InputLabel>
//               <Select label="Sub Category By" defaultValue="">
//                 <MenuItem value="">All Subcategories</MenuItem>
//                 <MenuItem value="women">Women</MenuItem>
//                 <MenuItem value="men">Men</MenuItem>
//                 <MenuItem value="audio">Audio</MenuItem>
//                 <MenuItem value="accessories">Accessories</MenuItem>
//                 <MenuItem value="footwear">Footwear</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Pricing Tier</InputLabel>
//               <Select label="Pricing Tier" defaultValue="">
//                 <MenuItem value="">All Tiers</MenuItem>
//                 <MenuItem value="both">Both (Retail + Wholesale)</MenuItem>
//                 <MenuItem value="retail">Retail Only</MenuItem>
//                 <MenuItem value="wholesale">Wholesale Only</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Status</InputLabel>
//               <Select label="Status" defaultValue="">
//                 <MenuItem value="">All Status</MenuItem>
//                 <MenuItem value="active">Active</MenuItem>
//                 <MenuItem value="inactive">Inactive</MenuItem>
//                 <MenuItem value="out-of-stock">Out of Stock</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>

//           <TextField
//             size="small"
//             placeholder="Search products..."
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search sx={{ color: 'grey.400' }} />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ minWidth: 200 }}
//           />
//         </Box>

//         {/* Scrollable Table Container */}
//         {/* <Box sx={{ width: '100%', overflowX: 'auto' }}> */}
//           <TableContainer component={Paper} elevation={0} sx={{ minWidth: 1200 }}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: 'grey.50' }}>
//                   <TableCell padding="checkbox">
//                     <Checkbox />
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 300 }}>PRODUCT</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>CATEGORY</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>SUB CATEGORY</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>RETAIL PRICE</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>WHOLESALE PRICE</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>MOQ</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>PRICING TIER</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>SALES</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>STOCK</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>RATING</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>WHOLESALE</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>ACTIONS</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
//                   <TableRow key={product.id} hover>
//                     <TableCell padding="checkbox">
//                       <Checkbox />
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 300 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Box
//                           sx={{
//                             width: 60,
//                             height: 60,
//                             backgroundColor: 'grey.100',
//                             borderRadius: '8px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             flexShrink: 0
//                           }}
//                         >
//                           <Typography variant="caption" sx={{ color: 'grey.500', textAlign: 'center', fontSize: '10px' }}>
//                             Product Image
//                           </Typography>
//                         </Box>
//                         <Link
//                           component="button"
//                           variant="body2"
//                           onClick={() => handleProductClick(product)}
//                           sx={{
//                             fontWeight: 500,
//                             color: 'primary.main',
//                             textDecoration: 'none',
//                             '&:hover': {
//                               textDecoration: 'underline',
//                               color: 'primary.dark'
//                             },
//                             textAlign: 'left'
//                           }}
//                         >
//                           {product.name}
//                         </Link>
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 120 }}>
//                       <Chip
//                         label={product.category}
//                         size="small"
//                         sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 140 }}>
//                       <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                         {product.subCategory}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 120 }}>
//                       <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669' }}>
//                         {product.retailPrice}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 120 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                         <Typography variant="body2" sx={{ fontWeight: 500, color: '#dc2626' }}>
//                           {product.wholesalePrice}
//                         </Typography>
//                         {product.isWholesaleEnabled && (
//                           <Business fontSize="small" sx={{ color: '#ef7921' }} />
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 100 }}>
//                       <Chip
//                         label={product.moq}
//                         size="small"
//                         variant="outlined"
//                         sx={{ 
//                           backgroundColor: product.isWholesaleEnabled ? '#fffbeb' : 'grey.100',
//                           color: product.isWholesaleEnabled ? '#d97706' : 'grey.500',
//                           borderColor: product.isWholesaleEnabled ? '#f59e0b' : 'grey.300'
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 120 }}>
//                       <Chip
//                         label={getPricingTierLabel(product.pricingTier)}
//                         size="small"
//                         color={getPricingTierColor(product.pricingTier)}
//                         variant="outlined"
//                       />
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 140 }}>
//                       <Box>
//                         <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                           {product.sales}
//                         </Typography>
//                         <Typography variant="caption" sx={{ color: 'grey.500' }}>
//                           {product.salesCount} sales
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 100 }}>
//                       <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                         {product.stock.toLocaleString()}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 100 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.800', mr: 0.5 }}>
//                           {product.rating}
//                         </Typography>
//                         <Typography variant="body2" sx={{ color: '#fbbf24' }}>
//                           ★
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 120 }}>
//                       <FormControlLabel
//                         control={
//                           <Switch
//                             checked={product.isWholesaleEnabled}
//                             onChange={(e) => handleWholesaleToggle(product.id, e)}
//                             size="small"
//                             color="success"
//                           />
//                         }
//                         label={
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                             {product.isWholesaleEnabled ? (
//                               <>
//                                 <Business fontSize="small" />
//                                 <span>Enabled</span>
//                               </>
//                             ) : (
//                               <>
//                                 <Storefront fontSize="small" />
//                                 <span>Disabled</span>
//                               </>
//                             )}
//                           </Box>
//                         }
//                         sx={{ margin: 0 }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 150 }}>
//                       <Box sx={{ display: 'flex', gap: 1 }}>
//                         <IconButton 
//                           size="small" 
//                           sx={{ color: 'primary.main' }}
//                           onClick={() => handleEdit(product)}
//                           title="Edit"
//                         >
//                           <Edit fontSize="small" />
//                         </IconButton>
//                         <IconButton 
//                           size="small" 
//                           sx={{ color: 'grey.600' }}
//                           onClick={() => handleViewDetails(product)}
//                           title="View Details"
//                         >
//                           <Visibility fontSize="small" />
//                         </IconButton>
//                         <IconButton 
//                           size="small" 
//                           sx={{ color: 'error.main' }}
//                           onClick={() => handleDelete(product)}
//                           title="Delete"
//                         >
//                           <Delete fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         {/* </Box> */}

//         {/* Pagination */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderTop: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography variant="body2" sx={{ color: 'grey.600' }}>
//             Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, products.length)} of {products.length} products
//           </Typography>
//           <TablePagination
//             component="div"
//             count={products.length}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             rowsPerPageOptions={[10, 25, 50]}
//             sx={{ flex: '0 1 auto', padding: 0 }}
//           />
//         </Box>

//         {/* Action Menu */}
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem onClick={() => handleEdit(selectedProduct)}>
//             <Edit sx={{ mr: 1, fontSize: '18px', color: 'primary.main' }} />
//             Edit
//           </MenuItem>
//           <MenuItem onClick={() => handleViewDetails(selectedProduct)}>
//             <Visibility sx={{ mr: 1, fontSize: '18px', color: 'grey.600' }} />
//             View Details
//           </MenuItem>
//           <MenuItem onClick={() => handleDelete(selectedProduct)}>
//             <Delete sx={{ mr: 1, fontSize: '18px', color: 'error.main' }} />
//             Delete
//           </MenuItem>
//         </Menu>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductsBox;


























































// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   InputAdornment,
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   TablePagination,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Menu,
//   Link
// } from '@mui/material';
// import {
//   Search,
//   Add,
//   Edit,
//   Visibility,
//   Delete
// } from '@mui/icons-material';

// const ProductsBox = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleAddProduct = () => {
//     console.log('Add product clicked');
//     // Add your add product logic here
//   };

//   const handleMenuOpen = (event, product) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProduct(product);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedProduct(null);
//   };

//   const handleEdit = (product) => {
//     console.log('Edit product:', product);
//     // Add edit logic here
//   };

//   const handleViewDetails = (product) => {
//     console.log('View details:', product);
//     // Add view details logic here
//   };

//   const handleDelete = (product) => {
//     console.log('Delete product:', product);
//     // Add delete logic here
//   };

//   const handleProductClick = (product) => {
//     console.log('Product clicked:', product);
//     // Navigate to product details page
//   };

//   // Sample data with images
//   const products = [
//     {
//       id: 1,
//       name: 'Women Black Cotton Blend Top',
//       category: 'Fashion',
//       subCategory: 'Women',
//       price: '$1,560.00',
//       sales: '$1,750.00',
//       stock: 85733,
//       rating: 4,
//       salesCount: 15,
//       // image: '/src/assets/images/handbag.jpg',
//       image: '/admin/src/assets/images/beauty.jpg'
//     },
//     {
//       id: 2,
//       name: 'Men\'s Casual Shirt',
//       category: 'Fashion',
//       subCategory: 'Men',
//       price: '$45.00',
//       sales: '$890.00',
//       stock: 23456,
//       rating: 5,
//       salesCount: 32,
//       image: '/api/placeholder/60/60'
//     },
//     {
//       id: 3,
//       name: 'Wireless Headphones Premium Edition with Noise Cancellation',
//       category: 'Electronics',
//       subCategory: 'Audio',
//       price: '$129.99',
//       sales: '$2,599.80',
//       stock: 12345,
//       rating: 4,
//       salesCount: 20,
//       image: '/api/placeholder/60/60'
//     },
//     {
//       id: 4,
//       name: 'Designer Handbag Luxury Leather',
//       category: 'Fashion',
//       subCategory: 'Accessories',
//       price: '$299.99',
//       sales: '$1,499.95',
//       stock: 5678,
//       rating: 4.8,
//       salesCount: 5,
//       image: '/api/placeholder/60/60'
//     },
//     {
//       id: 5,
//       name: 'Running Shoes Professional Athletic',
//       category: 'Sports',
//       subCategory: 'Footwear',
//       price: '$89.99',
//       sales: '$1,799.80',
//       stock: 9876,
//       rating: 4.3,
//       salesCount: 20,
//       image: '/api/placeholder/60/60'
//     },
//     {
//       id: 6,
//       name: 'Smart Watch Series 5 Advanced Fitness Tracker',
//       category: 'Electronics',
//       subCategory: 'Wearables',
//       price: '$249.99',
//       sales: '$4,999.80',
//       stock: 3456,
//       rating: 4.6,
//       salesCount: 20,
//       image: '/api/placeholder/60/60'
//     },
//     {
//       id: 7,
//       name: 'Leather Wallet Premium Quality',
//       category: 'Fashion',
//       subCategory: 'Accessories',
//       price: '$49.99',
//       sales: '$999.80',
//       stock: 7890,
//       rating: 4.2,
//       salesCount: 20,
//       image: '/src/assets/images/handbag.jpg'
//     },
//     {
//       id: 8,
//       name: 'Yoga Mat Premium Non-Slip Exercise Mat',
//       category: 'Sports',
//       subCategory: 'Fitness',
//       price: '$39.99',
//       sales: '$799.80',
//       stock: 1234,
//       rating: 4.4,
//       salesCount: 20,
//       image: '/src/assets/images/handbag.jpg'
//     }
//   ];

//   return (
//     <Card 
//       sx={{ 
//         borderRadius: '12px', 
//         boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//         marginTop: '24px',
//         overflow: 'hidden'
//       }}
//     >
//       <CardContent sx={{ padding: 0 }}>
//         {/* Header with Add Product Button */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderBottom: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
//             Products
//           </Typography>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleAddProduct}
//             sx={{
//               backgroundColor: '#ef7921',
//               '&:hover': {
//                 backgroundColor: '#e06b15',
//               },
//               borderRadius: '8px',
//               textTransform: 'none',
//               fontWeight: 500
//             }}
//           >
//             Add Product
//           </Button>
//         </Box>

//         {/* Filters */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderBottom: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           flexDirection: { xs: 'column', md: 'row' },
//           gap: '16px'
//         }}>
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: { xs: 'column', md: 'row' }, 
//             gap: '16px',
//             flex: 1
//           }}>
//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Category By</InputLabel>
//               <Select label="Category By" defaultValue="">
//                 <MenuItem value="">All Categories</MenuItem>
//                 <MenuItem value="fashion">Fashion</MenuItem>
//                 <MenuItem value="electronics">Electronics</MenuItem>
//                 <MenuItem value="sports">Sports</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Sub Category By</InputLabel>
//               <Select label="Sub Category By" defaultValue="">
//                 <MenuItem value="">All Subcategories</MenuItem>
//                 <MenuItem value="women">Women</MenuItem>
//                 <MenuItem value="men">Men</MenuItem>
//                 <MenuItem value="audio">Audio</MenuItem>
//                 <MenuItem value="accessories">Accessories</MenuItem>
//                 <MenuItem value="footwear">Footwear</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Status</InputLabel>
//               <Select label="Status" defaultValue="">
//                 <MenuItem value="">All Status</MenuItem>
//                 <MenuItem value="active">Active</MenuItem>
//                 <MenuItem value="inactive">Inactive</MenuItem>
//                 <MenuItem value="out-of-stock">Out of Stock</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>

//           <TextField
//             size="small"
//             placeholder="Search products..."
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search sx={{ color: 'grey.400' }} />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ minWidth: 200 }}
//           />
//         </Box>

//         {/* Scrollable Table Container */}
//         <Box sx={{ width: '100%', overflowX: 'auto' }}>
//           <TableContainer component={Paper} elevation={0} sx={{ minWidth: 1000 }}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: 'grey.50' }}>
//                   <TableCell padding="checkbox">
//                     <Checkbox />
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 300 }}>PRODUCT</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>CATEGORY</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>SUB CATEGORY</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>PRICE</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 140 }}>SALES</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>STOCK</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>RATING</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>STATUS</TableCell>
//                   <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>ACTIONS</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
//                   <TableRow key={product.id} hover>
//                     <TableCell padding="checkbox">
//                       <Checkbox />
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 300 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                         <Box
//                           sx={{
//                             width: 60,
//                             height: 60,
//                             backgroundColor: 'grey.100',
//                             borderRadius: '8px',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             flexShrink: 0
//                           }}
//                         >
//                           <Typography variant="caption" sx={{ color: 'grey.500', textAlign: 'center', fontSize: '10px' }}>
//                             Product Image
//                           </Typography>
//                         </Box>
//                         <Link
//                           component="button"
//                           variant="body2"
//                           onClick={() => handleProductClick(product)}
//                           sx={{
//                             fontWeight: 500,
//                             color: 'primary.main',
//                             textDecoration: 'none',
//                             '&:hover': {
//                               textDecoration: 'underline',
//                               color: 'primary.dark'
//                             },
//                             textAlign: 'left'
//                           }}
//                         >
//                           {product.name}
//                         </Link>
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 120 }}>
//                       <Chip
//                         label={product.category}
//                         size="small"
//                         sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 140 }}>
//                       <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                         {product.subCategory}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 120 }}>
//                       <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669' }}>
//                         {product.price}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 140 }}>
//                       <Box>
//                         <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                           {product.sales}
//                         </Typography>
//                         <Typography variant="caption" sx={{ color: 'grey.500' }}>
//                           {product.salesCount} sales
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 100 }}>
//                       <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                         {product.stock.toLocaleString()}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 100 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.800', mr: 0.5 }}>
//                           {product.rating}
//                         </Typography>
//                         <Typography variant="body2" sx={{ color: '#fbbf24' }}>
//                           ★
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 120 }}>
//                       <Chip
//                         label={product.stock > 0 ? "In Stock" : "Out of Stock"}
//                         size="small"
//                         sx={{ 
//                           backgroundColor: product.stock > 0 ? '#ecfdf5' : '#fef2f2',
//                           color: product.stock > 0 ? '#059669' : '#dc2626',
//                           fontWeight: 500
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ minWidth: 150 }}>
//                       <Box sx={{ display: 'flex', gap: 1 }}>
//                         <IconButton 
//                           size="small" 
//                           sx={{ color: 'primary.main' }}
//                           onClick={() => handleEdit(product)}
//                           title="Edit"
//                         >
//                           <Edit fontSize="small" />
//                         </IconButton>
//                         <IconButton 
//                           size="small" 
//                           sx={{ color: 'grey.600' }}
//                           onClick={() => handleViewDetails(product)}
//                           title="View Details"
//                         >
//                           <Visibility fontSize="small" />
//                         </IconButton>
//                         <IconButton 
//                           size="small" 
//                           sx={{ color: 'error.main' }}
//                           onClick={() => handleDelete(product)}
//                           title="Delete"
//                         >
//                           <Delete fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>

//         {/* Pagination */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderTop: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography variant="body2" sx={{ color: 'grey.600' }}>
//             Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, products.length)} of {products.length} products
//           </Typography>
//           <TablePagination
//             component="div"
//             count={products.length}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             rowsPerPageOptions={[10, 25, 50]}
//             sx={{ flex: '0 1 auto', padding: 0 }}
//           />
//         </Box>

//         {/* Action Menu */}
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem onClick={() => handleEdit(selectedProduct)}>
//             <Edit sx={{ mr: 1, fontSize: '18px', color: 'primary.main' }} />
//             Edit
//           </MenuItem>
//           <MenuItem onClick={() => handleViewDetails(selectedProduct)}>
//             <Visibility sx={{ mr: 1, fontSize: '18px', color: 'grey.600' }} />
//             View Details
//           </MenuItem>
//           <MenuItem onClick={() => handleDelete(selectedProduct)}>
//             <Delete sx={{ mr: 1, fontSize: '18px', color: 'error.main' }} />
//             Delete
//           </MenuItem>
//         </Menu>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductsBox;














// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   InputAdornment,
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   TablePagination,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Menu
// } from '@mui/material';
// import {
//   Search,
//   Add,
//   Edit,
//   Visibility,
//   Delete,
//   MoreVert
// } from '@mui/icons-material';

// const ProductsBox = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleAddProduct = () => {
//     console.log('Add product clicked');
//     // Add your add product logic here
//   };

//   const handleMenuOpen = (event, product) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProduct(product);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedProduct(null);
//   };

//   const handleEdit = () => {
//     console.log('Edit product:', selectedProduct);
//     handleMenuClose();
//     // Add edit logic here
//   };

//   const handleViewDetails = () => {
//     console.log('View details:', selectedProduct);
//     handleMenuClose();
//     // Add view details logic here
//   };

//   const handleDelete = () => {
//     console.log('Delete product:', selectedProduct);
//     handleMenuClose();
//     // Add delete logic here
//   };

//   // Sample data
//   const products = [
//     {
//       id: 1,
//       name: 'Buy New Trend Women Black Cotton Blend Top | top t... Trick Fab',
//       category: 'Fashion',
//       subCategory: 'Women',
//       price: '$1,560.00',
//       sales: '$1,750.00',
//       stock: 85733,
//       rating: 4,
//       salesCount: 15
//     },
//     {
//       id: 2,
//       name: 'Men\'s Casual Shirt',
//       category: 'Fashion',
//       subCategory: 'Men',
//       price: '$45.00',
//       sales: '$890.00',
//       stock: 23456,
//       rating: 5,
//       salesCount: 32
//     },
//     {
//       id: 3,
//       name: 'Wireless Headphones',
//       category: 'Electronics',
//       subCategory: 'Audio',
//       price: '$129.99',
//       sales: '$2,599.80',
//       stock: 12345,
//       rating: 4,
//       salesCount: 20
//     },
//     {
//       id: 4,
//       name: 'Designer Handbag',
//       category: 'Fashion',
//       subCategory: 'Accessories',
//       price: '$299.99',
//       sales: '$1,499.95',
//       stock: 5678,
//       rating: 4.8,
//       salesCount: 5
//     },
//     {
//       id: 5,
//       name: 'Running Shoes',
//       category: 'Sports',
//       subCategory: 'Footwear',
//       price: '$89.99',
//       sales: '$1,799.80',
//       stock: 9876,
//       rating: 4.3,
//       salesCount: 20
//     },
//     {
//       id: 6,
//       name: 'Smart Watch Series 5',
//       category: 'Electronics',
//       subCategory: 'Wearables',
//       price: '$249.99',
//       sales: '$4,999.80',
//       stock: 3456,
//       rating: 4.6,
//       salesCount: 20
//     },
//     {
//       id: 7,
//       name: 'Leather Wallet',
//       category: 'Fashion',
//       subCategory: 'Accessories',
//       price: '$49.99',
//       sales: '$999.80',
//       stock: 7890,
//       rating: 4.2,
//       salesCount: 20
//     },
//     {
//       id: 8,
//       name: 'Yoga Mat Premium',
//       category: 'Sports',
//       subCategory: 'Fitness',
//       price: '$39.99',
//       sales: '$799.80',
//       stock: 1234,
//       rating: 4.4,
//       salesCount: 20
//     }
//   ];

//   return (
//     <Card 
//       sx={{ 
//         borderRadius: '12px', 
//         boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//         marginTop: '24px'
//       }}
//     >
//       <CardContent sx={{ padding: 0 }}>
//         {/* Header with Add Product Button */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderBottom: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
//             Products
//           </Typography>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleAddProduct}
//             sx={{
//               backgroundColor: '#ef7921',
//               '&:hover': {
//                 backgroundColor: '#e06b15',
//               },
//               borderRadius: '8px',
//               textTransform: 'none',
//               fontWeight: 500
//             }}
//           >
//             Add Product
//           </Button>
//         </Box>

//         {/* Filters */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderBottom: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           flexDirection: { xs: 'column', md: 'row' },
//           gap: '16px'
//         }}>
//           <Box sx={{ 
//             display: 'flex', 
//             flexDirection: { xs: 'column', md: 'row' }, 
//             gap: '16px',
//             flex: 1
//           }}>
//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Category By</InputLabel>
//               <Select label="Category By" defaultValue="">
//                 <MenuItem value="">All Categories</MenuItem>
//                 <MenuItem value="fashion">Fashion</MenuItem>
//                 <MenuItem value="electronics">Electronics</MenuItem>
//                 <MenuItem value="sports">Sports</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Sub Category By</InputLabel>
//               <Select label="Sub Category By" defaultValue="">
//                 <MenuItem value="">All Subcategories</MenuItem>
//                 <MenuItem value="women">Women</MenuItem>
//                 <MenuItem value="men">Men</MenuItem>
//                 <MenuItem value="audio">Audio</MenuItem>
//                 <MenuItem value="accessories">Accessories</MenuItem>
//                 <MenuItem value="footwear">Footwear</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 180 }}>
//               <InputLabel>Status</InputLabel>
//               <Select label="Status" defaultValue="">
//                 <MenuItem value="">All Status</MenuItem>
//                 <MenuItem value="active">Active</MenuItem>
//                 <MenuItem value="inactive">Inactive</MenuItem>
//                 <MenuItem value="out-of-stock">Out of Stock</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>

//           <TextField
//             size="small"
//             placeholder="Search products..."
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search sx={{ color: 'grey.400' }} />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{ minWidth: 200 }}
//           />
//         </Box>

//         {/* Products Table */}
//         <TableContainer component={Paper} elevation={0}>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: 'grey.50' }}>
//                 <TableCell padding="checkbox">
//                   <Checkbox />
//                 </TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>PRODUCT</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>CATEGORY</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>SUB CATEGORY</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>PRICE</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>SALES</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>STOCK</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>RATING</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>ACTIONS</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
//                 <TableRow key={product.id} hover>
//                   <TableCell padding="checkbox">
//                     <Checkbox />
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                       {product.name}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={product.category}
//                       size="small"
//                       sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                       {product.subCategory}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669' }}>
//                       {product.price}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                         {product.sales}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: 'grey.500' }}>
//                         {product.salesCount} sales
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                       {product.stock.toLocaleString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.800', mr: 0.5 }}>
//                         {product.rating}
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: 'grey.500' }}>
//                         ★
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={product.stock > 0 ? "In Stock" : "Out of Stock"}
//                       size="small"
//                       sx={{ 
//                         backgroundColor: product.stock > 0 ? '#ecfdf5' : '#fef2f2',
//                         color: product.stock > 0 ? '#059669' : '#dc2626',
//                         fontWeight: 500
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <IconButton 
//                         size="small" 
//                         sx={{ color: 'primary.main' }}
//                         onClick={() => handleEdit(product)}
//                       >
//                         <Edit fontSize="small" />
//                       </IconButton>
//                       <IconButton 
//                         size="small" 
//                         sx={{ color: 'grey.600' }}
//                         onClick={() => handleViewDetails(product)}
//                       >
//                         <Visibility fontSize="small" />
//                       </IconButton>
//                       <IconButton 
//                         size="small" 
//                         sx={{ color: 'error.main' }}
//                         onClick={() => handleDelete(product)}
//                       >
//                         <Delete fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* Pagination */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderTop: '1px solid', 
//           borderColor: 'grey.100',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <Typography variant="body2" sx={{ color: 'grey.600' }}>
//             Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, products.length)} of {products.length} products
//           </Typography>
//           <TablePagination
//             component="div"
//             count={products.length}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             rowsPerPageOptions={[10, 25, 50]}
//             sx={{ flex: '0 1 auto', padding: 0 }}
//           />
//         </Box>

//         {/* Action Menu */}
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem onClick={handleEdit}>
//             <Edit sx={{ mr: 1, fontSize: '18px', color: 'primary.main' }} />
//             Edit
//           </MenuItem>
//           <MenuItem onClick={handleViewDetails}>
//             <Visibility sx={{ mr: 1, fontSize: '18px', color: 'grey.600' }} />
//             View Details
//           </MenuItem>
//           <MenuItem onClick={handleDelete}>
//             <Delete sx={{ mr: 1, fontSize: '18px', color: 'error.main' }} />
//             Delete
//           </MenuItem>
//         </Menu>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductsBox;













// // import React, { useState } from 'react';
// // import {
// //   Box,
// //   Card,
// //   CardContent,
// //   Typography,
// //   TextField,
// //   InputAdornment,
// //   Checkbox,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   Chip,
// //   IconButton,
// //   TablePagination,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Button
// // } from '@mui/material';
// // import {
// //   Search,
// //   MoreVert,
// //   Star,
// //   Add
// // } from '@mui/icons-material';

// // const ProductsBox = () => {
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(50);

// //   const handleChangePage = (event, newPage) => {
// //     setPage(newPage);
// //   };

// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(parseInt(event.target.value, 10));
// //     setPage(0);
// //   };

// //   const handleAddProduct = () => {
// //     console.log('Add product clicked');
// //     // Add your add product logic here
// //   };

// //   // Sample data
// //   const products = [
// //     {
// //       id: 1,
// //       name: 'Buy New Trend Women Black Cotton Blend Top | top t... Trick Fab',
// //       category: 'Fashion',
// //       subCategory: 'Women',
// //       price: '$1,560.00',
// //       sales: '$1,750.00',
// //       stock: 85733,
// //       rating: 4,
// //       salesCount: 15
// //     },
// //     {
// //       id: 2,
// //       name: 'Men\'s Casual Shirt',
// //       category: 'Fashion',
// //       subCategory: 'Men',
// //       price: '$45.00',
// //       sales: '$890.00',
// //       stock: 23456,
// //       rating: 5,
// //       salesCount: 32
// //     },
// //     {
// //       id: 3,
// //       name: 'Wireless Headphones',
// //       category: 'Electronics',
// //       subCategory: 'Audio',
// //       price: '$129.99',
// //       sales: '$2,599.80',
// //       stock: 12345,
// //       rating: 4,
// //       salesCount: 20
// //     },
// //     {
// //       id: 4,
// //       name: 'Designer Handbag',
// //       category: 'Fashion',
// //       subCategory: 'Accessories',
// //       price: '$299.99',
// //       sales: '$1,499.95',
// //       stock: 5678,
// //       rating: 4.8,
// //       salesCount: 5
// //     },
// //     {
// //       id: 5,
// //       name: 'Running Shoes',
// //       category: 'Sports',
// //       subCategory: 'Footwear',
// //       price: '$89.99',
// //       sales: '$1,799.80',
// //       stock: 9876,
// //       rating: 4.3,
// //       salesCount: 20
// //     }
// //   ];

// //   return (
// //     <Card 
// //       sx={{ 
// //         borderRadius: '12px', 
// //         boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
// //         marginTop: '24px'
// //       }}
// //     >
// //       <CardContent sx={{ padding: 0 }}>
// //         {/* Header with Add Product Button */}
// //         <Box sx={{ 
// //           padding: '16px', 
// //           borderBottom: '1px solid', 
// //           borderColor: 'grey.100',
// //           display: 'flex',
// //           justifyContent: 'space-between',
// //           alignItems: 'center'
// //         }}>
// //           <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
// //             Products
// //           </Typography>
// //           <Button
// //             variant="contained"
// //             startIcon={<Add />}
// //             onClick={handleAddProduct}
// //             sx={{
// //               backgroundColor: '#ef7921',
// //               '&:hover': {
// //                 backgroundColor: '#e06b15',
// //               },
// //               borderRadius: '8px',
// //               textTransform: 'none',
// //               fontWeight: 500
// //             }}
// //           >
// //             Add Product
// //           </Button>
// //         </Box>

// //         {/* Filters */}
// //         <Box sx={{ 
// //           padding: '16px', 
// //           borderBottom: '1px solid', 
// //           borderColor: 'grey.100',
// //           display: 'flex',
// //           flexDirection: { xs: 'column', md: 'row' },
// //           gap: '16px'
// //         }}>
// //           <Box sx={{ 
// //             display: 'flex', 
// //             flexDirection: { xs: 'column', md: 'row' }, 
// //             gap: '16px',
// //             flex: 1
// //           }}>
// //             <FormControl size="small" sx={{ minWidth: 180 }}>
// //               <InputLabel>Category By</InputLabel>
// //               <Select label="Category By" defaultValue="">
// //                 <MenuItem value="">All Categories</MenuItem>
// //                 <MenuItem value="fashion">Fashion</MenuItem>
// //                 <MenuItem value="electronics">Electronics</MenuItem>
// //                 <MenuItem value="sports">Sports</MenuItem>
// //               </Select>
// //             </FormControl>

// //             <FormControl size="small" sx={{ minWidth: 180 }}>
// //               <InputLabel>Sub Category By</InputLabel>
// //               <Select label="Sub Category By" defaultValue="">
// //                 <MenuItem value="">All Subcategories</MenuItem>
// //                 <MenuItem value="women">Women</MenuItem>
// //                 <MenuItem value="men">Men</MenuItem>
// //                 <MenuItem value="audio">Audio</MenuItem>
// //                 <MenuItem value="accessories">Accessories</MenuItem>
// //                 <MenuItem value="footwear">Footwear</MenuItem>
// //               </Select>
// //             </FormControl>

// //             <FormControl size="small" sx={{ minWidth: 180 }}>
// //               <InputLabel>Status</InputLabel>
// //               <Select label="Status" defaultValue="">
// //                 <MenuItem value="">All Status</MenuItem>
// //                 <MenuItem value="active">Active</MenuItem>
// //                 <MenuItem value="inactive">Inactive</MenuItem>
// //                 <MenuItem value="out-of-stock">Out of Stock</MenuItem>
// //               </Select>
// //             </FormControl>
// //           </Box>

// //           <TextField
// //             size="small"
// //             placeholder="Search products..."
// //             InputProps={{
// //               startAdornment: (
// //                 <InputAdornment position="start">
// //                   <Search sx={{ color: 'grey.400' }} />
// //                 </InputAdornment>
// //               ),
// //             }}
// //             sx={{ minWidth: 200 }}
// //           />
// //         </Box>

// //         {/* Products Table */}
// //         <TableContainer component={Paper} elevation={0}>
// //           <Table>
// //             <TableHead>
// //               <TableRow sx={{ backgroundColor: 'grey.50' }}>
// //                 <TableCell padding="checkbox">
// //                   <Checkbox />
// //                 </TableCell>
// //                 <TableCell sx={{ fontWeight: 600 }}>PRODUCT</TableCell>
// //                 <TableCell sx={{ fontWeight: 600 }}>CATEGORY</TableCell>
// //                 <TableCell sx={{ fontWeight: 600 }}>SUB CATEGORY</TableCell>
// //                 <TableCell sx={{ fontWeight: 600 }}>PRICE</TableCell>
// //                 <TableCell sx={{ fontWeight: 600 }}>SALES</TableCell>
// //                 <TableCell sx={{ fontWeight: 600 }}>STOCK</TableCell>
// //                 <TableCell sx={{ fontWeight: 600 }}>RATING</TableCell>
// //                 <TableCell sx={{ fontWeight: 600 }}>STATUS</TableCell>
// //                 <TableCell sx={{ fontWeight: 600 }}>ACTION</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
// //                 <TableRow key={product.id} hover>
// //                   <TableCell padding="checkbox">
// //                     <Checkbox />
// //                   </TableCell>
// //                   <TableCell>
// //                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
// //                       {product.name}
// //                     </Typography>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Chip
// //                       label={product.category}
// //                       size="small"
// //                       sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
// //                     />
// //                   </TableCell>
// //                   <TableCell>
// //                     <Typography variant="body2" sx={{ color: 'grey.600' }}>
// //                       {product.subCategory}
// //                     </Typography>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Typography variant="body2" sx={{ fontWeight: 500, color: '#059669' }}>
// //                       {product.price}
// //                     </Typography>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Box>
// //                       <Typography variant="body2" sx={{ fontWeight: 500 }}>
// //                         {product.sales}
// //                       </Typography>
// //                       <Typography variant="caption" sx={{ color: 'grey.500' }}>
// //                         {product.salesCount} sales
// //                       </Typography>
// //                     </Box>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Typography variant="body2" sx={{ color: 'grey.600' }}>
// //                       {product.stock.toLocaleString()}
// //                     </Typography>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
// //                       {[...Array(5)].map((_, i) => (
// //                         <Star
// //                           key={i}
// //                           sx={{ 
// //                             color: i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db',
// //                             fontSize: '18px'
// //                           }}
// //                         />
// //                       ))}
// //                       <Typography variant="caption" sx={{ marginLeft: '4px', color: 'grey.500' }}>
// //                         ({product.rating})
// //                       </Typography>
// //                     </Box>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Chip
// //                       label={product.stock > 0 ? "In Stock" : "Out of Stock"}
// //                       size="small"
// //                       sx={{ 
// //                         backgroundColor: product.stock > 0 ? '#ecfdf5' : '#fef2f2',
// //                         color: product.stock > 0 ? '#059669' : '#dc2626'
// //                       }}
// //                     />
// //                   </TableCell>
// //                   <TableCell>
// //                     <IconButton size="small">
// //                       <MoreVert />
// //                     </IconButton>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>

// //         {/* Pagination */}
// //         <Box sx={{ 
// //           padding: '16px', 
// //           borderTop: '1px solid', 
// //           borderColor: 'grey.100',
// //           display: 'flex',
// //           justifyContent: 'space-between',
// //           alignItems: 'center'
// //         }}>
// //           <Typography variant="body2" sx={{ color: 'grey.600' }}>
// //             Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, products.length)} of {products.length} products
// //           </Typography>
// //           <TablePagination
// //             component="div"
// //             count={products.length}
// //             page={page}
// //             onPageChange={handleChangePage}
// //             rowsPerPage={rowsPerPage}
// //             onRowsPerPageChange={handleChangeRowsPerPage}
// //             rowsPerPageOptions={[10, 25, 50]}
// //             sx={{ flex: '0 1 auto', padding: 0 }}
// //           />
// //         </Box>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default ProductsBox;