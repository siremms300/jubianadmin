import React, { useState } from 'react';
import {
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Drawer,
  TextField,
  Typography,
  Divider,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Category as CategoryIcon,
  SubdirectoryArrowRight as SubCategoryIcon,
  AccountTree as ThirdCategoryIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Sample data structure
const initialCategories = [
  {
    id: 1,
    name: 'Electronics',
    subCategories: [
      {
        id: 101,
        name: 'Smartphones',
        categoryId: 1,
        status: 'Active',
        thirdCategories: [
          { id: 1001, name: 'Android Phones', subCategoryId: 101, status: 'Active' },
          { id: 1002, name: 'iPhones', subCategoryId: 101, status: 'Active' },
          { id: 1003, name: 'Budget Phones', subCategoryId: 101, status: 'Inactive' }
        ]
      },
      {
        id: 102,
        name: 'Laptops',
        categoryId: 1,
        status: 'Active',
        thirdCategories: [
          { id: 1004, name: 'Gaming Laptops', subCategoryId: 102, status: 'Active' },
          { id: 1005, name: 'Business Laptops', subCategoryId: 102, status: 'Active' },
          { id: 1006, name: 'Ultrabooks', subCategoryId: 102, status: 'Active' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Clothing',
    subCategories: [
      {
        id: 201,
        name: "Men's Clothing",
        categoryId: 2,
        status: 'Active',
        thirdCategories: [
          { id: 2001, name: 'Shirts', subCategoryId: 201, status: 'Active' },
          { id: 2002, name: 'Pants', subCategoryId: 201, status: 'Active' },
          { id: 2003, name: 'Jackets', subCategoryId: 201, status: 'Inactive' }
        ]
      },
      {
        id: 202,
        name: "Women's Clothing",
        categoryId: 2,
        status: 'Active',
        thirdCategories: [
          { id: 2004, name: 'Dresses', subCategoryId: 202, status: 'Active' },
          { id: 2005, name: 'Skirts', subCategoryId: 202, status: 'Active' },
          { id: 2006, name: 'Blouses', subCategoryId: 202, status: 'Active' }
        ]
      }
    ]
  }
];

const SubCategory = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [level, setLevel] = useState('subCategory');
  const [newSubCategory, setNewSubCategory] = useState({
    name: '',
    description: '',
    categoryId: '',
    subCategoryId: '',
    status: 'Active'
  });

  // Calculate stats
  const totalCategories = categories.length;
  const totalSubCategories = categories.reduce((sum, cat) => sum + cat.subCategories.length, 0);
  const totalThirdCategories = categories.reduce(
    (sum, cat) => sum + cat.subCategories.reduce((subSum, subCat) => subSum + subCat.thirdCategories.length, 0), 
    0
  );
  const activeSubCategories = categories.reduce(
    (sum, cat) => sum + cat.subCategories.filter(sub => sub.status === 'Active').length, 
    0
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (!sidebarOpen) {
      setNewSubCategory({
        name: '',
        description: '',
        categoryId: '',
        subCategoryId: '',
        status: 'Active'
      });
      setLevel('subCategory');
      setIsEditing(false);
      setSelectedItem(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubCategory({
      ...newSubCategory,
      [name]: value
    });
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    if (e.target.value === 'subCategory') {
      setNewSubCategory({
        ...newSubCategory,
        subCategoryId: ''
      });
    }
  };

  const handleAddSubCategory = () => {
    if (newSubCategory.name && newSubCategory.categoryId) {
      if (level === 'subCategory') {
        const newSubCat = {
          id: Math.max(...categories.flatMap(c => c.subCategories).map(sc => sc.id), 0) + 1,
          name: newSubCategory.name,
          categoryId: parseInt(newSubCategory.categoryId),
          status: newSubCategory.status,
          thirdCategories: []
        };

        const updatedCategories = categories.map(cat =>
          cat.id === parseInt(newSubCategory.categoryId)
            ? { ...cat, subCategories: [...cat.subCategories, newSubCat] }
            : cat
        );

        setCategories(updatedCategories);
      } else {
        if (newSubCategory.subCategoryId) {
          const newThirdCat = {
            id: Math.max(...categories.flatMap(c => c.subCategories.flatMap(sc => sc.thirdCategories)).map(tc => tc.id), 0) + 1,
            name: newSubCategory.name,
            subCategoryId: parseInt(newSubCategory.subCategoryId),
            status: newSubCategory.status
          };

          const updatedCategories = categories.map(cat => ({
            ...cat,
            subCategories: cat.subCategories.map(sc =>
              sc.id === parseInt(newSubCategory.subCategoryId)
                ? { ...sc, thirdCategories: [...sc.thirdCategories, newThirdCat] }
                : sc
            )
          }));

          setCategories(updatedCategories);
        }
      }
      toggleSidebar();
    }
  };

  const handleEdit = (item, type) => {
    setSelectedItem(item);
    setIsEditing(true);
    setLevel(type);
    
    setNewSubCategory({
      name: item.name,
      description: item.description || '',
      categoryId: type === 'subCategory' ? item.categoryId.toString() : '',
      subCategoryId: type === 'thirdCategory' ? item.subCategoryId.toString() : '',
      status: item.status || 'Active'
    });
    
    setSidebarOpen(true);
  };

  const handleUpdate = () => {
    if (isEditing && selectedItem) {
      if (level === 'subCategory') {
        const updatedCategories = categories.map(cat => ({
          ...cat,
          subCategories: cat.subCategories.map(sc =>
            sc.id === selectedItem.id
              ? { ...sc, name: newSubCategory.name, description: newSubCategory.description, status: newSubCategory.status }
              : sc
          )
        }));
        setCategories(updatedCategories);
      } else {
        const updatedCategories = categories.map(cat => ({
          ...cat,
          subCategories: cat.subCategories.map(sc => ({
            ...sc,
            thirdCategories: sc.thirdCategories.map(tc =>
              tc.id === selectedItem.id
                ? { ...tc, name: newSubCategory.name, status: newSubCategory.status }
                : tc
            )
          }))
        }));
        setCategories(updatedCategories);
      }
      toggleSidebar();
    }
  };

  const openDeleteDialog = (item, type) => {
    setSelectedItem({...item, type});
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedItem) {
      if (selectedItem.type === 'subCategory') {
        const updatedCategories = categories.map(cat => ({
          ...cat,
          subCategories: cat.subCategories.filter(sc => sc.id !== selectedItem.id)
        }));
        setCategories(updatedCategories);
      } else {
        const updatedCategories = categories.map(cat => ({
          ...cat,
          subCategories: cat.subCategories.map(sc => ({
            ...sc,
            thirdCategories: sc.thirdCategories.filter(tc => tc.id !== selectedItem.id)
          }))
        }));
        setCategories(updatedCategories);
      }
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'default';
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        {/* <Typography variant="h4" component="h1" fontWeight="bold">
          Category Management
        </Typography> */}
        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={toggleSidebar}
          sx={{ borderRadius: 2 }}
        >
          Add Sub Category
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                    MAIN CATEGORIES
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {totalCategories}
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3,
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                    SUB CATEGORIES
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {totalSubCategories}
                  </Typography>
                </Box>
                <SubCategoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3,
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
            color: 'white',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                    THIRD CATEGORIES
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {totalThirdCategories}
                  </Typography>
                </Box>
                <ThirdCategoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: 3,
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: '#333',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                    ACTIVE SUBCATEGORIES
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {activeSubCategories}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Categories Accordion */}
      {categories.map((category) => (
        <Accordion key={category.id} sx={{ mb: 2, borderRadius: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CategoryIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">{category.name}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {category.subCategories.map((subCategory) => (
              <Accordion key={subCategory.id} sx={{ mb: 2, ml: 3, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SubCategoryIcon sx={{ mr: 2, color: 'secondary.main' }} />
                      <Typography variant="subtitle1">{subCategory.name}</Typography>
                      <Chip
                        label={subCategory.status}
                        color={getStatusColor(subCategory.status)}
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(subCategory, 'subCategory');
                        }}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog({...subCategory, type: 'subCategory'}, 'subCategory');
                        }}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Third Category Name</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subCategory.thirdCategories.map((thirdCategory) => (
                          <TableRow key={thirdCategory.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ThirdCategoryIcon sx={{ mr: 1, color: 'info.main', fontSize: 20 }} />
                                <Typography variant="body2">{thirdCategory.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={thirdCategory.status}
                                color={getStatusColor(thirdCategory.status)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(thirdCategory, 'thirdCategory')}
                                size="small"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => openDeleteDialog({...thirdCategory, type: 'thirdCategory'}, 'thirdCategory')}
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setNewSubCategory({
                        ...newSubCategory,
                        categoryId: category.id.toString(),
                        subCategoryId: subCategory.id.toString()
                      });
                      setLevel('thirdCategory');
                      setIsEditing(false);
                      setSelectedItem(null);
                      setSidebarOpen(true);
                    }}
                    sx={{ mt: 2 }}
                    size="small"
                  >
                    Add Third Category
                  </Button>
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Add/Edit Category Sidebar */}
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={toggleSidebar}
        PaperProps={{
          sx: { width: 400 }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {isEditing ? 'Edit' : 'Add New'} {level === 'subCategory' ? 'Sub Category' : 'Third Category'}
            </Typography>
            <IconButton onClick={toggleSidebar}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {!isEditing && (
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={level}
                  label="Level"
                  onChange={handleLevelChange}
                >
                  <MenuItem value="subCategory">Sub Category</MenuItem>
                  <MenuItem value="thirdCategory">Third Category</MenuItem>
                </Select>
              </FormControl>
            )}

            {level === 'subCategory' && (
              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  name="categoryId"
                  value={newSubCategory.categoryId}
                  label="Parent Category"
                  onChange={handleInputChange}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {level === 'thirdCategory' && (
              <FormControl fullWidth>
                <InputLabel>Parent Sub Category</InputLabel>
                <Select
                  name="subCategoryId"
                  value={newSubCategory.subCategoryId}
                  label="Parent Sub Category"
                  onChange={handleInputChange}
                  required
                  disabled={!isEditing && !newSubCategory.categoryId}
                >
                  {categories
                    .filter(cat => !newSubCategory.categoryId || cat.id.toString() === newSubCategory.categoryId)
                    .flatMap(c => c.subCategories)
                    .map((subCategory) => (
                      <MenuItem key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            )}

            <TextField
              fullWidth
              label={`${level === 'subCategory' ? 'Sub Category' : 'Third Category'} Name`}
              name="name"
              value={newSubCategory.name}
              onChange={handleInputChange}
              required
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={newSubCategory.description}
              onChange={handleInputChange}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={newSubCategory.status}
                label="Status"
                onChange={handleInputChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={isEditing ? handleUpdate : handleAddSubCategory}
              sx={{ mt: 2 }}
              disabled={!newSubCategory.name || (level === 'subCategory' ? !newSubCategory.categoryId : !newSubCategory.subCategoryId)}
            >
              {isEditing ? 'Update' : 'Add'} {level === 'subCategory' ? 'Sub Category' : 'Third Category'}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete {selectedItem?.type === 'subCategory' ? 'Sub Category' : 'Third Category'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the {selectedItem?.type === 'subCategory' ? 'sub category' : 'third category'} "{selectedItem?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubCategory;




















































// import React, { useState } from 'react';
// import {
//   Box,
//   Paper,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
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
//   DialogContentText,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem
// } from '@mui/material';
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Add as AddIcon,
//   Close as CloseIcon,
//   Image as ImageIcon,
//   ExpandMore as ExpandMoreIcon,
//   Category as CategoryIcon
// } from '@mui/icons-material';

// // Sample data structure
// const initialCategories = [
//   {
//     id: 1,
//     name: 'Electronics',
//     subCategories: [
//       {
//         id: 101,
//         name: 'Smartphones',
//         categoryId: 1,
//         thirdCategories: [
//           { id: 1001, name: 'Android Phones', subCategoryId: 101 },
//           { id: 1002, name: 'iPhones', subCategoryId: 101 },
//           { id: 1003, name: 'Budget Phones', subCategoryId: 101 }
//         ]
//       },
//       {
//         id: 102,
//         name: 'Laptops',
//         categoryId: 1,
//         thirdCategories: [
//           { id: 1004, name: 'Gaming Laptops', subCategoryId: 102 },
//           { id: 1005, name: 'Business Laptops', subCategoryId: 102 },
//           { id: 1006, name: 'Ultrabooks', subCategoryId: 102 }
//         ]
//       }
//     ]
//   },
//   {
//     id: 2,
//     name: 'Clothing',
//     subCategories: [
//       {
//         id: 201,
//         name: "Men's Clothing",
//         categoryId: 2,
//         thirdCategories: [
//           { id: 2001, name: 'Shirts', subCategoryId: 201 },
//           { id: 2002, name: 'Pants', subCategoryId: 201 },
//           { id: 2003, name: 'Jackets', subCategoryId: 201 }
//         ]
//       },
//       {
//         id: 202,
//         name: "Women's Clothing",
//         categoryId: 2,
//         thirdCategories: [
//           { id: 2004, name: 'Dresses', subCategoryId: 202 },
//           { id: 2005, name: 'Skirts', subCategoryId: 202 },
//           { id: 2006, name: 'Blouses', subCategoryId: 202 }
//         ]
//       }
//     ]
//   }
// ];

// const SubCategory = () => {
//   const [categories, setCategories] = useState(initialCategories);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [level, setLevel] = useState('subCategory'); // 'subCategory' or 'thirdCategory'
//   const [newSubCategory, setNewSubCategory] = useState({
//     name: '',
//     description: '',
//     categoryId: '',
//     subCategoryId: '',
//     status: 'Active'
//   });

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//     if (!sidebarOpen) {
//       // Reset form when opening sidebar
//       setNewSubCategory({
//         name: '',
//         description: '',
//         categoryId: '',
//         subCategoryId: '',
//         status: 'Active'
//       });
//       setLevel('subCategory');
//       setIsEditing(false);
//       setSelectedItem(null);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewSubCategory({
//       ...newSubCategory,
//       [name]: value
//     });
//   };

//   const handleLevelChange = (e) => {
//     setLevel(e.target.value);
//     // Reset subCategoryId when changing level
//     if (e.target.value === 'subCategory') {
//       setNewSubCategory({
//         ...newSubCategory,
//         subCategoryId: ''
//       });
//     }
//   };

//   const handleAddSubCategory = () => {
//     if (newSubCategory.name && newSubCategory.categoryId) {
//       if (level === 'subCategory') {
//         // Add new subcategory
//         const newSubCat = {
//           id: Math.max(...categories.flatMap(c => c.subCategories).map(sc => sc.id), 0) + 1,
//           name: newSubCategory.name,
//           categoryId: parseInt(newSubCategory.categoryId),
//           thirdCategories: []
//         };

//         const updatedCategories = categories.map(cat =>
//           cat.id === parseInt(newSubCategory.categoryId)
//             ? { ...cat, subCategories: [...cat.subCategories, newSubCat] }
//             : cat
//         );

//         setCategories(updatedCategories);
//       } else {
//         // Add new third category
//         if (newSubCategory.subCategoryId) {
//           const newThirdCat = {
//             id: Math.max(...categories.flatMap(c => c.subCategories.flatMap(sc => sc.thirdCategories)).map(tc => tc.id), 0) + 1,
//             name: newSubCategory.name,
//             subCategoryId: parseInt(newSubCategory.subCategoryId)
//           };

//           const updatedCategories = categories.map(cat => ({
//             ...cat,
//             subCategories: cat.subCategories.map(sc =>
//               sc.id === parseInt(newSubCategory.subCategoryId)
//                 ? { ...sc, thirdCategories: [...sc.thirdCategories, newThirdCat] }
//                 : sc
//             )
//           }));

//           setCategories(updatedCategories);
//         }
//       }

//       toggleSidebar();
//     }
//   };

//   const handleEdit = (item, type) => {
//     setSelectedItem(item);
//     setIsEditing(true);
//     setLevel(type === 'subCategory' ? 'subCategory' : 'thirdCategory');
    
//     setNewSubCategory({
//       name: item.name,
//       description: item.description || '',
//       categoryId: type === 'subCategory' ? item.categoryId.toString() : '',
//       subCategoryId: type === 'thirdCategory' ? item.subCategoryId.toString() : '',
//       status: item.status || 'Active'
//     });
    
//     setSidebarOpen(true);
//   };

//   const handleUpdate = () => {
//     if (isEditing && selectedItem) {
//       if (level === 'subCategory') {
//         // Update subcategory
//         const updatedCategories = categories.map(cat => ({
//           ...cat,
//           subCategories: cat.subCategories.map(sc =>
//             sc.id === selectedItem.id
//               ? { ...sc, name: newSubCategory.name, description: newSubCategory.description }
//               : sc
//           )
//         }));
//         setCategories(updatedCategories);
//       } else {
//         // Update third category
//         const updatedCategories = categories.map(cat => ({
//           ...cat,
//           subCategories: cat.subCategories.map(sc => ({
//             ...sc,
//             thirdCategories: sc.thirdCategories.map(tc =>
//               tc.id === selectedItem.id
//                 ? { ...tc, name: newSubCategory.name }
//                 : tc
//             )
//           }))
//         }));
//         setCategories(updatedCategories);
//       }
      
//       toggleSidebar();
//     }
//   };

//   const openDeleteDialog = (item, type) => {
//     setSelectedItem({...item, type});
//     setDeleteDialogOpen(true);
//   };

//   const handleDelete = () => {
//     if (selectedItem) {
//       if (selectedItem.type === 'subCategory') {
//         // Delete subcategory
//         const updatedCategories = categories.map(cat => ({
//           ...cat,
//           subCategories: cat.subCategories.filter(sc => sc.id !== selectedItem.id)
//         }));
//         setCategories(updatedCategories);
//       } else {
//         // Delete third category
//         const updatedCategories = categories.map(cat => ({
//           ...cat,
//           subCategories: cat.subCategories.map(sc => ({
//             ...sc,
//             thirdCategories: sc.thirdCategories.filter(tc => tc.id !== selectedItem.id)
//           }))
//         }));
//         setCategories(updatedCategories);
//       }
      
//       setDeleteDialogOpen(false);
//       setSelectedItem(null);
//     }
//   };

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
//         <Typography variant="h4" component="h1" fontWeight="bold">
//           Sub Categories
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={toggleSidebar}
//           sx={{ borderRadius: 2 }}
//         >
//           Add Sub Category
//         </Button>
//       </Box>

//       {categories.map((category) => (
//         <Accordion key={category.id} sx={{ mb: 2 }}>
//           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <CategoryIcon sx={{ mr: 2 }} />
//               <Typography variant="h6">{category.name}</Typography>
//             </Box>
//           </AccordionSummary>
//           <AccordionDetails>
//             {category.subCategories.map((subCategory) => (
//               <Accordion key={subCategory.id} sx={{ mb: 2, ml: 3 }}>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
//                     <Typography variant="subtitle1">{subCategory.name}</Typography>
//                     <Box>
//                       <IconButton
//                         color="primary"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleEdit(subCategory, 'subCategory');
//                         }}
//                         size="small"
//                       >
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton
//                         color="error"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openDeleteDialog({...subCategory, type: 'subCategory'}, 'subCategory');
//                         }}
//                         size="small"
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </Box>
//                   </Box>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <TableContainer component={Paper} variant="outlined">
//                     <Table size="small">
//                       <TableHead>
//                         <TableRow>
//                           <TableCell>Third Category Name</TableCell>
//                           <TableCell align="right">Actions</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {subCategory.thirdCategories.map((thirdCategory) => (
//                           <TableRow key={thirdCategory.id}>
//                             <TableCell>
//                               <Typography variant="body2">{thirdCategory.name}</Typography>
//                             </TableCell>
//                             <TableCell align="right">
//                               <IconButton
//                                 color="primary"
//                                 onClick={() => handleEdit(thirdCategory, 'thirdCategory')}
//                                 size="small"
//                               >
//                                 <EditIcon />
//                               </IconButton>
//                               <IconButton
//                                 color="error"
//                                 onClick={() => openDeleteDialog({...thirdCategory, type: 'thirdCategory'}, 'thirdCategory')}
//                                 size="small"
//                               >
//                                 <DeleteIcon />
//                               </IconButton>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                   <Button
//                     startIcon={<AddIcon />}
//                     onClick={() => {
//                       setNewSubCategory({
//                         ...newSubCategory,
//                         categoryId: category.id.toString(),
//                         subCategoryId: subCategory.id.toString()
//                       });
//                       setLevel('thirdCategory');
//                       setIsEditing(false);
//                       setSelectedItem(null);
//                       setSidebarOpen(true);
//                     }}
//                     sx={{ mt: 2 }}
//                     size="small"
//                   >
//                     Add Third Category
//                   </Button>
//                 </AccordionDetails>
//               </Accordion>
//             ))}
//           </AccordionDetails>
//         </Accordion>
//       ))}

//       {/* Add/Edit SubCategory Sidebar */}
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
//               {isEditing ? 'Edit' : 'Add New'} {level === 'subCategory' ? 'Sub Category' : 'Third Category'}
//             </Typography>
//             <IconButton onClick={toggleSidebar}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//           <Divider sx={{ mb: 3 }} />

//           <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//             {!isEditing && (
//               <FormControl fullWidth>
//                 <InputLabel>Level</InputLabel>
//                 <Select
//                   value={level}
//                   label="Level"
//                   onChange={handleLevelChange}
//                 >
//                   <MenuItem value="subCategory">Sub Category</MenuItem>
//                   <MenuItem value="thirdCategory">Third Category</MenuItem>
//                 </Select>
//               </FormControl>
//             )}

//             {level === 'subCategory' && (
//               <FormControl fullWidth>
//                 <InputLabel>Parent Category</InputLabel>
//                 <Select
//                   name="categoryId"
//                   value={newSubCategory.categoryId}
//                   label="Parent Category"
//                   onChange={handleInputChange}
//                   required
//                 >
//                   {categories.map((category) => (
//                     <MenuItem key={category.id} value={category.id}>
//                       {category.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             )}

//             {level === 'thirdCategory' && (
//               <FormControl fullWidth>
//                 <InputLabel>Parent Sub Category</InputLabel>
//                 <Select
//                   name="subCategoryId"
//                   value={newSubCategory.subCategoryId}
//                   label="Parent Sub Category"
//                   onChange={handleInputChange}
//                   required
//                 >
//                   {categories
//                     .flatMap(c => c.subCategories)
//                     .map((subCategory) => (
//                       <MenuItem key={subCategory.id} value={subCategory.id}>
//                         {subCategory.name}
//                       </MenuItem>
//                     ))
//                   }
//                 </Select>
//               </FormControl>
//             )}

//             <TextField
//               fullWidth
//               label={`${level === 'subCategory' ? 'Sub Category' : 'Third Category'} Name`}
//               name="name"
//               value={newSubCategory.name}
//               onChange={handleInputChange}
//               required
//             />

//             <TextField
//               fullWidth
//               multiline
//               rows={3}
//               label="Description"
//               name="description"
//               value={newSubCategory.description}
//               onChange={handleInputChange}
//             />

//             <Button
//               variant="contained"
//               onClick={isEditing ? handleUpdate : handleAddSubCategory}
//               sx={{ mt: 2 }}
//               disabled={!newSubCategory.name || (level === 'subCategory' ? !newSubCategory.categoryId : !newSubCategory.subCategoryId)}
//             >
//               {isEditing ? 'Update' : 'Add'} {level === 'subCategory' ? 'Sub Category' : 'Third Category'}
//             </Button>
//           </Box>
//         </Box>
//       </Drawer>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//       >
//         <DialogTitle>Delete {selectedItem?.type === 'subCategory' ? 'Sub Category' : 'Third Category'}</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete the {selectedItem?.type === 'subCategory' ? 'sub category' : 'third category'} "{selectedItem?.name}"? 
//             This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
//           <Button onClick={handleDelete} color="error" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default SubCategory;