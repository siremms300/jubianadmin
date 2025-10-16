import React, { useState, useEffect, useRef } from 'react';
import {
  Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp,
  MoreVertical, User, Mail, Phone, MapPin, Calendar, ShoppingBag, RefreshCw
} from 'lucide-react';
import { userApi } from '../../utils/userApi'; // Import the userApi
import { toast } from 'react-toastify';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [expandedUser, setExpandedUser] = useState(null);
  const [actionMenu, setActionMenu] = useState({ open: false, userId: null, position: { top: 0, left: 0 } });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const actionButtonRefs = useRef({});

  // Fetch users from backend using userApi
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.admin.getUsers({
        search: searchTerm,
        status: statusFilter !== 'All' ? statusFilter : '',
        role: roleFilter !== 'All' ? roleFilter : ''
      });
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.message || 'Failed to load users');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const response = await userApi.admin.getUserStats();
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);

  // Filter users based on search term and filters
  useEffect(() => {
    let result = users;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.mobile && user.mobile.toString().includes(searchTerm)) ||
        user._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // Apply role filter
    if (roleFilter !== 'All') {
      const roleMap = {
        'Admin': 'admin',
        'Customer': 'user'
      };
      result = result.filter(user => user.role === roleMap[roleFilter]);
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
      let aValue = a[key];
      let bValue = b[key];
      
      // Handle date sorting
      if (key === 'createdAt' || key === 'last_login_date') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }
      
      // Handle number sorting for orders
      if (key === 'orderCount') {
        aValue = a.orderHistory?.length || 0;
        bValue = b.orderHistory?.length || 0;
      }
      
      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
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
      setSelectedUser(users.find(user => user._id === userId));
    }
  };

  // Close action menu
  const closeActionMenu = () => {
    setActionMenu({ open: false, userId: null, position: { top: 0, left: 0 } });
    setSelectedUser(null);
  };

  // Update user status using userApi
  const updateUserStatus = async (userId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await userApi.admin.updateUserStatus(userId, newStatus);
      
      // Update local state
      const updatedUsers = users.map(user =>
        user._id === userId ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      
      // Update stats if needed
      fetchUserStats();
      
      toast.success(`User ${newStatus.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(error.message || 'Failed to update user status');
    } finally {
      setUpdatingStatus(false);
      closeActionMenu();
    }
  };

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      await userApi.admin.updateUserRole(userId, newRole);
      
      // Update local state
      const updatedUsers = users.map(user =>
        user._id === userId ? { ...user, role: newRole } : user
      );
      setUsers(updatedUsers);
      
      // Update stats
      fetchUserStats();
      
      toast.success(`User role updated to ${newRole} successfully`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error(error.message || 'Failed to update user role');
    }
  };

  // Delete user using userApi
  const deleteUser = async () => {
    try {
      await userApi.admin.deleteUser(selectedUser._id);
      
      // Update local state
      const updatedUsers = users.filter(user => user._id !== selectedUser._id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      
      // Update stats
      fetchUserStats();
      
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      closeActionMenu();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    }
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
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Format role for display
  const formatRole = (role) => {
    return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Last Login', 'Orders', 'Email Verified'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user._id,
        `"${user.name || 'No name'}"`,
        user.email || 'No email',
        user.mobile || 'N/A',
        formatRole(user.role),
        user.status || 'Active',
        formatDate(user.createdAt),
        formatDate(user.last_login_date),
        user.orderHistory?.length || 0,
        user.verify_Email ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Refresh both users and stats
  const handleRefresh = async () => {
    await fetchUsers();
    await fetchUserStats();
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

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-2xl font-bold">{userStats?.totalUsers || users.length}</p>
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
                {userStats?.activeUsers || users.filter(u => u.status === 'Active').length}
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
                {userStats?.customerUsers || users.filter(u => u.role === 'user').length}
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
                {userStats?.adminUsers || users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name, email, or ID..."
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
          </div>
          
          <div className="flex gap-2">
            <button 
              className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={exportToCSV}
              disabled={filteredUsers.length === 0}
            >
              <Download className="h-5 w-5 mr-2" />
              Export CSV
            </button>
          </div>
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
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Join Date
                    {sortConfig.key === 'createdAt' && (
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
                  onClick={() => handleSort('orderCount')}
                >
                  <div className="flex items-center">
                    Orders
                    {sortConfig.key === 'orderCount' && (
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
                  <React.Fragment key={user._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            className="h-10 w-10 rounded-full mr-3" 
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`} 
                            alt={user.name || 'User'} 
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`;
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name || 'No Name'}</div>
                            <div className="text-sm text-gray-500">ID: {user._id?.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email || 'No email'}</div>
                        <div className="text-sm text-gray-500">{user.mobile || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
                          {formatRole(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(user.last_login_date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.orderHistory?.length || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            onClick={() => toggleExpand(user._id)}
                            title="View Details"
                          >
                            {expandedUser === user._id ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          <button 
                            ref={el => actionButtonRefs.current[user._id] = el}
                            className="text-gray-600 hover:text-gray-800 transition-colors relative"
                            onClick={() => openActionMenu(user._id)}
                            title="More Actions"
                            disabled={updatingStatus}
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedUser === user._id && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                <User className="h-4 w-4 mr-2" /> User Information
                              </h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-2" /> {user.email || 'No email'}
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-2" /> {user.mobile || 'No phone number'}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" /> Joined: {formatDate(user.createdAt)}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" /> Last Login: {formatDate(user.last_login_date)}
                                </div>
                                <div className="flex items-center">
                                  <ShoppingBag className="h-4 w-4 mr-2" /> Total Orders: {user.orderHistory?.length || 0}
                                </div>
                                <div className="flex items-center">
                                  <div className={`h-2 w-2 rounded-full mr-2 ${user.verify_Email ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  Email Verified: {user.verify_Email ? 'Yes' : 'No'}
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Quick Actions</h4>
                              <div className="flex flex-wrap gap-2">
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
                                  Edit Profile
                                </button>
                                <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors">
                                  View Orders
                                </button>
                                <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors">
                                  Send Message
                                </button>
                                {user.role === 'user' ? (
                                  <button 
                                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors"
                                    onClick={() => updateUserRole(user._id, 'admin')}
                                  >
                                    Make Admin
                                  </button>
                                ) : (
                                  <button 
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                                    onClick={() => updateUserRole(user._id, 'user')}
                                  >
                                    Make User
                                  </button>
                                )}
                                {user.status === 'Active' ? (
                                  <button 
                                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm hover:bg-yellow-200 transition-colors"
                                    onClick={() => updateUserStatus(user._id, 'Inactive')}
                                  >
                                    Deactivate
                                  </button>
                                ) : (
                                  <button 
                                    className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
                                    onClick={() => updateUserStatus(user._id, 'Active')}
                                  >
                                    Activate
                                  </button>
                                )}
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
                  <td colSpan="8" className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Menu */}
      {actionMenu.open && (
        <div 
          className="fixed bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
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
          {selectedUser?.role === 'user' ? (
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-purple-600 hover:bg-gray-100"
              onClick={() => updateUserRole(selectedUser._id, 'admin')}
            >
              <User className="h-4 w-4 mr-2" /> Make Admin
            </button>
          ) : (
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
              onClick={() => updateUserRole(selectedUser._id, 'user')}
            >
              <User className="h-4 w-4 mr-2" /> Make User
            </button>
          )}
          {selectedUser?.status === 'Active' ? (
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
              onClick={() => updateUserStatus(selectedUser._id, 'Inactive')}
              disabled={updatingStatus}
            >
              <User className="h-4 w-4 mr-2" /> {updatingStatus ? 'Updating...' : 'Deactivate'}
            </button>
          ) : (
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
              onClick={() => updateUserStatus(selectedUser._id, 'Active')}
              disabled={updatingStatus}
            >
              <User className="h-4 w-4 mr-2" /> {updatingStatus ? 'Updating...' : 'Activate'}
            </button>
          )}
          {selectedUser?.status !== 'Suspended' && (
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
              onClick={() => updateUserStatus(selectedUser._id, 'Suspended')}
              disabled={updatingStatus}
            >
              <User className="h-4 w-4 mr-2" /> {updatingStatus ? 'Updating...' : 'Suspend'}
            </button>
          )}
          <button 
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={() => setDeleteDialogOpen(true)}
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
              Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone and will permanently remove all user data.
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
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;



































// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp,
//   MoreVertical, User, Mail, Phone, MapPin, Calendar, ShoppingBag, RefreshCw
// } from 'lucide-react';
// import { api } from '../../utils/api';
// import { toast } from 'react-toastify';

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [roleFilter, setRoleFilter] = useState('All');
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
//   const [expandedUser, setExpandedUser] = useState(null);
//   const [actionMenu, setActionMenu] = useState({ open: false, userId: null, position: { top: 0, left: 0 } });
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [updatingStatus, setUpdatingStatus] = useState(false);
//   const actionButtonRefs = useRef({});

//   // Fetch users from backend
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/api/admin/users'); // You'll need to create this endpoint
//       setUsers(response.data.data || response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       toast.error('Failed to load users');
//       // Fallback to empty array
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Filter users based on search term and filters
//   useEffect(() => {
//     let result = users;
    
//     // Apply search filter
//     if (searchTerm) {
//       result = result.filter(user => 
//         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.mobile?.toString().includes(searchTerm) ||
//         user._id?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     // Apply status filter
//     if (statusFilter !== 'All') {
//       result = result.filter(user => user.status === statusFilter);
//     }
    
//     // Apply role filter
//     if (roleFilter !== 'All') {
//       result = result.filter(user => user.role === roleFilter.toLowerCase());
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
//       let aValue = a[key];
//       let bValue = b[key];
      
//       // Handle date sorting
//       if (key === 'createdAt' || key === 'last_login_date') {
//         aValue = new Date(aValue);
//         bValue = new Date(bValue);
//       }
      
//       // Handle number sorting
//       if (key === 'orderCount') {
//         aValue = a.orderHistory?.length || 0;
//         bValue = b.orderHistory?.length || 0;
//       }
      
//       if (aValue < bValue) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (aValue > bValue) {
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
//   const openActionMenu = (userId) => {
//     const buttonElement = actionButtonRefs.current[userId];
//     if (buttonElement) {
//       const rect = buttonElement.getBoundingClientRect();
//       setActionMenu({
//         open: true,
//         userId,
//         position: {
//           top: rect.bottom + window.scrollY,
//           left: rect.left + window.scrollX
//         }
//       });
//       setSelectedUser(users.find(user => user._id === userId));
//     }
//   };

//   // Close action menu
//   const closeActionMenu = () => {
//     setActionMenu({ open: false, userId: null, position: { top: 0, left: 0 } });
//     setSelectedUser(null);
//   };

//   // Update user status
//   const updateUserStatus = async (userId, newStatus) => {
//     try {
//       setUpdatingStatus(true);
//       const response = await api.put(`/api/admin/users/${userId}/status`, {
//         status: newStatus
//       });
      
//       // Update local state
//       const updatedUsers = users.map(user =>
//         user._id === userId ? { ...user, status: newStatus } : user
//       );
//       setUsers(updatedUsers);
      
//       toast.success(`User ${newStatus.toLowerCase()} successfully`);
//     } catch (error) {
//       console.error('Error updating user status:', error);
//       toast.error('Failed to update user status');
//     } finally {
//       setUpdatingStatus(false);
//       closeActionMenu();
//     }
//   };

//   // Delete user
//   const deleteUser = async () => {
//     try {
//       await api.delete(`/api/admin/users/${selectedUser._id}`);
      
//       // Update local state
//       const updatedUsers = users.filter(user => user._id !== selectedUser._id);
//       setUsers(updatedUsers);
      
//       toast.success('User deleted successfully');
//       setDeleteDialogOpen(false);
//       closeActionMenu();
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       toast.error('Failed to delete user');
//     }
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
//     return role === 'admin' 
//       ? 'bg-purple-100 text-purple-800' 
//       : 'bg-blue-100 text-blue-800';
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Never';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Format role for display
//   const formatRole = (role) => {
//     return role.charAt(0).toUpperCase() + role.slice(1);
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Last Login', 'Orders', 'Email Verified'];
//     const csvContent = [
//       headers.join(','),
//       ...filteredUsers.map(user => [
//         user._id,
//         `"${user.name}"`,
//         user.email,
//         user.mobile || 'N/A',
//         formatRole(user.role),
//         user.status,
//         formatDate(user.createdAt),
//         formatDate(user.last_login_date),
//         user.orderHistory?.length || 0,
//         user.verify_Email ? 'Yes' : 'No'
//       ].join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
    
//     link.setAttribute('href', url);
//     link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = 'hidden';
    
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Close menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (actionMenu.open) {
//         closeActionMenu();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [actionMenu.open]);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600" />
//           <p className="mt-2 text-gray-600">Loading users...</p>
//         </div>
//       </div>
//     );
//   }

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
//                 {users.filter(u => u.role === 'user').length}
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
//                 {users.filter(u => u.role === 'admin').length}
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
//                 placeholder="Search users by name, email, or ID..."
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
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//               <option value="Suspended">Suspended</option>
//             </select>
            
//             <select
//               className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={roleFilter}
//               onChange={(e) => setRoleFilter(e.target.value)}
//             >
//               <option value="All">All Roles</option>
//               <option value="Admin">Admin</option>
//               <option value="Customer">Customer</option>
//             </select>
//           </div>
          
//           <div className="flex gap-2">
//             <button 
//               className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
//               onClick={fetchUsers}
//               disabled={loading}
//             >
//               <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//             <button 
//               className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               onClick={exportToCSV}
//             >
//               <Download className="h-5 w-5 mr-2" />
//               Export CSV
//             </button>
//           </div>
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
//                   onClick={() => handleSort('createdAt')}
//                 >
//                   <div className="flex items-center">
//                     Join Date
//                     {sortConfig.key === 'createdAt' && (
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
//                   onClick={() => handleSort('orderCount')}
//                 >
//                   <div className="flex items-center">
//                     Orders
//                     {sortConfig.key === 'orderCount' && (
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
//                   <React.Fragment key={user._id}>
//                     <tr className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <img 
//                             className="h-10 w-10 rounded-full mr-3" 
//                             src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
//                             alt={user.name} 
//                             onError={(e) => {
//                               e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
//                             }}
//                           />
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                             <div className="text-sm text-gray-500">ID: {user._id.substring(0, 8)}...</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{user.email}</div>
//                         <div className="text-sm text-gray-500">{user.mobile || 'No phone'}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
//                           {formatRole(user.role)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
//                           {user.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{formatDate(user.createdAt)}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{formatDate(user.last_login_date)}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {user.orderHistory?.length || 0}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button 
//                             className="text-blue-600 hover:text-blue-800 transition-colors"
//                             onClick={() => toggleExpand(user._id)}
//                             title="View Details"
//                           >
//                             {expandedUser === user._id ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                           </button>
//                           <button 
//                             ref={el => actionButtonRefs.current[user._id] = el}
//                             className="text-gray-600 hover:text-gray-800 transition-colors relative"
//                             onClick={() => openActionMenu(user._id)}
//                             title="More Actions"
//                             disabled={updatingStatus}
//                           >
//                             <MoreVertical className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                     {expandedUser === user._id && (
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
//                                   <Phone className="h-4 w-4 mr-2" /> {user.mobile || 'No phone number'}
//                                 </div>
//                                 <div className="flex items-center">
//                                   <Calendar className="h-4 w-4 mr-2" /> Joined: {formatDate(user.createdAt)}
//                                 </div>
//                                 <div className="flex items-center">
//                                   <Calendar className="h-4 w-4 mr-2" /> Last Login: {formatDate(user.last_login_date)}
//                                 </div>
//                                 <div className="flex items-center">
//                                   <ShoppingBag className="h-4 w-4 mr-2" /> Total Orders: {user.orderHistory?.length || 0}
//                                 </div>
//                                 <div className="flex items-center">
//                                   <div className={`h-2 w-2 rounded-full mr-2 ${user.verify_Email ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                                   Email Verified: {user.verify_Email ? 'Yes' : 'No'}
//                                 </div>
//                               </div>
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-gray-700 mb-2">Quick Actions</h4>
//                               <div className="flex flex-wrap gap-2">
//                                 <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
//                                   Edit Profile
//                                 </button>
//                                 <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors">
//                                   View Orders
//                                 </button>
//                                 <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors">
//                                   Send Message
//                                 </button>
//                                 {user.status === 'Active' ? (
//                                   <button 
//                                     className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm hover:bg-yellow-200 transition-colors"
//                                     onClick={() => updateUserStatus(user._id, 'Inactive')}
//                                   >
//                                     Deactivate
//                                   </button>
//                                 ) : (
//                                   <button 
//                                     className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
//                                     onClick={() => updateUserStatus(user._id, 'Active')}
//                                   >
//                                     Activate
//                                   </button>
//                                 )}
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
//                   <td colSpan="8" className="px-6 py-8 text-center">
//                     <div className="text-gray-500">
//                       <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                       <p className="text-lg font-medium">No users found</p>
//                       <p className="text-sm">Try adjusting your search or filters</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Action Menu */}
//       {actionMenu.open && (
//         <div 
//           className="fixed bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
//           style={{
//             top: actionMenu.position.top,
//             left: actionMenu.position.left,
//             minWidth: '160px'
//           }}
//         >
//           <button 
//             className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//             onClick={() => {
//               toggleExpand(actionMenu.userId);
//               closeActionMenu();
//             }}
//           >
//             <Eye className="h-4 w-4 mr-2" /> View Details
//           </button>
//           <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//             <Edit className="h-4 w-4 mr-2" /> Edit User
//           </button>
//           {selectedUser?.status === 'Active' ? (
//             <button 
//               className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
//               onClick={() => updateUserStatus(selectedUser._id, 'Inactive')}
//               disabled={updatingStatus}
//             >
//               <User className="h-4 w-4 mr-2" /> {updatingStatus ? 'Updating...' : 'Deactivate'}
//             </button>
//           ) : (
//             <button 
//               className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
//               onClick={() => updateUserStatus(selectedUser._id, 'Active')}
//               disabled={updatingStatus}
//             >
//               <User className="h-4 w-4 mr-2" /> {updatingStatus ? 'Updating...' : 'Activate'}
//             </button>
//           )}
//           {selectedUser?.status !== 'Suspended' && (
//             <button 
//               className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
//               onClick={() => updateUserStatus(selectedUser._id, 'Suspended')}
//               disabled={updatingStatus}
//             >
//               <User className="h-4 w-4 mr-2" /> {updatingStatus ? 'Updating...' : 'Suspend'}
//             </button>
//           )}
//           <button 
//             className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//             onClick={() => setDeleteDialogOpen(true)}
//           >
//             <Trash2 className="h-4 w-4 mr-2" /> Delete
//           </button>
//         </div>
//       )}

//       {/* Delete Confirmation Dialog */}
//       {deleteDialogOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
//             <p className="text-sm text-gray-600 mb-4">
//               Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone and will permanently remove all user data.
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
//                 Delete User
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Users;




























































// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //   Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp,
// //   MoreVertical, User, Mail, Phone, MapPin, Calendar, ShoppingBag
// // } from 'lucide-react';

// // const Users = () => {
// //   // Sample user data
// //   const [users, setUsers] = useState([
// //     {
// //       id: 1,
// //       name: 'John Doe',
// //       email: 'john.doe@example.com',
// //       phone: '+1 (555) 123-4567',
// //       role: 'Customer',
// //       status: 'Active',
// //       joinDate: '2023-01-15',
// //       lastLogin: '2023-10-20',
// //       orders: 12,
// //       avatar: 'https://via.placeholder.com/40',
// //       address: '123 Main St, New York, NY'
// //     },
// //     {
// //       id: 2,
// //       name: 'Jane Smith',
// //       email: 'jane.smith@example.com',
// //       phone: '+1 (555) 987-6543',
// //       role: 'Admin',
// //       status: 'Active',
// //       joinDate: '2022-08-22',
// //       lastLogin: '2023-10-21',
// //       orders: 45,
// //       avatar: 'https://via.placeholder.com/40',
// //       address: '456 Oak Ave, Los Angeles, CA'
// //     },
// //     {
// //       id: 3,
// //       name: 'Robert Johnson',
// //       email: 'robert.j@example.com',
// //       phone: '+1 (555) 456-7890',
// //       role: 'Customer',
// //       status: 'Inactive',
// //       joinDate: '2023-03-10',
// //       lastLogin: '2023-09-15',
// //       orders: 3,
// //       avatar: 'https://via.placeholder.com/40',
// //       address: '789 Pine Rd, Chicago, IL'
// //     },
// //     {
// //       id: 4,
// //       name: 'Sarah Wilson',
// //       email: 'sarah.w@example.com',
// //       phone: '+1 (555) 234-5678',
// //       role: 'Customer',
// //       status: 'Active',
// //       joinDate: '2022-11-05',
// //       lastLogin: '2023-10-22',
// //       orders: 28,
// //       avatar: 'https://via.placeholder.com/40',
// //       address: '321 Elm St, Miami, FL'
// //     },
// //     {
// //       id: 5,
// //       name: 'Michael Brown',
// //       email: 'michael.b@example.com',
// //       phone: '+1 (555) 876-5432',
// //       role: 'Customer',
// //       status: 'Suspended',
// //       joinDate: '2023-05-18',
// //       lastLogin: '2023-08-30',
// //       orders: 7,
// //       avatar: 'https://via.placeholder.com/40',
// //       address: '654 Maple Dr, Seattle, WA'
// //     }
// //   ]);

// //   const [filteredUsers, setFilteredUsers] = useState(users);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [statusFilter, setStatusFilter] = useState('All');
// //   const [roleFilter, setRoleFilter] = useState('All');
// //   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
// //   const [expandedUser, setExpandedUser] = useState(null);
// //   const [actionMenu, setActionMenu] = useState({ open: false, userId: null, position: { top: 0, left: 0 } });
// //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const actionButtonRefs = useRef({});

// //   // Filter users based on search term and filters
// //   useEffect(() => {
// //     let result = users;
    
// //     // Apply search filter
// //     if (searchTerm) {
// //       result = result.filter(user => 
// //         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         user.address.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //     }
    
// //     // Apply status filter
// //     if (statusFilter !== 'All') {
// //       result = result.filter(user => user.status === statusFilter);
// //     }
    
// //     // Apply role filter
// //     if (roleFilter !== 'All') {
// //       result = result.filter(user => user.role === roleFilter);
// //     }
    
// //     setFilteredUsers(result);
// //   }, [searchTerm, statusFilter, roleFilter, users]);

// //   // Handle sorting
// //   const handleSort = (key) => {
// //     let direction = 'ascending';
// //     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
// //       direction = 'descending';
// //     }
// //     setSortConfig({ key, direction });
    
// //     const sortedUsers = [...filteredUsers].sort((a, b) => {
// //       if (a[key] < b[key]) {
// //         return direction === 'ascending' ? -1 : 1;
// //       }
// //       if (a[key] > b[key]) {
// //         return direction === 'ascending' ? 1 : -1;
// //       }
// //       return 0;
// //     });
    
// //     setFilteredUsers(sortedUsers);
// //   };

// //   // Toggle user details expansion
// //   const toggleExpand = (userId) => {
// //     if (expandedUser === userId) {
// //       setExpandedUser(null);
// //     } else {
// //       setExpandedUser(userId);
// //     }
// //   };

// //   // Open action menu
// //   const openActionMenu = (userId) => {
// //     const buttonElement = actionButtonRefs.current[userId];
// //     if (buttonElement) {
// //       const rect = buttonElement.getBoundingClientRect();
// //       setActionMenu({
// //         open: true,
// //         userId,
// //         position: {
// //           top: rect.bottom + window.scrollY,
// //           left: rect.left + window.scrollX
// //         }
// //       });
// //       setSelectedUser(users.find(user => user.id === userId));
// //     }
// //   };

// //   // Close action menu
// //   const closeActionMenu = () => {
// //     setActionMenu({ open: false, userId: null, position: { top: 0, left: 0 } });
// //     setSelectedUser(null);
// //   };

// //   // Toggle user status
// //   const toggleUserStatus = () => {
// //     const updatedUsers = users.map(user =>
// //       user.id === selectedUser.id
// //         ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
// //         : user
// //     );
// //     setUsers(updatedUsers);
// //     closeActionMenu();
// //   };

// //   // Open delete confirmation
// //   const openDeleteDialog = () => {
// //     setDeleteDialogOpen(true);
// //   };

// //   // Delete user
// //   const deleteUser = () => {
// //     const updatedUsers = users.filter(user => user.id !== selectedUser.id);
// //     setUsers(updatedUsers);
// //     setDeleteDialogOpen(false);
// //     closeActionMenu();
// //   };

// //   // Get status badge class
// //   const getStatusClass = (status) => {
// //     switch (status) {
// //       case 'Active': return 'bg-green-100 text-green-800';
// //       case 'Inactive': return 'bg-gray-100 text-gray-800';
// //       case 'Suspended': return 'bg-red-100 text-red-800';
// //       default: return 'bg-gray-100 text-gray-800';
// //     }
// //   };

// //   // Get role badge class
// //   const getRoleClass = (role) => {
// //     return role === 'Admin' 
// //       ? 'bg-purple-100 text-purple-800' 
// //       : 'bg-blue-100 text-blue-800';
// //   };

// //   // Export to CSV
// //   const exportToCSV = () => {
// //     const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Last Login', 'Orders', 'Address'];
// //     const csvContent = [
// //       headers.join(','),
// //       ...filteredUsers.map(user => [
// //         user.id,
// //         `"${user.name}"`,
// //         user.email,
// //         user.phone,
// //         user.role,
// //         user.status,
// //         user.joinDate,
// //         user.lastLogin,
// //         user.orders,
// //         `"${user.address}"`
// //       ].join(','))
// //     ].join('\n');

// //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //     const link = document.createElement('a');
// //     const url = URL.createObjectURL(blob);
    
// //     link.setAttribute('href', url);
// //     link.setAttribute('download', 'users_export.csv');
// //     link.style.visibility = 'hidden';
    
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
// //   };

// //   // Close menu when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (actionMenu.open) {
// //         closeActionMenu();
// //       }
// //     };

// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, [actionMenu.open]);

// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
// //       <div className="mb-6">
// //         <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
// //         <p className="text-gray-600">Manage and track all system users</p>
// //       </div>

// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <div className="flex items-center">
// //             <div className="rounded-full bg-blue-100 p-3 mr-4">
// //               <User className="h-6 w-6 text-blue-600" />
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-600">Total Users</p>
// //               <p className="text-2xl font-bold">{users.length}</p>
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <div className="flex items-center">
// //             <div className="rounded-full bg-green-100 p-3 mr-4">
// //               <User className="h-6 w-6 text-green-600" />
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-600">Active Users</p>
// //               <p className="text-2xl font-bold text-green-600">
// //                 {users.filter(u => u.status === 'Active').length}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <div className="flex items-center">
// //             <div className="rounded-full bg-purple-100 p-3 mr-4">
// //               <User className="h-6 w-6 text-purple-600" />
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-600">Customers</p>
// //               <p className="text-2xl font-bold">
// //                 {users.filter(u => u.role === 'Customer').length}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="bg-white rounded-lg shadow p-4">
// //           <div className="flex items-center">
// //             <div className="rounded-full bg-indigo-100 p-3 mr-4">
// //               <User className="h-6 w-6 text-indigo-600" />
// //             </div>
// //             <div>
// //               <p className="text-sm text-gray-600">Admins</p>
// //               <p className="text-2xl font-bold">
// //                 {users.filter(u => u.role === 'Admin').length}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
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
// //               placeholder="Search users..."
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
// //             <option value="Active">Active</option>
// //             <option value="Inactive">Inactive</option>
// //             <option value="Suspended">Suspended</option>
// //           </select>
          
// //           <select
// //             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             value={roleFilter}
// //             onChange={(e) => setRoleFilter(e.target.value)}
// //           >
// //             <option value="All">All Roles</option>
// //             <option value="Admin">Admin</option>
// //             <option value="Customer">Customer</option>
// //           </select>
          
// //           <button 
// //             className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// //             onClick={exportToCSV}
// //           >
// //             <Download className="h-5 w-5 mr-2" />
// //             Export CSV
// //           </button>
// //         </div>
// //       </div>

// //       {/* Users Table */}
// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   User
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Contact
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Role
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Status
// //                 </th>
// //                 <th 
// //                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
// //                   onClick={() => handleSort('joinDate')}
// //                 >
// //                   <div className="flex items-center">
// //                     Join Date
// //                     {sortConfig.key === 'joinDate' && (
// //                       sortConfig.direction === 'ascending' ? 
// //                       <ChevronUp className="ml-1 h-4 w-4" /> : 
// //                       <ChevronDown className="ml-1 h-4 w-4" />
// //                     )}
// //                   </div>
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Last Login
// //                 </th>
// //                 <th 
// //                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
// //                   onClick={() => handleSort('orders')}
// //                 >
// //                   <div className="flex items-center">
// //                     Orders
// //                     {sortConfig.key === 'orders' && (
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
// //               {filteredUsers.length > 0 ? (
// //                 filteredUsers.map((user) => (
// //                   <React.Fragment key={user.id}>
// //                     <tr className="hover:bg-gray-50">
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="flex items-center">
// //                           <img className="h-10 w-10 rounded-full mr-3" src={user.avatar} alt={user.name} />
// //                           <div>
// //                             <div className="text-sm font-medium text-gray-900">{user.name}</div>
// //                             <div className="text-sm text-gray-500">ID: {user.id}</div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-900">{user.email}</div>
// //                         <div className="text-sm text-gray-500">{user.phone}</div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
// //                           {user.role}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
// //                           {user.status}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-900">{user.joinDate}</div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm text-gray-900">{user.lastLogin}</div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap">
// //                         <div className="text-sm font-medium text-gray-900">
// //                           {user.orders}
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// //                         <div className="flex items-center space-x-2">
// //                           <button 
// //                             className="text-blue-600 hover:text-blue-800 transition-colors"
// //                             onClick={() => toggleExpand(user.id)}
// //                             title="View Details"
// //                           >
// //                             {expandedUser === user.id ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
// //                           </button>
// //                           <button 
// //                             ref={el => actionButtonRefs.current[user.id] = el}
// //                             className="text-gray-600 hover:text-gray-800 transition-colors relative"
// //                             onClick={() => openActionMenu(user.id)}
// //                             title="More Actions"
// //                           >
// //                             <MoreVertical className="h-5 w-5" />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                     {expandedUser === user.id && (
// //                       <tr>
// //                         <td colSpan="8" className="px-6 py-4 bg-gray-50">
// //                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                             <div>
// //                               <h4 className="font-medium text-gray-700 mb-2 flex items-center">
// //                                 <User className="h-4 w-4 mr-2" /> User Information
// //                               </h4>
// //                               <div className="text-sm text-gray-600 space-y-1">
// //                                 <div className="flex items-center">
// //                                   <Mail className="h-4 w-4 mr-2" /> {user.email}
// //                                 </div>
// //                                 <div className="flex items-center">
// //                                   <Phone className="h-4 w-4 mr-2" /> {user.phone}
// //                                 </div>
// //                                 <div className="flex items-center">
// //                                   <MapPin className="h-4 w-4 mr-2" /> {user.address}
// //                                 </div>
// //                                 <div className="flex items-center">
// //                                   <Calendar className="h-4 w-4 mr-2" /> Joined: {user.joinDate}
// //                                 </div>
// //                                 <div className="flex items-center">
// //                                   <Calendar className="h-4 w-4 mr-2" /> Last Login: {user.lastLogin}
// //                                 </div>
// //                                 <div className="flex items-center">
// //                                   <ShoppingBag className="h-4 w-4 mr-2" /> Total Orders: {user.orders}
// //                                 </div>
// //                               </div>
// //                             </div>
// //                             <div>
// //                               <h4 className="font-medium text-gray-700 mb-2">User Actions</h4>
// //                               <div className="flex space-x-2">
// //                                 <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
// //                                   Edit Profile
// //                                 </button>
// //                                 <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors">
// //                                   View Orders
// //                                 </button>
// //                                 <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors">
// //                                   Send Message
// //                                 </button>
// //                               </div>
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
// //                     No users found matching your criteria.
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
// //                 Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
// //                 <span className="font-medium">{filteredUsers.length}</span> results
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

// //       {/* Action Menu */}
// //       {actionMenu.open && (
// //         <div 
// //           className="absolute bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
// //           style={{
// //             top: actionMenu.position.top,
// //             left: actionMenu.position.left,
// //             minWidth: '160px'
// //           }}
// //         >
// //           <button 
// //             className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// //             onClick={() => {
// //               toggleExpand(actionMenu.userId);
// //               closeActionMenu();
// //             }}
// //           >
// //             <Eye className="h-4 w-4 mr-2" /> View Details
// //           </button>
// //           <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
// //             <Edit className="h-4 w-4 mr-2" /> Edit User
// //           </button>
// //           <button 
// //             className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// //             onClick={toggleUserStatus}
// //           >
// //             {selectedUser.status === 'Active' ? (
// //               <>
// //                 <User className="h-4 w-4 mr-2" /> Deactivate
// //               </>
// //             ) : (
// //               <>
// //                 <User className="h-4 w-4 mr-2" /> Activate
// //               </>
// //             )}
// //           </button>
// //           <button 
// //             className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
// //             onClick={openDeleteDialog}
// //           >
// //             <Trash2 className="h-4 w-4 mr-2" /> Delete
// //           </button>
// //         </div>
// //       )}

// //       {/* Delete Confirmation Dialog */}
// //       {deleteDialogOpen && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white rounded-lg p-6 w-full max-w-md">
// //             <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
// //             <p className="text-sm text-gray-600 mb-4">
// //               Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone.
// //             </p>
// //             <div className="flex justify-end space-x-3">
// //               <button 
// //                 className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
// //                 onClick={() => setDeleteDialogOpen(false)}
// //               >
// //                 Cancel
// //               </button>
// //               <button 
// //                 className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
// //                 onClick={deleteUser}
// //               >
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Users;































































// // // import React, { useState, useEffect } from 'react';
// // // import {
// // //   Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp,
// // //   MoreVertical, User, Mail, Phone, MapPin, Calendar, ShoppingBag
// // // } from 'lucide-react';

// // // const Users = () => {
// // //   // Sample user data
// // //   const [users, setUsers] = useState([
// // //     {
// // //       id: 1,
// // //       name: 'John Doe',
// // //       email: 'john.doe@example.com',
// // //       phone: '+1 (555) 123-4567',
// // //       role: 'Customer',
// // //       status: 'Active',
// // //       joinDate: '2023-01-15',
// // //       lastLogin: '2023-10-20',
// // //       orders: 12,
// // //       avatar: 'https://via.placeholder.com/40',
// // //       address: '123 Main St, New York, NY'
// // //     },
// // //     {
// // //       id: 2,
// // //       name: 'Jane Smith',
// // //       email: 'jane.smith@example.com',
// // //       phone: '+1 (555) 987-6543',
// // //       role: 'Admin',
// // //       status: 'Active',
// // //       joinDate: '2022-08-22',
// // //       lastLogin: '2023-10-21',
// // //       orders: 45,
// // //       avatar: 'https://via.placeholder.com/40',
// // //       address: '456 Oak Ave, Los Angeles, CA'
// // //     },
// // //     {
// // //       id: 3,
// // //       name: 'Robert Johnson',
// // //       email: 'robert.j@example.com',
// // //       phone: '+1 (555) 456-7890',
// // //       role: 'Customer',
// // //       status: 'Inactive',
// // //       joinDate: '2023-03-10',
// // //       lastLogin: '2023-09-15',
// // //       orders: 3,
// // //       avatar: 'https://via.placeholder.com/40',
// // //       address: '789 Pine Rd, Chicago, IL'
// // //     },
// // //     {
// // //       id: 4,
// // //       name: 'Sarah Wilson',
// // //       email: 'sarah.w@example.com',
// // //       phone: '+1 (555) 234-5678',
// // //       role: 'Customer',
// // //       status: 'Active',
// // //       joinDate: '2022-11-05',
// // //       lastLogin: '2023-10-22',
// // //       orders: 28,
// // //       avatar: 'https://via.placeholder.com/40',
// // //       address: '321 Elm St, Miami, FL'
// // //     },
// // //     {
// // //       id: 5,
// // //       name: 'Michael Brown',
// // //       email: 'michael.b@example.com',
// // //       phone: '+1 (555) 876-5432',
// // //       role: 'Customer',
// // //       status: 'Suspended',
// // //       joinDate: '2023-05-18',
// // //       lastLogin: '2023-08-30',
// // //       orders: 7,
// // //       avatar: 'https://via.placeholder.com/40',
// // //       address: '654 Maple Dr, Seattle, WA'
// // //     }
// // //   ]);

// // //   const [filteredUsers, setFilteredUsers] = useState(users);
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [statusFilter, setStatusFilter] = useState('All');
// // //   const [roleFilter, setRoleFilter] = useState('All');
// // //   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
// // //   const [expandedUser, setExpandedUser] = useState(null);
// // //   const [actionMenu, setActionMenu] = useState(null);
// // //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// // //   const [selectedUser, setSelectedUser] = useState(null);

// // //   // Filter users based on search term and filters
// // //   useEffect(() => {
// // //     let result = users;
    
// // //     // Apply search filter
// // //     if (searchTerm) {
// // //       result = result.filter(user => 
// // //         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         user.address.toLowerCase().includes(searchTerm.toLowerCase())
// // //       );
// // //     }
    
// // //     // Apply status filter
// // //     if (statusFilter !== 'All') {
// // //       result = result.filter(user => user.status === statusFilter);
// // //     }
    
// // //     // Apply role filter
// // //     if (roleFilter !== 'All') {
// // //       result = result.filter(user => user.role === roleFilter);
// // //     }
    
// // //     setFilteredUsers(result);
// // //   }, [searchTerm, statusFilter, roleFilter, users]);

// // //   // Handle sorting
// // //   const handleSort = (key) => {
// // //     let direction = 'ascending';
// // //     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
// // //       direction = 'descending';
// // //     }
// // //     setSortConfig({ key, direction });
    
// // //     const sortedUsers = [...filteredUsers].sort((a, b) => {
// // //       if (a[key] < b[key]) {
// // //         return direction === 'ascending' ? -1 : 1;
// // //       }
// // //       if (a[key] > b[key]) {
// // //         return direction === 'ascending' ? 1 : -1;
// // //       }
// // //       return 0;
// // //     });
    
// // //     setFilteredUsers(sortedUsers);
// // //   };

// // //   // Toggle user details expansion
// // //   const toggleExpand = (userId) => {
// // //     if (expandedUser === userId) {
// // //       setExpandedUser(null);
// // //     } else {
// // //       setExpandedUser(userId);
// // //     }
// // //   };

// // //   // Open action menu
// // //   const openActionMenu = (event, user) => {
// // //     setActionMenu(event.currentTarget);
// // //     setSelectedUser(user);
// // //   };

// // //   // Close action menu
// // //   const closeActionMenu = () => {
// // //     setActionMenu(null);
// // //     setSelectedUser(null);
// // //   };

// // //   // Toggle user status
// // //   const toggleUserStatus = () => {
// // //     const updatedUsers = users.map(user =>
// // //       user.id === selectedUser.id
// // //         ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
// // //         : user
// // //     );
// // //     setUsers(updatedUsers);
// // //     closeActionMenu();
// // //   };

// // //   // Open delete confirmation
// // //   const openDeleteDialog = () => {
// // //     setDeleteDialogOpen(true);
// // //   };

// // //   // Delete user
// // //   const deleteUser = () => {
// // //     const updatedUsers = users.filter(user => user.id !== selectedUser.id);
// // //     setUsers(updatedUsers);
// // //     setDeleteDialogOpen(false);
// // //     closeActionMenu();
// // //   };

// // //   // Get status badge class
// // //   const getStatusClass = (status) => {
// // //     switch (status) {
// // //       case 'Active': return 'bg-green-100 text-green-800';
// // //       case 'Inactive': return 'bg-gray-100 text-gray-800';
// // //       case 'Suspended': return 'bg-red-100 text-red-800';
// // //       default: return 'bg-gray-100 text-gray-800';
// // //     }
// // //   };

// // //   // Get role badge class
// // //   const getRoleClass = (role) => {
// // //     return role === 'Admin' 
// // //       ? 'bg-purple-100 text-purple-800' 
// // //       : 'bg-blue-100 text-blue-800';
// // //   };

// // //   // Export to CSV
// // //   const exportToCSV = () => {
// // //     const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Last Login', 'Orders', 'Address'];
// // //     const csvContent = [
// // //       headers.join(','),
// // //       ...filteredUsers.map(user => [
// // //         user.id,
// // //         `"${user.name}"`,
// // //         user.email,
// // //         user.phone,
// // //         user.role,
// // //         user.status,
// // //         user.joinDate,
// // //         user.lastLogin,
// // //         user.orders,
// // //         `"${user.address}"`
// // //       ].join(','))
// // //     ].join('\n');

// // //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// // //     const link = document.createElement('a');
// // //     const url = URL.createObjectURL(blob);
    
// // //     link.setAttribute('href', url);
// // //     link.setAttribute('download', 'users_export.csv');
// // //     link.style.visibility = 'hidden';
    
// // //     document.body.appendChild(link);
// // //     link.click();
// // //     document.body.removeChild(link);
// // //   };

// // //   return (
// // //     <div className="p-6 bg-gray-50 min-h-screen">
// // //       <div className="mb-6">
// // //         <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
// // //         <p className="text-gray-600">Manage and track all system users</p>
// // //       </div>

// // //       {/* Stats Cards */}
// // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// // //         <div className="bg-white rounded-lg shadow p-4">
// // //           <div className="flex items-center">
// // //             <div className="rounded-full bg-blue-100 p-3 mr-4">
// // //               <User className="h-6 w-6 text-blue-600" />
// // //             </div>
// // //             <div>
// // //               <p className="text-sm text-gray-600">Total Users</p>
// // //               <p className="text-2xl font-bold">{users.length}</p>
// // //             </div>
// // //           </div>
// // //         </div>
        
// // //         <div className="bg-white rounded-lg shadow p-4">
// // //           <div className="flex items-center">
// // //             <div className="rounded-full bg-green-100 p-3 mr-4">
// // //               <User className="h-6 w-6 text-green-600" />
// // //             </div>
// // //             <div>
// // //               <p className="text-sm text-gray-600">Active Users</p>
// // //               <p className="text-2xl font-bold text-green-600">
// // //                 {users.filter(u => u.status === 'Active').length}
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>
        
// // //         <div className="bg-white rounded-lg shadow p-4">
// // //           <div className="flex items-center">
// // //             <div className="rounded-full bg-purple-100 p-3 mr-4">
// // //               <User className="h-6 w-6 text-purple-600" />
// // //             </div>
// // //             <div>
// // //               <p className="text-sm text-gray-600">Customers</p>
// // //               <p className="text-2xl font-bold">
// // //                 {users.filter(u => u.role === 'Customer').length}
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>
        
// // //         <div className="bg-white rounded-lg shadow p-4">
// // //           <div className="flex items-center">
// // //             <div className="rounded-full bg-indigo-100 p-3 mr-4">
// // //               <User className="h-6 w-6 text-indigo-600" />
// // //             </div>
// // //             <div>
// // //               <p className="text-sm text-gray-600">Admins</p>
// // //               <p className="text-2xl font-bold">
// // //                 {users.filter(u => u.role === 'Admin').length}
// // //               </p>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Filters and Search */}
// // //       <div className="bg-white rounded-lg shadow p-4 mb-6">
// // //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// // //           <div className="relative">
// // //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// // //               <Search className="h-5 w-5 text-gray-400" />
// // //             </div>
// // //             <input
// // //               type="text"
// // //               placeholder="Search users..."
// // //               className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //               value={searchTerm}
// // //               onChange={(e) => setSearchTerm(e.target.value)}
// // //             />
// // //           </div>
          
// // //           <select
// // //             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //             value={statusFilter}
// // //             onChange={(e) => setStatusFilter(e.target.value)}
// // //           >
// // //             <option value="All">All Statuses</option>
// // //             <option value="Active">Active</option>
// // //             <option value="Inactive">Inactive</option>
// // //             <option value="Suspended">Suspended</option>
// // //           </select>
          
// // //           <select
// // //             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //             value={roleFilter}
// // //             onChange={(e) => setRoleFilter(e.target.value)}
// // //           >
// // //             <option value="All">All Roles</option>
// // //             <option value="Admin">Admin</option>
// // //             <option value="Customer">Customer</option>
// // //           </select>
          
// // //           <button 
// // //             className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
// // //             onClick={exportToCSV}
// // //           >
// // //             <Download className="h-5 w-5 mr-2" />
// // //             Export CSV
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Users Table */}
// // //       <div className="bg-white rounded-lg shadow overflow-hidden">
// // //         <div className="overflow-x-auto">
// // //           <table className="min-w-full divide-y divide-gray-200">
// // //             <thead className="bg-gray-50">
// // //               <tr>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   User
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Contact
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Role
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Status
// // //                 </th>
// // //                 <th 
// // //                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
// // //                   onClick={() => handleSort('joinDate')}
// // //                 >
// // //                   <div className="flex items-center">
// // //                     Join Date
// // //                     {sortConfig.key === 'joinDate' && (
// // //                       sortConfig.direction === 'ascending' ? 
// // //                       <ChevronUp className="ml-1 h-4 w-4" /> : 
// // //                       <ChevronDown className="ml-1 h-4 w-4" />
// // //                     )}
// // //                   </div>
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Last Login
// // //                 </th>
// // //                 <th 
// // //                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
// // //                   onClick={() => handleSort('orders')}
// // //                 >
// // //                   <div className="flex items-center">
// // //                     Orders
// // //                     {sortConfig.key === 'orders' && (
// // //                       sortConfig.direction === 'ascending' ? 
// // //                       <ChevronUp className="ml-1 h-4 w-4" /> : 
// // //                       <ChevronDown className="ml-1 h-4 w-4" />
// // //                     )}
// // //                   </div>
// // //                 </th>
// // //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                   Actions
// // //                 </th>
// // //               </tr>
// // //             </thead>
// // //             <tbody className="bg-white divide-y divide-gray-200">
// // //               {filteredUsers.length > 0 ? (
// // //                 filteredUsers.map((user) => (
// // //                   <React.Fragment key={user.id}>
// // //                     <tr className="hover:bg-gray-50">
// // //                       <td className="px-6 py-4 whitespace-nowrap">
// // //                         <div className="flex items-center">
// // //                           <img className="h-10 w-10 rounded-full mr-3" src={user.avatar} alt={user.name} />
// // //                           <div>
// // //                             <div className="text-sm font-medium text-gray-900">{user.name}</div>
// // //                             <div className="text-sm text-gray-500">ID: {user.id}</div>
// // //                           </div>
// // //                         </div>
// // //                       </td>
// // //                       <td className="px-6 py-4 whitespace-nowrap">
// // //                         <div className="text-sm text-gray-900">{user.email}</div>
// // //                         <div className="text-sm text-gray-500">{user.phone}</div>
// // //                       </td>
// // //                       <td className="px-6 py-4 whitespace-nowrap">
// // //                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
// // //                           {user.role}
// // //                         </span>
// // //                       </td>
// // //                       <td className="px-6 py-4 whitespace-nowrap">
// // //                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
// // //                           {user.status}
// // //                         </span>
// // //                       </td>
// // //                       <td className="px-6 py-4 whitespace-nowrap">
// // //                         <div className="text-sm text-gray-900">{user.joinDate}</div>
// // //                       </td>
// // //                       <td className="px-6 py-4 whitespace-nowrap">
// // //                         <div className="text-sm text-gray-900">{user.lastLogin}</div>
// // //                       </td>
// // //                       <td className="px-6 py-4 whitespace-nowrap">
// // //                         <div className="text-sm font-medium text-gray-900">
// // //                           {user.orders}
// // //                         </div>
// // //                       </td>
// // //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// // //                         <div className="flex items-center space-x-2">
// // //                           <button 
// // //                             className="text-blue-600 hover:text-blue-800 transition-colors"
// // //                             onClick={() => toggleExpand(user.id)}
// // //                             title="View Details"
// // //                           >
// // //                             {expandedUser === user.id ? <ChevronUp className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
// // //                           </button>
// // //                           <button 
// // //                             className="text-gray-600 hover:text-gray-800 transition-colors"
// // //                             onClick={(e) => openActionMenu(e, user)}
// // //                             title="More Actions"
// // //                           >
// // //                             <MoreVertical className="h-5 w-5" />
// // //                           </button>
// // //                         </div>
// // //                       </td>
// // //                     </tr>
// // //                     {expandedUser === user.id && (
// // //                       <tr>
// // //                         <td colSpan="8" className="px-6 py-4 bg-gray-50">
// // //                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //                             <div>
// // //                               <h4 className="font-medium text-gray-700 mb-2 flex items-center">
// // //                                 <User className="h-4 w-4 mr-2" /> User Information
// // //                               </h4>
// // //                               <div className="text-sm text-gray-600 space-y-1">
// // //                                 <div className="flex items-center">
// // //                                   <Mail className="h-4 w-4 mr-2" /> {user.email}
// // //                                 </div>
// // //                                 <div className="flex items-center">
// // //                                   <Phone className="h-4 w-4 mr-2" /> {user.phone}
// // //                                 </div>
// // //                                 <div className="flex items-center">
// // //                                   <MapPin className="h-4 w-4 mr-2" /> {user.address}
// // //                                 </div>
// // //                                 <div className="flex items-center">
// // //                                   <Calendar className="h-4 w-4 mr-2" /> Joined: {user.joinDate}
// // //                                 </div>
// // //                                 <div className="flex items-center">
// // //                                   <Calendar className="h-4 w-4 mr-2" /> Last Login: {user.lastLogin}
// // //                                 </div>
// // //                                 <div className="flex items-center">
// // //                                   <ShoppingBag className="h-4 w-4 mr-2" /> Total Orders: {user.orders}
// // //                                 </div>
// // //                               </div>
// // //                             </div>
// // //                             <div>
// // //                               <h4 className="font-medium text-gray-700 mb-2">User Actions</h4>
// // //                               <div className="flex space-x-2">
// // //                                 <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors">
// // //                                   Edit Profile
// // //                                 </button>
// // //                                 <button className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors">
// // //                                   View Orders
// // //                                 </button>
// // //                                 <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors">
// // //                                   Send Message
// // //                                 </button>
// // //                               </div>
// // //                             </div>
// // //                           </div>
// // //                         </td>
// // //                       </tr>
// // //                     )}
// // //                   </React.Fragment>
// // //                 ))
// // //               ) : (
// // //                 <tr>
// // //                   <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
// // //                     No users found matching your criteria.
// // //                   </td>
// // //                 </tr>
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>
        
// // //         {/* Pagination */}
// // //         <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
// // //           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
// // //             <div>
// // //               <p className="text-sm text-gray-700">
// // //                 Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
// // //                 <span className="font-medium">{filteredUsers.length}</span> results
// // //               </p>
// // //             </div>
// // //             <div>
// // //               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
// // //                 <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
// // //                   Previous
// // //                 </a>
// // //                 <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
// // //                   1
// // //                 </a>
// // //                 <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
// // //                   Next
// // //                 </a>
// // //               </nav>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Action Menu */}
// // //       {actionMenu && (
// // //         <div className="fixed inset-0 z-50" onClick={closeActionMenu}>
// // //           <div 
// // //             className="absolute bg-white rounded-md shadow-lg py-1 z-50"
// // //             style={{
// // //               top: actionMenu.getBoundingClientRect().bottom + window.scrollY,
// // //               left: actionMenu.getBoundingClientRect().left + window.scrollX,
// // //               minWidth: '160px'
// // //             }}
// // //             onClick={e => e.stopPropagation()}
// // //           >
// // //             <button 
// // //               className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// // //               onClick={() => toggleExpand(selectedUser.id)}
// // //             >
// // //               <Eye className="h-4 w-4 mr-2" /> View Details
// // //             </button>
// // //             <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
// // //               <Edit className="h-4 w-4 mr-2" /> Edit User
// // //             </button>
// // //             <button 
// // //               className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
// // //               onClick={toggleUserStatus}
// // //             >
// // //               {selectedUser.status === 'Active' ? (
// // //                 <>
// // //                   <User className="h-4 w-4 mr-2" /> Deactivate
// // //                 </>
// // //               ) : (
// // //                 <>
// // //                   <User className="h-4 w-4 mr-2" /> Activate
// // //                 </>
// // //               )}
// // //             </button>
// // //             <button 
// // //               className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
// // //               onClick={openDeleteDialog}
// // //             >
// // //               <Trash2 className="h-4 w-4 mr-2" /> Delete
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Delete Confirmation Dialog */}
// // //       {deleteDialogOpen && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// // //           <div className="bg-white rounded-lg p-6 w-full max-w-md">
// // //             <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
// // //             <p className="text-sm text-gray-600 mb-4">
// // //               Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone.
// // //             </p>
// // //             <div className="flex justify-end space-x-3">
// // //               <button 
// // //                 className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
// // //                 onClick={() => setDeleteDialogOpen(false)}
// // //               >
// // //                 Cancel
// // //               </button>
// // //               <button 
// // //                 className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
// // //                 onClick={deleteUser}
// // //               >
// // //                 Delete
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Users;


























// // // import React, { useState } from 'react';
// // // import {
// // //   Box,
// // //   Paper,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   IconButton,
// // //   Button,
// // //   Typography,
// // //   Chip,
// // //   Stack,
// // //   Dialog,
// // //   DialogTitle,
// // //   DialogContent,
// // //   DialogActions,
// // //   DialogContentText,
// // //   TextField,
// // //   InputAdornment,
// // //   Menu,
// // //   MenuItem,
// // //   Avatar,
// // //   Card,
// // //   CardContent,
// // //   Grid
// // // } from '@mui/material';
// // // import {
// // //   Edit as EditIcon,
// // //   Delete as DeleteIcon,
// // //   MoreVert as MoreVertIcon,
// // //   Search as SearchIcon,
// // //   FileDownload as FileDownloadIcon,
// // //   Visibility as VisibilityIcon,
// // //   Block as BlockIcon,
// // //   CheckCircle as CheckCircleIcon
// // // } from '@mui/icons-material';

// // // // Sample user data
// // // const initialUsers = [
// // //   {
// // //     id: 1,
// // //     name: 'John Doe',
// // //     email: 'john.doe@example.com',
// // //     phone: '+1 (555) 123-4567',
// // //     role: 'Customer',
// // //     status: 'Active',
// // //     joinDate: '2023-01-15',
// // //     lastLogin: '2023-10-20',
// // //     orders: 12,
// // //     avatar: 'https://via.placeholder.com/40',
// // //     address: '123 Main St, New York, NY'
// // //   },
// // //   {
// // //     id: 2,
// // //     name: 'Jane Smith',
// // //     email: 'jane.smith@example.com',
// // //     phone: '+1 (555) 987-6543',
// // //     role: 'Admin',
// // //     status: 'Active',
// // //     joinDate: '2022-08-22',
// // //     lastLogin: '2023-10-21',
// // //     orders: 45,
// // //     avatar: 'https://via.placeholder.com/40',
// // //     address: '456 Oak Ave, Los Angeles, CA'
// // //   },
// // //   {
// // //     id: 3,
// // //     name: 'Robert Johnson',
// // //     email: 'robert.j@example.com',
// // //     phone: '+1 (555) 456-7890',
// // //     role: 'Customer',
// // //     status: 'Inactive',
// // //     joinDate: '2023-03-10',
// // //     lastLogin: '2023-09-15',
// // //     orders: 3,
// // //     avatar: 'https://via.placeholder.com/40',
// // //     address: '789 Pine Rd, Chicago, IL'
// // //   },
// // //   {
// // //     id: 4,
// // //     name: 'Sarah Wilson',
// // //     email: 'sarah.w@example.com',
// // //     phone: '+1 (555) 234-5678',
// // //     role: 'Customer',
// // //     status: 'Active',
// // //     joinDate: '2022-11-05',
// // //     lastLogin: '2023-10-22',
// // //     orders: 28,
// // //     avatar: 'https://via.placeholder.com/40',
// // //     address: '321 Elm St, Miami, FL'
// // //   },
// // //   {
// // //     id: 5,
// // //     name: 'Michael Brown',
// // //     email: 'michael.b@example.com',
// // //     phone: '+1 (555) 876-5432',
// // //     role: 'Customer',
// // //     status: 'Suspended',
// // //     joinDate: '2023-05-18',
// // //     lastLogin: '2023-08-30',
// // //     orders: 7,
// // //     avatar: 'https://via.placeholder.com/40',
// // //     address: '654 Maple Dr, Seattle, WA'
// // //   }
// // // ];

// // // const Users = () => {
// // //   const [users, setUsers] = useState(initialUsers);
// // //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// // //   const [selectedUser, setSelectedUser] = useState(null);
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [statusFilter, setStatusFilter] = useState('All');
// // //   const [roleFilter, setRoleFilter] = useState('All');
// // //   const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
// // //   const [selectedUserForMenu, setSelectedUserForMenu] = useState(null);

// // //   // Filter users based on search term and filters
// // //   const filteredUsers = users.filter(user => {
// // //     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
// // //     const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
// // //     const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
// // //     return matchesSearch && matchesStatus && matchesRole;
// // //   });

// // //   const openDeleteDialog = (user) => {
// // //     setSelectedUser(user);
// // //     setDeleteDialogOpen(true);
// // //   };

// // //   const handleDeleteUser = () => {
// // //     const updatedUsers = users.filter(user => user.id !== selectedUser.id);
// // //     setUsers(updatedUsers);
// // //     setDeleteDialogOpen(false);
// // //     setSelectedUser(null);
// // //   };

// // //   const handleActionMenuOpen = (event, user) => {
// // //     setActionMenuAnchor(event.currentTarget);
// // //     setSelectedUserForMenu(user);
// // //   };

// // //   const handleActionMenuClose = () => {
// // //     setActionMenuAnchor(null);
// // //     setSelectedUserForMenu(null);
// // //   };

// // //   const toggleUserStatus = () => {
// // //     const updatedUsers = users.map(user =>
// // //       user.id === selectedUserForMenu.id
// // //         ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
// // //         : user
// // //     );
// // //     setUsers(updatedUsers);
// // //     handleActionMenuClose();
// // //   };

// // //   const exportToCSV = () => {
// // //     const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Join Date', 'Last Login', 'Orders', 'Address'];
// // //     const csvContent = [
// // //       headers.join(','),
// // //       ...filteredUsers.map(user => [
// // //         user.id,
// // //         `"${user.name}"`,
// // //         user.email,
// // //         user.phone,
// // //         user.role,
// // //         user.status,
// // //         user.joinDate,
// // //         user.lastLogin,
// // //         user.orders,
// // //         `"${user.address}"`
// // //       ].join(','))
// // //     ].join('\n');

// // //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// // //     const link = document.createElement('a');
// // //     const url = URL.createObjectURL(blob);
    
// // //     link.setAttribute('href', url);
// // //     link.setAttribute('download', 'users_export.csv');
// // //     link.style.visibility = 'hidden';
    
// // //     document.body.appendChild(link);
// // //     link.click();
// // //     document.body.removeChild(link);
// // //   };

// // //   const getStatusColor = (status) => {
// // //     switch (status) {
// // //       case 'Active': return 'success';
// // //       case 'Inactive': return 'default';
// // //       case 'Suspended': return 'error';
// // //       default: return 'default';
// // //     }
// // //   };

// // //   const getRoleColor = (role) => {
// // //     switch (role) {
// // //       case 'Admin': return 'primary'; 
// // //       case 'Customer': return 'default';
// // //       default: return 'default';
// // //     }
// // //   };

// // //   return (
// // //     <Box>
// // //       {/* Header Section */}
// // //       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
// // //         {/* <Typography variant="h4" component="h1" fontWeight="bold">
// // //           Users Management
// // //         </Typography> */}
// // //         <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
// // //         <Button
// // //           variant="contained"
// // //           startIcon={<FileDownloadIcon />}
// // //           onClick={exportToCSV}
// // //           sx={{ borderRadius: 2 }}
// // //         >
// // //           Export CSV
// // //         </Button>
// // //       </Box>

// // //       {/* Stats Cards */}
// // //       <Grid container spacing={3} sx={{ mb: 4 }}>
// // //         <Grid item xs={12} sm={6} md={3}>
// // //           <Card>
// // //             <CardContent>
// // //               <Typography color="textSecondary" gutterBottom>
// // //                 Total Users
// // //               </Typography>
// // //               <Typography variant="h5" component="div">
// // //                 {users.length}
// // //               </Typography>
// // //             </CardContent>
// // //           </Card>
// // //         </Grid>
// // //         <Grid item xs={12} sm={6} md={3}>
// // //           <Card>
// // //             <CardContent>
// // //               <Typography color="textSecondary" gutterBottom>
// // //                 Active Users
// // //               </Typography>
// // //               <Typography variant="h5" component="div" color="success.main">
// // //                 {users.filter(u => u.status === 'Active').length}
// // //               </Typography>
// // //             </CardContent>
// // //           </Card>
// // //         </Grid>
// // //         <Grid item xs={12} sm={6} md={3}>
// // //           <Card>
// // //             <CardContent>
// // //               <Typography color="textSecondary" gutterBottom>
// // //                 Customers
// // //               </Typography>
// // //               <Typography variant="h5" component="div">
// // //                 {users.filter(u => u.role === 'Customer').length}
// // //               </Typography>
// // //             </CardContent>
// // //           </Card>
// // //         </Grid>
// // //         <Grid item xs={12} sm={6} md={3}>
// // //           <Card>
// // //             <CardContent>
// // //               <Typography color="textSecondary" gutterBottom>
// // //                 Admins
// // //               </Typography>
// // //               <Typography variant="h5" component="div">
// // //                 {users.filter(u => u.role === 'Admin').length}
// // //               </Typography>
// // //             </CardContent>
// // //           </Card>
// // //         </Grid>
// // //       </Grid>

// // //       {/* Filters Section */}
// // //       <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
// // //         <Grid container spacing={2} alignItems="center">
// // //           <Grid item xs={12} md={4}>
// // //             <TextField
// // //               fullWidth
// // //               placeholder="Search users..."
// // //               value={searchTerm}
// // //               onChange={(e) => setSearchTerm(e.target.value)}
// // //               InputProps={{
// // //                 startAdornment: (
// // //                   <InputAdornment position="start">
// // //                     <SearchIcon />
// // //                   </InputAdornment>
// // //                 ),
// // //               }}
// // //             />
// // //           </Grid>
// // //           <Grid item xs={12} sm={6} md={3}>
// // //             <TextField
// // //               fullWidth
// // //               select
// // //               label="Status"
// // //               value={statusFilter}
// // //               onChange={(e) => setStatusFilter(e.target.value)}
// // //             >
// // //               <MenuItem value="All">All Status</MenuItem>
// // //               <MenuItem value="Active">Active</MenuItem>
// // //               <MenuItem value="Inactive">Inactive</MenuItem>
// // //               <MenuItem value="Suspended">Suspended</MenuItem>
// // //             </TextField>
// // //           </Grid>
// // //           <Grid item xs={12} sm={6} md={3}>
// // //             <TextField
// // //               fullWidth
// // //               select
// // //               label="Role"
// // //               value={roleFilter}
// // //               onChange={(e) => setRoleFilter(e.target.value)}
// // //             >
// // //               <MenuItem value="All">All Roles</MenuItem>
// // //               <MenuItem value="Admin">Admin</MenuItem> 
// // //               <MenuItem value="Customer">Customer</MenuItem>
// // //             </TextField>
// // //           </Grid>
// // //           <Grid item xs={12} md={2}>
// // //             <Button
// // //               fullWidth
// // //               variant="outlined"
// // //               onClick={() => {
// // //                 setSearchTerm('');
// // //                 setStatusFilter('All');
// // //                 setRoleFilter('All');
// // //               }}
// // //             >
// // //               Clear Filters
// // //             </Button>
// // //           </Grid>
// // //         </Grid>
// // //       </Paper>

// // //       {/* Users Table */}
// // //       <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
// // //         <TableContainer>
// // //           <Table>
// // //             <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
// // //               <TableRow>
// // //                 <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
// // //                 <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
// // //                 <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
// // //                 <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
// // //                 <TableCell sx={{ fontWeight: 'bold' }}>Join Date</TableCell>
// // //                 <TableCell sx={{ fontWeight: 'bold' }}>Last Login</TableCell>
// // //                 <TableCell sx={{ fontWeight: 'bold' }}>Orders</TableCell>
// // //                 <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
// // //               </TableRow>
// // //             </TableHead>
// // //             <TableBody>
// // //               {filteredUsers.map((user) => (
// // //                 <TableRow key={user.id} hover>
// // //                   <TableCell>
// // //                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
// // //                       <Avatar src={user.avatar} sx={{ mr: 2 }} />
// // //                       <Box>
// // //                         <Typography variant="subtitle1" fontWeight="medium">
// // //                           {user.name}
// // //                         </Typography>
// // //                         <Typography variant="body2" color="textSecondary">
// // //                           ID: {user.id}
// // //                         </Typography>
// // //                       </Box>
// // //                     </Box>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <Typography variant="body2">{user.email}</Typography>
// // //                     <Typography variant="body2" color="textSecondary">
// // //                       {user.phone}
// // //                     </Typography>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <Chip
// // //                       label={user.role}
// // //                       color={getRoleColor(user.role)}
// // //                       size="small"
// // //                     />
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <Chip
// // //                       label={user.status}
// // //                       color={getStatusColor(user.status)}
// // //                       size="small"
// // //                     />
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <Typography variant="body2">
// // //                       {new Date(user.joinDate).toLocaleDateString()}
// // //                     </Typography>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <Typography variant="body2">
// // //                       {new Date(user.lastLogin).toLocaleDateString()}
// // //                     </Typography>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <Typography variant="body2" fontWeight="medium">
// // //                       {user.orders}
// // //                     </Typography>
// // //                   </TableCell>
// // //                   <TableCell align="center">
// // //                     <Stack direction="row" spacing={1} justifyContent="center">
// // //                       <IconButton
// // //                         color="primary"
// // //                         size="small"
// // //                         onClick={(e) => handleActionMenuOpen(e, user)}
// // //                       >
// // //                         <MoreVertIcon />
// // //                       </IconButton>
// // //                     </Stack>
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ))}
// // //             </TableBody>
// // //           </Table>
// // //         </TableContainer>

// // //         {filteredUsers.length === 0 && (
// // //           <Box sx={{ p: 4, textAlign: 'center' }}>
// // //             <Typography variant="h6" color="textSecondary">
// // //               No users found
// // //             </Typography>
// // //             <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
// // //               Try adjusting your search or filter criteria
// // //             </Typography>
// // //           </Box>
// // //         )}
// // //       </Paper>

// // //       {/* Action Menu */}
// // //       <Menu
// // //         anchorEl={actionMenuAnchor}
// // //         open={Boolean(actionMenuAnchor)}
// // //         onClose={handleActionMenuClose}
// // //       >
// // //         <MenuItem onClick={() => { handleActionMenuClose(); }}>
// // //           <VisibilityIcon sx={{ mr: 1 }} /> View Details
// // //         </MenuItem>
// // //         <MenuItem onClick={() => { handleActionMenuClose(); }}>
// // //           <EditIcon sx={{ mr: 1 }} /> Edit User
// // //         </MenuItem>
// // //         <MenuItem onClick={toggleUserStatus}>
// // //           {selectedUserForMenu?.status === 'Active' ? (
// // //             <>
// // //               <BlockIcon sx={{ mr: 1 }} /> Deactivate
// // //             </>
// // //           ) : (
// // //             <>
// // //               <CheckCircleIcon sx={{ mr: 1 }} /> Activate
// // //             </>
// // //           )}
// // //         </MenuItem>
// // //         <MenuItem onClick={() => openDeleteDialog(selectedUserForMenu)}>
// // //           <DeleteIcon sx={{ mr: 1 }} /> Delete
// // //         </MenuItem>
// // //       </Menu>

// // //       {/* Delete Confirmation Dialog */}
// // //       <Dialog
// // //         open={deleteDialogOpen}
// // //         onClose={() => setDeleteDialogOpen(false)}
// // //       >
// // //         <DialogTitle>Delete User</DialogTitle>
// // //         <DialogContent>
// // //           <DialogContentText>
// // //             Are you sure you want to delete the user "{selectedUser?.name}"? This action cannot be undone.
// // //           </DialogContentText>
// // //         </DialogContent>
// // //         <DialogActions>
// // //           <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
// // //           <Button onClick={handleDeleteUser} color="error" autoFocus>
// // //             Delete
// // //           </Button>
// // //         </DialogActions>
// // //       </Dialog>
// // //     </Box>
// // //   );
// // // };

// // // export default Users;