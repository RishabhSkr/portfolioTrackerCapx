import { Box, Button, Typography } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const Hero = ({ onViewPortfolio }) => {
  return (
    <Box
      sx={{
        minHeight: '40vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        background: 'linear-gradient(to right bottom, #2196f3, #1976d2)',
        color: 'white',
        padding: '2rem',
        borderRadius: '0 0 20% 20%',
        textAlign: 'center'
      }}
    >
      <TrendingUp sx={{ fontSize: 60 }} />
      <Typography variant="h2" fontWeight="bold">
        Portfolio Tracker
      </Typography>
      <Typography variant="h5" sx={{ maxWidth: 600, mb: 2 }}>
        Track your investments in real-time with our powerful portfolio management tool
      </Typography>
      <Button 
        variant="contained" 
        size="large"
        onClick={onViewPortfolio}
        sx={{
          backgroundColor: 'white',
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.9)'
          }
        }}
      >
        View Portfolio
      </Button>
    </Box>
  );
};

export default Hero;
