'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Bedtime,
  Analytics,
  Flag,
  Settings,
  Person,
  Notifications,
  Close,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: ${drawerWidth}px;
    background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
    color: white;
    border: none;
    box-shadow: 4px 0 20px rgba(0,0,0,0.1);
  }
`;

const StyledListItemButton = styled(ListItemButton)`
  margin: 4px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255,255,255,0.1);
    transform: translateX(8px);
  }
  
  &.Mui-selected {
    background-color: rgba(14, 165, 233, 0.2);
    border-left: 4px solid #0ea5e9;
    
    &:hover {
      background-color: rgba(14, 165, 233, 0.3);
    }
  }
`;

const UserSection = styled(Box)`
  padding: 24px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 16px;
`;

const NavItem = styled(motion.div)`
  margin-bottom: 8px;
`;

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard />, description: 'Overview of your sleep' },
    { id: 'tracker', label: 'Sleep Tracker', icon: <Bedtime />, description: 'Track your sleep sessions' },
    { id: 'analytics', label: 'Analytics', icon: <Analytics />, description: 'Sleep data insights' },
    { id: 'goals', label: 'Goals', icon: <Flag />, description: 'Set and track sleep goals' },
    { id: 'settings', label: 'Settings', icon: <Settings />, description: 'App preferences' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavItemClick = (pageId: string) => {
    onPageChange(pageId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* User Section */}
      <UserSection>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}
          >
            S
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              SleepTracker
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Your sleep companion
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label="Premium"
            size="small"
            sx={{
              bgcolor: 'rgba(251, 191, 36, 0.2)',
              color: '#fbbf24',
              border: '1px solid rgba(251, 191, 36, 0.3)',
            }}
          />
          <Chip
            label="7 day streak"
            size="small"
            sx={{
              bgcolor: 'rgba(34, 197, 94, 0.2)',
              color: '#22c55e',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}
          />
        </Box>
      </UserSection>

      {/* Navigation Items */}
      <List sx={{ flex: 1, px: 2 }}>
        {navItems.map((item, index) => (
          <NavItem
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ListItem disablePadding>
              <StyledListItemButton
                selected={currentPage === item.id}
                onClick={() => handleNavItemClick(item.id)}
                sx={{
                  '& .MuiListItemIcon-root': {
                    color: currentPage === item.id ? '#0ea5e9' : 'rgba(255,255,255,0.8)',
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: currentPage === item.id ? 600 : 400,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  secondaryTypographyProps={{
                    sx: { opacity: 0.7, fontSize: '0.75rem' }
                  }}
                />
              </StyledListItemButton>
            </ListItem>
          </NavItem>
        ))}
      </List>

      {/* Bottom Section */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Last sync: 2 min ago
          </Typography>
          <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <Notifications />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#22c55e',
              animation: 'pulse 2s infinite',
            }}
          />
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Connected to sleep device
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {navItems.find(item => item.id === currentPage)?.label || 'SleepTracker'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <Notifications />
            </IconButton>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              <Person />
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <StyledDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </StyledDrawer>

      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: theme.zIndex.drawer - 1,
          }}
          onClick={handleDrawerToggle}
        />
      )}

      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
};

export default Navigation;

