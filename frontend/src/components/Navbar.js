import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#1a237e',
        boxShadow: 2
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: 1
          }}
        >
          CreditSea Reports
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<CloudUploadIcon />}
            sx={{
              backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            Upload
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/reports"
            startIcon={<AssessmentIcon />}
            sx={{
              backgroundColor: location.pathname === '/reports' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            Reports
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;