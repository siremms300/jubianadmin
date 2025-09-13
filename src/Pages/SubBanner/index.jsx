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
  FormControlLabel,
  Tabs,
  Tab
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

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`subbanner-tabpanel-${index}`}
      aria-labelledby={`subbanner-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Sample subbanner data for different sections
const initialSubBanners = {
  topSection: [
    {
      id: 1,
      title: 'Special Offer',
      image: 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Top+Section+1',
      status: 'Active',
      isActive: true,
      section: 'topSection'
    },
    {
      id: 2,
      title: 'Limited Time',
      image: 'https://via.placeholder.com/400x200/4ECDC4/FFFFFF?text=Top+Section+2',
      status: 'Active',
      isActive: true,
      section: 'topSection'
    }
  ],
  bottomSection: [
    {
      id: 3,
      title: 'New Collection',
      image: 'https://via.placeholder.com/400x200/45B7D1/FFFFFF?text=Bottom+Section+1',
      status: 'Active',
      isActive: true,
      section: 'bottomSection'
    },
    {
      id: 4,
      title: 'Clearance',
      image: 'https://via.placeholder.com/400x200/F7DC6F/FFFFFF?text=Bottom+Section+2',
      status: 'Inactive',
      isActive: false,
      section: 'bottomSection'
    }
  ]
};

const SubBanner = () => {
  const [subBanners, setSubBanners] = useState(initialSubBanners);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubBanner, setSelectedSubBanner] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSection, setCurrentSection] = useState('topSection');
  const [tabValue, setTabValue] = useState(0);
  const [newSubBanner, setNewSubBanner] = useState({
    title: '',
    image: null,
    imagePreview: '',
    status: 'Active',
    isActive: true,
    section: 'topSection'
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentSection(newValue === 0 ? 'topSection' : 'bottomSection');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (!sidebarOpen) {
      setNewSubBanner({
        title: '',
        image: null,
        imagePreview: '',
        status: 'Active',
        isActive: true,
        section: currentSection
      });
      setIsEditing(false);
      setSelectedSubBanner(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSubBanner({
      ...newSubBanner,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePreview = URL.createObjectURL(file);
      setNewSubBanner({
        ...newSubBanner,
        image: file,
        imagePreview: imagePreview
      });
    }
  };

  const handleAddSubBanner = () => {
    if (newSubBanner.title && newSubBanner.image) {
      const newSubBannerObj = {
        id: Math.max(...subBanners.topSection.map(b => b.id), ...subBanners.bottomSection.map(b => b.id), 0) + 1,
        title: newSubBanner.title,
        image: newSubBanner.imagePreview,
        status: newSubBanner.status,
        isActive: newSubBanner.isActive,
        section: currentSection
      };

      const updatedSubBanners = {
        ...subBanners,
        [currentSection]: [...subBanners[currentSection], newSubBannerObj]
      };

      setSubBanners(updatedSubBanners);
      toggleSidebar();
    }
  };

  const handleEdit = (subBanner) => {
    setSelectedSubBanner(subBanner);
    setIsEditing(true);
    setNewSubBanner({
      title: subBanner.title,
      image: null,
      imagePreview: subBanner.image,
      status: subBanner.status,
      isActive: subBanner.isActive,
      section: subBanner.section
    });
    setCurrentSection(subBanner.section);
    setTabValue(subBanner.section === 'topSection' ? 0 : 1);
    setSidebarOpen(true);
  };

  const handleUpdate = () => {
    if (isEditing && selectedSubBanner) {
      const updatedSubBanners = {
        ...subBanners,
        [selectedSubBanner.section]: subBanners[selectedSubBanner.section].map(banner =>
          banner.id === selectedSubBanner.id
            ? {
                ...banner,
                title: newSubBanner.title,
                image: newSubBanner.imagePreview || banner.image,
                status: newSubBanner.status,
                isActive: newSubBanner.isActive,
                section: currentSection
              }
            : banner
        )
      };

      // If section changed, move the banner to the new section
      if (selectedSubBanner.section !== currentSection) {
        updatedSubBanners[selectedSubBanner.section] = updatedSubBanners[selectedSubBanner.section].filter(
          banner => banner.id !== selectedSubBanner.id
        );
        updatedSubBanners[currentSection] = [
          ...updatedSubBanners[currentSection],
          {
            ...selectedSubBanner,
            title: newSubBanner.title,
            image: newSubBanner.imagePreview || selectedSubBanner.image,
            status: newSubBanner.status,
            isActive: newSubBanner.isActive,
            section: currentSection
          }
        ];
      }

      setSubBanners(updatedSubBanners);
      toggleSidebar();
    }
  };

  const openDeleteDialog = (subBanner) => {
    setSelectedSubBanner(subBanner);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    const updatedSubBanners = {
      ...subBanners,
      [selectedSubBanner.section]: subBanners[selectedSubBanner.section].filter(
        banner => banner.id !== selectedSubBanner.id
      )
    };

    setSubBanners(updatedSubBanners);
    setDeleteDialogOpen(false);
    setSelectedSubBanner(null);
  };

  const toggleSubBannerStatus = (subBanner) => {
    const updatedSubBanners = {
      ...subBanners,
      [subBanner.section]: subBanners[subBanner.section].map(b =>
        b.id === subBanner.id
          ? { ...b, isActive: !b.isActive, status: !b.isActive ? 'Active' : 'Inactive' }
          : b
      )
    };
    setSubBanners(updatedSubBanners);
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
          Sub Banners Management
        </Typography> */}
        <h1 className="text-2xl font-bold text-gray-800">Sub Banners Management</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={toggleSidebar}
          sx={{ borderRadius: 2 }}
        >
          Add Sub Banner
        </Button>
      </Box>

      {/* Tabs for different sections */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="subbanner sections">
          <Tab label="Top Section SubBanners" />
          <Tab label="Bottom Section SubBanners" />
        </Tabs>

        {/* Top Section Tab */}
        <TabPanel value={tabValue} index={0}>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Sub Banner</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subBanners.topSection.map((subBanner) => (
                    <TableRow key={subBanner.id} hover>
                      <TableCell>
                        <Box
                          component="img"
                          src={subBanner.image}
                          alt={subBanner.title}
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
                          {subBanner.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={subBanner.status}
                            color={getStatusColor(subBanner.status)}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() => toggleSubBannerStatus(subBanner)}
                            color={subBanner.isActive ? 'success' : 'default'}
                          >
                            {subBanner.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEdit(subBanner)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => openDeleteDialog(subBanner)}
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

            {subBanners.topSection.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No sub banners found for top section
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Click "Add Sub Banner" to create your first top section banner
                </Typography>
              </Box>
            )}
          </Paper>
        </TabPanel>

        {/* Bottom Section Tab */}
        <TabPanel value={tabValue} index={1}>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Sub Banner</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subBanners.bottomSection.map((subBanner) => (
                    <TableRow key={subBanner.id} hover>
                      <TableCell>
                        <Box
                          component="img"
                          src={subBanner.image}
                          alt={subBanner.title}
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
                          {subBanner.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={subBanner.status}
                            color={getStatusColor(subBanner.status)}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() => toggleSubBannerStatus(subBanner)}
                            color={subBanner.isActive ? 'success' : 'default'}
                          >
                            {subBanner.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEdit(subBanner)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => openDeleteDialog(subBanner)}
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

            {subBanners.bottomSection.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No sub banners found for bottom section
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Click "Add Sub Banner" to create your first bottom section banner
                </Typography>
              </Box>
            )}
          </Paper>
        </TabPanel>
      </Paper>

      {/* Add/Edit SubBanner Sidebar */}
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
              {isEditing ? 'Edit Sub Banner' : 'Add New Sub Banner'}
            </Typography>
            <IconButton onClick={toggleSidebar}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {newSubBanner.imagePreview && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  component="img"
                  src={newSubBanner.imagePreview}
                  alt="Sub banner preview"
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
              label="Sub Banner Title"
              name="title"
              value={newSubBanner.title}
              onChange={handleInputChange}
              required
            />

            {/* Section Selection */}
            <TextField
              fullWidth
              select
              label="Section"
              name="section"
              value={currentSection}
              onChange={(e) => setCurrentSection(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="topSection">Top Section</option>
              <option value="bottomSection">Bottom Section</option>
            </TextField>

            {/* Image Upload Button */}
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ py: 1.5 }}
            >
              Upload Sub Banner Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            
            {newSubBanner.image && (
              <Typography variant="body2" color="textSecondary" align="center">
                {newSubBanner.image.name}
              </Typography>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={newSubBanner.isActive}
                  onChange={handleInputChange}
                  name="isActive"
                />
              }
              label="Active Sub Banner"
            />

            <Button
              variant="contained"
              onClick={isEditing ? handleUpdate : handleAddSubBanner}
              sx={{ mt: 2 }}
              disabled={!newSubBanner.title || !newSubBanner.image}
            >
              {isEditing ? 'Update Sub Banner' : 'Add Sub Banner'}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Sub Banner</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the sub banner "{selectedSubBanner?.title}"? This action cannot be undone.
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

export default SubBanner;