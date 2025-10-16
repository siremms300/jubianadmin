import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Paper
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Download,
  ExpandMore,
  LocalShipping,
  CheckCircle,
  Pending,
  Cancel,
  ShoppingBag,
  Replay,
  Edit,
  Delete,
  Refresh
} from '@mui/icons-material';
import { orderApi } from '../../utils/orderApi';
import { toast } from 'react-toastify';

// Styled components following your client pattern
const OrdersContainer = styled('div')({
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '2rem 1rem',
  fontFamily: 'Arial, sans-serif',
});

const PageHeader = styled('div')({
  marginBottom: '2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '1rem',
  '& h1': {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 0.5rem 0',
  },
  '& p': {
    color: '#6b7280',
    margin: 0,
  },
});

const StatsGrid = styled(Grid)({
  marginBottom: '2rem',
});

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: '#f8fafc',
  '& .stat-value': {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: theme.spacing(1),
  },
  '& .stat-label': {
    color: '#6b7280',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
}));

const FiltersSection = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  marginBottom: '2rem',
  alignItems: 'center',
  padding: '1rem',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
});

const OrderCard = styled(Card)({
  marginBottom: '1.5rem',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
});

const OrderHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '1rem',
  marginBottom: '1rem',
});

const OrderDetailsGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '1rem',
  marginBottom: '1rem',
});

const DetailItem = styled('div')({
  '& h4': {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#6b7280',
    margin: '0 0 0.25rem 0',
    textTransform: 'uppercase',
  },
  '& p': {
    fontSize: '0.95rem',
    color: '#1f2937',
    margin: 0,
  },
});

const StatusChip = styled(Chip)(({ status }) => {
  let color, icon;
  switch (status?.toLowerCase()) {
    case 'delivered':
      color = '#10b981';
      icon = <CheckCircle />;
      break;
    case 'processing':
      color = '#f59e0b';
      icon = <Pending />;
      break;
    case 'shipped':
      color = '#3b82f6';
      icon = <LocalShipping />;
      break;
    case 'cancelled':
      color = '#ef4444';
      icon = <Cancel />;
      break;
    case 'pending':
      color = '#6b7280';
      icon = <Pending />;
      break;
    case 'confirmed':
      color = '#8b5cf6';
      icon = <CheckCircle />;
      break;
    default:
      color = '#6b7280';
      icon = <Pending />;
  }
  return {
    backgroundColor: `${color}15`,
    color: color,
    fontWeight: '600',
    '& .MuiChip-icon': {
      color: color,
    },
  };
});

const ActionButtons = styled('div')({
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'flex-end',
  marginTop: '1rem',
  flexWrap: 'wrap',
});

const EmptyState = styled('div')({
  textAlign: 'center',
  padding: '3rem 1rem',
  color: '#9ca3af',
  '& svg': {
    fontSize: '4rem',
    marginBottom: '1rem',
    color: '#d1d5db',
  },
  '& h3': {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0',
    color: '#6b7280',
  },
  '& p': {
    margin: '0 0 2rem 0',
  },
});

const LoadingSpinner = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '3rem',
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [statusEdit, setStatusEdit] = useState({ orderId: null, newStatus: '' });

  // Fetch orders and stats on component mount
  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  // const fetchOrders = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await orderApi.admin.getAllOrders({
  //       search: searchTerm,
  //       status: statusFilter !== 'all' ? statusFilter : '',
  //       type: typeFilter !== 'all' ? typeFilter : ''
  //     });
      
  //     // Following client pattern - expect { success: true, data: orders }
  //     if (response.success) {
  //       setOrders(response.data || []);
  //     } else {
  //       throw new Error(response.message || 'Failed to load orders');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching orders:', error);
  //     toast.error(error.message || 'Failed to load orders');
  //     setOrders([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchStats = async () => {
  //   try {
  //     const response = await orderApi.admin.getOrderStats();
  //     if (response.success) {
  //       setStats(response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching stats:', error);
  //     // Don't show toast for stats error to avoid clutter
  //   }
  // };



  // In Admin Orders component - using the new pattern
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.admin.getOrders({
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : '',
        type: typeFilter !== 'all' ? typeFilter : ''
      });
      
      // Following the same pattern as products
      if (response.success) {
        setOrders(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await orderApi.admin.getOrderStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };


  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      const response = await orderApi.admin.updateOrderStatus(orderId, newStatus);
      
      if (response.success) {
        // Update local state
        const updatedOrders = orders.map(order => 
          order._id === orderId ? { ...order, order_status: newStatus } : order
        );
        setOrders(updatedOrders);
        toast.success('Order status updated successfully');
        setStatusEdit({ orderId: null, newStatus: '' });
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openDeleteDialog = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      setDeletingOrder(orderToDelete);
      const response = await orderApi.admin.deleteOrder(orderToDelete);
      
      if (response.success) {
        // Remove from local state
        const updatedOrders = orders.filter(order => order._id !== orderToDelete);
        setOrders(updatedOrders);
        toast.success('Order deleted successfully');
        closeDeleteDialog();
        // Refresh stats after deletion
        fetchStats();
      } else {
        throw new Error(response.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error(error.message || 'Failed to delete order');
    } finally {
      setDeletingOrder(null);
    }
  };

  const startStatusEdit = (orderId, currentStatus) => {
    setStatusEdit({ orderId, newStatus: currentStatus });
  };

  const cancelStatusEdit = () => {
    setStatusEdit({ orderId: null, newStatus: '' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm ? 
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.delivery_address?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter;
    
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'wholesale' && order.items?.some(item => item.pricingTier === 'wholesale')) ||
      (typeFilter === 'retail' && order.items?.every(item => item.pricingTier === 'retail'));
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading && orders.length === 0) {
    return (
      <OrdersContainer>
        <LoadingSpinner>
          <CircularProgress />
        </LoadingSpinner>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <PageHeader>
        <div>
          <h1>Orders Management</h1>
          <p>Manage and track all customer orders</p>
        </div>
        <Button 
          variant="contained" 
          startIcon={<Refresh />}
          onClick={() => {
            fetchOrders();
            fetchStats();
          }}
          disabled={loading}
          sx={{ backgroundColor: '#ef7921', '&:hover': { backgroundColor: '#e06b15' } }}
        >
          Refresh
        </Button>
      </PageHeader>

      {/* Stats Section */}
      {stats && (
        <StatsGrid container spacing={3}>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard>
              <div className="stat-value">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard>
              <div className="stat-value" style={{ color: '#ef4444' }}>{stats.pendingOrders}</div>
              <div className="stat-label">Pending</div>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard>
              <div className="stat-value" style={{ color: '#10b981' }}>{stats.deliveredOrders}</div>
              <div className="stat-label">Delivered</div>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard>
              <div className="stat-value" style={{ color: '#8b5cf6' }}>{stats.wholesaleOrders}</div>
              <div className="stat-label">Wholesale</div>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard>
              <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.todayOrders}</div>
              <div className="stat-label">Today</div>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <StatCard>
              <div className="stat-value" style={{ color: '#3b82f6' }}>{formatCurrency(stats.totalRevenue)}</div>
              <div className="stat-label">Revenue</div>
            </StatCard>
          </Grid>
        </StatsGrid>
      )}

      {/* Filters Section */}
      <FiltersSection>
        <TextField
          placeholder="Search by order ID, email, or product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ minWidth: '300px' }}
        />
        
        <FormControl size="small" sx={{ minWidth: '150px' }}>
          <InputLabel>Order Status</InputLabel>
          <Select
            value={statusFilter}
            label="Order Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: '120px' }}>
          <InputLabel>Order Type</InputLabel>
          <Select
            value={typeFilter}
            label="Order Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="retail">Retail</MenuItem>
            <MenuItem value="wholesale">Wholesale</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setTypeFilter('all');
          }}
        >
          Clear Filters
        </Button>
      </FiltersSection>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <OrderCard key={order._id}>
            <CardContent>
              <OrderHeader>
                <div>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Order #{order.orderId}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Placed on {formatDate(order.createdAt)} by {order.userId?.name || 'N/A'} ({order.userId?.email || 'No email'})
                  </Typography>
                </div>
                
                {/* Status Section with Edit */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {statusEdit.orderId === order._id ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FormControl size="small">
                        <Select
                          value={statusEdit.newStatus}
                          onChange={(e) => setStatusEdit(prev => ({ ...prev, newStatus: e.target.value }))}
                          sx={{ minWidth: '120px' }}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="confirmed">Confirmed</MenuItem>
                          <MenuItem value="processing">Processing</MenuItem>
                          <MenuItem value="shipped">Shipped</MenuItem>
                          <MenuItem value="delivered">Delivered</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={() => handleUpdateStatus(order._id, statusEdit.newStatus)}
                        disabled={updatingStatus === order._id}
                      >
                        {updatingStatus === order._id ? <CircularProgress size={16} /> : 'Save'}
                      </Button>
                      <Button size="small" onClick={cancelStatusEdit}>
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <StatusChip 
                        icon={order.order_status === 'delivered' ? <CheckCircle /> : 
                              order.order_status === 'shipped' ? <LocalShipping /> : 
                              order.order_status === 'cancelled' ? <Cancel /> : <Pending />}
                        label={getStatusDisplay(order.order_status)} 
                        status={order.order_status} 
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => startStatusEdit(order._id, order.order_status)}
                        title="Edit Status"
                      >
                        <Edit />
                      </IconButton>
                    </>
                  )}
                </Box>
              </OrderHeader>

              <OrderDetailsGrid>
                <DetailItem>
                  <h4>Total Amount</h4>
                  <p>{formatCurrency(order.total)}</p>
                </DetailItem>
                <DetailItem>
                  <h4>Payment Method</h4>
                  <p>
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 
                     order.payment_method === 'card' ? 'Credit/Debit Card' : 
                     order.payment_method === 'paypal' ? 'PayPal' : 
                     order.payment_method || 'N/A'}
                  </p>
                </DetailItem>
                <DetailItem>
                  <h4>Contact</h4>
                  <p>{order.delivery_address?.phone || 'N/A'}</p>
                </DetailItem>
                <DetailItem>
                  <h4>Order Type</h4>
                  <p>
                    {order.items?.some(item => item.pricingTier === 'wholesale') ? 'Wholesale' : 'Retail'}
                  </p>
                </DetailItem>
              </OrderDetailsGrid>

              {/* Rest of the component remains similar to client side but with admin actions */}
              <ActionButtons>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  startIcon={<ExpandMore sx={{ 
                    transform: expandedOrder === order._id ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }} />}
                >
                  {expandedOrder === order._id ? 'Hide' : 'View'} Details
                </Button>
                
                <Button 
                  variant="outlined" 
                  size="small"
                  color="error"
                  onClick={() => openDeleteDialog(order._id)}
                  disabled={deletingOrder === order._id}
                  startIcon={deletingOrder === order._id ? <CircularProgress size={16} /> : <Delete />}
                >
                  {deletingOrder === order._id ? 'Deleting...' : 'Delete'}
                </Button>
              </ActionButtons>

              {/* Expanded Order Details */}
              {expandedOrder === order._id && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                  {/* Same order details as client side */}
                  {order.delivery_address && (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Shipping Address
                        </Typography>
                        <Typography variant="body2">
                          {order.delivery_address.address_line}<br />
                          {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.pincode}<br />
                          {order.delivery_address.country}<br />
                          Phone: {order.delivery_address.mobile}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                    </>
                  )}
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Order Items
                  </Typography>
                  {order.items?.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {item.quantity} x {item.name}
                        {item.pricingTier === 'wholesale' && ' (Wholesale)'}
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  ))}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2">{formatCurrency(order.subtotal)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Shipping:</Typography>
                    <Typography variant="body2">
                      {order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}
                    </Typography>
                  </Box>
                  {order.totalSavings > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="success.main">
                        Wholesale Savings:
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        -{formatCurrency(order.totalSavings)}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                    <Typography variant="body1">Total:</Typography>
                    <Typography variant="body1">{formatCurrency(order.total)}</Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </OrderCard>
        ))
      ) : (
        <EmptyState>
          <ShoppingBag />
          <h3>No orders found</h3>
          <p>
            {orders.length === 0 
              ? "No orders have been placed yet." 
              : "No orders match your search criteria."}
          </p>
        </EmptyState>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this order? This action cannot be undone and will permanently remove all order data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Keep Order</Button>
          <Button 
            onClick={handleDeleteOrder} 
            color="error"
            variant="contained"
            disabled={deletingOrder}
          >
            {deletingOrder ? 'Deleting...' : 'Yes, Delete Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </OrdersContainer>
  );
};

export default Orders;



















































// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp,
//   MoreVertical, User, Mail, Phone, MapPin, Calendar, ShoppingBag, RefreshCw
// } from 'lucide-react';
// import { orderApi } from '../../utils/orderApi'; // Import your order API
// import { toast } from 'react-toastify';

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [typeFilter, setTypeFilter] = useState('All');
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [editingStatus, setEditingStatus] = useState(null);
//   const [newStatus, setNewStatus] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [updatingStatus, setUpdatingStatus] = useState(false);
//   const actionButtonRefs = useRef({});

//   // Fetch orders from backend
//   // const fetchOrders = async () => {
//   //   try {
//   //     setLoading(true);
//   //     // You'll need to create an admin endpoint for all orders
//   //     const response = await orderApi.admin.getAllOrders({
//   //       search: searchTerm,
//   //       status: statusFilter !== 'All' ? statusFilter.toLowerCase() : '',
//   //       type: typeFilter !== 'All' ? typeFilter.toLowerCase() : ''
//   //     });
//   //     setOrders(response.data || []);
//   //     setFilteredOrders(response.data || []);
//   //   } catch (error) {
//   //     console.error('Error fetching orders:', error);
//   //     toast.error(error.message || 'Failed to load orders');
//   //     setOrders([]);
//   //     setFilteredOrders([]);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // Initial data fetch
  
//   // In Orders.js component - Fix data handling
// const fetchOrders = async () => {
//   try {
//     setLoading(true);
//     const response = await orderApi.admin.getAllOrders({
//       search: searchTerm,
//       status: statusFilter !== 'All' ? statusFilter.toLowerCase() : '',
//       type: typeFilter !== 'All' ? typeFilter.toLowerCase() : ''
//     });
    
//     // FIXED: Handle the response format correctly
//     if (response.success) {
//       setOrders(response.data || []);
//       setFilteredOrders(response.data || []);
//     } else {
//       throw new Error(response.message || 'Failed to load orders');
//     }
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     toast.error(error.message || 'Failed to load orders');
//     setOrders([]);
//     setFilteredOrders([]);
//   } finally {
//     setLoading(false);
//   }
// };
  
  
  
  
//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Filter orders based on search term and filters
//   useEffect(() => {
//     let result = orders;
    
//     // Apply search filter
//     if (searchTerm) {
//       result = result.filter(order => 
//         order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.delivery_address?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.items.some(item => 
//           item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.productId?._id?.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }
    
//     // Apply status filter
//     if (statusFilter !== 'All') {
//       result = result.filter(order => order.order_status === statusFilter.toLowerCase());
//     }
    
//     // Apply type filter - check if any item is wholesale
//     if (typeFilter !== 'All') {
//       if (typeFilter === 'Wholesale') {
//         result = result.filter(order => 
//           order.items.some(item => item.pricingTier === 'wholesale')
//         );
//       } else {
//         result = result.filter(order => 
//           order.items.every(item => item.pricingTier === 'retail')
//         );
//       }
//     }
    
//     setFilteredOrders(result);
//   }, [searchTerm, statusFilter, typeFilter, orders]);

//   // Handle sorting
//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
    
//     const sortedOrders = [...filteredOrders].sort((a, b) => {
//       let aValue = a[key];
//       let bValue = b[key];
      
//       // Handle date sorting
//       if (key === 'createdAt' || key === 'updatedAt') {
//         aValue = new Date(aValue || 0);
//         bValue = new Date(bValue || 0);
//       }
      
//       // Handle nested object sorting
//       if (key === 'total') {
//         aValue = a.total;
//         bValue = b.total;
//       }
      
//       if (aValue < bValue) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (aValue > bValue) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });
    
//     setFilteredOrders(sortedOrders);
//   };

//   // Toggle order details expansion
//   const toggleExpand = (orderId) => {
//     if (expandedOrder === orderId) {
//       setExpandedOrder(null);
//     } else {
//       setExpandedOrder(orderId);
//     }
//   };

//   // Start editing order status
//   const startEditStatus = (orderId, currentStatus) => {
//     setEditingStatus(orderId);
//     setNewStatus(currentStatus);
//   };

//   // Save order status
//   const saveStatus = async (orderId) => {
//     try {
//       setUpdatingStatus(true);
//       await orderApi.admin.updateOrderStatus(orderId, newStatus);
      
//       // Update local state
//       const updatedOrders = orders.map(order => {
//         if (order._id === orderId) {
//           return { ...order, order_status: newStatus };
//         }
//         return order;
//       });
      
//       setOrders(updatedOrders);
//       setEditingStatus(null);
//       toast.success('Order status updated successfully');
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       toast.error(error.message || 'Failed to update order status');
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     setEditingStatus(null);
//   };

//   // Delete order
//   const deleteOrder = async (orderId) => {
//     if (window.confirm('Are you sure you want to delete this order?')) {
//       try {
//         await orderApi.admin.deleteOrder(orderId);
//         const updatedOrders = orders.filter(order => order._id !== orderId);
//         setOrders(updatedOrders);
//         setFilteredOrders(updatedOrders);
//         toast.success('Order deleted successfully');
//       } catch (error) {
//         console.error('Error deleting order:', error);
//         toast.error(error.message || 'Failed to delete order');
//       }
//     }
//   };

//   // Get status badge class
//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'confirmed': return 'bg-blue-100 text-blue-800';
//       case 'processing': return 'bg-indigo-100 text-indigo-800';
//       case 'shipped': return 'bg-purple-100 text-purple-800';
//       case 'delivered': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Get order type badge class
//   const getTypeClass = (order) => {
//     const hasWholesale = order.items.some(item => item.pricingTier === 'wholesale');
//     return hasWholesale 
//       ? 'bg-purple-100 text-purple-800' 
//       : 'bg-teal-100 text-teal-800';
//   };

//   // Calculate total quantity for an order
//   const getTotalQuantity = (items) => {
//     return items.reduce((total, item) => total + item.quantity, 0);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   // Format status for display
//   const formatStatus = (status) => {
//     return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
//   };

//   // Format payment method for display
//   const formatPaymentMethod = (method) => {
//     const methodMap = {
//       'cod': 'Cash on Delivery',
//       'card': 'Credit Card',
//       'paypal': 'PayPal',
//       'bank_transfer': 'Bank Transfer'
//     };
//     return methodMap[method] || method;
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const headers = ['Order ID', 'Customer Email', 'Phone', 'Total Amount', 'Order Type', 'Status', 'Payment Method', 'Payment Status', 'Date', 'Items Count'];
//     const csvContent = [
//       headers.join(','),
//       ...filteredOrders.map(order => [
//         order.orderId,
//         `"${order.userId?.email || 'No email'}"`,
//         order.delivery_address?.phone || 'N/A',
//         order.total?.toFixed(2) || '0.00',
//         order.items.some(item => item.pricingTier === 'wholesale') ? 'Wholesale' : 'Retail',
//         formatStatus(order.order_status),
//         formatPaymentMethod(order.payment_method),
//         order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : 'Pending',
//         formatDate(order.createdAt),
//         order.items?.length || 0
//       ].join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
    
//     link.setAttribute('href', url);
//     link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = 'hidden';
    
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Loading state
//   if (loading && orders.length === 0) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600" />
//           <p className="mt-2 text-gray-600">Loading orders...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
//         <p className="text-gray-600">Manage and track all customer orders</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-blue-100 p-3 mr-4">
//               <ShoppingBag className="h-6 w-6 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Total Orders</p>
//               <p className="text-2xl font-bold">{orders.length}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-green-100 p-3 mr-4">
//               <ShoppingBag className="h-6 w-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Completed</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {orders.filter(o => o.order_status === 'delivered').length}
//               </p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-purple-100 p-3 mr-4">
//               <ShoppingBag className="h-6 w-6 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Wholesale</p>
//               <p className="text-2xl font-bold">
//                 {orders.filter(o => o.items.some(item => item.pricingTier === 'wholesale')).length}
//               </p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-indigo-100 p-3 mr-4">
//               <ShoppingBag className="h-6 w-6 text-indigo-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Pending</p>
//               <p className="text-2xl font-bold">
//                 {orders.filter(o => o.order_status === 'pending').length}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-lg shadow p-4 mb-6">
//         <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
//           <div className="flex flex-col md:flex-row gap-4 flex-1">
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search orders, products, emails..."
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             <select
//               className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="All">All Statuses</option>
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
            
//             <select
//               className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={typeFilter}
//               onChange={(e) => setTypeFilter(e.target.value)}
//             >
//               <option value="All">All Types</option>
//               <option value="Retail">Retail</option>
//               <option value="Wholesale">Wholesale</option>
//             </select>
//           </div>
          
//           <div className="flex gap-2">
//             <button 
//               className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
//               onClick={fetchOrders}
//               disabled={loading}
//             >
//               <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//             <button 
//               className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               onClick={exportToCSV}
//               disabled={filteredOrders.length === 0}
//             >
//               <Download className="h-5 w-5 mr-2" />
//               Export CSV
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('orderId')}
//                 >
//                   <div className="flex items-center">
//                     Order ID
//                     {sortConfig.key === 'orderId' && (
//                       sortConfig.direction === 'ascending' ? 
//                       <ChevronUp className="ml-1 h-4 w-4" /> : 
//                       <ChevronDown className="ml-1 h-4 w-4" />
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Products
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Payment
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('total')}
//                 >
//                   <div className="flex items-center">
//                     Total Amount
//                     {sortConfig.key === 'total' && (
//                       sortConfig.direction === 'ascending' ? 
//                       <ChevronUp className="ml-1 h-4 w-4" /> : 
//                       <ChevronDown className="ml-1 h-4 w-4" />
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Order Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('createdAt')}
//                 >
//                   <div className="flex items-center">
//                     Date
//                     {sortConfig.key === 'createdAt' && (
//                       sortConfig.direction === 'ascending' ? 
//                       <ChevronUp className="ml-1 h-4 w-4" /> : 
//                       <ChevronDown className="ml-1 h-4 w-4" />
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredOrders.length > 0 ? (
//                 filteredOrders.map((order) => (
//                   <React.Fragment key={order._id}>
//                     <tr className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
//                         <div className="text-sm text-gray-500">Items: {order.items?.length || 0}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{order.userId?.name || 'N/A'}</div>
//                         <div className="text-sm text-gray-500">{order.userId?.email || 'No email'}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900 max-w-xs">
//                           {order.items?.slice(0, 2).map((item, index) => (
//                             <div key={index} className="mb-1 truncate">
//                               {item.name} × {item.quantity}
//                             </div>
//                           ))}
//                           {order.items?.length > 2 && (
//                             <div className="text-xs text-gray-500">
//                               +{order.items.length - 2} more items
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{formatPaymentMethod(order.payment_method)}</div>
//                         <div className={`text-xs ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
//                           {order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : 'Pending'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">{order.delivery_address?.phone || 'N/A'}</div>
//                         <div className="text-sm text-gray-500 truncate max-w-xs">
//                           {order.delivery_address?.address || 'No address'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           ${order.total?.toFixed(2) || '0.00'}
//                         </div>
//                         {order.totalSavings > 0 && (
//                           <div className="text-xs text-green-600">
//                             Saved: ${order.totalSavings.toFixed(2)}
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeClass(order)}`}>
//                           {order.items.some(item => item.pricingTier === 'wholesale') ? 'Wholesale' : 'Retail'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {editingStatus === order._id ? (
//                           <div className="flex items-center space-x-2">
//                             <select
//                               className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                               value={newStatus}
//                               onChange={(e) => setNewStatus(e.target.value)}
//                             >
//                               <option value="pending">Pending</option>
//                               <option value="confirmed">Confirmed</option>
//                               <option value="processing">Processing</option>
//                               <option value="shipped">Shipped</option>
//                               <option value="delivered">Delivered</option>
//                               <option value="cancelled">Cancelled</option>
//                             </select>
//                             <button 
//                               className="text-green-600 hover:text-green-800 transition-colors"
//                               onClick={() => saveStatus(order._id)}
//                               disabled={updatingStatus}
//                             >
//                               {updatingStatus ? 'Saving...' : 'Save'}
//                             </button>
//                             <button 
//                               className="text-gray-600 hover:text-gray-800 transition-colors"
//                               onClick={cancelEdit}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="flex items-center">
//                             <span 
//                               className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.order_status)} cursor-pointer hover:opacity-80 transition-opacity`}
//                               onClick={() => startEditStatus(order._id, order.order_status)}
//                             >
//                               {formatStatus(order.order_status)}
//                             </span>
//                             <button 
//                               className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
//                               onClick={() => startEditStatus(order._id, order.order_status)}
//                             >
//                               <Edit className="h-4 w-4" />
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button 
//                             className="text-blue-600 hover:text-blue-800 transition-colors"
//                             onClick={() => toggleExpand(order._id)}
//                             title="View Details"
//                           >
//                             {expandedOrder === order._id ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                           </button>
//                           <button 
//                             className="text-red-600 hover:text-red-800 transition-colors"
//                             onClick={() => deleteOrder(order._id)}
//                             title="Delete Order"
//                           >
//                             <Trash2 className="h-5 w-5" />
//                           </button>
//                           <button 
//                             className="text-gray-600 hover:text-gray-800 transition-colors"
//                             title="Download Invoice"
//                           >
//                             <Download className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                     {expandedOrder === order._id && (
//                       <tr>
//                         <td colSpan="10" className="px-6 py-4 bg-gray-50">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                               <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
//                               <div className="text-sm text-gray-600 space-y-1">
//                                 <div><strong>Name:</strong> {order.delivery_address?.name || 'N/A'}</div>
//                                 <div><strong>Phone:</strong> {order.delivery_address?.phone || 'N/A'}</div>
//                                 <div><strong>Address:</strong> {order.delivery_address?.address || 'No address'}</div>
//                                 <div><strong>City:</strong> {order.delivery_address?.city || 'N/A'}</div>
//                                 <div><strong>State:</strong> {order.delivery_address?.state || 'N/A'}</div>
//                                 <div><strong>Postal Code:</strong> {order.delivery_address?.postalCode || 'N/A'}</div>
//                               </div>
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-gray-700 mb-2">Order Items Details</h4>
//                               <div className="text-sm text-gray-600 space-y-2">
//                                 {order.items?.map((item, index) => (
//                                   <div key={index} className="p-3 bg-gray-100 rounded-md">
//                                     <div className="flex justify-between items-start">
//                                       <div>
//                                         <div className="font-medium">{item.name}</div>
//                                         <div className="text-gray-500 text-xs">ID: {item.productId?._id || 'N/A'}</div>
//                                       </div>
//                                       <span className={`px-2 py-1 text-xs rounded-full ${
//                                         item.pricingTier === 'wholesale' ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800'
//                                       }`}>
//                                         {item.pricingTier}
//                                       </span>
//                                     </div>
//                                     <div className="flex justify-between mt-2">
//                                       <span>Quantity: {item.quantity}</span>
//                                       <span>Price: ${item.price?.toFixed(2)}</span>
//                                     </div>
//                                     <div className="text-right mt-1 font-medium">
//                                       Subtotal: ${(item.quantity * item.price)?.toFixed(2)}
//                                     </div>
//                                   </div>
//                                 ))}
//                                 <div className="mt-3 p-3 bg-white border rounded-md">
//                                   <div className="flex justify-between">
//                                     <span>Subtotal:</span>
//                                     <span>${order.subtotal?.toFixed(2)}</span>
//                                   </div>
//                                   <div className="flex justify-between">
//                                     <span>Shipping:</span>
//                                     <span>${order.shipping?.toFixed(2)}</span>
//                                   </div>
//                                   {order.totalSavings > 0 && (
//                                     <div className="flex justify-between text-green-600">
//                                       <span>Savings:</span>
//                                       <span>-${order.totalSavings?.toFixed(2)}</span>
//                                     </div>
//                                   )}
//                                   <div className="flex justify-between font-bold border-t mt-2 pt-2">
//                                     <span>Total:</span>
//                                     <span>${order.total?.toFixed(2)}</span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="10" className="px-6 py-8 text-center">
//                     <div className="text-gray-500">
//                       <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                       <p className="text-lg font-medium">No orders found</p>
//                       <p className="text-sm">Try adjusting your search or filters</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Orders;




































// import React, { useState, useEffect } from 'react';
// import { Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';

// const Orders = () => {
//   // Sample orders data with enhanced product information
//   const [orders, setOrders] = useState([
//     {
//       id: 'ORD-001',
//       paymentMethod: 'Credit Card',
//       phone: '+1 (555) 123-4567',
//       address: '123 Main St, New York, NY 10001',
//       totalAmount: 249.99,
//       email: 'customer1@example.com',
//       userId: 'USR-1001',
//       status: 'Processing',
//       date: '2023-10-15',
//       orderType: 'Retail',
//       items: [
//         { id: 'PROD-1001', name: 'Product A', quantity: 2, price: 49.99, type: 'retail' },
//         { id: 'PROD-1002', name: 'Product B', quantity: 1, price: 149.99, type: 'retail' }
//       ]
//     },
//     {
//       id: 'ORD-002',
//       paymentMethod: 'PayPal',
//       phone: '+1 (555) 987-6543',
//       address: '456 Oak Ave, Los Angeles, CA 90001',
//       totalAmount: 1249.99,
//       email: 'customer2@example.com',
//       userId: 'USR-1002',
//       status: 'Shipped',
//       date: '2023-10-14',
//       orderType: 'Wholesale',
//       items: [
//         { id: 'PROD-1003', name: 'Product C', quantity: 50, price: 24.99, type: 'wholesale' }
//       ]
//     },
//     {
//       id: 'ORD-003',
//       paymentMethod: 'Bank Transfer',
//       phone: '+1 (555) 456-7890',
//       address: '789 Pine Rd, Chicago, IL 60007',
//       totalAmount: 499.99,
//       email: 'customer3@example.com',
//       userId: 'USR-1003',
//       status: 'Delivered',
//       date: '2023-10-13',
//       orderType: 'Retail',
//       items: [
//         { id: 'PROD-1004', name: 'Product D', quantity: 5, price: 99.99, type: 'retail' }
//       ]
//     },
//     {
//       id: 'ORD-004',
//       paymentMethod: 'Credit Card',
//       phone: '+1 (555) 234-5678',
//       address: '321 Elm St, Miami, FL 33101',
//       totalAmount: 899.99,
//       email: 'customer4@example.com',
//       userId: 'USR-1004',
//       status: 'Pending',
//       date: '2023-10-12',
//       orderType: 'Wholesale',
//       items: [
//         { id: 'PROD-1005', name: 'Product E', quantity: 20, price: 44.99, type: 'wholesale' }
//       ]
//     },
//     {
//       id: 'ORD-005',
//       paymentMethod: 'Cash on Delivery',
//       phone: '+1 (555) 876-5432',
//       address: '654 Maple Dr, Seattle, WA 98101',
//       totalAmount: 149.99,
//       email: 'customer5@example.com',
//       userId: 'USR-1005',
//       status: 'Cancelled',
//       date: '2023-10-11',
//       orderType: 'Retail',
//       items: [
//         { id: 'PROD-1006', name: 'Product F', quantity: 3, price: 49.99, type: 'retail' }
//       ]
//     }
//   ]);

//   const [filteredOrders, setFilteredOrders] = useState(orders);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [typeFilter, setTypeFilter] = useState('All');
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [editingStatus, setEditingStatus] = useState(null);
//   const [newStatus, setNewStatus] = useState('');

//   // Filter orders based on search term and filters
//   useEffect(() => {
//     let result = orders;
    
//     // Apply search filter
//     if (searchTerm) {
//       result = result.filter(order => 
//         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         order.items.some(item => 
//           item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.id.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }
    
//     // Apply status filter
//     if (statusFilter !== 'All') {
//       result = result.filter(order => order.status === statusFilter);
//     }
    
//     // Apply type filter
//     if (typeFilter !== 'All') {
//       result = result.filter(order => order.orderType === typeFilter);
//     }
    
//     setFilteredOrders(result);
//   }, [searchTerm, statusFilter, typeFilter, orders]);

//   // Handle sorting
//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
    
//     const sortedOrders = [...filteredOrders].sort((a, b) => {
//       if (a[key] < b[key]) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (a[key] > b[key]) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });
    
//     setFilteredOrders(sortedOrders);
//   };

//   // Toggle order details expansion
//   const toggleExpand = (orderId) => {
//     if (expandedOrder === orderId) {
//       setExpandedOrder(null);
//     } else {
//       setExpandedOrder(orderId);
//     }
//   };

//   // Start editing order status
//   const startEditStatus = (orderId, currentStatus) => {
//     setEditingStatus(orderId);
//     setNewStatus(currentStatus);
//   };

//   // Save order status
//   const saveStatus = (orderId) => {
//     const updatedOrders = orders.map(order => {
//       if (order.id === orderId) {
//         return { ...order, status: newStatus };
//       }
//       return order;
//     });
    
//     setOrders(updatedOrders);
//     setEditingStatus(null);
//   };

//   // Cancel editing
//   const cancelEdit = () => {
//     setEditingStatus(null);
//   };

//   // Delete order
//   const deleteOrder = (orderId) => {
//     if (window.confirm('Are you sure you want to delete this order?')) {
//       const updatedOrders = orders.filter(order => order.id !== orderId);
//       setOrders(updatedOrders);
//     }
//   };

//   // Get status badge class
//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'Pending': return 'bg-yellow-100 text-yellow-800';
//       case 'Processing': return 'bg-blue-100 text-blue-800';
//       case 'Shipped': return 'bg-indigo-100 text-indigo-800';
//       case 'Delivered': return 'bg-green-100 text-green-800';
//       case 'Cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Get order type badge class
//   const getTypeClass = (type) => {
//     return type === 'Wholesale' 
//       ? 'bg-purple-100 text-purple-800' 
//       : 'bg-teal-100 text-teal-800';
//   };

//   // Calculate total quantity for an order
//   const getTotalQuantity = (items) => {
//     return items.reduce((total, item) => total + item.quantity, 0);
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
//         <p className="text-gray-600">Manage and track all customer orders</p>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-lg shadow p-4 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search orders, products, addresses..."
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
          
//           <select
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="All">All Statuses</option>
//             <option value="Pending">Pending</option>
//             <option value="Processing">Processing</option>
//             <option value="Shipped">Shipped</option>
//             <option value="Delivered">Delivered</option>
//             <option value="Cancelled">Cancelled</option>
//           </select>
          
//           <select
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={typeFilter}
//             onChange={(e) => setTypeFilter(e.target.value)}
//           >
//             <option value="All">All Types</option>
//             <option value="Retail">Retail</option>
//             <option value="Wholesale">Wholesale</option>
//           </select>
          
//           <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
//             <Filter className="h-5 w-5 mr-2" />
//             More Filters
//           </button>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('id')}
//                 >
//                   <div className="flex items-center">
//                     Order ID
//                     {sortConfig.key === 'id' && (
//                       sortConfig.direction === 'ascending' ? 
//                       <ChevronUp className="ml-1 h-4 w-4" /> : 
//                       <ChevronDown className="ml-1 h-4 w-4" />
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Products
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Quantity
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Payment Method
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Address
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('totalAmount')}
//                 >
//                   <div className="flex items-center">
//                     Total Amount
//                     {sortConfig.key === 'totalAmount' && (
//                       sortConfig.direction === 'ascending' ? 
//                       <ChevronUp className="ml-1 h-4 w-4" /> : 
//                       <ChevronDown className="ml-1 h-4 w-4" />
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Order Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('date')}
//                 >
//                   <div className="flex items-center">
//                     Date
//                     {sortConfig.key === 'date' && (
//                       sortConfig.direction === 'ascending' ? 
//                       <ChevronUp className="ml-1 h-4 w-4" /> : 
//                       <ChevronDown className="ml-1 h-4 w-4" />
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredOrders.length > 0 ? (
//                 filteredOrders.map((order) => (
//                   <React.Fragment key={order.id}>
//                     <tr className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{order.id}</div>
//                         <div className="text-sm text-gray-500">{order.userId}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">
//                           {order.items.map((item, index) => (
//                             <div key={index} className="mb-1">
//                               {item.name} <span className="text-gray-500">({item.id})</span>
//                             </div>
//                           ))}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {order.items.map((item, index) => (
//                             <div key={index} className="mb-1">
//                               {item.quantity}
//                             </div>
//                           ))}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           Total: {getTotalQuantity(order.items)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{order.paymentMethod}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">{order.phone}</div>
//                         <div className="text-sm text-gray-500">{order.email}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-600 max-w-xs truncate">
//                           {order.address}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           ${order.totalAmount.toFixed(2)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeClass(order.orderType)}`}>
//                           {order.orderType}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {editingStatus === order.id ? (
//                           <div className="flex items-center space-x-2">
//                             <select
//                               className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                               value={newStatus}
//                               onChange={(e) => setNewStatus(e.target.value)}
//                             >
//                               <option value="Pending">Pending</option>
//                               <option value="Processing">Processing</option>
//                               <option value="Shipped">Shipped</option>
//                               <option value="Delivered">Delivered</option>
//                               <option value="Cancelled">Cancelled</option>
//                             </select>
//                             <button 
//                               className="text-green-600 hover:text-green-800 transition-colors"
//                               onClick={() => saveStatus(order.id)}
//                             >
//                               Save
//                             </button>
//                             <button 
//                               className="text-gray-600 hover:text-gray-800 transition-colors"
//                               onClick={cancelEdit}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="flex items-center">
//                             <span 
//                               className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)} cursor-pointer hover:opacity-80 transition-opacity`}
//                               onClick={() => startEditStatus(order.id, order.status)}
//                             >
//                               {order.status}
//                             </span>
//                             <button 
//                               className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
//                               onClick={() => startEditStatus(order.id, order.status)}
//                             >
//                               <Edit className="h-4 w-4" />
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{order.date}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button 
//                             className="text-blue-600 hover:text-blue-800 transition-colors"
//                             onClick={() => toggleExpand(order.id)}
//                             title="View Details"
//                           >
//                             {expandedOrder === order.id ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                           </button>
//                           <button 
//                             className="text-red-600 hover:text-red-800 transition-colors"
//                             onClick={() => deleteOrder(order.id)}
//                             title="Delete Order"
//                           >
//                             <Trash2 className="h-5 w-5" />
//                           </button>
//                           <button 
//                             className="text-gray-600 hover:text-gray-800 transition-colors"
//                             title="Download Invoice"
//                           >
//                             <Download className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                     {expandedOrder === order.id && (
//                       <tr>
//                         <td colSpan="11" className="px-6 py-4 bg-gray-50">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                               <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
//                               <p className="text-sm text-gray-600">{order.address}</p>
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-gray-700 mb-2">Order Items Details</h4>
//                               <div className="text-sm text-gray-600">
//                                 {order.items.map((item, index) => (
//                                   <div key={index} className="mb-3 p-3 bg-gray-100 rounded-md">
//                                     <div className="flex justify-between">
//                                       <span className="font-medium">{item.name}</span>
//                                       <span className="text-gray-500">ID: {item.id}</span>
//                                     </div>
//                                     <div className="flex justify-between mt-1">
//                                       <span>Quantity: {item.quantity}</span>
//                                       <span>Price: ${item.price.toFixed(2)}</span>
//                                     </div>
//                                     <div className="flex justify-between mt-1">
//                                       <span>Type: {item.type}</span>
//                                       <span className="font-medium">Subtotal: ${(item.quantity * item.price).toFixed(2)}</span>
//                                     </div>
//                                   </div>
//                                 ))}
//                                 <div className="mt-2 font-medium text-right">
//                                   Order Total: ${order.totalAmount.toFixed(2)}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="11" className="px-6 py-4 text-center text-sm text-gray-500">
//                     No orders found matching your criteria.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
        
//         {/* Pagination */}
//         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm text-gray-700">
//                 Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
//                 <span className="font-medium">{filteredOrders.length}</span> results
//               </p>
//             </div>
//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                   Previous
//                 </a>
//                 <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
//                   1
//                 </a>
//                 <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                   Next
//                 </a>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Orders;

















































// // import React, { useState, useEffect } from 'react';
// // import { Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';

// // const Orders = () => {
// //   // Sample orders data
// //   const [orders, setOrders] = useState([
// //     {
// //       id: 'ORD-001',
// //       paymentMethod: 'Credit Card',
// //       phone: '+1 (555) 123-4567',
// //       address: '123 Main St, New York, NY 10001',
// //       totalAmount: 249.99,
// //       email: 'customer1@example.com',
// //       userId: 'USR-1001',
// //       status: 'Processing',
// //       date: '2023-10-15',
// //       orderType: 'Retail',
// //       items: [
// //         { name: 'Product A', quantity: 2, price: 49.99, type: 'retail' },
// //         { name: 'Product B', quantity: 1, price: 149.99, type: 'retail' }
// //       ]
// //     },
// //     {
// //       id: 'ORD-002',
// //       paymentMethod: 'PayPal',
// //       phone: '+1 (555) 987-6543',
// //       address: '456 Oak Ave, Los Angeles, CA 90001',
// //       totalAmount: 1249.99,
// //       email: 'customer2@example.com',
// //       userId: 'USR-1002',
// //       status: 'Shipped',
// //       date: '2023-10-14',
// //       orderType: 'Wholesale',
// //       items: [
// //         { name: 'Product C', quantity: 50, price: 24.99, type: 'wholesale' }
// //       ]
// //     },
// //     {
// //       id: 'ORD-003',
// //       paymentMethod: 'Bank Transfer',
// //       phone: '+1 (555) 456-7890',
// //       address: '789 Pine Rd, Chicago, IL 60007',
// //       totalAmount: 499.99,
// //       email: 'customer3@example.com',
// //       userId: 'USR-1003',
// //       status: 'Delivered',
// //       date: '2023-10-13',
// //       orderType: 'Retail',
// //       items: [
// //         { name: 'Product D', quantity: 5, price: 99.99, type: 'retail' }
// //       ]
// //     },
// //     {
// //       id: 'ORD-004',
// //       paymentMethod: 'Credit Card',
// //       phone: '+1 (555) 234-5678',
// //       address: '321 Elm St, Miami, FL 33101',
// //       totalAmount: 899.99,
// //       email: 'customer4@example.com',
// //       userId: 'USR-1004',
// //       status: 'Pending',
// //       date: '2023-10-12',
// //       orderType: 'Wholesale',
// //       items: [
// //         { name: 'Product E', quantity: 20, price: 44.99, type: 'wholesale' }
// //       ]
// //     },
// //     {
// //       id: 'ORD-005',
// //       paymentMethod: 'Cash on Delivery',
// //       phone: '+1 (555) 876-5432',
// //       address: '654 Maple Dr, Seattle, WA 98101',
// //       totalAmount: 149.99,
// //       email: 'customer5@example.com',
// //       userId: 'USR-1005',
// //       status: 'Cancelled',
// //       date: '2023-10-11',
// //       orderType: 'Retail',
// //       items: [
// //         { name: 'Product F', quantity: 3, price: 49.99, type: 'retail' }
// //       ]
// //     }
// //   ]);

// //   const [filteredOrders, setFilteredOrders] = useState(orders);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [statusFilter, setStatusFilter] = useState('All');
// //   const [typeFilter, setTypeFilter] = useState('All');
// //   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
// //   const [expandedOrder, setExpandedOrder] = useState(null);
// //   const [editingStatus, setEditingStatus] = useState(null);
// //   const [newStatus, setNewStatus] = useState('');

// //   // Filter orders based on search term and filters
// //   useEffect(() => {
// //     let result = orders;
    
// //     // Apply search filter
// //     if (searchTerm) {
// //       result = result.filter(order => 
// //         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         order.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         order.userId.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //     }
    
// //     // Apply status filter
// //     if (statusFilter !== 'All') {
// //       result = result.filter(order => order.status === statusFilter);
// //     }
    
// //     // Apply type filter
// //     if (typeFilter !== 'All') {
// //       result = result.filter(order => order.orderType === typeFilter);
// //     }
    
// //     setFilteredOrders(result);
// //   }, [searchTerm, statusFilter, typeFilter, orders]);

// //   // Handle sorting
// //   const handleSort = (key) => {
// //     let direction = 'ascending';
// //     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
// //       direction = 'descending';
// //     }
// //     setSortConfig({ key, direction });
    
// //     const sortedOrders = [...filteredOrders].sort((a, b) => {
// //       if (a[key] < b[key]) {
// //         return direction === 'ascending' ? -1 : 1;
// //       }
// //       if (a[key] > b[key]) {
// //         return direction === 'ascending' ? 1 : -1;
// //       }
// //       return 0;
// //     });
    
// //     setFilteredOrders(sortedOrders);
// //   };

// //   // Toggle order details expansion
// //   const toggleExpand = (orderId) => {
// //     if (expandedOrder === orderId) {
// //       setExpandedOrder(null);
// //     } else {
// //       setExpandedOrder(orderId);
// //     }
// //   };

// //   // Start editing order status
// //   const startEditStatus = (orderId, currentStatus) => {
// //     setEditingStatus(orderId);
// //     setNewStatus(currentStatus);
// //   };

// //   // Save order status
// //   const saveStatus = (orderId) => {
// //     const updatedOrders = orders.map(order => {
// //       if (order.id === orderId) {
// //         return { ...order, status: newStatus };
// //       }
// //       return order;
// //     });
    
// //     setOrders(updatedOrders);
// //     setEditingStatus(null);
// //   };

// //   // Cancel editing
// //   const cancelEdit = () => {
// //     setEditingStatus(null);
// //   };

// //   // Delete order
// //   const deleteOrder = (orderId) => {
// //     if (window.confirm('Are you sure you want to delete this order?')) {
// //       const updatedOrders = orders.filter(order => order.id !== orderId);
// //       setOrders(updatedOrders);
// //     }
// //   };

// //   // Get status badge class
// //   const getStatusClass = (status) => {
// //     switch (status) {
// //       case 'Pending': return 'bg-yellow-100 text-yellow-800';
// //       case 'Processing': return 'bg-blue-100 text-blue-800';
// //       case 'Shipped': return 'bg-indigo-100 text-indigo-800';
// //       case 'Delivered': return 'bg-green-100 text-green-800';
// //       case 'Cancelled': return 'bg-red-100 text-red-800';
// //       default: return 'bg-gray-100 text-gray-800';
// //     }
// //   };

// //   // Get order type badge class
// //   const getTypeClass = (type) => {
// //     return type === 'Wholesale' 
// //       ? 'bg-purple-100 text-purple-800' 
// //       : 'bg-teal-100 text-teal-800';
// //   };

// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
// //       <div className="mb-6">
// //         <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
// //         <p className="text-gray-600">Manage and track all customer orders</p>
// //       </div>

// //       {/* Filters and Search */}
// //       <div className="bg-white rounded-lg shadow p-4 mb-6">
// //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //           <div className="relative">
// //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //               <Search className="h-5 w-5 text-gray-400" />
// //             </div>
// //             <input
// //               type="text"
// //               placeholder="Search orders..."
// //               className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //           </div>
          
// //           <select
// //             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             value={statusFilter}
// //             onChange={(e) => setStatusFilter(e.target.value)}
// //           >
// //             <option value="All">All Statuses</option>
// //             <option value="Pending">Pending</option>
// //             <option value="Processing">Processing</option>
// //             <option value="Shipped">Shipped</option>
// //             <option value="Delivered">Delivered</option>
// //             <option value="Cancelled">Cancelled</option>
// //           </select>
          
// //           <select
// //             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             value={typeFilter}
// //             onChange={(e) => setTypeFilter(e.target.value)}
// //           >
// //             <option value="All">All Types</option>
// //             <option value="Retail">Retail</option>
// //             <option value="Wholesale">Wholesale</option>
// //           </select>
          
// //           <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
// //             <Filter className="h-5 w-5 mr-2" />
// //             More Filters
// //           </button>
// //         </div>
// //       </div>

// //       {/* Orders Table */}
// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th 
// //                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
// //                   onClick={() => handleSort('id')}
// //                 >
// //                   <div className="flex items-center">
// //                     Order ID
// //                     {sortConfig.key === 'id' && (
// //                       sortConfig.direction === 'ascending' ? 
// //                       <ChevronUp className="ml-1 h-4 w-4" /> : 
// //                       <ChevronDown className="ml-1 h-4 w-4" />
// //                     )}
// //                   </div>
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Payment Method
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Contact
// //                 </th>
// //                 <th 
// //                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
// //                   onClick={() => handleSort('totalAmount')}
// //                 >
// //                   <div className="flex items-center">
// //                     Total Amount
// //                     {sortConfig.key === 'totalAmount' && (
// //                       sortConfig.direction === 'ascending' ? 
// //                       <ChevronUp className="ml-1 h-4 w-4" /> : 
// //                       <ChevronDown className="ml-1 h-4 w-4" />
// //                     )}
// //                   </div>
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Order Type
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Status
// //                 </th>
// //                 <th 
// //                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
// //                   onClick={() => handleSort('date')}
// //                 >
// //                   <div className="flex items-center">
// //                     Date
// //                     {sortConfig.key === 'date' && (
// //                       sortConfig.direction === 'ascending' ? 
// //                       <ChevronUp className="ml-1 h-4 w-4" /> : 
// //                       <ChevronDown className="ml-1 h-4 w-4" />
// //                     )}
// //                   </div>
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Actions
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {filteredOrders.length > 0 ? (
// //                 filteredOrders.map((order) => (
// //                   <React.Fragment key={order.id}>
// //                     <tr className="hover:bg-gray-50">
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm font-medium text-gray-900">{order.id}</div>
// //                         <div className="text-sm text-gray-500">{order.userId}</div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-900">{order.paymentMethod}</div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-900">{order.phone}</div>
// //                         <div className="text-sm text-gray-500">{order.email}</div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm font-medium text-gray-900">
// //                           ${order.totalAmount.toFixed(2)}
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeClass(order.orderType)}`}>
// //                           {order.orderType}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         {editingStatus === order.id ? (
// //                           <div className="flex items-center space-x-2">
// //                             <select
// //                               className="border border-gray-300 rounded-md px-2 py-1 text-sm"
// //                               value={newStatus}
// //                               onChange={(e) => setNewStatus(e.target.value)}
// //                             >
// //                               <option value="Pending">Pending</option>
// //                               <option value="Processing">Processing</option>
// //                               <option value="Shipped">Shipped</option>
// //                               <option value="Delivered">Delivered</option>
// //                               <option value="Cancelled">Cancelled</option>
// //                             </select>
// //                             <button 
// //                               className="text-green-600 hover:text-green-800"
// //                               onClick={() => saveStatus(order.id)}
// //                             >
// //                               Save
// //                             </button>
// //                             <button 
// //                               className="text-gray-600 hover:text-gray-800"
// //                               onClick={cancelEdit}
// //                             >
// //                               Cancel
// //                             </button>
// //                           </div>
// //                         ) : (
// //                           <div className="flex items-center">
// //                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
// //                               {order.status}
// //                             </span>
// //                             <button 
// //                               className="ml-2 text-blue-600 hover:text-blue-800"
// //                               onClick={() => startEditStatus(order.id, order.status)}
// //                             >
// //                               <Edit className="h-4 w-4" />
// //                             </button>
// //                           </div>
// //                         )}
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-900">{order.date}</div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// //                         <div className="flex items-center space-x-2">
// //                           <button 
// //                             className="text-blue-600 hover:text-blue-800"
// //                             onClick={() => toggleExpand(order.id)}
// //                           >
// //                             {expandedOrder === order.id ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
// //                           </button>
// //                           <button 
// //                             className="text-red-600 hover:text-red-800"
// //                             onClick={() => deleteOrder(order.id)}
// //                           >
// //                             <Trash2 className="h-5 w-5" />
// //                           </button>
// //                           <button className="text-gray-600 hover:text-gray-800">
// //                             <Download className="h-5 w-5" />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                     {expandedOrder === order.id && (
// //                       <tr>
// //                         <td colSpan="8" className="px-6 py-4 bg-gray-50">
// //                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                             <div>
// //                               <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
// //                               <p className="text-sm text-gray-600">{order.address}</p>
// //                             </div>
// //                             <div>
// //                               <h4 className="font-medium text-gray-700 mb-2">Order Items</h4>
// //                               <ul className="text-sm text-gray-600">
// //                                 {order.items.map((item, index) => (
// //                                   <li key={index} className="mb-1">
// //                                     {item.quantity} x {item.name} - ${item.price.toFixed(2)} ({item.type})
// //                                   </li>
// //                                 ))}
// //                               </ul>
// //                             </div>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     )}
// //                   </React.Fragment>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
// //                     No orders found matching your criteria.
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
        
// //         {/* Pagination */}
// //         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
// //           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
// //             <div>
// //               <p className="text-sm text-gray-700">
// //                 Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
// //                 <span className="font-medium">{filteredOrders.length}</span> results
// //               </p>
// //             </div>
// //             <div>
// //               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
// //                 <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
// //                   Previous
// //                 </a>
// //                 <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
// //                   1
// //                 </a>
// //                 <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
// //                   Next
// //                 </a>
// //               </nav>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Orders;


