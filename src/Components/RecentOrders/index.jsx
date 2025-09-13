import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import {
  MoreVert,
  Business,
  Storefront,
  Download,
  Visibility,
  Edit,
  Delete,
  LocalShipping,
  CheckCircle
} from '@mui/icons-material';

const RecentOrders = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = () => {
    console.log('Export orders clicked');
    // Add your export logic here
    // This could export to CSV, Excel, PDF, etc.
  };

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleViewDetails = (order) => {
    console.log('View order details:', order);
    // Add view details logic here
  };

  const handleEditOrder = (order) => {
    console.log('Edit order:', order);
    // Add edit logic here
  };

  const handleUpdateStatus = (order) => {
    console.log('Update order status:', order);
    // Add status update logic here
  };

  const handleDeleteOrder = (order) => {
    console.log('Delete order:', order);
    // Add delete logic here
  };

  // Sample orders data with wholesale/retail information
  const orders = [
    {
      id: '68bee019228db479bbf37e63',
      name: 'John Doe',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY',
      totalAmount: '$156.00',
      email: 'john.doe@email.com',
      userId: 'USR-1001',
      status: 'Completed',
      date: '2025-09-08',
      orderType: 'wholesale',
      itemsCount: 15,
      moq: 10,
      wholesaleDiscount: '$45.60'
    },
    {
      id: '68bee019228db479bbf37e64',
      name: 'Jane Smith',
      phone: '+1 (555) 987-6543',
      address: '456 Oak Ave, Los Angeles, CA',
      totalAmount: '$89.50',
      email: 'jane.smith@email.com',
      userId: 'USR-1002',
      status: 'Processing',
      date: '2025-09-07',
      orderType: 'retail',
      itemsCount: 3,
      moq: 5,
      wholesaleDiscount: '$0.00'
    },
    {
      id: '68bee019228db479bbf37e65',
      name: 'Mike Johnson',
      phone: '+1 (555) 456-7890',
      address: '789 Pine Rd, Chicago, IL',
      totalAmount: '$234.75',
      email: 'mike.j@email.com',
      userId: 'USR-1003',
      status: 'Shipped',
      date: '2025-09-06',
      orderType: 'wholesale',
      itemsCount: 25,
      moq: 10,
      wholesaleDiscount: '$78.25'
    },
    {
      id: '68bee019228db479bbf37e66',
      name: 'Sarah Wilson',
      phone: '+1 (555) 321-0987',
      address: '321 Elm St, Miami, FL',
      totalAmount: '$67.25',
      email: 'sarah.w@email.com',
      userId: 'USR-1004',
      status: 'Pending',
      date: '2025-09-05',
      orderType: 'retail',
      itemsCount: 2,
      moq: 5,
      wholesaleDiscount: '$0.00'
    },
    {
      id: 'ORD-005',
      name: 'David Brown',
      phone: '+1 (555) 654-3210',
      address: '654 Maple Dr, Seattle, WA',
      totalAmount: '$189.99',
      email: 'david.b@email.com',
      userId: 'USR-1005',
      status: 'Cancelled',
      date: '2025-09-04',
      orderType: 'wholesale',
      itemsCount: 12,
      moq: 8,
      wholesaleDiscount: '$36.00'
    },
    {
      id: 'ORD-006',
      name: 'Emily Davis',
      phone: '+1 (555) 789-0123',
      address: '987 Cedar Ln, Boston, MA',
      totalAmount: '$312.40',
      email: 'emily.d@email.com',
      userId: 'USR-1006',
      status: 'Completed',
      date: '2025-09-03',
      orderType: 'retail',
      itemsCount: 4,
      moq: 6,
      wholesaleDiscount: '$0.00'
    },
    {
      id: 'ORD-007',
      name: 'Robert Lee',
      phone: '+1 (555) 234-5678',
      address: '234 Birch St, Austin, TX',
      totalAmount: '$145.60',
      email: 'robert.l@email.com',
      userId: 'USR-1007',
      status: 'Processing',
      date: '2025-09-02',
      orderType: 'wholesale',
      itemsCount: 18,
      moq: 10,
      wholesaleDiscount: '$52.40'
    },
    {
      id: 'ORD-008',
      name: 'Lisa Garcia',
      phone: '+1 (555) 876-5432',
      address: '876 Walnut Ave, Denver, CO',
      totalAmount: '$278.35',
      email: 'lisa.g@email.com',
      userId: 'USR-1008',
      status: 'Shipped',
      date: '2025-09-01',
      orderType: 'wholesale',
      itemsCount: 22,
      moq: 15,
      wholesaleDiscount: '$67.65'
    },
    {
      id: 'ORD-009',
      name: 'James Wilson',
      phone: '+1 (555) 345-6789',
      address: '345 Spruce Rd, Phoenix, AZ',
      totalAmount: '$98.75',
      email: 'james.w@email.com',
      userId: 'USR-1009',
      status: 'Completed',
      date: '2025-08-31',
      orderType: 'retail',
      itemsCount: 1,
      moq: 3,
      wholesaleDiscount: '$0.00'
    },
    {
      id: 'ORD-010',
      name: 'Maria Martinez',
      phone: '+1 (555) 765-4321',
      address: '765 Palm St, San Diego, CA',
      totalAmount: '$421.80',
      email: 'maria.m@email.com',
      userId: 'USR-1010',
      status: 'Pending',
      date: '2025-08-30',
      orderType: 'wholesale',
      itemsCount: 30,
      moq: 20,
      wholesaleDiscount: '$128.20'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return { bgcolor: '#ecfdf5', color: '#059669' };
      case 'Processing':
        return { bgcolor: '#fffbeb', color: '#d97706' };
      case 'Shipped':
        return { bgcolor: '#e0f2fe', color: '#0369a1' };
      case 'Pending':
        return { bgcolor: '#fef3c7', color: '#92400e' };
      case 'Cancelled':
        return { bgcolor: '#fee2e2', color: '#dc2626' };
      default:
        return { bgcolor: '#f3f4f6', color: '#374151' };
    }
  };

  const getOrderTypeColor = (orderType) => {
    switch (orderType) {
      case 'wholesale':
        return { bgcolor: '#fffbeb', color: '#d97706', icon: <Business fontSize="small" /> };
      case 'retail':
        return { bgcolor: '#e0f2fe', color: '#0369a1', icon: <Storefront fontSize="small" /> };
      default:
        return { bgcolor: '#f3f4f6', color: '#374151', icon: null };
    }
  };

  const isWholesaleOrder = (order) => {
    return order.orderType === 'wholesale' && order.itemsCount >= order.moq;
  };

  return (
    <Card sx={{ 
      borderRadius: '12px', 
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      marginTop: '24px'
    }}>
      <CardContent sx={{ padding: 0 }}>
        {/* Header */}
        <Box sx={{ 
          padding: '16px', 
          borderBottom: '1px solid', 
          borderColor: 'grey.100',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
            Recent Orders
          </Typography>
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
            Export Orders
          </Button>
        </Box>

        {/* Orders Table */}
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Order Id</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Order Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Items Count</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>MOQ</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Wholesale Discount</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>User Id</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Order Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => {
                  const orderTypeInfo = getOrderTypeColor(order.orderType);
                  const isWholesale = isWholesaleOrder(order);
                  
                  return (
                    <TableRow key={order.id} hover>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                          {order.id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {order.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                          {order.phone}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px', maxWidth: '200px' }}>
                        <Typography variant="body2" sx={{ color: 'grey.600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.address}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isWholesale ? '#dc2626' : 'success.main' }}>
                            {order.totalAmount}
                          </Typography>
                          {isWholesale && (
                            <Typography variant="caption" sx={{ color: '#059669' }}>
                              Wholesale Price
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Chip
                          icon={orderTypeInfo.icon}
                          label={order.orderType}
                          size="small"
                          sx={{ 
                            backgroundColor: orderTypeInfo.bgcolor,
                            color: orderTypeInfo.color,
                            fontWeight: 500,
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {order.itemsCount}
                          </Typography>
                          {isWholesale && (
                            <Chip
                              label="MOQ Met"
                              size="small"
                              sx={{ 
                                backgroundColor: '#ecfdf5',
                                color: '#059669',
                                fontSize: '0.7rem',
                                height: '20px'
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                          {order.moq}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: order.wholesaleDiscount !== '$0.00' ? '#059669' : 'grey.500'
                          }}
                        >
                          {order.wholesaleDiscount}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                          {order.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                          {order.userId}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{ 
                            backgroundColor: getStatusColor(order.status).bgcolor,
                            color: getStatusColor(order.status).color,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                          {order.date}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: '12px 16px' }}>
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleMenuOpen(e, order)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
            Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, orders.length)} of {orders.length} orders
          </Typography>
          <TablePagination
            component="div"
            count={orders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{ flex: '0 1 auto', padding: 0 }}
          />
        </Box>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleViewDetails(selectedOrder)}>
            <Visibility sx={{ mr: 1, fontSize: '18px', color: 'primary.main' }} />
            View Details
          </MenuItem>
          <MenuItem onClick={() => handleEditOrder(selectedOrder)}>
            <Edit sx={{ mr: 1, fontSize: '18px', color: 'success.main' }} />
            Edit Order
          </MenuItem>
          <MenuItem onClick={() => handleUpdateStatus(selectedOrder)}>
            <LocalShipping sx={{ mr: 1, fontSize: '18px', color: 'info.main' }} />
            Update Status
          </MenuItem>
          <MenuItem onClick={() => handleDeleteOrder(selectedOrder)}>
            <Delete sx={{ mr: 1, fontSize: '18px', color: 'error.main' }} />
            Delete Order
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;











































// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   TablePagination
// } from '@mui/material';
// import {
//   MoreVert,
//   Business,
//   Storefront
// } from '@mui/icons-material';

// const RecentOrders = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Sample orders data with wholesale/retail information
//   const orders = [
//     {
//       id: '68bee019228db479bbf37e63',
//       name: 'John Doe',
//       phone: '+1 (555) 123-4567',
//       address: '123 Main St, New York, NY',
//       totalAmount: '$156.00',
//       email: 'john.doe@email.com',
//       userId: 'USR-1001',
//       status: 'Completed',
//       date: '2025-09-08',
//       orderType: 'wholesale',
//       itemsCount: 15,
//       moq: 10,
//       wholesaleDiscount: '$45.60'
//     },
//     {
//       id: '68bee019228db479bbf37e64',
//       name: 'Jane Smith',
//       phone: '+1 (555) 987-6543',
//       address: '456 Oak Ave, Los Angeles, CA',
//       totalAmount: '$89.50',
//       email: 'jane.smith@email.com',
//       userId: 'USR-1002',
//       status: 'Processing',
//       date: '2025-09-07',
//       orderType: 'retail',
//       itemsCount: 3,
//       moq: 5,
//       wholesaleDiscount: '$0.00'
//     },
//     {
//       id: '68bee019228db479bbf37e65',
//       name: 'Mike Johnson',
//       phone: '+1 (555) 456-7890',
//       address: '789 Pine Rd, Chicago, IL',
//       totalAmount: '$234.75',
//       email: 'mike.j@email.com',
//       userId: 'USR-1003',
//       status: 'Shipped',
//       date: '2025-09-06',
//       orderType: 'wholesale',
//       itemsCount: 25,
//       moq: 10,
//       wholesaleDiscount: '$78.25'
//     },
//     {
//       id: '68bee019228db479bbf37e66',
//       name: 'Sarah Wilson',
//       phone: '+1 (555) 321-0987',
//       address: '321 Elm St, Miami, FL',
//       totalAmount: '$67.25',
//       email: 'sarah.w@email.com',
//       userId: 'USR-1004',
//       status: 'Pending',
//       date: '2025-09-05',
//       orderType: 'retail',
//       itemsCount: 2,
//       moq: 5,
//       wholesaleDiscount: '$0.00'
//     },
//     {
//       id: 'ORD-005',
//       name: 'David Brown',
//       phone: '+1 (555) 654-3210',
//       address: '654 Maple Dr, Seattle, WA',
//       totalAmount: '$189.99',
//       email: 'david.b@email.com',
//       userId: 'USR-1005',
//       status: 'Cancelled',
//       date: '2025-09-04',
//       orderType: 'wholesale',
//       itemsCount: 12,
//       moq: 8,
//       wholesaleDiscount: '$36.00'
//     },
//     {
//       id: 'ORD-006',
//       name: 'Emily Davis',
//       phone: '+1 (555) 789-0123',
//       address: '987 Cedar Ln, Boston, MA',
//       totalAmount: '$312.40',
//       email: 'emily.d@email.com',
//       userId: 'USR-1006',
//       status: 'Completed',
//       date: '2025-09-03',
//       orderType: 'retail',
//       itemsCount: 4,
//       moq: 6,
//       wholesaleDiscount: '$0.00'
//     },
//     {
//       id: 'ORD-007',
//       name: 'Robert Lee',
//       phone: '+1 (555) 234-5678',
//       address: '234 Birch St, Austin, TX',
//       totalAmount: '$145.60',
//       email: 'robert.l@email.com',
//       userId: 'USR-1007',
//       status: 'Processing',
//       date: '2025-09-02',
//       orderType: 'wholesale',
//       itemsCount: 18,
//       moq: 10,
//       wholesaleDiscount: '$52.40'
//     },
//     {
//       id: 'ORD-008',
//       name: 'Lisa Garcia',
//       phone: '+1 (555) 876-5432',
//       address: '876 Walnut Ave, Denver, CO',
//       totalAmount: '$278.35',
//       email: 'lisa.g@email.com',
//       userId: 'USR-1008',
//       status: 'Shipped',
//       date: '2025-09-01',
//       orderType: 'wholesale',
//       itemsCount: 22,
//       moq: 15,
//       wholesaleDiscount: '$67.65'
//     },
//     {
//       id: 'ORD-009',
//       name: 'James Wilson',
//       phone: '+1 (555) 345-6789',
//       address: '345 Spruce Rd, Phoenix, AZ',
//       totalAmount: '$98.75',
//       email: 'james.w@email.com',
//       userId: 'USR-1009',
//       status: 'Completed',
//       date: '2025-08-31',
//       orderType: 'retail',
//       itemsCount: 1,
//       moq: 3,
//       wholesaleDiscount: '$0.00'
//     },
//     {
//       id: 'ORD-010',
//       name: 'Maria Martinez',
//       phone: '+1 (555) 765-4321',
//       address: '765 Palm St, San Diego, CA',
//       totalAmount: '$421.80',
//       email: 'maria.m@email.com',
//       userId: 'USR-1010',
//       status: 'Pending',
//       date: '2025-08-30',
//       orderType: 'wholesale',
//       itemsCount: 30,
//       moq: 20,
//       wholesaleDiscount: '$128.20'
//     }
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Completed':
//         return { bgcolor: '#ecfdf5', color: '#059669' };
//       case 'Processing':
//         return { bgcolor: '#fffbeb', color: '#d97706' };
//       case 'Shipped':
//         return { bgcolor: '#e0f2fe', color: '#0369a1' };
//       case 'Pending':
//         return { bgcolor: '#fef3c7', color: '#92400e' };
//       case 'Cancelled':
//         return { bgcolor: '#fee2e2', color: '#dc2626' };
//       default:
//         return { bgcolor: '#f3f4f6', color: '#374151' };
//     }
//   };

//   const getOrderTypeColor = (orderType) => {
//     switch (orderType) {
//       case 'wholesale':
//         return { bgcolor: '#fffbeb', color: '#d97706', icon: <Business fontSize="small" /> };
//       case 'retail':
//         return { bgcolor: '#e0f2fe', color: '#0369a1', icon: <Storefront fontSize="small" /> };
//       default:
//         return { bgcolor: '#f3f4f6', color: '#374151', icon: null };
//     }
//   };

//   const isWholesaleOrder = (order) => {
//     return order.orderType === 'wholesale' && order.itemsCount >= order.moq;
//   };

//   return (
//     <Card sx={{ 
//       borderRadius: '12px', 
//       boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//       marginTop: '24px'
//     }}>
//       <CardContent sx={{ padding: 0 }}>
//         {/* Header */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderBottom: '1px solid', 
//           borderColor: 'grey.100' 
//         }}>
//           <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
//             Recent Orders
//           </Typography>
//         </Box>

//         {/* Orders Table */}
//         <Box sx={{ width: '100%', overflowX: 'auto' }}>
//           <TableContainer component={Paper} elevation={0}>
//             <Table sx={{ minWidth: 1200 }}>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: 'grey.50' }}>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Order Id</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Name</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Phone Number</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Address</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Total Amount</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Order Type</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Items Count</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>MOQ</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Wholesale Discount</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Email</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>User Id</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Order Status</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Date</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => {
//                   const orderTypeInfo = getOrderTypeColor(order.orderType);
//                   const isWholesale = isWholesaleOrder(order);
                  
//                   return (
//                     <TableRow key={order.id} hover>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
//                           {order.id}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                           {order.name}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                           {order.phone}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px', maxWidth: '200px' }}>
//                         <Typography variant="body2" sx={{ color: 'grey.600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                           {order.address}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <Box>
//                           <Typography variant="body2" sx={{ fontWeight: 600, color: isWholesale ? '#dc2626' : 'success.main' }}>
//                             {order.totalAmount}
//                           </Typography>
//                           {isWholesale && (
//                             <Typography variant="caption" sx={{ color: '#059669' }}>
//                               Wholesale Price
//                             </Typography>
//                           )}
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <Chip
//                           icon={orderTypeInfo.icon}
//                           label={order.orderType}
//                           size="small"
//                           sx={{ 
//                             backgroundColor: orderTypeInfo.bgcolor,
//                             color: orderTypeInfo.color,
//                             fontWeight: 500,
//                             textTransform: 'capitalize'
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                             {order.itemsCount}
//                           </Typography>
//                           {isWholesale && (
//                             <Chip
//                               label="MOQ Met"
//                               size="small"
//                               sx={{ 
//                                 backgroundColor: '#ecfdf5',
//                                 color: '#059669',
//                                 fontSize: '0.7rem',
//                                 height: '20px'
//                               }}
//                             />
//                           )}
//                         </Box>
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                           {order.moq}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <Typography 
//                           variant="body2" 
//                           sx={{ 
//                             fontWeight: 600, 
//                             color: order.wholesaleDiscount !== '$0.00' ? '#059669' : 'grey.500'
//                           }}
//                         >
//                           {order.wholesaleDiscount}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                           {order.email}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                           {order.userId}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <Chip
//                           label={order.status}
//                           size="small"
//                           sx={{ 
//                             backgroundColor: getStatusColor(order.status).bgcolor,
//                             color: getStatusColor(order.status).color,
//                             fontWeight: 500
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                           {order.date}
//                         </Typography>
//                       </TableCell>
//                       <TableCell sx={{ padding: '12px 16px' }}>
//                         <IconButton size="small">
//                           <MoreVert />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
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
//             Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, orders.length)} of {orders.length} orders
//           </Typography>
//           <TablePagination
//             component="div"
//             count={orders.length}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             rowsPerPageOptions={[5, 10, 25]}
//             sx={{ flex: '0 1 auto', padding: 0 }}
//           />
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default RecentOrders;


















// import React, { useState } from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   TablePagination
// } from '@mui/material';
// import {
//   MoreVert
// } from '@mui/icons-material';

// const RecentOrders = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Sample orders data
//   const orders = [
//     {
//       id: '68bee019228db479bbf37e63	',
//       name: 'John Doe',
//       phone: '+1 (555) 123-4567',
//       address: '123 Main St, New York, NY',
//       totalAmount: '$156.00',
//       email: 'john.doe@email.com',
//       userId: 'USR-1001',
//       status: 'Completed',
//       date: '2025-09-08'
//     },
//     {
//       id: '68bee019228db479bbf37e63	',
//       name: 'Jane Smith',
//       phone: '+1 (555) 987-6543',
//       address: '456 Oak Ave, Los Angeles, CA',
//       totalAmount: '$89.50',
//       email: 'jane.smith@email.com',
//       userId: 'USR-1002',
//       status: 'Processing',
//       date: '2025-09-07'
//     },
//     {
//       id: '68bee019228db479bbf37e63	',
//       name: 'Mike Johnson',
//       phone: '+1 (555) 456-7890',
//       address: '789 Pine Rd, Chicago, IL',
//       totalAmount: '$234.75',
//       email: 'mike.j@email.com',
//       userId: 'USR-1003',
//       status: 'Shipped',
//       date: '2025-09-06'
//     },
//     {
//       id: '68bee019228db479bbf37e63	',
//       name: 'Sarah Wilson',
//       phone: '+1 (555) 321-0987',
//       address: '321 Elm St, Miami, FL',
//       totalAmount: '$67.25',
//       email: 'sarah.w@email.com',
//       userId: 'USR-1004',
//       status: 'Pending',
//       date: '2025-09-05'
//     },
//     {
//       id: 'ORD-005',
//       name: 'David Brown',
//       phone: '+1 (555) 654-3210',
//       address: '654 Maple Dr, Seattle, WA',
//       totalAmount: '$189.99',
//       email: 'david.b@email.com',
//       userId: 'USR-1005',
//       status: 'Cancelled',
//       date: '2025-09-04'
//     },
//     {
//       id: 'ORD-006',
//       name: 'Emily Davis',
//       phone: '+1 (555) 789-0123',
//       address: '987 Cedar Ln, Boston, MA',
//       totalAmount: '$312.40',
//       email: 'emily.d@email.com',
//       userId: 'USR-1006',
//       status: 'Completed',
//       date: '2025-09-03'
//     },
//     {
//       id: 'ORD-007',
//       name: 'Robert Lee',
//       phone: '+1 (555) 234-5678',
//       address: '234 Birch St, Austin, TX',
//       totalAmount: '$145.60',
//       email: 'robert.l@email.com',
//       userId: 'USR-1007',
//       status: 'Processing',
//       date: '2025-09-02'
//     },
//     {
//       id: 'ORD-008',
//       name: 'Lisa Garcia',
//       phone: '+1 (555) 876-5432',
//       address: '876 Walnut Ave, Denver, CO',
//       totalAmount: '$278.35',
//       email: 'lisa.g@email.com',
//       userId: 'USR-1008',
//       status: 'Shipped',
//       date: '2025-09-01'
//     },
//     {
//       id: 'ORD-009',
//       name: 'James Wilson',
//       phone: '+1 (555) 345-6789',
//       address: '345 Spruce Rd, Phoenix, AZ',
//       totalAmount: '$98.75',
//       email: 'james.w@email.com',
//       userId: 'USR-1009',
//       status: 'Completed',
//       date: '2025-08-31'
//     },
//     {
//       id: 'ORD-010',
//       name: 'Maria Martinez',
//       phone: '+1 (555) 765-4321',
//       address: '765 Palm St, San Diego, CA',
//       totalAmount: '$421.80',
//       email: 'maria.m@email.com',
//       userId: 'USR-1010',
//       status: 'Pending',
//       date: '2025-08-30'
//     }
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Completed':
//         return { bgcolor: '#ecfdf5', color: '#059669' };
//       case 'Processing':
//         return { bgcolor: '#fffbeb', color: '#d97706' };
//       case 'Shipped':
//         return { bgcolor: '#e0f2fe', color: '#0369a1' };
//       case 'Pending':
//         return { bgcolor: '#fef3c7', color: '#92400e' };
//       case 'Cancelled':
//         return { bgcolor: '#fee2e2', color: '#dc2626' };
//       default:
//         return { bgcolor: '#f3f4f6', color: '#374151' };
//     }
//   };

//   return (
//     <Card sx={{ 
//       borderRadius: '12px', 
//       boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
//       marginTop: '24px'
//     }}>
//       <CardContent sx={{ padding: 0 }}>
//         {/* Header */}
//         <Box sx={{ 
//           padding: '16px', 
//           borderBottom: '1px solid', 
//           borderColor: 'grey.100' 
//         }}>
//           <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.800' }}>
//             Recent Orders
//           </Typography>
//         </Box>

//         {/* Orders Table */}
//         <Box sx={{ width: '100%', overflowX: 'auto' }}>
//           <TableContainer component={Paper} elevation={0}>
//             <Table sx={{ minWidth: 1000 }}>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: 'grey.50' }}>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Order Id</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Name</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Phone Number</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Address</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Total Amount</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Email</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>User Id</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Order Status</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Date</TableCell>
//                   <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
//                   <TableRow key={order.id} hover>
//                     <TableCell sx={{ padding: '12px 16px' }}>
//                       <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
//                         {order.id}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ padding: '12px 16px' }}>
//                       <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                         {order.name}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ padding: '12px 16px' }}>
//                       <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                         {order.phone}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ padding: '12px 16px', maxWidth: '200px' }}>
//                       <Typography variant="body2" sx={{ color: 'grey.600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                         {order.address}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ padding: '12px 16px' }}>
//                       <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
//                         {order.totalAmount}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ padding: '12px 16px' }}>
//                       <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                         {order.email}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ padding: '12px 16px' }}>
//                       <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                         {order.userId}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ padding: '12px 16px' }}>
//                       <Chip
//                         label={order.status}
//                         size="small"
//                         sx={{ 
//                           backgroundColor: getStatusColor(order.status).bgcolor,
//                           color: getStatusColor(order.status).color,
//                           fontWeight: 500
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell sx={{ padding: '12px 16px' }}>
//                       <Typography variant="body2" sx={{ color: 'grey.600' }}>
//                         {order.date}
//                       </Typography>
//                     </TableCell>
//                     <TableCell sx={{ padding: '12px 16px' }}>
//                       <IconButton size="small">
//                         <MoreVert />
//                       </IconButton>
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
//             Showing {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, orders.length)} of {orders.length} orders
//           </Typography>
//           <TablePagination
//             component="div"
//             count={orders.length}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             rowsPerPageOptions={[5, 10, 25]}
//             sx={{ flex: '0 1 auto', padding: 0 }}
//           />
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default RecentOrders;
