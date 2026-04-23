// src/components/Student/Dashboard.jsx
import React, { useState, useEffect } from 'react';
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
	List,
	ListItem,
	ListItemText,
	Chip,
	Button,
	CircularProgress,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	useTheme,
	useMediaQuery,
} from '@mui/material';
import {
	Routes,
	Route,
	Link,
	useNavigate
} from 'react-router-dom';
// import {
// 	BarChart,
// 	Bar,
// 	PieChart,
// 	Pie,
// 	Cell,
// 	XAxis,
// 	YAxis,
// 	CartesianGrid,
// 	Tooltip,
// 	Legend,
// 	ResponsiveContainer,
// } from 'recharts';
import EventRegistration from './EventRegistration';
import ItemRequest from './ItemRequest';
import Payment from './Payment';
import { fetchAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { convertTo12Hour } from '../../services/helpers';

const StudentDashboard = () => 
{
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const navigate = useNavigate();

	const { user } = useAuth();

	const [tabValue, setTabValue] = useState(0);

	/*
	// Mock data for charts
	const eventData = [
		{ name: 'Jan', events: 2 },
		{ name: 'Feb', events: 3 },
		{ name: 'Mar', events: 1 },
		{ name: 'Apr', events: 4 },
		{ name: 'May', events: 2 },
	];

	const eventTypeData = [
		{ name: 'Academic', value: 40 },
		{ name: 'Cultural', value: 30 },
		{ name: 'Sports', value: 20 },
		{ name: 'Social', value: 10 },
	];

	const joinedEvents = [
		{ id: 1, name: 'National Architecture Week', date: '2024-04-10', status: 'Active' },
		{ id: 2, name: 'Software Tutorial Workshop', date: '2024-04-15', status: 'Completed' },
		{ id: 3, name: 'Campus Clean-up Drive', date: '2024-04-20', status: 'Active' },
	];
	*/

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	return (
		<Container maxWidth="xl">
			<Typography variant="h4" gutterBottom sx={{ mb: 2 }}>Student Dashboard</Typography>
			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					variant={ (isMobile) ? "scrollable" : null }
				>
					<Tab label="Overview" />
					<Tab label="Events" />
					<Tab label="Request Item" />
					<Tab label="Payment" />
				</Tabs>
			</Box>
			{ tabValue === 0 && <JoinedEvent userHandle={ user } nextTab={ setTabValue } /> }
			{ tabValue === 1 && <EventRegistration /> }
			{ tabValue === 2 && <ItemRequest /> }
			{ tabValue === 3 && <Payment /> }
		</Container>
	);
};

const JoinedEvent = ({ userHandle, nextTab }) =>
{
	const user = userHandle;

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const navigate = useNavigate();

	const [joinedEvents, setJoinedEvents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [events, setEvents] = useState(null);

	const [statsCard, setStatsCard] = useState({
		totalEventJoined: 0,
		totalActiveEvents: 0,
		totalPendingRequest: 0,
		totalPaid: 0,
	});

	useEffect(() => {
		async function fetchDatas() {
			try {
				setLoading(true);
				const datas = await fetchAPI(`/registration/get/student/${ user.token }`, "GET");
				const eventDatas = await fetchAPI(`/event/get/all`, "GET");
				const paymentDatas = await fetchAPI(`/transaction/get/student/${ user.token }`, "GET");
				const requestDatas = await fetchAPI(`/item/request/get/student/${ user.token }`, "GET");
				setJoinedEvents(( datas.data.cause ) ? [] : datas.data);
				setEvents(( eventDatas.data.cause ) ? null : eventDatas.data);
				setLoading(false);
				const len = ( paymentDatas.data.cause ) ? 0 : paymentDatas.data.length, d = [];
				for (var i = 0; i < len; ++i) d[i] = parseInt(paymentDatas.data[i].amount);
				setStatsCard({
					totalEventJoined: ( datas.data.cause ) ? 0 : datas.data.length,
					totalActiveEvents: ( eventDatas.data.cause ) ? 0 : eventDatas.data.filter(event => event.is_active === "true").length,
					totalPendingRequest: ( requestDatas.data.cause ) ? 0 : requestDatas.data.filter(item => item.is_approved === "neutral").length,
					totalPaid: d.reduce((a, b) => a + b, 0)
				});
			} catch (e) {
				console.error(e);
			}
		}
		fetchDatas();
	},[]);

	const getSpecificEvent = (event) => {
		if ( !events.length ) return "";
		return events.filter(e => parseInt(e.id) === parseInt(event.event_id))[0];
	}

	return (
		<Grid container spacing={3}>
			{/* Stats Cards */}
			<Grid size={{ xs: 12, md: 3 }}>
				<Card>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>Total Events Joined</Typography>
						<Typography variant="h4">{ statsCard.totalEventJoined }</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid size={{ xs: 12, md: 3 }}>
				<Card>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>Active Events</Typography>
						<Typography variant="h4">{ statsCard.totalActiveEvents }</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid size={{ xs: 12, md: 3 }}>
				<Card>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>
							Pending Requests
						</Typography>
						<Typography variant="h4">
							{ statsCard.totalPendingRequest }
						</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid size={{ xs: 12, md: 3 }}>
				<Card>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>Total Paid</Typography>
						<Typography variant="h4">₱ { statsCard.totalPaid }</Typography>
					</CardContent>
				</Card>
			</Grid>
			{/* Charts */}
			{/*
				<Grid item size={{ xs: 12, md: 8 }}>
					<Paper sx={{ p: 2 }}>
						<Typography variant="h6" gutterBottom>
							Events Participation (Monthly)
						</Typography>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={eventData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey="events" fill="#8884d8" />
							</BarChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>

				<Grid item size={{ xs: 12, md: 4 }}>
					<Paper sx={{ p: 2 }}>
						<Typography variant="h6" gutterBottom>
							Event Types Distribution
						</Typography>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={eventTypeData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
								>
									{eventTypeData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</Paper>
				</Grid>
			*/}
			<Grid size={{ xs: 12 }} sx={{ mb: 2 }}> {/* Joined Events List */}
				<Paper sx={{ p: 3 }}>
					<Typography variant="h6" gutterBottom>
						Your Joined Events
					</Typography>
					<Box sx={{ overflow: 'auto' }}>
						<List sx={{ width: { xs: '400px', md: '100%' } }}>
							{
								joinedEvents.map(event => (
									<ListItem
										key={ event.id }
										secondaryAction={
											<>
												<Chip
													// label={ ( event.is_active === "true" ) ? "Active" : "Closed" }
													// color={ event?.status === 'Active' ? 'success' : 'default' }
													// size="small"
													label="Registered"
													color="success"
												/>
												<Chip
													sx={{ ml: '10px' }}
													label={ ( getSpecificEvent(event).is_active === "true" ) ? "Active" : "Closed" }
													color={ ( getSpecificEvent(event).is_active === "true" ) ? "success" : "error" }
												/>
											</>
											// <Button onClick={ () => tab(1) } >View Details</Button>
										}
									>
										<ListItemText
											primary={ event.event_name }
											secondary={ `Joined Date: ${ new Date(event.created_at).toDateString() }` }
										/>
										<ListItemText
											primary="Event date"
											secondary={
												`
												${ new Date( getSpecificEvent(event).date ).toDateString() } | 
												${ convertTo12Hour( getSpecificEvent(event).time_start ) } to
												${ convertTo12Hour( getSpecificEvent(event).time_end ) }
												`
											}
										/>
										<ListItemText
											primary="Event location"
											secondary={ `${ getSpecificEvent(event).location }` }
										/>
									</ListItem>
								))
							}
						</List>
						{/*<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} >Event</TableCell>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} >Starts</TableCell>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} >Ends</TableCell>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} >Location</TableCell>
										<TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} >Status</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										joinedEvents.map(event => (
											// <ListItem
											// 	key={ event.id }
											// 	secondaryAction={
											// 		<Chip
											// 			// label={ ( event.is_active === "true" ) ? "Active" : "Closed" }
											// 			// color={ event?.status === 'Active' ? 'success' : 'default' }
											// 			// size="small"
											// 			label="Registered"
											// 			color="success"
											// 		/>
											// 		// <Button onClick={ () => tab(1) } >View Details</Button>
											// 	}
											// >
											// 	<ListItemText
											// 		primary={ event.event_name }
											// 		secondary={`Joined Date: ${ new Date(event.created_at).toDateString() }`}
											// 	/>
											// </ListItem>
											<></>
										))
									}
								</TableBody>
							</Table>
						</TableContainer>*/}
						{ ( loading ) && <Box fullWidth align="center" ><CircularProgress /></Box> }
						{
							( !loading && joinedEvents.length === 0 ) && (
								<Typography color="text.secondary" align="center">You did not join any events</Typography>
							)
						}
					</Box>
					<Button
						variant="outlined"
						size={ (isMobile) ? "small" : "" }
						fullWidth={ (isMobile) ? true : false }
						onClick={() => nextTab(1)}
						sx={{ mt: 2 }}
					>
						Register for More Events
					</Button>
				</Paper>
			</Grid>
		</Grid>
	);
}

export default StudentDashboard;
