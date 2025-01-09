import {
    AccountBalance as AccountBalanceIcon,
    ShowChart as ChartIcon,
    House as HouseIcon,
    AttachMoney as MoneyIcon,
    Refresh as RefreshIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
    Box,
    Container,
    IconButton,
    Paper,
    Stack,
    Typography,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { PieChart } from '../components/Chart';
import StockList from '../components/StockList';
import { BASE_URL, } from '../../constants';
import axios from 'axios';
import EditStockDialog from '../components/EditStockDialog';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        totalValue: 0,
        totalStocks: 0,
        topPerformer: null,
        holdings: [],
    });
    const [loading, setLoading] = useState(true);
    const [selectedStock, setSelectedStock] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const fetchDashBoardData = async (showToast = false) => {
        try {
            setLoading(true);
            if (showToast) {
                toast.loading('Fetching dashboard data...');
            }
            const res = await axios.get(`${BASE_URL}/stats`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setDashboardData(res.data.data);
        } catch (error) {
            toast.error(`Error fetching dashboard data - ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashBoardData(false); // Initial load without toast
        const interval = setInterval(() => fetchDashBoardData(false), 300000); // Auto-refresh without toast
        return () => clearInterval(interval);
    }, []);

    const handleManualRefresh = () => {
        fetchDashBoardData(true); // Show toast only on manual refresh
    };

    const handleEditStockQuantity = async (stockId, quantity) => {
        try {
            await axios.put(`${BASE_URL}/${stockId}`, { quantity },{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Stock quantity updated successfully');
            await fetchDashBoardData();
        } catch (error) {
            toast.error(`Error updating stock quantity - ${error.message}`);
        }
    };

    const handleEditClick = stockId => {
        const stock = dashboardData.holdings.find(s => s.stockId === stockId);
        setSelectedStock(stock);
        setEditDialogOpen(true);
    };
    const handleDeleteStock = async stockId => {
        try {
            await axios.delete(`${BASE_URL}/${stockId}`,{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // Refetch dashboard data after successful deletion
            toast.success('Stock deleted successfully');
            await fetchDashBoardData();
        } catch (error) {
            toast.error(`Error deleting stock - ${error.message}`);
        }
    };

    const Widgets = (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing="2rem"
            justifyContent="space-between"
            margin="2rem 0"
        >
            <Widget
                title="Portfolio Value"
                value={`$${(dashboardData?.totalValue || 0).toFixed(2)}`}
                Icon={<MoneyIcon />}
            />
            <Widget
                title="Top Performer"
                value={`${dashboardData?.topPerformer?.symbol || 'N/A'}`}
                secondaryValue={`$${
                    dashboardData?.topPerformer?.value?.toFixed(2) || 0
                }`}
                Icon={<TrendingUpIcon />}
            />
            <Widget
                title="Total Stocks"
                value={dashboardData?.totalStocks || 0}
                Icon={<ChartIcon />}
            />
        </Stack>
    );

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 3 }}>
                Portfolio Dashboard
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    padding: { xs: '1rem', sm: '2rem' },
                    margin: '2rem 0',
                    borderRadius: '1rem',
                }}
            >
                <Stack
                    direction={'row'}
                    alignItems={'center'}
                    spacing={2}
                    sx={{ width: '100%' }}
                >
                    <AccountBalanceIcon sx={{ fontSize: '2rem' }} />
                    <Typography variant="h6" sx={{ flexGrow: 0 }}>
                        Stock Portfolio
                    </Typography>

                    <Box sx={{ flexGrow: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                        <Tooltip title="Refresh Portfolio">
                            <IconButton onClick={handleManualRefresh}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        </Stack>
                    </Box>

                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Last Updated: {new Date().toLocaleTimeString()}
                        </Typography>
                    </Box>
                    <Box>
                        <Tooltip title="Back to Home">
                            <IconButton
                                onClick={() => navigate('/')}
                                sx={{
                                    backgroundColor: "black",
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: "darkgrey",
                                        transform: 'scale(1.1)',
                                    },
                                    transition: 'all 0.2s',
                                }}
                            >
                                <HouseIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Stack>
            </Paper>
            {!loading ? Widgets : <CircularProgress />}
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
                <Paper
                    elevation={3}
                    sx={{ p: 3, flex: 2, borderRadius: '1.5rem' }}
                >
                    <Typography variant="h6" gutterBottom>
                        Holdings
                    </Typography>
                    <StockList
                        stocks={dashboardData?.holdings || []}
                        onDelete={handleDeleteStock}
                        onEdit={handleEditClick}
                    />
                </Paper>

                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        flex: 1,
                        height: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '1.5rem',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Portfolio Distribution
                    </Typography>
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            maxHeight: '450px',
                        }}
                    >
                        <PieChart
                            value={
                                dashboardData?.holdings?.map(s => s.value) || []
                            }
                            labels={
                                dashboardData?.holdings?.map(s => s.symbol) ||
                                []
                            }
                        />
                    </Box>
                </Paper>
            </Stack>

            <EditStockDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                stock={selectedStock}
                onSave={handleEditStockQuantity}
            />
        </Container>
    );
};

const Widget = ({ title, value, secondaryValue, Icon }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Paper
            elevation={3}
            sx={{
                padding: '2rem',
                margin: '2rem 0',
                borderRadius: '1.5rem',
                width: '20rem',
            }}
        >
            <Stack alignItems={'center'} spacing={'1rem'}>
                <Stack alignItems={'center'} spacing={1}>
                    <Typography
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        sx={{
                            color: 'rgba(0,0,0,0.7)',
                            borderRadius: '50%',
                            border: `5px solid rgb(0, 0, 0)`,
                            width: '5rem',
                            height: '5rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: secondaryValue ? 'pointer' : 'default',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {isHovered && secondaryValue ? secondaryValue : value}
                    </Typography>
                </Stack>
                <Stack direction={'row'} spacing={'1rem'} alignItems={'center'}>
                    {Icon}
                    <Typography>{title}</Typography>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default Dashboard;
