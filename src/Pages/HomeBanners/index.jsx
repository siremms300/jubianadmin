import React, { useState } from 'react';
import {
  Box,
  Paper,
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
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

// Sample banner data
const initialBanners = [
  {
    id: 1,
    title: 'Summer Sale',
    image: 'https://via.placeholder.com/800x400/FF6B6B/FFFFFF?text=Summer+Sale',
    status: 'Active',
    isActive: true
  },
  {
    id: 2,
    title: 'New Arrivals',
    image: 'https://via.placeholder.com/800x400/4ECDC4/FFFFFF?text=New+Arrivals',
    status: 'Active',
    isActive: true
  },
  {
    id: 3,
    title: 'Winter Collection',
    image: 'https://via.placeholder.com/800x400/45B7D1/FFFFFF?text=Winter+Collection',
    status: 'Inactive',
    isActive: false
  },
  {
    id: 4,
    title: 'Clearance',
    image: 'https://via.placeholder.com/800x400/F7DC6F/FFFFFF?text=Clearance+Sale',
    status: 'Inactive',
    isActive: false
  }
];

const HomeBanners = () => {
  const [banners, setBanners] = useState(initialBanners);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    image: null,
    imagePreview: '',
    status: 'Active',
    isActive: true
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (!sidebarOpen) {
      setNewBanner({
        title: '',
        image: null,
        imagePreview: '',
        status: 'Active',
        isActive: true
      });
      setIsEditing(false);
      setSelectedBanner(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBanner({
      ...newBanner,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePreview = URL.createObjectURL(file);
      setNewBanner({
        ...newBanner,
        image: file,
        imagePreview: imagePreview
      });
    }
  };

  const handleAddBanner = () => {
    if (newBanner.title && newBanner.image) {
      // In a real application, you would upload the image to a server here
      // For this example, we'll use the preview URL directly
      const newBannerObj = {
        id: Math.max(...banners.map(b => b.id), 0) + 1,
        title: newBanner.title,
        image: newBanner.imagePreview, // Using the preview URL for display
        status: newBanner.status,
        isActive: newBanner.isActive
      };

      setBanners([...banners, newBannerObj]);
      toggleSidebar();
    }
  };

  const handleEdit = (banner) => {
    setSelectedBanner(banner);
    setIsEditing(true);
    setNewBanner({
      title: banner.title,
      image: null,
      imagePreview: banner.image,
      status: banner.status,
      isActive: banner.isActive
    });
    setSidebarOpen(true);
  };

  const handleUpdate = () => {
    if (isEditing && selectedBanner) {
      // In a real application, you would handle image upload here
      const updatedBanners = banners.map(banner =>
        banner.id === selectedBanner.id
          ? {
              ...banner,
              title: newBanner.title,
              image: newBanner.imagePreview || banner.image,
              status: newBanner.status,
              isActive: newBanner.isActive
            }
          : banner
      );
      setBanners(updatedBanners);
      toggleSidebar();
    }
  };

  const openDeleteDialog = (banner) => {
    setSelectedBanner(banner);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    const updatedBanners = banners.filter(banner => banner.id !== selectedBanner.id);
    setBanners(updatedBanners);
    setDeleteDialogOpen(false);
    setSelectedBanner(null);
  };

  const toggleBannerStatus = (banner) => {
    const updatedBanners = banners.map(b =>
      b.id === banner.id
        ? { ...b, isActive: !b.isActive, status: !b.isActive ? 'Active' : 'Inactive' }
        : b
    );
    setBanners(updatedBanners);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        {/* <Typography variant="h4" component="h1" fontWeight="bold">
          Home Banners
        </Typography> */}
        <h1 className="text-2xl font-bold text-gray-800">Home Banners</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={toggleSidebar}
          sx={{ borderRadius: 2 }}
        >
          Add Banner
        </Button>
      </Box>

      {/* Banners Table */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Banner</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id} hover>
                  <TableCell>
                    <Box
                      component="img"
                      src={banner.image}
                      alt={banner.title}
                      sx={{
                        width: 120,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {banner.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={banner.status}
                        color={getStatusColor(banner.status)}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={() => toggleBannerStatus(banner)}
                        color={banner.isActive ? 'success' : 'default'}
                      >
                        {banner.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(banner)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => openDeleteDialog(banner)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {banners.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              No banners found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Click "Add Banner" to create your first banner
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Add/Edit Banner Sidebar */}
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
              {isEditing ? 'Edit Banner' : 'Add New Banner'}
            </Typography>
            <IconButton onClick={toggleSidebar}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {newBanner.imagePreview && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="img"
                  src={newBanner.imagePreview}
                  alt="Banner preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                  }}
                />
              </Box>
            )}

            <TextField
              fullWidth
              label="Banner Title"
              name="title"
              value={newBanner.title}
              onChange={handleInputChange}
              required
            />

            {/* Image Upload Button */}
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Upload Banner Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            
            {newBanner.image && (
              <Typography variant="body2" color="textSecondary" align="center">
                {newBanner.image.name}
              </Typography>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={newBanner.isActive}
                  onChange={handleInputChange}
                  name="isActive"
                />
              }
              label="Active Banner"
            />

            <Button
              variant="contained"
              onClick={isEditing ? handleUpdate : handleAddBanner}
              sx={{ mt: 2 }}
              disabled={!newBanner.title || !newBanner.image}
            >
              {isEditing ? 'Update Banner' : 'Add Banner'}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Banner</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the banner "{selectedBanner?.title}"? This action cannot be undone.
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

export default HomeBanners;