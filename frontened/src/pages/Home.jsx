import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import TopStocks from '../components/TopStocks';
import SearchStocks from '../components/SearchStocks';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();



  return (
    <Box>
      <Hero onViewPortfolio={() => navigate('/dashboard')} />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SearchStocks />  
        <TopStocks />
      </Container>
      <Footer />
    </Box>
  );
};

export default Home;