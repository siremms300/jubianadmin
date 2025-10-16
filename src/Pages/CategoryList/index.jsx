import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp, Plus, X, Image, MoreVertical } from 'lucide-react';
import { categoryApi } from '../../utils/categoryApi';
import { toast } from 'react-toastify';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    status: 'Active', 
    color: '#000000',
    parentId: null,
    image: null,
    imagePreview: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (sidebarOpen) {
      setNewCategory({
        name: '',
        description: '',
        status: 'Active',
        color: '#000000',
        parentId: null,
        image: null,
        imagePreview: ''
      });
      setSelectedCategory(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     // Validate file type
  //     if (!file.type.startsWith('image/')) {
  //       toast.error('Please select a valid image file');
  //       return;
  //     }

  //     // Validate file size (5MB)
  //     if (file.size > 5 * 1024 * 1024) {
  //       toast.error('Image size should be less than 5MB');
  //       return;
  //     }

  //     const imagePreview = URL.createObjectURL(file);
  //     setNewCategory({
  //       ...newCategory,
  //       image: file,
  //       imagePreview
  //     });
  //   }
  // };


  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   console.log('📁 File selected:', file);
    
  //   if (file) {
  //     // Quick validation
  //     const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  //     if (!validTypes.includes(file.type)) {
  //       toast.error('Please select JPEG, PNG, or WebP image');
  //       return;
  //     }

  //     if (file.size > 5 * 1024 * 1024) {
  //       toast.error('Image must be smaller than 5MB');
  //       return;
  //     }

  //     // Create preview
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setNewCategory({
  //         ...newCategory,
  //         image: file,
  //         imagePreview: e.target.result
  //       });
  //       console.log('✅ Image preview set');
  //     };
  //     reader.readAsDataURL(file);
      
  //   } else {
  //     console.log('❌ No file found in event');
  //   }
  // };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Use FileReader for preview
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setNewCategory(prev => ({
          ...prev,
          image: file,
          imagePreview: event.target.result
        }));
        console.log('🖼️ Image preview loaded via FileReader');
      };
      
      reader.onerror = (error) => {
        console.error('❌ FileReader error:', error);
        toast.error('Error loading image');
      };
      
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setNewCategory({
      ...newCategory,
      image: null,
      imagePreview: ''
    });
  };

  const prepareFormData = () => {
    const formData = new FormData();
    formData.append('name', newCategory.name);
    formData.append('description', newCategory.description);
    formData.append('status', newCategory.status);
    formData.append('color', newCategory.color);
    if (newCategory.parentId) {
      formData.append('parentId', newCategory.parentId);
    }
    if (newCategory.image) {
      formData.append('image', newCategory.image);
    }
    return formData;
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast.error('Category name is required');
      return;
    }

    try {
      setUploading(true);
      const formData = prepareFormData();
      const response = await categoryApi.createCategory(formData);
      
      if (response.success) {
        toast.success('Category created successfully');
        setCategories([...categories, response.data]);
        toggleSidebar();
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setUploading(false);
    }
  };

  const handleEditCategory = (category) => {
    setNewCategory({
      name: category.name,
      description: category.description || '',
      status: category.status,
      color: category.color || '#000000',
      parentId: category.parentId?._id || null,
      image: null,
      imagePreview: category.images[0] || ''
    });
    setSelectedCategory(category);
    setSidebarOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory || !newCategory.name) {
      toast.error('Category name is required');
      return;
    }

    try {
      setUploading(true);
      const formData = prepareFormData();
      const response = await categoryApi.updateCategory(selectedCategory._id, formData);
      
      if (response.success) {
        toast.success('Category updated successfully');
        const updatedCategories = categories.map(cat =>
          cat._id === selectedCategory._id ? response.data : cat
        );
        setCategories(updatedCategories);
        setSidebarOpen(false);
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.message || 'Failed to update category');
    } finally {
      setUploading(false);
    }
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    try {
      const response = await categoryApi.deleteCategory(selectedCategory._id);
      if (response.success) {
        toast.success('Category deleted successfully');
        const updatedCategories = categories.filter(cat => cat._id !== selectedCategory._id);
        setCategories(updatedCategories);
        setDeleteDialogOpen(false);
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Filter categories based on search term and filters
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || category.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get status badge class
  const getStatusClass = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Description', 'Status', 'Products'];
    const csvContent = [
      headers.join(','),
      ...filteredCategories.map(category => [
        category._id,
        `"${category.name}"`,
        `"${category.description || ''}"`,
        category.status,
        category.subcategories ? category.subcategories.length : 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'categories_export.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>
        <p className="text-gray-600">Manage and organize product categories</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Image className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Image className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-green-600">
                {categories.filter(c => c.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Image className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Subcategories</p>
              <p className="text-2xl font-bold">
                {categories.reduce((total, cat) => total + (cat.subcategories ? cat.subcategories.length : 0), 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="rounded-full bg-indigo-100 p-3 mr-4">
              <Image className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inactive Categories</p>
              <p className="text-2xl font-bold">
                {categories.filter(c => c.status === 'Inactive').length}
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
              placeholder="Search categories..."
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
          </select>
          
          <div className="flex space-x-2">
            <button 
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={exportToCSV}
            >
              <Download className="h-5 w-5 mr-2" />
              Export CSV
            </button>
            <button 
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
          
          <button 
            className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            onClick={toggleSidebar}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Category Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="ml-1 h-4 w-4" /> : 
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('subcategories')}
                >
                  <div className="flex items-center">
                    Subcategories
                    {sortConfig.key === 'subcategories' && (
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
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={category.images[0]} 
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500">ID: {category._id.slice(-8)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs">
                        {category.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(category.status)}`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.subcategories ? category.subcategories.length : 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={() => handleEditCategory(category)}
                          title="Edit Category"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 transition-colors"
                          onClick={() => openDeleteDialog(category)}
                          title="Delete Category"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No categories found matching your criteria.
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCategories.length}</span> of{' '}
                <span className="font-medium">{filteredCategories.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Category Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleSidebar}
          ></div>
          <div className="bg-white h-full w-full max-w-md overflow-y-auto z-50 relative">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={toggleSidebar}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="h-32 w-32 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden mb-3 border-2 border-dashed border-gray-300">
                    {newCategory.imagePreview ? (
                      <div className="relative">
                        <img 
                          src={newCategory.imagePreview} 
                          alt="Category preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <Image className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <label className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                    <span>{newCategory.imagePreview ? 'Change Image' : 'Upload Image'}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP (Max 15MB)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newCategory.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter category description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    name="color"
                    value={newCategory.color}
                    onChange={handleInputChange}
                    className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newCategory.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                
                <button
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  onClick={selectedCategory ? handleUpdateCategory : handleAddCategory}
                  disabled={!newCategory.name || uploading}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {selectedCategory ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    selectedCategory ? 'Update Category' : 'Add Category'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Category</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md border border-gray-300"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDeleteCategory}
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

export default CategoryList;





































































































































































// import React, { useState } from 'react';
// import {
//   Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp,
//   Plus, X, Image, MoreVertical
// } from 'lucide-react';

// // Sample category data
// const initialCategories = [
//   {
//     id: 1,
//     name: 'Electronics',
//     image: 'https://via.placeholder.com/80',
//     description: 'Electronic devices and gadgets',
//     status: 'Active',
//     products: 42
//   },
//   {
//     id: 2,
//     name: 'Clothing',
//     image: 'https://via.placeholder.com/80',
//     description: 'Fashion and apparel',
//     status: 'Active',
//     products: 78
//   },
//   {
//     id: 3,
//     name: 'Home & Kitchen',
//     image: 'https://via.placeholder.com/80',
//     description: 'Home appliances and kitchenware',
//     status: 'Active',
//     products: 56
//   },
//   {
//     id: 4,
//     name: 'Beauty',
//     image: 'https://via.placeholder.com/80',
//     description: 'Cosmetics and personal care',
//     status: 'Inactive',
//     products: 34
//   }
// ];

// const CategoryList = () => {
//   const [categories, setCategories] = useState(initialCategories);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [newCategory, setNewCategory] = useState({
//     name: '',
//     description: '',
//     status: 'Active',
//     image: null
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

//   // Filter categories based on search term and filters
//   const filteredCategories = categories.filter(category => {
//     const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          category.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'All' || category.status === statusFilter;
    
//     return matchesSearch && matchesStatus;
//   });

//   // Handle sorting
//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
    
//     const sortedCategories = [...filteredCategories].sort((a, b) => {
//       if (a[key] < b[key]) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (a[key] > b[key]) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });
    
//     setCategories(sortedCategories);
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//     // Reset form when closing sidebar
//     if (sidebarOpen) {
//       setNewCategory({
//         name: '',
//         description: '',
//         status: 'Active',
//         image: null
//       });
//       setSelectedCategory(null);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewCategory({
//       ...newCategory,
//       [name]: value
//     });
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setNewCategory({
//         ...newCategory,
//         image: imageUrl
//       });
//     }
//   };

//   const handleAddCategory = () => {
//     if (newCategory.name) {
//       const newCat = {
//         id: categories.length + 1,
//         name: newCategory.name,
//         description: newCategory.description,
//         status: newCategory.status,
//         image: newCategory.image || 'https://via.placeholder.com/80',
//         products: 0
//       };
//       setCategories([...categories, newCat]);
//       toggleSidebar();
//     }
//   };

//   const handleEditCategory = (category) => {
//     setNewCategory({
//       name: category.name,
//       description: category.description,
//       status: category.status,
//       image: category.image
//     });
//     setSelectedCategory(category);
//     setSidebarOpen(true);
//   };

//   const handleUpdateCategory = () => {
//     if (selectedCategory && newCategory.name) {
//       const updatedCategories = categories.map(cat =>
//         cat.id === selectedCategory.id
//           ? {
//               ...cat,
//               name: newCategory.name,
//               description: newCategory.description,
//               status: newCategory.status,
//               image: newCategory.image || cat.image
//             }
//           : cat
//       );
//       setCategories(updatedCategories);
//       setSidebarOpen(false);
//       setSelectedCategory(null);
//     }
//   };

//   const openDeleteDialog = (category) => {
//     setSelectedCategory(category);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteCategory = () => {
//     const updatedCategories = categories.filter(cat => cat.id !== selectedCategory.id);
//     setCategories(updatedCategories);
//     setDeleteDialogOpen(false);
//     setSelectedCategory(null);
//   };

//   // Get status badge class
//   const getStatusClass = (status) => {
//     return status === 'Active' 
//       ? 'bg-green-100 text-green-800' 
//       : 'bg-gray-100 text-gray-800';
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const headers = ['ID', 'Name', 'Description', 'Status', 'Products'];
//     const csvContent = [
//       headers.join(','),
//       ...filteredCategories.map(category => [
//         category.id,
//         `"${category.name}"`,
//         `"${category.description}"`,
//         category.status,
//         category.products
//       ].join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
    
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'categories_export.csv');
//     link.style.visibility = 'hidden';
    
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>
//         <p className="text-gray-600">Manage and organize product categories</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-blue-100 p-3 mr-4">
//               <Image className="h-6 w-6 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Total Categories</p>
//               <p className="text-2xl font-bold">{categories.length}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-green-100 p-3 mr-4">
//               <Image className="h-6 w-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Active Categories</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {categories.filter(c => c.status === 'Active').length}
//               </p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-purple-100 p-3 mr-4">
//               <Image className="h-6 w-6 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Total Products</p>
//               <p className="text-2xl font-bold">
//                 {categories.reduce((total, cat) => total + cat.products, 0)}
//               </p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-indigo-100 p-3 mr-4">
//               <Image className="h-6 w-6 text-indigo-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Inactive Categories</p>
//               <p className="text-2xl font-bold">
//                 {categories.filter(c => c.status === 'Inactive').length}
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
//               placeholder="Search categories..."
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
//           </select>
          
//           <div className="flex space-x-2">
//             <button 
//               className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               onClick={exportToCSV}
//             >
//               <Download className="h-5 w-5 mr-2" />
//               Export CSV
//             </button>
//             <button 
//               className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               <Filter className="h-5 w-5 mr-2" />
//               More Filters
//             </button>
//           </div>
          
//           <button 
//             className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
//             onClick={toggleSidebar}
//           >
//             <Plus className="h-5 w-5 mr-2" />
//             Add Category
//           </button>
//         </div>
//       </div>

//       {/* Categories Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Image
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('name')}
//                 >
//                   <div className="flex items-center">
//                     Category Name
//                     {sortConfig.key === 'name' && (
//                       sortConfig.direction === 'ascending' ? 
//                       <ChevronUp className="ml-1 h-4 w-4" /> : 
//                       <ChevronDown className="ml-1 h-4 w-4" />
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('products')}
//                 >
//                   <div className="flex items-center">
//                     Products
//                     {sortConfig.key === 'products' && (
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
//               {filteredCategories.length > 0 ? (
//                 filteredCategories.map((category) => (
//                   <tr key={category.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
//                         <img 
//                           src={category.image} 
//                           alt={category.name}
//                           className="h-full w-full object-cover"
//                         />
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{category.name}</div>
//                       <div className="text-sm text-gray-500">ID: {category.id}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-600 max-w-xs">
//                         {category.description}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(category.status)}`}>
//                         {category.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {category.products}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center space-x-2">
//                         <button 
//                           className="text-blue-600 hover:text-blue-800 transition-colors"
//                           onClick={() => handleEditCategory(category)}
//                           title="Edit Category"
//                         >
//                           <Edit className="h-5 w-5" />
//                         </button>
//                         <button 
//                           className="text-red-600 hover:text-red-800 transition-colors"
//                           onClick={() => openDeleteDialog(category)}
//                           title="Delete Category"
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
//                     No categories found matching your criteria.
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
//                 Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCategories.length}</span> of{' '}
//                 <span className="font-medium">{filteredCategories.length}</span> results
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

//       {/* Add/Edit Category Sidebar */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 z-50 flex justify-end">
//           <div 
//             className="fixed inset-0 bg-opacity-0"
//             onClick={toggleSidebar}
//           ></div>
//           <div className="bg-[#e7e7e7] h-full w-full max-w-md overflow-y-auto z-50 relative">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-gray-800">
//                   {selectedCategory ? 'Edit Category' : 'Add New Category'}
//                 </h2>
//                 <button 
//                   className="text-gray-500 hover:text-gray-700"
//                   onClick={toggleSidebar}
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="flex flex-col items-center">
//                   <div className="h-32 w-32 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden mb-3">
//                     {newCategory.image ? (
//                       <img 
//                         src={newCategory.image} 
//                         alt="Category preview"
//                         className="h-full w-full object-cover"
//                       />
//                     ) : (
//                       <Image className="h-12 w-12 text-gray-400" />
//                     )}
//                   </div>
//                   <label className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
//                     <span>Upload Image</span>
//                     <input
//                       type="file"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                     />
//                   </label>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={newCategory.name}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter category name"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={newCategory.description}
//                     onChange={handleInputChange}
//                     rows={3}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter category description"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Status
//                   </label>
//                   <select
//                     name="status"
//                     value={newCategory.status}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </div>
                
//                 <button
//                   className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
//                   onClick={selectedCategory ? handleUpdateCategory : handleAddCategory}
//                   disabled={!newCategory.name}
//                 >
//                   {selectedCategory ? 'Update Category' : 'Add Category'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      

//       {/* Delete Confirmation Dialog */}
//       {deleteDialogOpen && (
//         <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-[#e7e7e7] rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Category</h3>
//             <p className="text-sm text-gray-600 mb-4">
//               Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
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
//                 onClick={handleDeleteCategory}
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

// export default CategoryList;













































// import React, { useState } from 'react';
// import {
//   Eye, Edit, Trash2, Search, Filter, Download, ChevronDown, ChevronUp,
//   Plus, X, Image, MoreVertical
// } from 'lucide-react';

// // Sample category data
// const initialCategories = [
//   {
//     id: 1,
//     name: 'Electronics',
//     image: 'https://via.placeholder.com/80',
//     description: 'Electronic devices and gadgets',
//     status: 'Active',
//     products: 42
//   },
//   {
//     id: 2,
//     name: 'Clothing',
//     image: 'https://via.placeholder.com/80',
//     description: 'Fashion and apparel',
//     status: 'Active',
//     products: 78
//   },
//   {
//     id: 3,
//     name: 'Home & Kitchen',
//     image: 'https://via.placeholder.com/80',
//     description: 'Home appliances and kitchenware',
//     status: 'Active',
//     products: 56
//   },
//   {
//     id: 4,
//     name: 'Beauty',
//     image: 'https://via.placeholder.com/80',
//     description: 'Cosmetics and personal care',
//     status: 'Inactive',
//     products: 34
//   }
// ];

// const CategoryList = () => {
//   const [categories, setCategories] = useState(initialCategories);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [newCategory, setNewCategory] = useState({
//     name: '',
//     description: '',
//     status: 'Active',
//     image: null
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

//   // Filter categories based on search term and filters
//   const filteredCategories = categories.filter(category => {
//     const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          category.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'All' || category.status === statusFilter;
    
//     return matchesSearch && matchesStatus;
//   });

//   // Handle sorting
//   const handleSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
    
//     const sortedCategories = [...filteredCategories].sort((a, b) => {
//       if (a[key] < b[key]) {
//         return direction === 'ascending' ? -1 : 1;
//       }
//       if (a[key] > b[key]) {
//         return direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });
    
//     setCategories(sortedCategories);
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//     // Reset form when closing sidebar
//     if (sidebarOpen) {
//       setNewCategory({
//         name: '',
//         description: '',
//         status: 'Active',
//         image: null
//       });
//       setSelectedCategory(null);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewCategory({
//       ...newCategory,
//       [name]: value
//     });
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setNewCategory({
//         ...newCategory,
//         image: imageUrl
//       });
//     }
//   };

//   const handleAddCategory = () => {
//     if (newCategory.name) {
//       const newCat = {
//         id: categories.length + 1,
//         name: newCategory.name,
//         description: newCategory.description,
//         status: newCategory.status,
//         image: newCategory.image || 'https://via.placeholder.com/80',
//         products: 0
//       };
//       setCategories([...categories, newCat]);
//       toggleSidebar();
//     }
//   };

//   const handleEditCategory = (category) => {
//     setNewCategory({
//       name: category.name,
//       description: category.description,
//       status: category.status,
//       image: category.image
//     });
//     setSelectedCategory(category);
//     setSidebarOpen(true);
//   };

//   const handleUpdateCategory = () => {
//     if (selectedCategory && newCategory.name) {
//       const updatedCategories = categories.map(cat =>
//         cat.id === selectedCategory.id
//           ? {
//               ...cat,
//               name: newCategory.name,
//               description: newCategory.description,
//               status: newCategory.status,
//               image: newCategory.image || cat.image
//             }
//           : cat
//       );
//       setCategories(updatedCategories);
//       setSidebarOpen(false);
//       setSelectedCategory(null);
//     }
//   };

//   const openDeleteDialog = (category) => {
//     setSelectedCategory(category);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteCategory = () => {
//     const updatedCategories = categories.filter(cat => cat.id !== selectedCategory.id);
//     setCategories(updatedCategories);
//     setDeleteDialogOpen(false);
//     setSelectedCategory(null);
//   };

//   // Get status badge class
//   const getStatusClass = (status) => {
//     return status === 'Active' 
//       ? 'bg-green-100 text-green-800' 
//       : 'bg-gray-100 text-gray-800';
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const headers = ['ID', 'Name', 'Description', 'Status', 'Products'];
//     const csvContent = [
//       headers.join(','),
//       ...filteredCategories.map(category => [
//         category.id,
//         `"${category.name}"`,
//         `"${category.description}"`,
//         category.status,
//         category.products
//       ].join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
    
//     link.setAttribute('href', url);
//     link.setAttribute('download', 'categories_export.csv');
//     link.style.visibility = 'hidden';
    
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>
//         <p className="text-gray-600">Manage and organize product categories</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-blue-100 p-3 mr-4">
//               <Image className="h-6 w-6 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Total Categories</p>
//               <p className="text-2xl font-bold">{categories.length}</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-green-100 p-3 mr-4">
//               <Image className="h-6 w-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Active Categories</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {categories.filter(c => c.status === 'Active').length}
//               </p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-purple-100 p-3 mr-4">
//               <Image className="h-6 w-6 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Total Products</p>
//               <p className="text-2xl font-bold">
//                 {categories.reduce((total, cat) => total + cat.products, 0)}
//               </p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow p-4">
//           <div className="flex items-center">
//             <div className="rounded-full bg-indigo-100 p-3 mr-4">
//               <Image className="h-6 w-6 text-indigo-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Inactive Categories</p>
//               <p className="text-2xl font-bold">
//                 {categories.filter(c => c.status === 'Inactive').length}
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
//               placeholder="Search categories..."
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
//           </select>
          
//           <div className="flex space-x-2">
//             <button 
//               className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               onClick={exportToCSV}
//             >
//               <Download className="h-5 w-5 mr-2" />
//               Export CSV
//             </button>
//             <button 
//               className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               <Filter className="h-5 w-5 mr-2" />
//               More Filters
//             </button>
//           </div>
          
//           <button 
//             className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//             onClick={toggleSidebar}
//           >
//             <Plus className="h-5 w-5 mr-2" />
//             Add Category
//           </button>
//         </div>
//       </div>

//       {/* Categories Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Image
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('name')}
//                 >
//                   <div className="flex items-center">
//                     Category Name
//                     {sortConfig.key === 'name' && (
//                       sortConfig.direction === 'ascending' ? 
//                       <ChevronUp className="ml-1 h-4 w-4" /> : 
//                       <ChevronDown className="ml-1 h-4 w-4" />
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th 
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                   onClick={() => handleSort('products')}
//                 >
//                   <div className="flex items-center">
//                     Products
//                     {sortConfig.key === 'products' && (
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
//               {filteredCategories.length > 0 ? (
//                 filteredCategories.map((category) => (
//                   <tr key={category.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
//                         <img 
//                           src={category.image} 
//                           alt={category.name}
//                           className="h-full w-full object-cover"
//                         />
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{category.name}</div>
//                       <div className="text-sm text-gray-500">ID: {category.id}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-600 max-w-xs">
//                         {category.description}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(category.status)}`}>
//                         {category.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {category.products}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center space-x-2">
//                         <button 
//                           className="text-blue-600 hover:text-blue-800 transition-colors"
//                           onClick={() => handleEditCategory(category)}
//                           title="Edit Category"
//                         >
//                           <Edit className="h-5 w-5" />
//                         </button>
//                         <button 
//                           className="text-red-600 hover:text-red-800 transition-colors"
//                           onClick={() => openDeleteDialog(category)}
//                           title="Delete Category"
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
//                     No categories found matching your criteria.
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
//                 Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCategories.length}</span> of{' '}
//                 <span className="font-medium">{filteredCategories.length}</span> results
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

      {/* Add/Edit Category Sidebar */}
      // {sidebarOpen && (
      //   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      //     <div className="bg-white h-full w-full max-w-md overflow-y-auto">
      //       <div className="p-6">
      //         <div className="flex justify-between items-center mb-4">
      //           <h2 className="text-xl font-bold text-gray-800">
      //             {selectedCategory ? 'Edit Category' : 'Add New Category'}
      //           </h2>
      //           <button 
      //             className="text-gray-500 hover:text-gray-700"
      //             onClick={toggleSidebar}
      //           >
      //             <X className="h-6 w-6" />
      //           </button>
      //         </div>
              
      //         <div className="space-y-4">
      //           <div className="flex flex-col items-center">
      //             <div className="h-32 w-32 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden mb-3">
      //               {newCategory.image ? (
      //                 <img 
      //                   src={newCategory.image} 
      //                   alt="Category preview"
      //                   className="h-full w-full object-cover"
      //                 />
      //               ) : (
      //                 <Image className="h-12 w-12 text-gray-400" />
      //               )}
      //             </div>
      //             <label className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
      //               <span>Upload Image</span>
      //               <input
      //                 type="file"
      //                 className="hidden"
      //                 accept="image/*"
      //                 onChange={handleImageUpload}
      //               />
      //             </label>
      //           </div>
                
      //           <div>
      //             <label className="block text-sm font-medium text-gray-700 mb-1">
      //               Category Name *
      //             </label>
      //             <input
      //               type="text"
      //               name="name"
      //               value={newCategory.name}
      //               onChange={handleInputChange}
      //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      //               placeholder="Enter category name"
      //             />
      //           </div>
                
      //           <div>
      //             <label className="block text-sm font-medium text-gray-700 mb-1">
      //               Description
      //             </label>
      //             <textarea
      //               name="description"
      //               value={newCategory.description}
      //               onChange={handleInputChange}
      //               rows={3}
      //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      //               placeholder="Enter category description"
      //             />
      //           </div>
                
      //           <div>
      //             <label className="block text-sm font-medium text-gray-700 mb-1">
      //               Status
      //             </label>
      //             <select
      //               name="status"
      //               value={newCategory.status}
      //               onChange={handleInputChange}
      //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      //             >
      //               <option value="Active">Active</option>
      //               <option value="Inactive">Inactive</option>
      //             </select>
      //           </div>
                
      //           <button
      //             className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
      //             onClick={selectedCategory ? handleUpdateCategory : handleAddCategory}
      //             disabled={!newCategory.name}
      //           >
      //             {selectedCategory ? 'Update Category' : 'Add Category'}
      //           </button>
      //         </div>
      //       </div>
      //     </div>
      //   </div>
      // )}

//       {/* Delete Confirmation Dialog */}
//       {deleteDialogOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Category</h3>
//             <p className="text-sm text-gray-600 mb-4">
//               Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
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
//                 onClick={handleDeleteCategory}
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

// export default CategoryList;








































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
//   Drawer,
//   TextField,
//   Typography,
//   Divider,
//   Avatar,
//   Chip,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   DialogContentText
// } from '@mui/material';
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon,
//   Close as CloseIcon,
//   Image as ImageIcon
// } from '@mui/icons-material';

// // Sample category data
// const initialCategories = [
//   {
//     id: 1,
//     name: 'Electronics',
//     image: 'https://via.placeholder.com/80',
//     description: 'Electronic devices and gadgets',
//     status: 'Active',
//     products: 42
//   },
//   {
//     id: 2,
//     name: 'Clothing',
//     image: 'https://via.placeholder.com/80',
//     description: 'Fashion and apparel',
//     status: 'Active',
//     products: 78
//   },
//   {
//     id: 3,
//     name: 'Home & Kitchen',
//     image: 'https://via.placeholder.com/80',
//     description: 'Home appliances and kitchenware',
//     status: 'Active',
//     products: 56
//   },
//   {
//     id: 4,
//     name: 'Beauty',
//     image: 'https://via.placeholder.com/80',
//     description: 'Cosmetics and personal care',
//     status: 'Inactive',
//     products: 34
//   }
// ];

// const CategoryList = () => {
//   const [categories, setCategories] = useState(initialCategories);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [newCategory, setNewCategory] = useState({
//     name: '',
//     description: '',
//     status: 'Active',
//     image: null
//   });

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//     // Reset form when closing sidebar
//     if (sidebarOpen) {
//       setNewCategory({
//         name: '',
//         description: '',
//         status: 'Active',
//         image: null
//       });
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewCategory({
//       ...newCategory,
//       [name]: value
//     });
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setNewCategory({
//         ...newCategory,
//         image: imageUrl
//       });
//     }
//   };

//   const handleAddCategory = () => {
//     if (newCategory.name) {
//       const newCat = {
//         id: categories.length + 1,
//         name: newCategory.name,
//         description: newCategory.description,
//         status: newCategory.status,
//         image: newCategory.image || 'https://via.placeholder.com/80',
//         products: 0
//       };
//       setCategories([...categories, newCat]);
//       toggleSidebar();
//     }
//   };

//   const handleEditCategory = (category) => {
//     // For simplicity, we're using the same sidebar for add/edit
//     setNewCategory({
//       name: category.name,
//       description: category.description,
//       status: category.status,
//       image: category.image
//     });
//     setSelectedCategory(category);
//     setSidebarOpen(true);
//   };

//   const handleUpdateCategory = () => {
//     if (selectedCategory && newCategory.name) {
//       const updatedCategories = categories.map(cat =>
//         cat.id === selectedCategory.id
//           ? {
//               ...cat,
//               name: newCategory.name,
//               description: newCategory.description,
//               status: newCategory.status,
//               image: newCategory.image || cat.image
//             }
//           : cat
//       );
//       setCategories(updatedCategories);
//       setSidebarOpen(false);
//       setSelectedCategory(null);
//     }
//   };

//   const openDeleteDialog = (category) => {
//     setSelectedCategory(category);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteCategory = () => {
//     const updatedCategories = categories.filter(cat => cat.id !== selectedCategory.id);
//     setCategories(updatedCategories);
//     setDeleteDialogOpen(false);
//     setSelectedCategory(null);
//   };

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Typography variant="h4" component="h1" fontWeight="bold">
//           Categories
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={toggleSidebar}
//           sx={{ borderRadius: 2 }}
//         >
//           Add Category
//         </Button>
//       </Box>

//       <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
//         <TableContainer>
//           <Table>
//             <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Category Name</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Products</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {categories.map((category) => (
//                 <TableRow key={category.id} hover>
//                   <TableCell>
//                     <Avatar
//                       src={category.image}
//                       variant="rounded"
//                       sx={{ width: 60, height: 60 }}
//                     >
//                       <ImageIcon />
//                     </Avatar>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="subtitle1" fontWeight="medium">
//                       {category.name}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2" color="textSecondary">
//                       {category.description}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={category.status}
//                       color={category.status === 'Active' ? 'success' : 'default'}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">{category.products}</Typography>
//                   </TableCell>
//                   <TableCell align="center">
//                     <Stack direction="row" spacing={1} justifyContent="center">
//                       <IconButton
//                         color="primary"
//                         onClick={() => handleEditCategory(category)}
//                         size="small"
//                       >
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton
//                         color="error"
//                         onClick={() => openDeleteDialog(category)}
//                         size="small"
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </Stack>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Add/Edit Category Sidebar */}
//       <Drawer
//         anchor="right"
//         open={sidebarOpen}
//         onClose={toggleSidebar}
//         PaperProps={{
//           sx: { width: 400 }
//         }}
//       >
//         <Box sx={{ p: 3 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//             <Typography variant="h6">
//               {selectedCategory ? 'Edit Category' : 'Add New Category'}
//             </Typography>
//             <IconButton onClick={toggleSidebar}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//           <Divider sx={{ mb: 3 }} />

//           <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Avatar
//                 src={newCategory.image}
//                 variant="rounded"
//                 sx={{ width: 100, height: 100, mb: 2 }}
//               >
//                 <ImageIcon />
//               </Avatar>
//               <Button variant="outlined" component="label">
//                 Upload Image
//                 <input
//                   hidden
//                   accept="image/*"
//                   type="file"
//                   onChange={handleImageUpload}
//                 />
//               </Button>
//             </Box>

//             <TextField
//               fullWidth
//               label="Category Name"
//               name="name"
//               value={newCategory.name}
//               onChange={handleInputChange}
//               required
//             />

//             <TextField
//               fullWidth
//               multiline
//               rows={3}
//               label="Description"
//               name="description"
//               value={newCategory.description}
//               onChange={handleInputChange}
//             />

//             <TextField
//               fullWidth
//               select
//               label="Status"
//               name="status"
//               value={newCategory.status}
//               onChange={handleInputChange}
//               SelectProps={{
//                 native: true,
//               }}
//             >
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </TextField>

//             <Button
//               variant="contained"
//               onClick={selectedCategory ? handleUpdateCategory : handleAddCategory}
//               sx={{ mt: 2 }}
//               disabled={!newCategory.name}
//             >
//               {selectedCategory ? 'Update Category' : 'Add Category'}
//             </Button>
//           </Box>
//         </Box>
//       </Drawer>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//       >
//         <DialogTitle>Delete Category</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleDeleteCategory} color="error" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default CategoryList;