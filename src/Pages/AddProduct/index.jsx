import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Stack,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const steps = ['Basic Information', 'Pricing & Inventory', 'Media & Images'];

const AddProduct = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    thirdCategory: '',
    price: '',
    oldPrice: '',
    featured: false,
    retailPrice: '',
    wholesalePrice: '',
    moq: '',
    pricingTier: '',
    stock: '',
    rating: '',
    wholesaleEnabled: false,
    brand: '',
    discount: '',
    size: '',
    images: [],
    banners: [],
    bannerTitle: ''
  });

  // Category data
  const categories = [
    { value: '', label: 'Select a category' },
    { value: 'electronics', label: 'Electronics & Gadgets' },
    { value: 'clothing', label: 'Clothing, Shoes & Accessories' },
    { value: 'home', label: 'Home, Kitchen & Appliances' },
    { value: 'beauty', label: 'Beauty, Health & Personal Care' },
    { value: 'sports', label: 'Sports, Fitness & Outdoor Activities' },
    { value: 'toys', label: 'Toys, Games & Baby Products' },
  ];

  const subCategories = [
    { value: '', label: 'Select a sub-category' },
    { value: 'smartphones', label: 'Smartphones & Mobile Devices', category: 'electronics' },
    { value: 'laptops', label: 'Laptops, Computers & Accessories', category: 'electronics' },
    { value: 'tvs', label: 'Televisions & Home Entertainment Systems', category: 'electronics' },
    { value: 'mens', label: "Men's Clothing, Shoes & Accessories", category: 'clothing' },
    { value: 'womens', label: "Women's Clothing, Shoes & Accessories", category: 'clothing' },
    { value: 'kids', label: "Kids' Clothing, Shoes & Accessories", category: 'clothing' },
    { value: 'kitchen', label: 'Kitchen Appliances & Utensils', category: 'home' },
    { value: 'furniture', label: 'Furniture & Home Decor', category: 'home' },
    { value: 'skincare', label: 'Skincare & Beauty Products', category: 'beauty' },
    { value: 'makeup', label: 'Makeup & Cosmetics', category: 'beauty' },
  ];

  const thirdLevelCategories = [
    { value: '', label: 'Select a third-level category' },
    { value: 'gaming', label: 'Gaming Laptops & Computer Systems', subCategory: 'laptops' },
    { value: 'business', label: 'Business & Productivity Laptops', subCategory: 'laptops' },
    { value: 'ultrabooks', label: 'Ultrabooks & Thin & Light Laptops', subCategory: 'laptops' },
    { value: 'shirts', label: 'Casual & Formal Shirts for Men', subCategory: 'mens' },
    { value: 'pants', label: 'Jeans, Trousers & Casual Pants', subCategory: 'mens' },
    { value: 'footwear', label: 'Shoes, Boots & Footwear for Men', subCategory: 'mens' },
    { value: 'blenders', label: 'Blenders, Mixers & Food Processors', subCategory: 'kitchen' },
    { value: 'cookware', label: 'Cookware, Bakeware & Cooking Utensils', subCategory: 'kitchen' },
    { value: 'moisturizers', label: 'Moisturizers, Creams & Lotions', subCategory: 'skincare' },
    { value: 'cleansers', label: 'Cleansers, Toners & Exfoliators', subCategory: 'skincare' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({
      ...productData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileUpload = (e, field) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }));
    
    setProductData({
      ...productData,
      [field]: [...productData[field], ...filePreviews]
    });
  };

  const removeImage = (index, field) => {
    const updatedImages = [...productData[field]];
    updatedImages.splice(index, 1);
    setProductData({
      ...productData,
      [field]: updatedImages
    });
  };

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);

  const renderBasicInfo = () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Basic Information</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Product Name" name="name" value={productData.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Product Brand" name="brand" value={productData.brand} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              multiline 
              rows={4} 
              label="Product Description" 
              name="description" 
              value={productData.description} 
              onChange={handleChange} 
              sx={{ 
                '& .MuiInputBase-root': { 
                  minHeight: '120px' 
                } 
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box className="custom-dropdown">
              <label htmlFor="category-select" style={{ display: 'block', marginBottom: '8px', color: 'rgba(0, 0, 0, 0.6)' }}>
                Category
              </label>
              <select
                id="category-select"
                name="category"
                value={productData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '16.5px 14px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  fontSize: '16px',
                  backgroundColor: '#fff',
                  appearance: 'menulist'
                }}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box className="custom-dropdown">
              <label htmlFor="subcategory-select" style={{ display: 'block', marginBottom: '8px', color: 'rgba(0, 0, 0, 0.6)' }}>
                Sub Category
              </label>
              <select
                id="subcategory-select"
                name="subCategory"
                value={productData.subCategory}
                onChange={handleChange}
                disabled={!productData.category}
                style={{
                  width: '100%',
                  padding: '16.5px 14px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  fontSize: '16px',
                  backgroundColor: productData.category ? '#fff' : 'rgba(0, 0, 0, 0.05)',
                  appearance: 'menulist'
                }}
              >
                {subCategories
                  .filter(sub => !sub.category || sub.category === productData.category)
                  .map((subCategory) => (
                    <option key={subCategory.value} value={subCategory.value}>
                      {subCategory.label}
                    </option>
                  ))
                }
              </select>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box className="custom-dropdown">
              <label htmlFor="thirdcategory-select" style={{ display: 'block', marginBottom: '8px', color: 'rgba(0, 0, 0, 0.6)' }}>
                Third Level Category
              </label>
              <select
                id="thirdcategory-select"
                name="thirdCategory"
                value={productData.thirdCategory}
                onChange={handleChange}
                disabled={!productData.subCategory}
                style={{
                  width: '100%',
                  padding: '16.5px 14px',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  fontSize: '16px',
                  backgroundColor: productData.subCategory ? '#fff' : 'rgba(0, 0, 0, 0.05)',
                  appearance: 'menulist'
                }}
              >
                {thirdLevelCategories
                  .filter(third => !third.subCategory || third.subCategory === productData.subCategory)
                  .map((thirdCategory) => (
                    <option key={thirdCategory.value} value={thirdCategory.value}>
                      {thirdCategory.label}
                    </option>
                  ))
                }
              </select>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel 
              control={
                <Checkbox 
                  name="featured" 
                  checked={productData.featured} 
                  onChange={handleChange} 
                />
              } 
              label="Is Featured?" 
            />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );

  const renderPricingInventory = () => (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Pricing & Inventory</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Product Price" name="price" value={productData.price} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Old Price" name="oldPrice" value={productData.oldPrice} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Retail Price" name="retailPrice" value={productData.retailPrice} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Wholesale Price" name="wholesalePrice" value={productData.wholesalePrice} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="MOQ" name="moq" value={productData.moq} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Pricing Tier" name="pricingTier" value={productData.pricingTier} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Discount (%)" name="discount" value={productData.discount} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Stock" name="stock" value={productData.stock} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Rating" name="rating" value={productData.rating} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Size" name="size" value={productData.size} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel 
              control={
                <Checkbox 
                  name="wholesaleEnabled" 
                  checked={productData.wholesaleEnabled} 
                  onChange={handleChange} 
                />
              } 
              label="Wholesale Enabled" 
            />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );

  const renderMediaImages = () => (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Product Images</Typography>
        <Button variant="outlined" component="label">
          Upload Images
          <input hidden type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'images')} />
        </Button>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {productData.images.map((image, index) => (
            <Grid item xs={4} sm={3} md={2} key={index}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 4, 
                    right: 4, 
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    zIndex: 10,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,1)'
                    }
                  }}
                  onClick={() => removeImage(index, 'images')}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Box
                  component="img"
                  src={image.url}
                  alt={`Product ${index}`}
                  sx={{
                    height: 80,
                    width: '100%',
                    objectFit: 'contain',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 0.5,
                    backgroundColor: '#f5f5f5'
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Banner Images</Typography>
        <TextField 
          fullWidth 
          label="Banner Title" 
          name="bannerTitle" 
          value={productData.bannerTitle} 
          onChange={handleChange} 
          sx={{ mb: 3 }} 
        />
        <Button variant="outlined" component="label">
          Upload Banner
          <input hidden type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'banners')} />
        </Button>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {productData.banners.map((banner, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    position: 'absolute', 
                    top: 4, 
                    right: 4, 
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    zIndex: 10,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,1)'
                    }
                  }}
                  onClick={() => removeImage(index, 'banners')}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Box
                  component="img"
                  src={banner.url}
                  alt={`Banner ${index}`}
                  sx={{
                    height: 100,
                    width: '100%',
                    objectFit: 'cover',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );

  return (
    <Paper elevation={0} sx={{ p: 5, borderRadius: 3, backgroundColor: '#fafafa' }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>Add New Product</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
        {steps.map((label, index) => (
          <Step key={index}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {activeStep === 0 && renderBasicInfo()}
      {activeStep === 1 && renderPricingInventory()}
      {activeStep === 2 && renderMediaImages()}

      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button variant="outlined" disabled={activeStep === 0} onClick={prevStep}>Back</Button>
        {activeStep === steps.length - 1 ? (
          <Button variant="contained" color="primary">Submit</Button>
        ) : (
          <Button variant="contained" color="primary" onClick={nextStep}>Next</Button>
        )}
      </Box>
    </Paper>
  );
};

export default AddProduct;






















// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardMedia,
//   Checkbox,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   Grid,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Select,
//   Step,
//   StepLabel,
//   Stepper,
//   TextField,
//   Typography,
//   Stack,
//   IconButton
// } from '@mui/material';
// import { Delete as DeleteIcon } from '@mui/icons-material';

// const steps = ['Basic Information', 'Pricing & Inventory', 'Media & Images'];

// const AddProduct = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [productData, setProductData] = useState({
//     name: '',
//     description: '',
//     category: '',
//     subCategory: '',
//     thirdCategory: '',
//     price: '',
//     oldPrice: '',
//     featured: false,
//     retailPrice: '',
//     wholesalePrice: '',
//     moq: '',
//     pricingTier: '',
//     stock: '',
//     rating: '',
//     wholesaleEnabled: false,
//     brand: '',
//     discount: '',
//     size: '',
//     images: [],
//     banners: [],
//     bannerTitle: ''
//   });

//   // Category data
//   const categories = [
//     { value: 'electronics', label: 'Electronics' },
//     { value: 'clothing', label: 'Clothing' },
//     { value: 'home', label: 'Home & Kitchen' },
//     { value: 'beauty', label: 'Beauty & Personal Care' },
//   ];

//   const subCategories = [
//     { value: 'smartphones', label: 'Smartphones', category: 'electronics' },
//     { value: 'laptops', label: 'Laptops', category: 'electronics' },
//     { value: 'mens', label: "Men's Clothing", category: 'clothing' },
//     { value: 'womens', label: "Women's Clothing", category: 'clothing' },
//   ];

//   const thirdLevelCategories = [
//     { value: 'gaming', label: 'Gaming Laptops', subCategory: 'laptops' },
//     { value: 'business', label: 'Business Laptops', subCategory: 'laptops' },
//     { value: 'shirts', label: 'Shirts', subCategory: 'mens' },
//     { value: 'pants', label: 'Pants', subCategory: 'mens' },
//   ];

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setProductData({
//       ...productData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleFileUpload = (e, field) => {
//     const files = Array.from(e.target.files);
//     const filePreviews = files.map(file => ({
//       url: URL.createObjectURL(file),
//       file: file
//     }));
    
//     setProductData({
//       ...productData,
//       [field]: [...productData[field], ...filePreviews]
//     });
//   };

//   const removeImage = (index, field) => {
//     const updatedImages = [...productData[field]];
//     updatedImages.splice(index, 1);
//     setProductData({
//       ...productData,
//       [field]: updatedImages
//     });
//   };

//   const nextStep = () => setActiveStep((prev) => prev + 1);
//   const prevStep = () => setActiveStep((prev) => prev - 1);

//   const renderBasicInfo = () => (
//     <Stack spacing={4}>
//       <Box>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Basic Information</Typography>
//         <Grid container spacing={4}>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Product Name" name="name" value={productData.name} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Product Brand" name="brand" value={productData.brand} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField 
//               fullWidth 
//               multiline 
//               rows={4} 
//               label="Product Description" 
//               name="description" 
//               value={productData.description} 
//               onChange={handleChange} 
//               sx={{ 
//                 '& .MuiInputBase-root': { 
//                   minHeight: '120px' 
//                 } 
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth>
//               <InputLabel>Category</InputLabel>
//               <Select
//                 name="category"
//                 value={productData.category}
//                 label="Category"
//                 onChange={handleChange}
//               >
//                 {categories.map((category) => (
//                   <MenuItem key={category.value} value={category.value}>
//                     {category.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth disabled={!productData.category}>
//               <InputLabel>Sub Category</InputLabel>
//               <Select
//                 name="subCategory"
//                 value={productData.subCategory}
//                 label="Sub Category"
//                 onChange={handleChange}
//               >
//                 {subCategories
//                   .filter(sub => sub.category === productData.category)
//                   .map((subCategory) => (
//                     <MenuItem key={subCategory.value} value={subCategory.value}>
//                       {subCategory.label}
//                     </MenuItem>
//                   ))
//                 }
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth disabled={!productData.subCategory}>
//               <InputLabel>Third Level Category</InputLabel>
//               <Select
//                 name="thirdCategory"
//                 value={productData.thirdCategory}
//                 label="Third Level Category"
//                 onChange={handleChange}
//               >
//                 {thirdLevelCategories
//                   .filter(third => third.subCategory === productData.subCategory)
//                   .map((thirdCategory) => (
//                     <MenuItem key={thirdCategory.value} value={thirdCategory.value}>
//                       {thirdCategory.label}
//                     </MenuItem>
//                   ))
//                 }
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel 
//               control={
//                 <Checkbox 
//                   name="featured" 
//                   checked={productData.featured} 
//                   onChange={handleChange} 
//                 />
//               } 
//               label="Is Featured?" 
//             />
//           </Grid>
//         </Grid>
//       </Box>
//     </Stack>
//   );

//   const renderPricingInventory = () => (
//     <Stack spacing={4}>
//       <Box>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Pricing & Inventory</Typography>
//         <Grid container spacing={4}>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Product Price" name="price" value={productData.price} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Old Price" name="oldPrice" value={productData.oldPrice} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Retail Price" name="retailPrice" value={productData.retailPrice} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Wholesale Price" name="wholesalePrice" value={productData.wholesalePrice} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="MOQ" name="moq" value={productData.moq} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Pricing Tier" name="pricingTier" value={productData.pricingTier} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Discount (%)" name="discount" value={productData.discount} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Stock" name="stock" value={productData.stock} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Rating" name="rating" value={productData.rating} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Size" name="size" value={productData.size} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel 
//               control={
//                 <Checkbox 
//                   name="wholesaleEnabled" 
//                   checked={productData.wholesaleEnabled} 
//                   onChange={handleChange} 
//                 />
//               } 
//               label="Wholesale Enabled" 
//             />
//           </Grid>
//         </Grid>
//       </Box>
//     </Stack>
//   );

//   const renderMediaImages = () => (
//     <Stack spacing={5}>
//       <Box>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Product Images</Typography>
//         <Button variant="outlined" component="label">
//           Upload Images
//           <input hidden type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'images')} />
//         </Button>
//         <Grid container spacing={2} sx={{ mt: 2 }}>
//           {productData.images.map((image, index) => (
//             <Grid item xs={4} sm={3} md={2} key={index}>
//               <Card sx={{ borderRadius: 2, boxShadow: 1, position: 'relative' }}>
//                 <IconButton 
//                   size="small" 
//                   sx={{ 
//                     position: 'absolute', 
//                     top: 4, 
//                     right: 4, 
//                     backgroundColor: 'rgba(255,255,255,0.8)',
//                     zIndex: 10,
//                     '&:hover': {
//                       backgroundColor: 'rgba(255,255,255,1)'
//                     }
//                   }}
//                   onClick={() => removeImage(index, 'images')}
//                 >
//                   <DeleteIcon fontSize="small" />
//                 </IconButton>
//                 <CardMedia 
//                   component="img" 
//                   height="80" 
//                   image={image.url} 
//                   alt={`Product ${index}`} 
//                   sx={{ objectFit: 'contain' }}
//                 />
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       <Divider />

//       <Box>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Banner Images</Typography>
//         <TextField 
//           fullWidth 
//           label="Banner Title" 
//           name="bannerTitle" 
//           value={productData.bannerTitle} 
//           onChange={handleChange} 
//           sx={{ mb: 3 }} 
//         />
//         <Button variant="outlined" component="label">
//           Upload Banner
//           <input hidden type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'banners')} />
//         </Button>
//         <Grid container spacing={2} sx={{ mt: 2 }}>
//           {productData.banners.map((banner, index) => (
//             <Grid item xs={6} sm={4} md={3} key={index}>
//               <Card sx={{ borderRadius: 2, boxShadow: 1, position: 'relative' }}>
//                 <IconButton 
//                   size="small" 
//                   sx={{ 
//                     position: 'absolute', 
//                     top: 4, 
//                     right: 4, 
//                     backgroundColor: 'rgba(255,255,255,0.8)',
//                     zIndex: 10,
//                     '&:hover': {
//                       backgroundColor: 'rgba(255,255,255,1)'
//                     }
//                   }}
//                   onClick={() => removeImage(index, 'banners')}
//                 >
//                   <DeleteIcon fontSize="small" />
//                 </IconButton>
//                 <CardMedia 
//                   component="img" 
//                   height="100" 
//                   image={banner.url} 
//                   alt={`Banner ${index}`} 
//                   sx={{ objectFit: 'cover' }}
//                 />
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Stack>
//   );

//   return (
//     <Paper elevation={0} sx={{ p: 5, borderRadius: 3, backgroundColor: '#fafafa' }}>
//       <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>Add New Product</Typography>

//       <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
//         {steps.map((label, index) => (
//           <Step key={index}><StepLabel>{label}</StepLabel></Step>
//         ))}
//       </Stepper>

//       {activeStep === 0 && renderBasicInfo()}
//       {activeStep === 1 && renderPricingInventory()}
//       {activeStep === 2 && renderMediaImages()}

//       <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
//         <Button variant="outlined" disabled={activeStep === 0} onClick={prevStep}>Back</Button>
//         {activeStep === steps.length - 1 ? (
//           <Button variant="contained" color="primary">Submit</Button>
//         ) : (
//           <Button variant="contained" color="primary" onClick={nextStep}>Next</Button>
//         )}
//       </Box>
//     </Paper>
//   );
// };

// export default AddProduct;


















































// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardMedia,
//   Checkbox,
//   Divider,
//   FormControlLabel,
//   Grid,
//   Paper,
//   Step,
//   StepLabel,
//   Stepper,
//   TextField,
//   Typography,
//   Stack
// } from '@mui/material';

// const steps = ['Basic Information', 'Pricing & Inventory', 'Media & Images'];

// const AddProduct = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [productData, setProductData] = useState({
//     name: '',
//     description: '',
//     category: '',
//     subCategory: '',
//     thirdCategory: '',
//     price: '',
//     oldPrice: '',
//     featured: false,
//     retailPrice: '',
//     wholesalePrice: '',
//     moq: '',
//     pricingTier: '',
//     stock: '',
//     rating: '',
//     wholesaleEnabled: false,
//     brand: '',
//     discount: '',
//     size: '',
//     images: [],
//     banners: [],
//     bannerTitle: ''
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setProductData({
//       ...productData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleFileUpload = (e, field) => {
//     const files = Array.from(e.target.files);
//     setProductData({
//       ...productData,
//       [field]: [...productData[field], ...files.map(file => URL.createObjectURL(file))]
//     });
//   };

//   const nextStep = () => setActiveStep((prev) => prev + 1);
//   const prevStep = () => setActiveStep((prev) => prev - 1);

//   const renderBasicInfo = () => (
//     <Stack spacing={4}>
//       <Box>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Basic Information</Typography>
//         <Grid container spacing={4}>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Product Name" name="name" value={productData.name} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Product Brand" name="brand" value={productData.brand} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField fullWidth multiline rows={3} label="Product Description" name="description" value={productData.description} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Category" name="category" value={productData.category} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Sub Category" name="subCategory" value={productData.subCategory} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Third Level Category" name="thirdCategory" value={productData.thirdCategory} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel control={<Checkbox name="featured" checked={productData.featured} onChange={handleChange} />} label="Is Featured?" />
//           </Grid>
//         </Grid>
//       </Box>
//     </Stack>
//   );

//   const renderPricingInventory = () => (
//     <Stack spacing={4}>
//       <Box>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Pricing & Inventory</Typography>
//         <Grid container spacing={4}>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Product Price" name="price" value={productData.price} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Old Price" name="oldPrice" value={productData.oldPrice} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Retail Price" name="retailPrice" value={productData.retailPrice} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField fullWidth label="Wholesale Price" name="wholesalePrice" value={productData.wholesalePrice} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="MOQ" name="moq" value={productData.moq} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Pricing Tier" name="pricingTier" value={productData.pricingTier} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Discount (%)" name="discount" value={productData.discount} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Stock" name="stock" value={productData.stock} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Rating" name="rating" value={productData.rating} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField fullWidth label="Size" name="size" value={productData.size} onChange={handleChange} />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel control={<Checkbox name="wholesaleEnabled" checked={productData.wholesaleEnabled} onChange={handleChange} />} label="Wholesale Enabled" />
//           </Grid>
//         </Grid>
//       </Box>
//     </Stack>
//   );

//   const renderMediaImages = () => (
//     <Stack spacing={5}>
//       <Box>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Product Images</Typography>
//         <Button variant="outlined" component="label">Upload Images<input hidden type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'images')} /></Button>
//         <Grid container spacing={3} sx={{ mt: 2 }}>
//           {productData.images.map((image, index) => (
//             <Grid item xs={6} sm={4} md={3} key={index}>
//               <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
//                 <CardMedia component="img" height="140" image={image} alt={`Product ${index}`} />
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       <Divider />

//       <Box>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Banner Images</Typography>
//         <TextField fullWidth label="Banner Title" name="bannerTitle" value={productData.bannerTitle} onChange={handleChange} sx={{ mb: 3 }} />
//         <Button variant="outlined" component="label">Upload Banner<input hidden type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'banners')} /></Button>
//         <Grid container spacing={3} sx={{ mt: 2 }}>
//           {productData.banners.map((banner, index) => (
//             <Grid item xs={6} sm={4} md={3} key={index}>
//               <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
//                 <CardMedia component="img" height="140" image={banner} alt={`Banner ${index}`} />
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Stack>
//   );

//   return (
//     <Paper elevation={0} sx={{ p: 5, borderRadius: 3, backgroundColor: '#fafafa' }}>
//       <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>Add New Product</Typography>

//       <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
//         {steps.map((label, index) => (
//           <Step key={index}><StepLabel>{label}</StepLabel></Step>
//         ))}
//       </Stepper>

//       {activeStep === 0 && renderBasicInfo()}
//       {activeStep === 1 && renderPricingInventory()}
//       {activeStep === 2 && renderMediaImages()}

//       <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
//         <Button variant="outlined" disabled={activeStep === 0} onClick={prevStep}>Back</Button>
//         {activeStep === steps.length - 1 ? (
//           <Button variant="contained" color="primary">Submit</Button>
//         ) : (
//           <Button variant="contained" color="primary" onClick={nextStep}>Next</Button>
//         )}
//       </Box>
//     </Paper>
//   );
// };

// export default AddProduct;
