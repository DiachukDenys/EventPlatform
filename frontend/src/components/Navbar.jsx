import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // твій кастомний хук

const Navbar = () => {
  const { user, logout, activeRole, changeRole } = useAuth();
  if (user) var availableRoles = user.roles;
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const open = Boolean(anchorEl);
  const handleClick = (event) =>{ 
    
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => setAnchorEl(null);



  const handleRoleSelect = (role) => {
    changeRole(role);
    handleClose();
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Головна" />
        </ListItem>
        {!user ? (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Увійти" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemText primary="Реєстрація" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/profile">
              <AccountCircleIcon sx={{ mr: 1 }} />
              <ListItemText primary="Профіль" />
            </ListItem>
            <ListItem button onClick={logout}>
              <ListItemText primary="Вийти" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );


  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'white' }}>
          EventPlatform
        </Typography>
        {isMobile ? (
          <>
            <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              {drawerContent}
            </Drawer>
          </>
        ) : (
          <Box>
            <Button color='inherit' component={Link} to="/events">Події</Button>
            {!user ? (
              <>
                <Button color="inherit" component={Link} to="/login">Увійти</Button>
                <Button color="inherit" component={Link} to="/register">Реєстрація</Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={handleClick} endIcon={<ExpandMoreIcon />}>
                  {activeRole || 'Оберіть роль'}
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  {availableRoles.map((role) => (
                    <MenuItem key={role} onClick={() => handleRoleSelect(role)}>
                      <ListItemIcon>
                        {activeRole === role && <CheckIcon fontSize="small" />}
                      </ListItemIcon>
                      <ListItemText>{role}</ListItemText>
                    </MenuItem>
                  ))}
                </Menu>
                <Button color="inherit" component={Link} to="/profile" startIcon={<AccountCircleIcon />}>
                  Профіль
                </Button>
                <Button color="inherit" onClick={logout}>Вийти</Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
);

};

export default Navbar;
