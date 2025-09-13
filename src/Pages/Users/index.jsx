import React, { useState, useEffect, useRef } from 'react';
import {
  Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp,
  MoreVertical, User, Mail, Phone, MapPin, Calendar, ShoppingBag
} from 'lucide-react';

const Users = () => {
  // Sample user data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      role: 'Customer',
      status: 'Active',
      joinDate: '2023-01-15',
      lastLogin: '2023-10-20',
      orders: 12,
      avatar: 'https://via.placeholder.com/40',
      address: '123 Main St, New York, NY'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      role: 'Admin',
      status: 'Active',
      joinDate: '2022-08-22',
      lastLogin: '2023-10-21',
      orders: 45,
      avatar: 'https://via.placeholder.com/40',
      address: '456 Oak Ave, Los Angeles, CA'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '+1 (555) 456-7890',
      role: 'Customer',
      status: 'Inactive',
      joinDate: '2023-03-10',
      lastLogin: '2023-09-15',
      orders: 3,
      avatar: 'https://via.placeholder.com/40',
      address: '789 Pine Rd, Chicago, IL'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.w@example.com',
      phone: '+1 (555) 234-5678',
      role: 'Customer',
      status: 'Active',
      joinDate: '2022-11-05',
      lastLogin: '2023-10-22',
      orders: 28,
      avatar: 'https://via.placeholder.com/40',
      address: '321 Elm St, Miami, FL'
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      phone: '+1 (555) 876-5432',
      role: 'Customer',
      status: 'Suspended',
      joinDate: '2023-05-18',
      lastLogin: '2023-08-30',
      orders: 7,
      avatar: 'https://via.placeholder.com/40',
      address: '654 Maple Dr, Seattle, WA'
    }
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [expandedUser, setExpandedUser] = useState(null);
  const [actionMenu, setActionMenu] = useState({ open: false, userId: null, position: { top: 0, left: 0 } });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const actionButtonRefs = useRef({});

  // Filter users based on search term and filters
  useEffect(() => {
    let result = users;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // Apply role filter
    if (roleFilter !== 'All') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(result);
  }, [searchTerm, statusFilter, roleFilter, users]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredUsers(sortedUsers);
  };

  // Toggle user details expansion
  const toggleExpand = (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  // Open action menu
  const openActionMenu = (userId) => {
    const buttonElement = actionButtonRefs.current[userId];
    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();
      setActionMenu({
        open: true,
        userId,
        position: {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        }
      });
      setSelectedUser(users.find(user => user.id === userId));
    }
  };

  // Close action menu
  const closeActionMenu = () => {
    setActionMenu({ open: false, userId: null, position: { top: 0, left: 0 } });
    setSelectedUser(null);
  };

  // Toggle user status
  const toggleUserStatus = () => {
    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    );
    setUsers(updatedUsers);
    closeActionMenu();
  };

  // Open delete confirmation
  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  // Delete user
  const deleteUser = () => {
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setDeleteDialogOpen(false);
    closeActionMenu();
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get role badge class
  const getRoleClass = (role) => {
    return role === 'Admin' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Last Login', 'Orders', 'Address'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.id,
        `"${user.name}"`,
        user.email,
        user.phone,
        user.role,
        user.status,
        user.joinDate,
        user.lastLogin,
        user.orders,
        `"${user.address}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'users_export.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenu.open) {
        closeActionMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [actionMenu.open]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
        <p className="text-gray-600">Manage and track all system users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.role === 'Customer').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-indigo-100 p-3 mr-4">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.role === 'Admin').length}
              </p>
            </div>
          </div>
        </div>
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
              placeholder="Search users..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
          
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
          </select>
          
          <button 
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={exportToCSV}
          >
            <Download className="h-5 w-5 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('joinDate')}
                >
                  <div className="flex items-center">
                    Join Date
                    {sortConfig.key === 'joinDate' && (
                      sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="ml-1 h-4 w-4" /> : 
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('orders')}
                >
                  <div className="flex items-center">
                    Orders
                    {sortConfig.key === 'orders' && (
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full mr-3" src={user.avatar} alt={user.name} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.joinDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.lastLogin}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.orders}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            onClick={() => toggleExpand(user.id)}
                            title="View Details"
                          >
                            {expandedUser === user.id ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          <button 
                            ref={el => actionButtonRefs.current[user.id] = el}
                            className="text-gray-600 hover:text-gray-800 transition-colors relative"
                            onClick={() => openActionMenu(user.id)}
                            title="More Actions"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedUser === user.id && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                <User className="h-4 w-4 mr-2" /> User Information
                              </h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-2" /> {user.email}
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-2" /> {user.phone}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" /> {user.address}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" /> Joined: {user.joinDate}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" /> Last Login: {user.lastLogin}
                                </div>
                                <div className="flex items-center">
                                  <ShoppingBag className="h-4 w-4 mr-2" /> Total Orders: {user.orders}
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">User Actions</h4>
                              <div className="flex space-x-2">
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
                                  Edit Profile
                                </button>
                                <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors">
                                  View Orders
                                </button>
                                <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors">
                                  Send Message
                                </button>
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
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found matching your criteria.
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
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

      {/* Action Menu */}
      {actionMenu.open && (
        <div 
          className="absolute bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
          style={{
            top: actionMenu.position.top,
            left: actionMenu.position.left,
            minWidth: '160px'
          }}
        >
          <button 
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              toggleExpand(actionMenu.userId);
              closeActionMenu();
            }}
          >
            <Eye className="h-4 w-4 mr-2" /> View Details
          </button>
          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <Edit className="h-4 w-4 mr-2" /> Edit User
          </button>
          <button 
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={toggleUserStatus}
          >
            {selectedUser.status === 'Active' ? (
              <>
                <User className="h-4 w-4 mr-2" /> Deactivate
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-2" /> Activate
              </>
            )}
          </button>
          <button 
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={openDeleteDialog}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={deleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;































































// import React, { useState, useEffect } from 'react';
// import {
//   Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp,
//   MoreVertical, User, Mail, Phone, MapPin, Calendar, ShoppingBag
// } from 'lucide-react';

// const Users = () => {
//   // Sample user data
//   const [users, setUsers] = useState([
//     {
//       id: 1,
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       phone: '+1 (555) 123-4567',
//       role: 'Customer',
//       status: 'Active',
//       joinDate: '2023-01-15',
//       lastLogin: '2023-10-20',
//       orders: 12,
//       avatar: 'https://via.placeholder.com/40',
//       address: '123 Main St, New York, NY'
//     },
//     {
//       id: 2,
//       name: 'Jane Smith',
//       email: 'jane.smith@example.com',
//       phone: '+1 (555) 987-6543',
//       role: 'Admin',
//       status: 'Active',
//       joinDate: '2022-08-22',
//       lastLogin: '2023-10-21',
//       orders: 45,
//       avatar: 'https://via.placeholder.com/40',
//       address: '456 Oak Ave, Los Angeles, CA'
//     },
//     {
//       id: 3,
//       name: 'Robert Johnson',
//       email: 'robert.j@example.com',
//       phone: '+1 (555) 456-7890',
//       role: 'Customer',
//       status: 'Inactive',
//       joinDate: '2023-03-10',
//       lastLogin: '2023-09-15',
//       orders: 3,
//       avatar: 'https://via.placeholder.com/40',
//       address: '789 Pine Rd, Chicago, IL'
//     },
//     {
//       id: 4,
//       name: 'Sarah Wilson',
//       email: 'sarah.w@example.com',
//       phone: '+1 (555) 234-5678',
//       role: 'Customer',
//       status: 'Active',
//       joinDate: '2022-11-05',
//       lastLogin: '2023-10-22',
//       orders: 28,
//       avatar: 'https://via.placeholder.com/40',
//       address: '321 Elm St, Miami, FL'
//     },
//     {
//       id: 5,
//       name: 'Michael Brown',
//       email: 'michael.b@example.com',
//       phone: '+1 (555) 876-5432',
//       role: 'Customer',
//       status: 'Suspended',
//       joinDate: '2023-05-18',
//       lastLogin: '2023-08-30',
//       orders: 7,
//       avatar: 'https://via.placeholder.com/40',
//       address: '654 Maple Dr, Seattle, WA'
//     }
//   ]);

//   const [filteredUsers, setFilteredUsers] = useState(users);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [roleFilter, setRoleFilter] = useState('All');
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [expandedUser, setExpandedUser] = useState(null);
//   const [actionMenu, setActionMenu] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   // Filter users based on search term and filters
//   useEffect(() => {
//     let result = users;
    
//     // Apply search filter
//     if (searchTerm) {
//       result = result.filter(user => 
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.address.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     // Apply status filter
//     if (statusFilter !== 'All') {
//       result = result.filter(user => user.status === statusFilter);
//     }
    
//     // Apply role filter
//     if (roleFilter !== 'All') {
//       result = result.filter(user => user.role === roleFilter);
//     }
    
//     setFilteredUsers(result);
//   }, [searchTerm, statusFilter, roleFilter, users]);

//   // Handle sorting
//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
    
//     const sortedUsers = [...filteredUsers].sort((a, b) => {
//       if (a[key] < b[key]) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (a[key] > b[key]) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });
    
//     setFilteredUsers(sortedUsers);
//   };

//   // Toggle user details expansion
//   const toggleExpand = (userId) => {
//     if (expandedUser === userId) {
//       setExpandedUser(null);
//     } else {
//       setExpandedUser(userId);
//     }
//   };

//   // Open action menu
//   const openActionMenu = (event, user) => {
//     setActionMenu(event.currentTarget);
//     setSelectedUser(user);
//   };

//   // Close action menu
//   const closeActionMenu = () => {
//     setActionMenu(null);
//     setSelectedUser(null);
//   };

//   // Toggle user status
//   const toggleUserStatus = () => {
//     const updatedUsers = users.map(user =>
//       user.id === selectedUser.id
//         ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
//         : user
//     );
//     setUsers(updatedUsers);
//     closeActionMenu();
//   };

//   // Open delete confirmation
//   const openDeleteDialog = () => {
//     setDeleteDialogOpen(true);
//   };

//   // Delete user
//   const deleteUser = () => {
//     const updatedUsers = users.filter(user => user.id !== selectedUser.id);
//     setUsers(updatedUsers);
//     setDeleteDialogOpen(false);
//     closeActionMenu();
//   };

//   // Get status badge class
//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'Active': return 'bg-green-100 text-green-800';
//       case 'Inactive': return 'bg-gray-100 text-gray-800';
//       case 'Suspended': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Get role badge class
//   const getRoleClass = (role) => {
//     return role === 'Admin' 
//       ? 'bg-purple-100 text-purple-800' 
//       : 'bg-blue-100 text-blue-800';
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Last Login', 'Orders', 'Address'];
//     const csvContent = [
//       headers.join(','),
//       ...filteredUsers.map(user => [
//         user.id,
//         `"${user.name}"`,
//         user.email,
//         user.phone,
//         user.role,
//         user.status,
//         user.joinDate,
//         user.lastLogin,
//         user.orders,
//         `"${user.address}"`
//       ].join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
    
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'users_export.csv');
//     link.style.visibility = 'hidden';
    
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
//         <p className="text-gray-600">Manage and track all system users</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-blue-100 p-3 mr-4">
//               <User className="h-6 w-6 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Total Users</p>
//               <p className="text-2xl font-bold">{users.length}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-green-100 p-3 mr-4">
//               <User className="h-6 w-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Active Users</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {users.filter(u => u.status === 'Active').length}
//               </p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-purple-100 p-3 mr-4">
//               <User className="h-6 w-6 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Customers</p>
//               <p className="text-2xl font-bold">
//                 {users.filter(u => u.role === 'Customer').length}
//               </p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-indigo-100 p-3 mr-4">
//               <User className="h-6 w-6 text-indigo-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Admins</p>
//               <p className="text-2xl font-bold">
//                 {users.filter(u => u.role === 'Admin').length}
//               </p>
//             </div>
//           </div>
//         </div>
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
//               placeholder="Search users..."
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
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//             <option value="Suspended">Suspended</option>
//           </select>
          
//           <select
//             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={roleFilter}
//             onChange={(e) => setRoleFilter(e.target.value)}
//           >
//             <option value="All">All Roles</option>
//             <option value="Admin">Admin</option>
//             <option value="Customer">Customer</option>
//           </select>
          
//           <button 
//             className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//             onClick={exportToCSV}
//           >
//             <Download className="h-5 w-5 mr-2" />
//             Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   User
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('joinDate')}
//                 >
//                   <div className="flex items-center">
//                     Join Date
//                     {sortConfig.key === 'joinDate' && (
//                       sortConfig.direction === 'ascending' ? 
//                       <ChevronUp className="ml-1 h-4 w-4" /> : 
//                       <ChevronDown className="ml-1 h-4 w-4" />
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Last Login
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('orders')}
//                 >
//                   <div className="flex items-center">
//                     Orders
//                     {sortConfig.key === 'orders' && (
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
//               {filteredUsers.length > 0 ? (
//                 filteredUsers.map((user) => (
//                   <React.Fragment key={user.id}>
//                     <tr className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <img className="h-10 w-10 rounded-full mr-3" src={user.avatar} alt={user.name} />
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                             <div className="text-sm text-gray-500">ID: {user.id}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{user.email}</div>
//                         <div className="text-sm text-gray-500">{user.phone}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
//                           {user.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
//                           {user.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{user.joinDate}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{user.lastLogin}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {user.orders}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button 
//                             className="text-blue-600 hover:text-blue-800 transition-colors"
//                             onClick={() => toggleExpand(user.id)}
//                             title="View Details"
//                           >
//                             {expandedUser === user.id ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                           </button>
//                           <button 
//                             className="text-gray-600 hover:text-gray-800 transition-colors"
//                             onClick={(e) => openActionMenu(e, user)}
//                             title="More Actions"
//                           >
//                             <MoreVertical className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                     {expandedUser === user.id && (
//                       <tr>
//                         <td colSpan="8" className="px-6 py-4 bg-gray-50">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                               <h4 className="font-medium text-gray-700 mb-2 flex items-center">
//                                 <User className="h-4 w-4 mr-2" /> User Information
//                               </h4>
//                               <div className="text-sm text-gray-600 space-y-1">
//                                 <div className="flex items-center">
//                                   <Mail className="h-4 w-4 mr-2" /> {user.email}
//                                 </div>
//                                 <div className="flex items-center">
//                                   <Phone className="h-4 w-4 mr-2" /> {user.phone}
//                                 </div>
//                                 <div className="flex items-center">
//                                   <MapPin className="h-4 w-4 mr-2" /> {user.address}
//                                 </div>
//                                 <div className="flex items-center">
//                                   <Calendar className="h-4 w-4 mr-2" /> Joined: {user.joinDate}
//                                 </div>
//                                 <div className="flex items-center">
//                                   <Calendar className="h-4 w-4 mr-2" /> Last Login: {user.lastLogin}
//                                 </div>
//                                 <div className="flex items-center">
//                                   <ShoppingBag className="h-4 w-4 mr-2" /> Total Orders: {user.orders}
//                                 </div>
//                               </div>
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-gray-700 mb-2">User Actions</h4>
//                               <div className="flex space-x-2">
//                                 <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
//                                   Edit Profile
//                                 </button>
//                                 <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors">
//                                   View Orders
//                                 </button>
//                                 <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors">
//                                   Send Message
//                                 </button>
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
//                   <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
//                     No users found matching your criteria.
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
//                 Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
//                 <span className="font-medium">{filteredUsers.length}</span> results
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

//       {/* Action Menu */}
//       {actionMenu && (
//         <div className="fixed inset-0 z-50" onClick={closeActionMenu}>
//           <div 
//             className="absolute bg-white rounded-md shadow-lg py-1 z-50"
//             style={{
//               top: actionMenu.getBoundingClientRect().bottom + window.scrollY,
//               left: actionMenu.getBoundingClientRect().left + window.scrollX,
//               minWidth: '160px'
//             }}
//             onClick={e => e.stopPropagation()}
//           >
//             <button 
//               className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               onClick={() => toggleExpand(selectedUser.id)}
//             >
//               <Eye className="h-4 w-4 mr-2" /> View Details
//             </button>
//             <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//               <Edit className="h-4 w-4 mr-2" /> Edit User
//             </button>
//             <button 
//               className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               onClick={toggleUserStatus}
//             >
//               {selectedUser.status === 'Active' ? (
//                 <>
//                   <User className="h-4 w-4 mr-2" /> Deactivate
//                 </>
//               ) : (
//                 <>
//                   <User className="h-4 w-4 mr-2" /> Activate
//                 </>
//               )}
//             </button>
//             <button 
//               className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//               onClick={openDeleteDialog}
//             >
//               <Trash2 className="h-4 w-4 mr-2" /> Delete
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Dialog */}
//       {deleteDialogOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
//             <p className="text-sm text-gray-600 mb-4">
//               Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone.
//             </p>
//             <div className="flex justify-end space-x-3">
//               <button 
//                 className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
//                 onClick={() => setDeleteDialogOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
//                 onClick={deleteUser}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Users;


























// import React, { useState } from 'react';
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Button,
//   Typography,
//   Chip,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   DialogContentText,
//   TextField,
//   InputAdornment,
//   Menu,
//   MenuItem,
//   Avatar,
//   Card,
//   CardContent,
//   Grid
// } from '@mui/material';
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   MoreVert as MoreVertIcon,
//   Search as SearchIcon,
//   FileDownload as FileDownloadIcon,
//   Visibility as VisibilityIcon,
//   Block as BlockIcon,
//   CheckCircle as CheckCircleIcon
// } from '@mui/icons-material';

// // Sample user data
// const initialUsers = [
//   {
//     id: 1,
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     phone: '+1 (555) 123-4567',
//     role: 'Customer',
//     status: 'Active',
//     joinDate: '2023-01-15',
//     lastLogin: '2023-10-20',
//     orders: 12,
//     avatar: 'https://via.placeholder.com/40',
//     address: '123 Main St, New York, NY'
//   },
//   {
//     id: 2,
//     name: 'Jane Smith',
//     email: 'jane.smith@example.com',
//     phone: '+1 (555) 987-6543',
//     role: 'Admin',
//     status: 'Active',
//     joinDate: '2022-08-22',
//     lastLogin: '2023-10-21',
//     orders: 45,
//     avatar: 'https://via.placeholder.com/40',
//     address: '456 Oak Ave, Los Angeles, CA'
//   },
//   {
//     id: 3,
//     name: 'Robert Johnson',
//     email: 'robert.j@example.com',
//     phone: '+1 (555) 456-7890',
//     role: 'Customer',
//     status: 'Inactive',
//     joinDate: '2023-03-10',
//     lastLogin: '2023-09-15',
//     orders: 3,
//     avatar: 'https://via.placeholder.com/40',
//     address: '789 Pine Rd, Chicago, IL'
//   },
//   {
//     id: 4,
//     name: 'Sarah Wilson',
//     email: 'sarah.w@example.com',
//     phone: '+1 (555) 234-5678',
//     role: 'Customer',
//     status: 'Active',
//     joinDate: '2022-11-05',
//     lastLogin: '2023-10-22',
//     orders: 28,
//     avatar: 'https://via.placeholder.com/40',
//     address: '321 Elm St, Miami, FL'
//   },
//   {
//     id: 5,
//     name: 'Michael Brown',
//     email: 'michael.b@example.com',
//     phone: '+1 (555) 876-5432',
//     role: 'Customer',
//     status: 'Suspended',
//     joinDate: '2023-05-18',
//     lastLogin: '2023-08-30',
//     orders: 7,
//     avatar: 'https://via.placeholder.com/40',
//     address: '654 Maple Dr, Seattle, WA'
//   }
// ];

// const Users = () => {
//   const [users, setUsers] = useState(initialUsers);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [roleFilter, setRoleFilter] = useState('All');
//   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
//   const [selectedUserForMenu, setSelectedUserForMenu] = useState(null);

//   // Filter users based on search term and filters
//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
//     const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
//     return matchesSearch && matchesStatus && matchesRole;
//   });

//   const openDeleteDialog = (user) => {
//     setSelectedUser(user);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteUser = () => {
//     const updatedUsers = users.filter(user => user.id !== selectedUser.id);
//     setUsers(updatedUsers);
//     setDeleteDialogOpen(false);
//     setSelectedUser(null);
//   };

//   const handleActionMenuOpen = (event, user) => {
//     setActionMenuAnchor(event.currentTarget);
//     setSelectedUserForMenu(user);
//   };

//   const handleActionMenuClose = () => {
//     setActionMenuAnchor(null);
//     setSelectedUserForMenu(null);
//   };

//   const toggleUserStatus = () => {
//     const updatedUsers = users.map(user =>
//       user.id === selectedUserForMenu.id
//         ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
//         : user
//     );
//     setUsers(updatedUsers);
//     handleActionMenuClose();
//   };

//   const exportToCSV = () => {
//     const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Last Login', 'Orders', 'Address'];
//     const csvContent = [
//       headers.join(','),
//       ...filteredUsers.map(user => [
//         user.id,
//         `"${user.name}"`,
//         user.email,
//         user.phone,
//         user.role,
//         user.status,
//         user.joinDate,
//         user.lastLogin,
//         user.orders,
//         `"${user.address}"`
//       ].join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
    
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'users_export.csv');
//     link.style.visibility = 'hidden';
    
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Active': return 'success';
//       case 'Inactive': return 'default';
//       case 'Suspended': return 'error';
//       default: return 'default';
//     }
//   };

//   const getRoleColor = (role) => {
//     switch (role) {
//       case 'Admin': return 'primary'; 
//       case 'Customer': return 'default';
//       default: return 'default';
//     }
//   };

//   return (
//     <Box>
//       {/* Header Section */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
//         {/* <Typography variant="h4" component="h1" fontWeight="bold">
//           Users Management
//         </Typography> */}
//         <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
//         <Button
//           variant="contained"
//           startIcon={<FileDownloadIcon />}
//           onClick={exportToCSV}
//           sx={{ borderRadius: 2 }}
//         >
//           Export CSV
//         </Button>
//       </Box>

//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="textSecondary" gutterBottom>
//                 Total Users
//               </Typography>
//               <Typography variant="h5" component="div">
//                 {users.length}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="textSecondary" gutterBottom>
//                 Active Users
//               </Typography>
//               <Typography variant="h5" component="div" color="success.main">
//                 {users.filter(u => u.status === 'Active').length}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="textSecondary" gutterBottom>
//                 Customers
//               </Typography>
//               <Typography variant="h5" component="div">
//                 {users.filter(u => u.role === 'Customer').length}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="textSecondary" gutterBottom>
//                 Admins
//               </Typography>
//               <Typography variant="h5" component="div">
//                 {users.filter(u => u.role === 'Admin').length}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Filters Section */}
//       <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={4}>
//             <TextField
//               fullWidth
//               placeholder="Search users..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               fullWidth
//               select
//               label="Status"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <MenuItem value="All">All Status</MenuItem>
//               <MenuItem value="Active">Active</MenuItem>
//               <MenuItem value="Inactive">Inactive</MenuItem>
//               <MenuItem value="Suspended">Suspended</MenuItem>
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <TextField
//               fullWidth
//               select
//               label="Role"
//               value={roleFilter}
//               onChange={(e) => setRoleFilter(e.target.value)}
//             >
//               <MenuItem value="All">All Roles</MenuItem>
//               <MenuItem value="Admin">Admin</MenuItem> 
//               <MenuItem value="Customer">Customer</MenuItem>
//             </TextField>
//           </Grid>
//           <Grid item xs={12} md={2}>
//             <Button
//               fullWidth
//               variant="outlined"
//               onClick={() => {
//                 setSearchTerm('');
//                 setStatusFilter('All');
//                 setRoleFilter('All');
//               }}
//             >
//               Clear Filters
//             </Button>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Users Table */}
//       <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
//         <TableContainer>
//           <Table>
//             <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Join Date</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Last Login</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Orders</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredUsers.map((user) => (
//                 <TableRow key={user.id} hover>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       <Avatar src={user.avatar} sx={{ mr: 2 }} />
//                       <Box>
//                         <Typography variant="subtitle1" fontWeight="medium">
//                           {user.name}
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                           ID: {user.id}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">{user.email}</Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       {user.phone}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={user.role}
//                       color={getRoleColor(user.role)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={user.status}
//                       color={getStatusColor(user.status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(user.joinDate).toLocaleDateString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(user.lastLogin).toLocaleDateString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2" fontWeight="medium">
//                       {user.orders}
//                     </Typography>
//                   </TableCell>
//                   <TableCell align="center">
//                     <Stack direction="row" spacing={1} justifyContent="center">
//                       <IconButton
//                         color="primary"
//                         size="small"
//                         onClick={(e) => handleActionMenuOpen(e, user)}
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {filteredUsers.length === 0 && (
//           <Box sx={{ p: 4, textAlign: 'center' }}>
//             <Typography variant="h6" color="textSecondary">
//               No users found
//             </Typography>
//             <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//               Try adjusting your search or filter criteria
//             </Typography>
//           </Box>
//         )}
//       </Paper>

//       {/* Action Menu */}
//       <Menu
//         anchorEl={actionMenuAnchor}
//         open={Boolean(actionMenuAnchor)}
//         onClose={handleActionMenuClose}
//       >
//         <MenuItem onClick={() => { handleActionMenuClose(); }}>
//           <VisibilityIcon sx={{ mr: 1 }} /> View Details
//         </MenuItem>
//         <MenuItem onClick={() => { handleActionMenuClose(); }}>
//           <EditIcon sx={{ mr: 1 }} /> Edit User
//         </MenuItem>
//         <MenuItem onClick={toggleUserStatus}>
//           {selectedUserForMenu?.status === 'Active' ? (
//             <>
//               <BlockIcon sx={{ mr: 1 }} /> Deactivate
//             </>
//           ) : (
//             <>
//               <CheckCircleIcon sx={{ mr: 1 }} /> Activate
//             </>
//           )}
//         </MenuItem>
//         <MenuItem onClick={() => openDeleteDialog(selectedUserForMenu)}>
//           <DeleteIcon sx={{ mr: 1 }} /> Delete
//         </MenuItem>
//       </Menu>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//       >
//         <DialogTitle>Delete User</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleDeleteUser} color="error" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Users;