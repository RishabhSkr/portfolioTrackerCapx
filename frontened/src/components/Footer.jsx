import React from 'react'
import { Box, Container, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            Made with <FavoriteIcon sx={{ color: 'red' }} /> by Rishabh Sonkar
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
          >
            © {new Date().getFullYear()} Portfolio Tracker. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};


export default Footer;