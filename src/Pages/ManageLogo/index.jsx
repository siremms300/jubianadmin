import React, { useState } from 'react';
import {
  Box,
  Paper,
  Card,
  CardContent,
  Button,
  Typography,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Sample logo data
const initialLogo = {
  id: 1,
  image: 'https://via.placeholder.com/200x80/3f51b5/ffffff?text=Current+Logo',
  uploadedAt: '2023-10-15T14:30:00Z',
  uploadedBy: 'Admin User'
};

const ManageLogo = () => {
  const [logo, setLogo] = useState(initialLogo);
  const [newLogo, setNewLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setNewLogo(file);
      setLogoPreview(preview);
    }
  };

  const handleSaveLogo = () => {
    if (newLogo) {
      // In a real application, you would upload the logo to your server here
      const updatedLogo = {
        id: logo.id + 1,
        image: logoPreview,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Admin User' // This would typically come from your auth system
      };

      setLogo(updatedLogo);
      setNewLogo(null);
      setLogoPreview(null);
      setSuccessAlert(true);

      // Hide success alert after 3 seconds
      setTimeout(() => {
        setSuccessAlert(false);
      }, 3000);
    }
  };

  const handleDeleteLogo = () => {
    setLogo(null);
    setDeleteDialogOpen(false);
  };

  const handleReset = () => {
    setNewLogo(null);
    setLogoPreview(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Manage Logo
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Upload and manage your website logo. Recommended size: 200x80 pixels.
        </Typography>
      </Box>

      {successAlert && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Logo updated successfully!
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Current Logo Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Current Logo
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {logo ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Box
                    component="img"
                    src={logo.image}
                    alt="Current logo"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 120,
                      objectFit: 'contain'
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    <strong>Uploaded on:</strong> {formatDate(logo.uploadedAt)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Uploaded by:</strong> {logo.uploadedBy}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Remove Logo
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  No logo uploaded yet
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Upload a logo to display on your website
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Upload New Logo Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Upload New Logo
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Logo Preview */}
              {(logoPreview || newLogo) && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview:
                  </Typography>
                  <Box
                    component="img"
                    src={logoPreview}
                    alt="New logo preview"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 120,
                      objectFit: 'contain',
                      border: '1px dashed #e0e0e0',
                      borderRadius: 1,
                      p: 1
                    }}
                  />
                </Box>
              )}

              {/* Upload Button */}
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ py: 2 }}
              >
                Select Logo File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </Button>

              {newLogo && (
                <Typography variant="body2" color="textSecondary" align="center">
                  Selected: {newLogo.name}
                </Typography>
              )}

              {/* Requirements */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Logo Requirements:
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div">
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      <li>Recommended dimensions: 200x80 pixels</li>
                      <li>Supported formats: PNG, JPG, SVG</li>
                      <li>Max file size: 2MB</li>
                      <li>Transparent background recommended</li>
                    </ul>
                  </Typography>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  disabled={!newLogo}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveLogo}
                  disabled={!newLogo}
                  startIcon={<CheckCircleIcon />}
                  fullWidth
                >
                  Save Logo
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Preview Section */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Logo Preview
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            How your logo will appear on the website:
          </Typography>
          
          <Box sx={{ 
            width: '100%', 
            maxWidth: 400, 
            height: 200, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #e0e0e0',
            mt: 2
          }}>
            {logo ? (
              <Box
                component="img"
                src={logo.image}
                alt="Logo preview"
                sx={{
                  maxWidth: '80%',
                  maxHeight: 80,
                  objectFit: 'contain'
                }}
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                No logo to display
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Remove Logo</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove the current logo? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteLogo} color="error" autoFocus>
            Remove Logo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageLogo;