import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme as useMuiTheme,
  Tooltip,
  Collapse,
  Fab,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Spa as SpaIcon,
  Inventory as InventoryIcon,
  CalendarMonth as CalendarIcon,
  BarChart as BarChartIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Logout as LogoutIcon,
  LocationCity as LocationCityIcon,
  ExpandLess,
  ExpandMore,
  Settings as SettingsIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Scissors } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import Footer from './Footer';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Clientes', icon: <PeopleIcon />, path: '/clients' },
  { text: 'Profissionais', icon: <PersonIcon />, path: '/professionals' },
  { text: 'Serviços', icon: <SpaIcon />, path: '/services' },
  { text: 'Produtos', icon: <InventoryIcon />, path: '/products' },
  { text: 'Agenda', icon: <CalendarIcon />, path: '/schedule' },
  { text: 'Relatórios', icon: <BarChartIcon />, path: '/reports' },
];

const Layout = () => {
  const { usuario,sair} = useAuth();
  const { mode, toggleColorMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    sair();
    navigate('/login');
  };

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Scissors size={28} color={muiTheme.palette.primary.main} />
          <Typography variant="h6" component="div" fontWeight="bold" color="primary">
            BellaSoft
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} edge="end">
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(156, 39, 176, 0.08)',
                  borderRight: `3px solid ${muiTheme.palette.primary.main}`,
                  '&:hover': {
                    backgroundColor: 'rgba(156, 39, 176, 0.12)',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? muiTheme.palette.primary.main : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Settings Section */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleSettingsToggle}>
            <ListItemIcon >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Configurações" />
            {settingsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              selected={location.pathname === '/cidades'}
              onClick={() => handleMenuClick('/cidades')}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === '/cidades' ? muiTheme.palette.primary.main : 'inherit',
                }}
              >
                <LocationCityIcon />
              </ListItemIcon>
              <ListItemText primary="Cidades" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: desktopOpen ? `${drawerWidth}px` : 0 },
          boxShadow: 'none',
          borderBottom: `1px solid ${muiTheme.palette.divider}`,
          backgroundColor: muiTheme.palette.background.paper,
          color: muiTheme.palette.text.primary,
          transition: muiTheme.transitions.create(['margin', 'width'], {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={mode === 'dark' ? 'Modo claro' : 'Modo escuro'}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls="menu-appbar"
              aria-haspopup="true"
            >
              <Avatar
                sx={{
                  bgcolor: muiTheme.palette.primary.main,
                  width: 40,
                  height: 40,
                }}
              >
                {usuario?.name.charAt(0)}
              </Avatar>
            </IconButton>
            <Typography
              variant="body1"
              component="div"
              sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}
            >
              {usuario?.name}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          // width: 0, 
          // width: { md: desktopOpen ? drawerWidth : 0 }, 
          flexShrink: { md: 0 },
          transition: muiTheme.transitions.create('width', {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              transition: muiTheme.transitions.create('width', {
                easing: muiTheme.transitions.easing.sharp,
                duration: muiTheme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open={desktopOpen}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { 
            xs: '100%',
            md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' 
          },
          ml: { md: desktopOpen ? `${drawerWidth}px` : 0 },
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'auto',
          transition: muiTheme.transitions.create(['margin', 'width'], {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1, mb: 4 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sair</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout;