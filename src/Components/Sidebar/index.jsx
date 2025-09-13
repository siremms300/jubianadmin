import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Box
} from '@mui/material';
import {
  Dashboard,
  Home,
  Category,
  Inventory,
  People,
  Receipt,
  Campaign,
  Article,
  Settings,
  ExpandLess,
  ExpandMore,
  ChevronRight,
  Logout
} from '@mui/icons-material';

const Sidebar = ({ isOpen }) => {
  const [openItems, setOpenItems] = useState({
    homeSlides: false,
    category: false,
    products: false,
    banners: false,
    blogs: false
  });

  const navigate = useNavigate();

  const handleClick = (item) => {
    setOpenItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard sx={{ color: '#ef7921' }} />,
      path: '/'
    },
    {
      text: 'Home Slides',
      icon: <Home sx={{ color: '#4f46e5' }} />,
      hasSubmenu: true,
      subItems: [
        { text: 'Home Banners List', path: '/home-banners' },
        // { text: 'Add Home Banner Slide', path: '/add-home-banner' }
      ]
    },
    {
      text: 'Category',
      icon: <Category sx={{ color: '#10b981' }} />,
      hasSubmenu: true,
      subItems: [
        { text: 'Category List', path: '/categories' },
        // { text: 'Add A Category', path: '/category/add' },
        { text: 'Sub Category List', path: '/category/subCat' },
        // { text: 'Add A Sub Category', path: '/category/subCat/add' }
      ]
    },
    {
      text: 'Products',
      icon: <Inventory sx={{ color: '#f59e0b' }} />,
      hasSubmenu: true,
      subItems: [
        { text: 'Products List', path: '/products' },
        { text: 'Product Upload', path: '/product/upload' },
        // { text: 'Add Product RAMS', path: '/product-rams' },
        // { text: 'Add Product WEIGHT', path: '/product-weight' },
        // { text: 'Add Product SIZE', path: '/product-size' }
      ]
    },
    {
      text: 'Users',
      icon: <People sx={{ color: '#ec4899' }} />,
      path: '/users'
    },
    {
      text: 'Orders',
      icon: <Receipt sx={{ color: '#8b5cf6' }} />,
      path: '/orders'
    },
    {
      text: 'Banners',
      icon: <Campaign sx={{ color: '#06b6d4' }} />,
      hasSubmenu: true,
      subItems: [
        { text: 'Sub Banner', path: '/sub-banner' },
        // { text: 'Sub Banner 2', path: '/sub-banner-2' },
        // { text: 'Home Banner List 2', path: '/banners-2' },
        // { text: 'Add Banner', path: '/add-banner-2' }
      ]
    },
    {
      text: 'Blogs',
      icon: <Article sx={{ color: '#f97316' }} />,
      hasSubmenu: true,
      subItems: [
        { text: 'Blog List', path: '/blogs' },
        { text: 'Add Blog', path: '/add-blog' }
      ]
    },
    {
      text: 'Manage Logo',
      icon: <Settings sx={{ color: '#64748b' }} />,
      path: '/manage-logo'
    },
    {
      text: 'Logout',
      icon: <Logout sx={{ color: '#ef4444' }} />,
      path: '/logout'
    }
  ];

  return (
    <div className={`sidebar fixed left-0 top-0 h-full bg-white text-gray-800 transition-all duration-300 z-40 shadow-lg ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`} style={{ height: '100vh' }}>
      {/* Logo Section */}
      <Box className="p-5 border-b border-gray-100 flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-xl">JM</span>
        </div>
        <div className="ml-3">
          <h1 className="text-lg font-semibold text-gray-800">Jubian Market</h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
      </Box>
      
      {/* Navigation Items */}
      <List className="py-2 h-[calc(100%-88px)] overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {!item.hasSubmenu ? (
              // Single item with direct link
              <ListItem 
                button 
                onClick={() => handleNavigation(item.path)}
                className="hover:bg-orange-50 mx-2 my-1 rounded-lg transition-all duration-200 cursor-pointer"
                sx={{
                  '&:hover': {
                    backgroundColor: '#fff7ed',
                    '& .MuiListItemIcon-root': {
                      color: '#ef7921',
                    },
                    '& .MuiListItemText-primary': {
                      color: '#ef7921',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }} 
                />
              </ListItem>
            ) : (
              // Item with submenu
              <>
                <ListItem 
                  button 
                  onClick={() => handleClick(item.text.toLowerCase().replace(/\s+/g, '-'))}
                  className="hover:bg-orange-50 mx-2 my-1 rounded-lg transition-all duration-200 cursor-pointer"
                  sx={{
                    '&:hover': {
                      backgroundColor: '#fff7ed',
                      '& .MuiListItemIcon-root': {
                        color: '#ef7921',
                      },
                      '& .MuiListItemText-primary': {
                        color: '#ef7921',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }} 
                  />
                  {openItems[item.text.toLowerCase().replace(/\s+/g, '-')] ? 
                    <ExpandLess sx={{ color: '#9ca3af', fontSize: '18px' }} /> : 
                    <ExpandMore sx={{ color: '#9ca3af', fontSize: '18px' }} />
                  }
                </ListItem>
                <Collapse 
                  in={openItems[item.text.toLowerCase().replace(/\s+/g, '-')]} 
                  timeout="auto" 
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <ListItem 
                        button 
                        key={subIndex}
                        onClick={() => handleNavigation(subItem.path)}
                        className="pl-12 hover:bg-orange-50 mx-2 my-1 rounded-lg transition-all duration-200 cursor-pointer"
                        sx={{
                          '&:hover': {
                            backgroundColor: '#fff7ed',
                            '& .MuiListItemIcon-root': {
                              color: '#ef7921',
                            },
                            '& .MuiListItemText-primary': {
                              color: '#ef7921',
                            }
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: '30px' }}>
                          <ChevronRight sx={{ color: '#9ca3af', fontSize: '16px' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={subItem.text} 
                          primaryTypographyProps={{ 
                            fontSize: '0.8rem',
                            fontWeight: 400
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            )}
            {index === 0 && <Divider className="my-2 bg-gray-100" />}
          </React.Fragment>
        ))}
      </List>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ef7921;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;



















// import React, { useState } from 'react';
// import {
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Divider,
//   Box
// } from '@mui/material';
// import {
//   Dashboard,
//   Home,
//   Category,
//   Inventory,
//   People,
//   Receipt,
//   Campaign,
//   Article,
//   Settings,
//   ExpandLess,
//   ExpandMore,
//   ChevronRight,
//   Logout
// } from '@mui/icons-material';

// const Sidebar = ({ isOpen }) => {
//   const [openItems, setOpenItems] = useState({
//     homeSlides: false,
//     category: false,
//     products: false,
//     banners: false,
//     blogs: false
//   });

//   const handleClick = (item) => {
//     setOpenItems(prev => ({
//       ...prev,
//       [item]: !prev[item]
//     }));
//   };

//   const menuItems = [
//     {
//       text: 'Dashboard',
//       icon: <Dashboard sx={{ color: '#ef7921' }} />,
//       path: '/'
//     },
//     {
//       text: 'Home Slides',
//       icon: <Home sx={{ color: '#4f46e5' }} />,
//       hasSubmenu: true,
//       subItems: [
//         { text: 'Home Banners List', path: '/home-banners' },
//         { text: 'Add Home Banner Slide', path: '/add-home-banner' }
//       ]
//     },
//     {
//       text: 'Category',
//       icon: <Category sx={{ color: '#10b981' }} />,
//       hasSubmenu: true,
//       subItems: [
//         { text: 'Category List', path: '/categories' },
//         { text: 'Add A Category', path: '/category/add' },
//         { text: 'Sub Category List', path: '/category/subCat' },
//         { text: 'Add A Sub Category', path: '/category/subCat/add' }
//       ]
//     },
//     {
//       text: 'Products',
//       icon: <Inventory sx={{ color: '#f59e0b' }} />,
//       hasSubmenu: true,
//       subItems: [
//         { text: 'Products List', path: '/products' },
//         { text: 'Product Upload', path: '/product/upload' },
//         { text: 'Add Product RAMS', path: '/product-rams' },
//         { text: 'Add Product WEIGHT', path: '/product-weight' },
//         { text: 'Add Product SIZE', path: '/product-size' }
//       ]
//     },
//     {
//       text: 'Users',
//       icon: <People sx={{ color: '#ec4899' }} />,
//       path: '/users'
//     },
//     {
//       text: 'Orders',
//       icon: <Receipt sx={{ color: '#8b5cf6' }} />,
//       path: '/orders'
//     },
//     {
//       text: 'Banners',
//       icon: <Campaign sx={{ color: '#06b6d4' }} />,
//       hasSubmenu: true,
//       subItems: [
//         { text: 'Home Banner List', path: '/banners' },
//         { text: 'Add Home Banner', path: '/add-banner' },
//         { text: 'Home Banner List 2', path: '/banners-2' },
//         { text: 'Add Banner', path: '/add-banner-2' }
//       ]
//     },
//     {
//       text: 'Blogs',
//       icon: <Article sx={{ color: '#f97316' }} />,
//       hasSubmenu: true,
//       subItems: [
//         { text: 'Blog List', path: '/blogs' },
//         { text: 'Add Blog', path: '/add-blog' }
//       ]
//     },
//     {
//       text: 'Manage Logo',
//       icon: <Settings sx={{ color: '#64748b' }} />,
//       path: '/manage-logo'
//     },
//     {
//       text: 'Logout',
//       icon: <Logout sx={{ color: '#ef4444' }} />,
//       path: '/logout'
//     }
//   ];

//   return (
//     <div className={`sidebar fixed left-0 top-0 h-full bg-white text-gray-800 transition-all duration-300 z-40 shadow-lg ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`} style={{ height: '100vh' }}>
//       {/* Logo Section */}
//       <Box className="p-5 border-b border-gray-100 flex items-center justify-center">
//         <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
//           <span className="text-white font-bold text-xl">JM</span>
//         </div>
//         <div className="ml-3">
//           <h1 className="text-lg font-semibold text-gray-800">Jubian Market</h1>
//           <p className="text-xs text-gray-500">Admin Panel</p>
//         </div>
//       </Box>
      
//       {/* Navigation Items */}
//       <List className="py-2 h-[calc(100%-88px)] overflow-y-auto custom-scrollbar">
//         {menuItems.map((item, index) => (
//           <React.Fragment key={index}>
//             {!item.hasSubmenu ? (
//               // Single item with direct link
//               <ListItem 
//                 button 
//                 onClick={() => console.log(`Navigating to ${item.path}`)}
//                 className="hover:bg-orange-50 mx-2 my-1 rounded-lg transition-all duration-200"
//                 sx={{
//                   '&:hover': {
//                     backgroundColor: '#fff7ed',
//                     '& .MuiListItemIcon-root': {
//                       color: '#ef7921',
//                     },
//                     '& .MuiListItemText-primary': {
//                       color: '#ef7921',
//                     }
//                   }
//                 }}
//               >
//                 <ListItemIcon sx={{ minWidth: '40px' }}>
//                   {item.icon}
//                 </ListItemIcon>
//                 <ListItemText 
//                   primary={item.text} 
//                   primaryTypographyProps={{ 
//                     fontSize: '0.9rem',
//                     fontWeight: 500
//                   }} 
//                 />
//               </ListItem>
//             ) : (
//               // Item with submenu
//               <>
//                 <ListItem 
//                   button 
//                   onClick={() => handleClick(item.text.toLowerCase().replace(/\s+/g, '-'))}
//                   className="hover:bg-orange-50 mx-2 my-1 rounded-lg transition-all duration-200"
//                   sx={{
//                     '&:hover': {
//                       backgroundColor: '#fff7ed',
//                       '& .MuiListItemIcon-root': {
//                         color: '#ef7921',
//                       },
//                       '& .MuiListItemText-primary': {
//                         color: '#ef7921',
//                       }
//                     }
//                   }}
//                 >
//                   <ListItemIcon sx={{ minWidth: '40px' }}>
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText 
//                     primary={item.text} 
//                     primaryTypographyProps={{ 
//                       fontSize: '0.9rem',
//                       fontWeight: 500
//                     }} 
//                   />
//                   {openItems[item.text.toLowerCase().replace(/\s+/g, '-')] ? 
//                     <ExpandLess sx={{ color: '#9ca3af', fontSize: '18px' }} /> : 
//                     <ExpandMore sx={{ color: '#9ca3af', fontSize: '18px' }} />
//                   }
//                 </ListItem>
//                 <Collapse 
//                   in={openItems[item.text.toLowerCase().replace(/\s+/g, '-')]} 
//                   timeout="auto" 
//                   unmountOnExit
//                 >
//                   <List component="div" disablePadding>
//                     {item.subItems.map((subItem, subIndex) => (
//                       <ListItem 
//                         button 
//                         key={subIndex}
//                         onClick={() => console.log(`Navigating to ${subItem.path}`)}
//                         className="pl-12 hover:bg-orange-50 mx-2 my-1 rounded-lg transition-all duration-200"
//                         sx={{
//                           '&:hover': {
//                             backgroundColor: '#fff7ed',
//                             '& .MuiListItemIcon-root': {
//                               color: '#ef7921',
//                             },
//                             '& .MuiListItemText-primary': {
//                               color: '#ef7921',
//                             }
//                           }
//                         }}
//                       >
//                         <ListItemIcon sx={{ minWidth: '30px' }}>
//                           <ChevronRight sx={{ color: '#9ca3af', fontSize: '16px' }} />
//                         </ListItemIcon>
//                         <ListItemText 
//                           primary={subItem.text} 
//                           primaryTypographyProps={{ 
//                             fontSize: '0.8rem',
//                             fontWeight: 400
//                           }} 
//                         />
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Collapse>
//               </>
//             )}
//             {index === 0 && <Divider className="my-2 bg-gray-100" />}
//           </React.Fragment>
//         ))}
//       </List>

//       {/* Custom scrollbar styles */}
//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f5f9;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #ef7921;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Sidebar;
