import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';

const Orders = () => {
  // Sample orders data with enhanced product information
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      paymentMethod: 'Credit Card',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      totalAmount: 249.99,
      email: 'customer1@example.com',
      userId: 'USR-1001',
      status: 'Processing',
      date: '2023-10-15',
      orderType: 'Retail',
      items: [
        { id: 'PROD-1001', name: 'Product A', quantity: 2, price: 49.99, type: 'retail' },
        { id: 'PROD-1002', name: 'Product B', quantity: 1, price: 149.99, type: 'retail' }
      ]
    },
    {
      id: 'ORD-002',
      paymentMethod: 'PayPal',
      phone: '+1 (555) 987-6543',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      totalAmount: 1249.99,
      email: 'customer2@example.com',
      userId: 'USR-1002',
      status: 'Shipped',
      date: '2023-10-14',
      orderType: 'Wholesale',
      items: [
        { id: 'PROD-1003', name: 'Product C', quantity: 50, price: 24.99, type: 'wholesale' }
      ]
    },
    {
      id: 'ORD-003',
      paymentMethod: 'Bank Transfer',
      phone: '+1 (555) 456-7890',
      address: '789 Pine Rd, Chicago, IL 60007',
      totalAmount: 499.99,
      email: 'customer3@example.com',
      userId: 'USR-1003',
      status: 'Delivered',
      date: '2023-10-13',
      orderType: 'Retail',
      items: [
        { id: 'PROD-1004', name: 'Product D', quantity: 5, price: 99.99, type: 'retail' }
      ]
    },
    {
      id: 'ORD-004',
      paymentMethod: 'Credit Card',
      phone: '+1 (555) 234-5678',
      address: '321 Elm St, Miami, FL 33101',
      totalAmount: 899.99,
      email: 'customer4@example.com',
      userId: 'USR-1004',
      status: 'Pending',
      date: '2023-10-12',
      orderType: 'Wholesale',
      items: [
        { id: 'PROD-1005', name: 'Product E', quantity: 20, price: 44.99, type: 'wholesale' }
      ]
    },
    {
      id: 'ORD-005',
      paymentMethod: 'Cash on Delivery',
      phone: '+1 (555) 876-5432',
      address: '654 Maple Dr, Seattle, WA 98101',
      totalAmount: 149.99,
      email: 'customer5@example.com',
      userId: 'USR-1005',
      status: 'Cancelled',
      date: '2023-10-11',
      orderType: 'Retail',
      items: [
        { id: 'PROD-1006', name: 'Product F', quantity: 3, price: 49.99, type: 'retail' }
      ]
    }
  ]);

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Filter orders based on search term and filters
  useEffect(() => {
    let result = orders;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'All') {
      result = result.filter(order => order.orderType === typeFilter);
    }
    
    setFilteredOrders(result);
  }, [searchTerm, statusFilter, typeFilter, orders]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredOrders(sortedOrders);
  };

  // Toggle order details expansion
  const toggleExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Start editing order status
  const startEditStatus = (orderId, currentStatus) => {
    setEditingStatus(orderId);
    setNewStatus(currentStatus);
  };

  // Save order status
  const saveStatus = (orderId) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    setEditingStatus(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingStatus(null);
  };

  // Delete order
  const deleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
    }
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get order type badge class
  const getTypeClass = (type) => {
    return type === 'Wholesale' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-teal-100 text-teal-800';
  };

  // Calculate total quantity for an order
  const getTotalQuantity = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders, products, addresses..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
          </select>
          
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Filter className="h-5 w-5 mr-2" />
            More Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    Order ID
                    {sortConfig.key === 'id' && (
                      sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="ml-1 h-4 w-4" /> : 
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('totalAmount')}
                >
                  <div className="flex items-center">
                    Total Amount
                    {sortConfig.key === 'totalAmount' && (
                      sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="ml-1 h-4 w-4" /> : 
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortConfig.key === 'date' && (
                      sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="ml-1 h-4 w-4" /> : 
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">{order.userId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items.map((item, index) => (
                            <div key={index} className="mb-1">
                              {item.name} <span className="text-gray-500">({item.id})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.items.map((item, index) => (
                            <div key={index} className="mb-1">
                              {item.quantity}
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Total: {getTotalQuantity(order.items)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.paymentMethod}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.phone}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {order.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeClass(order.orderType)}`}>
                          {order.orderType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingStatus === order.id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <button 
                              className="text-green-600 hover:text-green-800 transition-colors"
                              onClick={() => saveStatus(order.id)}
                            >
                              Save
                            </button>
                            <button 
                              className="text-gray-600 hover:text-gray-800 transition-colors"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span 
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                              onClick={() => startEditStatus(order.id, order.status)}
                            >
                              {order.status}
                            </span>
                            <button 
                              className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                              onClick={() => startEditStatus(order.id, order.status)}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            onClick={() => toggleExpand(order.id)}
                            title="View Details"
                          >
                            {expandedOrder === order.id ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 transition-colors"
                            onClick={() => deleteOrder(order.id)}
                            title="Delete Order"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            title="Download Invoice"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan="11" className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                              <p className="text-sm text-gray-600">{order.address}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Order Items Details</h4>
                              <div className="text-sm text-gray-600">
                                {order.items.map((item, index) => (
                                  <div key={index} className="mb-3 p-3 bg-gray-100 rounded-md">
                                    <div className="flex justify-between">
                                      <span className="font-medium">{item.name}</span>
                                      <span className="text-gray-500">ID: {item.id}</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                      <span>Quantity: {item.quantity}</span>
                                      <span>Price: ${item.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                      <span>Type: {item.type}</span>
                                      <span className="font-medium">Subtotal: ${(item.quantity * item.price).toFixed(2)}</span>
                                    </div>
                                  </div>
                                ))}
                                <div className="mt-2 font-medium text-right">
                                  Order Total: ${order.totalAmount.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{' '}
                <span className="font-medium">{filteredOrders.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;

















































// import React, { useState, useEffect } from 'react';
// import { Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';

// const Orders = () => {
//   // Sample orders data
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
//         { name: 'Product A', quantity: 2, price: 49.99, type: 'retail' },
//         { name: 'Product B', quantity: 1, price: 149.99, type: 'retail' }
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
//         { name: 'Product C', quantity: 50, price: 24.99, type: 'wholesale' }
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
//         { name: 'Product D', quantity: 5, price: 99.99, type: 'retail' }
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
//         { name: 'Product E', quantity: 20, price: 44.99, type: 'wholesale' }
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
//         { name: 'Product F', quantity: 3, price: 49.99, type: 'retail' }
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
//         order.userId.toLowerCase().includes(searchTerm.toLowerCase())
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
//               placeholder="Search orders..."
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
//                   Payment Method
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact
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
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{order.paymentMethod}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{order.phone}</div>
//                         <div className="text-sm text-gray-500">{order.email}</div>
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
//                               className="border border-gray-300 rounded-md px-2 py-1 text-sm"
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
//                               className="text-green-600 hover:text-green-800"
//                               onClick={() => saveStatus(order.id)}
//                             >
//                               Save
//                             </button>
//                             <button 
//                               className="text-gray-600 hover:text-gray-800"
//                               onClick={cancelEdit}
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="flex items-center">
//                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
//                               {order.status}
//                             </span>
//                             <button 
//                               className="ml-2 text-blue-600 hover:text-blue-800"
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
//                             className="text-blue-600 hover:text-blue-800"
//                             onClick={() => toggleExpand(order.id)}
//                           >
//                             {expandedOrder === order.id ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                           </button>
//                           <button 
//                             className="text-red-600 hover:text-red-800"
//                             onClick={() => deleteOrder(order.id)}
//                           >
//                             <Trash2 className="h-5 w-5" />
//                           </button>
//                           <button className="text-gray-600 hover:text-gray-800">
//                             <Download className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                     {expandedOrder === order.id && (
//                       <tr>
//                         <td colSpan="8" className="px-6 py-4 bg-gray-50">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
//                               <p className="text-sm text-gray-600">{order.address}</p>
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-gray-700 mb-2">Order Items</h4>
//                               <ul className="text-sm text-gray-600">
//                                 {order.items.map((item, index) => (
//                                   <li key={index} className="mb-1">
//                                     {item.quantity} x {item.name} - ${item.price.toFixed(2)} ({item.type})
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
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


