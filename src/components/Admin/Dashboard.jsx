import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Container,
	Grid,
	Paper,
	Typography,
	Box,
	Card,
	CardContent,
	Tab,
	Tabs,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	IconButton,
	Chip,
	TextField,
	CircularProgress,
	useTheme,
	useMediaQuery
} from '@mui/material';
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
	Check as CheckIcon,
	Close as CloseIcon,
	MonetizationOn as MonetizationIcon,
} from '@mui/icons-material';
import {
	LineChart,
	Line,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import EventManagement from './EventManagement';
import BorrowRequests from './BorrowRequests';
import Transactions from './Transactions';
import ItemManagement from './ItemManagement';
import { fetchAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => 
{
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const navigate = useNavigate();

	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleApproveRequest = (id) => {
		console.log('Approved request:', id);
	};

	const handleRejectRequest = (id) => {
		console.log('Rejected request:', id);
	};

	return (
		<Container maxWidth="xl">
			<Typography variant="h4" gutterBottom sx={{ mb: 1 }}>Admin Dashboard</Typography>

			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
				<Tabs value={tabValue} onChange={handleTabChange} variant={ (isMobile) ? "scrollable" : null }>
					<Tab label="Overview" />
					<Tab label="Event Management" />
					<Tab label="Item Management" />
					<Tab label="Borrow Requests" />
					<Tab label="Transactions" />
				</Tabs>
			</Box>

			{ tabValue === 0 && ( <Charts /> ) }
			{ tabValue === 1 && ( <EventManagement /> ) }
			{ tabValue === 2 && ( <ItemManagement /> ) }
			{ tabValue === 3 && ( <BorrowRequests /> ) }
			{ tabValue === 4 && ( <Transactions /> ) }

			{/*
				tabValue === 4 && (
					<Grid size={{ xs: 12, sm: 6, md: 3 }}>
						<Card>
							<CardContent>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<Box>
										<Typography color="text.secondary" gutterBottom>
											Current Plan
										</Typography>
										<Typography variant="h5">
											Free Tier
										</Typography>
									</Box>
									<MonetizationIcon color="primary" />
								</Box>
								<Button
									size="small"
									variant="outlined"
									fullWidth
									sx={{ mt: 1 }}
									onClick={() => navigate('/admin/subscription')}
								>
									Upgrade Plan
								</Button>
							</CardContent>
						</Card>
					</Grid>
				)
			*/}
			
		</Container>
	);
};

const Charts = () =>
{
	const { user } = useAuth();

	const [loadingCharts, setLoadingCharts] = useState(false);

	const [cardDatas, setCardDatas] = useState({
		totalUsers: 0,
		totalActiveEvents: 0,
		totalPendingRequest: 0,
		totalRevenue: 0,
	});

	const [userGrowthData, setUserGrowthData] = useState([
		{ month: 'Jan', students: 0 },
		{ month: 'Feb', students: 0 },
		{ month: 'Mar', students: 0 },
		{ month: 'Apr', students: 0 },
		{ month: 'May', students: 0 },
		{ month: 'Jun', students: 0 },
		{ month: 'Jul', students: 0 },
		{ month: 'Aug', students: 0 },
		{ month: 'Sep', students: 0 },
		{ month: 'Oct', students: 0 },
		{ month: 'Nov', students: 0 },
		{ month: 'Dec', students: 0 }
	]);

	const [requestTrendsData, setRequestTrendsData] = useState([
		{ day: 'Mon', events: 0, borrows: 0 },
		{ day: 'Tue', events: 0, borrows: 0 },
		{ day: 'Wed', events: 0, borrows: 0 },
		{ day: 'Thu', events: 0, borrows: 0 },
		{ day: 'Fri', events: 0, borrows: 0 },
		{ day: 'Sat', events: 0, borrows: 0 },
		{ day: 'Sun', events: 0, borrows: 0 }
	]);

	const filterLengthByMonth = (data, numMonth) => {
		if (!data) return;
		return data.filter(item => new Date(item.created_at).getMonth()+1 === numMonth).length;
	}

	const filterLengthByDay = (data, numDay) => {
		if (!data) return;
		return data.filter(item => new Date(item.created_at).getDay() === numDay).length;
	}

	useEffect(() => {
		async function fetchDatas() {
			try {
				setLoadingCharts(true);
				const studentDatas = await fetchAPI("/student/get/all/data", "GET");
				const eventDatas = await fetchAPI("/event/get/all", "GET");
				const registrationDatas = await fetchAPI(`/registration/get/admin/token/${ user.token }`, "GET");
				const paymentDatas = await fetchAPI(`/transaction/get/admin/${ user.token }`, "GET");
				const requestDatas = await fetchAPI(`/item/request/get/admin/${ user.token }`, "GET");
				setLoadingCharts(false);
				if ( studentDatas.data.cause || eventDatas.data.cause ||
					 registrationDatas.data.cause || paymentDatas.data.cause ||
					 requestDatas.data.cause ) {
					alert("Unable to load informations");
					setLoadingCharts(false);
					return;
				}
				const len = paymentDatas.data.length, d = [];
				for (var i = 0; i < len; ++i) d[i] = parseInt(paymentDatas.data[i].amount);
				setUserGrowthData([
					{ month: 'Jan', students: filterLengthByMonth(studentDatas.data, 1) },
					{ month: 'Feb', students: filterLengthByMonth(studentDatas.data, 2) },
					{ month: 'Mar', students: filterLengthByMonth(studentDatas.data, 3) },
					{ month: 'Apr', students: filterLengthByMonth(studentDatas.data, 4) },
					{ month: 'May', students: filterLengthByMonth(studentDatas.data, 5) },
					{ month: 'Jun', students: filterLengthByMonth(studentDatas.data, 6) },
					{ month: 'Jul', students: filterLengthByMonth(studentDatas.data, 7) },
					{ month: 'Aug', students: filterLengthByMonth(studentDatas.data, 8) },
					{ month: 'Sep', students: filterLengthByMonth(studentDatas.data, 9) },
					{ month: 'Oct', students: filterLengthByMonth(studentDatas.data, 10) },
					{ month: 'Nov', students: filterLengthByMonth(studentDatas.data, 11) },
					{ month: 'Dec', students: filterLengthByMonth(studentDatas.data, 12) }
				]);
				setRequestTrendsData([
					{ day: 'Mon', events: filterLengthByDay(registrationDatas.data, 1), borrows: filterLengthByDay(requestDatas.data, 1) },
					{ day: 'Tue', events: filterLengthByDay(registrationDatas.data, 2), borrows: filterLengthByDay(requestDatas.data, 2) },
					{ day: 'Wed', events: filterLengthByDay(registrationDatas.data, 3), borrows: filterLengthByDay(requestDatas.data, 3) },
					{ day: 'Thu', events: filterLengthByDay(registrationDatas.data, 4), borrows: filterLengthByDay(requestDatas.data, 4) },
					{ day: 'Fri', events: filterLengthByDay(registrationDatas.data, 5), borrows: filterLengthByDay(requestDatas.data, 5) },
					{ day: 'Sat', events: filterLengthByDay(registrationDatas.data, 6), borrows: filterLengthByDay(requestDatas.data, 6) },
					{ day: 'Sun', events: filterLengthByDay(registrationDatas.data, 0), borrows: filterLengthByDay(requestDatas.data, 0) }
				]);
				setCardDatas({
					totalUsers: studentDatas.data.length,
					totalActiveEvents: eventDatas.data.filter(event => event.is_active === "true").length,
					totalPendingRequest: requestDatas.data.filter(req => req.is_approved === "neutral").length,
					totalRevenue: d.reduce((a, b) => a + b, 0)
				})
			} catch (e) {
				console.error(e);
			}
		}
		fetchDatas();
	}, []);

	return (
		<Grid container spacing={3}>
			<Grid size={{ xs: 12, md: 3 }}>
				<Card>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>Total Users</Typography>
						<Typography variant="h4">{ cardDatas.totalUsers }</Typography>
					</CardContent>
				</Card>
			</Grid>
			
			<Grid size={{ xs: 12, md: 3 }}>
				<Card>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>Active Events</Typography>
						<Typography variant="h4">{ cardDatas.totalActiveEvents }</Typography>
					</CardContent>
				</Card>
			</Grid>
			
			<Grid size={{ xs: 12, md: 3 }}>
				<Card>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>Pending Requests</Typography>
						<Typography variant="h4">{ cardDatas.totalPendingRequest }</Typography>
					</CardContent>
				</Card>
			</Grid>
			
			<Grid size={{ xs: 12, md: 3 }}>
				<Card>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>Total Revenue</Typography>
						<Typography variant="h4">₱ { cardDatas.totalRevenue }</Typography>
					</CardContent>
				</Card>
			</Grid>

			{
				( loadingCharts ) && (
					<Grid size={{ xs: 12 }}>
						<Box fullWidth align="center" >
							<CircularProgress />
						</Box>
					</Grid>
				)
			}

			{
				( !loadingCharts ) && (
					<>
						<Grid size={{ xs: 12, md: 6 }}>
							<Paper sx={{ p: 2 }}>
								<Typography variant="h6" gutterBottom>Student Growth</Typography>
								<ResponsiveContainer width="100%" height={300}>
									<LineChart data={ userGrowthData }>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="month" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Line type="monotone" dataKey="students" stroke="#8884d8" activeDot={{ r: 8 }} />
									</LineChart>
								</ResponsiveContainer>
							</Paper>
						</Grid>

						<Grid size={{ xs: 12, md: 6 }}>
							<Paper sx={{ p: 2 }}>
								<Typography variant="h6" gutterBottom>Request Trends</Typography>
								<ResponsiveContainer width="100%" height={300}>
									<AreaChart data={ requestTrendsData }>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="day" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Area type="monotone" dataKey="events" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
										<Area type="monotone" dataKey="borrows" stackId="1" stroke="#8884d8" fill="#8884d8" />
									</AreaChart>
								</ResponsiveContainer>
							</Paper>
						</Grid>
					</>
				)
			}
		</Grid>
	);
}

export default AdminDashboard;
