import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Typography
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Person,
  Logout
} from '@mui/icons-material';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    console.log('Logging out...');
  };

  const handleProfile = () => {
    handleUserMenuClose();
    console.log('Navigating to profile...');
  };

  return (
    <header className={`h-[60px] bg-white shadow-sm flex items-center fixed top-0 z-50 transition-all duration-300 ${sidebarOpen ? 'left-64 w-[calc(100%-16rem)]' : 'left-0 w-full'}`}>
      <div className='flex items-center px-4'>
        <IconButton onClick={toggleSidebar} className='mr-2'>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className='hidden md:block'>
          Admin Dashboard
        </Typography>
      </div>

      <div className='flex items-center gap-4 ml-auto px-4'>
        <IconButton>
          <Badge badgeContent={4} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        <IconButton onClick={handleUserMenuClick}>
          <Avatar 
            sx={{ width: 36, height: 36, bgcolor: '#ef7921' }} 
            alt="User"
          >
            A
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleUserMenuClose}
          onClick={handleUserMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfile}>
            <Person sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;