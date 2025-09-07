import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Fade,
  Slide,
  Zoom,
  useTheme,
  useMediaQuery,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Science,
  Eco,
  Assessment,
  Chat,
  Person,
  Star,
  Notifications,
  Language,
  Logout,
  Settings,
  Close,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const drawerWidth = 280;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      color: '#4caf50',
    },
    {
      text: 'AI Advisory',
      icon: <Science />,
      path: '/advisory',
      color: '#ff9800',
    },
    {
      text: 'Sustainable Practices',
      icon: <Eco />,
      path: '/practices',
      color: '#2e7d32',
    },
    {
      text: 'Digital Twin',
      icon: <Assessment />,
      path: '/simulation',
      color: '#9c27b0',
    },
    {
      text: 'Communication',
      icon: <Chat />,
      path: '/communication',
      color: '#2196f3',
    },
    {
      text: 'Achievements',
      icon: <Star />,
      path: '/achievements',
      color: '#ff5722',
    },
    {
      text: 'Profile',
      icon: <Person />,
      path: '/profile',
      color: '#607d8b',
    },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    handleMenuClose();
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, #2e7d32 0%, #4caf50 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `,
          zIndex: 0,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        {/* Logo */}
        <Fade in={true} timeout={1000}>
          <Box display="flex" alignItems="center" mb={4}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                width: 48,
                height: 48,
                mr: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Eco />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                SFN Demo
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Sustainable Farming
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* User Info */}
        <Fade in={true} timeout={1200}>
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  width: 40,
                  height: 40,
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {user?.name || 'Farmer'}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {user?.email || 'farmer@sfn.com'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Navigation Menu */}
        <List sx={{ px: 0 }}>
          {menuItems.map((item, index) => (
            <Slide
              key={item.text}
              direction="right"
              in={true}
              timeout={800}
              delay={1400 + index * 100}
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    py: 1.5,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isActivePath(item.path)
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'transparent',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.15)',
                      transform: 'translateX(8px)',
                    },
                    '&::before': isActivePath(item.path)
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 4,
                          height: '60%',
                          background: item.color,
                          borderRadius: '0 2px 2px 0',
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActivePath(item.path) ? 'white' : 'rgba(255, 255, 255, 0.8)',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActivePath(item.path) ? 600 : 400,
                      fontSize: '0.95rem',
                    }}
                  />
                  {isActivePath(item.path) && (
                    <ArrowForward sx={{ fontSize: 16, opacity: 0.8 }} />
                  )}
                </ListItemButton>
              </ListItem>
            </Slide>
          ))}
        </List>

        {/* Language Selector */}
        <Fade in={true} timeout={1600}>
          <Box mt={4}>
            <Typography variant="caption" sx={{ opacity: 0.8, mb: 2, display: 'block' }}>
              Language
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {languages.map((lang) => (
                <Chip
                  key={lang.code}
                  label={`${lang.flag} ${lang.name}`}
                  size="small"
                  onClick={() => handleLanguageChange(lang.code)}
                  sx={{
                    background: currentLanguage === lang.code
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: scrolled
            ? 'rgba(46, 125, 50, 0.95)'
            : 'linear-gradient(135deg, #2e7d32, #4caf50)',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled
            ? '0 8px 32px rgba(46, 125, 50, 0.3)'
            : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => isActivePath(item.path))?.text || 'Dashboard'}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton color="inherit">
                <Settings />
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  transition: 'transform 0.2s ease',
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                minWidth: 200,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Person sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 50%, #f1f8e9 100%)',
        }}
      >
        <Toolbar />
        <Fade in={true} timeout={1000}>
          <Box>{children}</Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default Layout;