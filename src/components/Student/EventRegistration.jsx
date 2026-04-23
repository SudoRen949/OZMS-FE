import React, { useState, useEffect } from 'react';
import {
	Paper,
	Typography,
	Grid,
	Card,
	CardContent,
	CardActions,
	Button,
	TextField,
	MenuItem,
	Box,
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	InputLabel,
	Select,
	Alert,
	Stepper,
	Step,
	StepLabel,
	CircularProgress,
	Tooltip,
	Link,
	useTheme,
	useMediaQuery,
} from '@mui/material';
import { fetchAPI, API_BASE_URL } from '../../services/api';
import { convertTo12Hour } from '../../services/helpers';
import { useAuth } from '../../context/AuthContext';

const EventRegistration = () => 
{
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const { user } = useAuth();

	const personalDataValue = {
		firstName: user.first_name,
		lastName: user.last_name,
		suffix: user.suffix || '',
		studentId: user.student_id,
		email: user.email,
		department: 'cea',
		year: '1st',
		course: 'Computer Engineering',
	};

	const transactionDataValue = {
		paymentMethod: null,
		receipt: null
	}

	const courses = [
		'Computer Engineering',
		'Architecture',
		'Civil Engineering',
		'Electrical Engineering',
		'Mechanical Engineering',
		'Information Technology',
		'Computer Science',
		'Geodetic Engineering',
	];
	
	const [events, setEvents] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterType, setFilterType] = useState('all');
	const [personalData, setPersonalData] = useState(personalDataValue);
	const [transactionData, setTransactionData] = useState(transactionDataValue);
	const [loading, setLoading] = useState(false);
	const [loadingSubmition, setLoadingSubmition] = useState(false);
	const [joinedEvents, setJoinedEvents] = useState([]);

	useEffect(() => {
		async function fetchAllEvents() {
			try {
				setLoading(true);
				const eventDatas = await fetchAPI("/event/get/all", "GET");
				const joinedDatas = await fetchAPI(`/registration/get/student/${ user.token }`, "GET");
				setEvents(( eventDatas.data.cause ) ? [] : eventDatas.data);
				setFilteredEvents(( eventDatas.data.cause ) ? [] : eventDatas.data);
				setJoinedEvents(( joinedDatas.data.cause ) ? [] : joinedDatas.data);
				setLoading(false);
			} catch (e) {
				console.error(e);
			}
		}
		fetchAllEvents();
	}, []);

	useEffect(() => {
		let filtered = events;
		if (searchTerm) {
			filtered = filtered.filter(event =>
				event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				event.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
		if (filterType !== 'all') {
			filtered = filtered.filter(event => event.category.toLowerCase() === filterType);
		}
		setFilteredEvents(filtered);
	}, [searchTerm, filterType, events]);

	const handleRegisterClick = (event) => {
		const paymentProps = event?.payment_props;
		setSelectedEvent({
			...event,
			payment_props: JSON.parse(paymentProps)
		});
		setActiveStep(0);
		setOpenDialog(true);
	};

	const handleNext = () => {
		setActiveStep((prevStep) => prevStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	const handleClose = () => {
		setOpenDialog(false);
		setActiveStep(0);
		setPersonalData(personalDataValue);
		setTransactionData(transactionDataValue);
	};

	const handleSubmitRegistration = async () => {
		try {
			setLoadingSubmition(true);
			const joinedNum = parseInt(selectedEvent.joined) + 1;
			// registration
			const data = {
				...personalData,
				token: user.token,
				fullname: `${ personalData.firstName } ${ personalData.lastName } ${ personalData.suffix || '' }`,
				eventId: selectedEvent.id,
				eventName: selectedEvent.title,
				eventOwnerName: selectedEvent.owner,
				eventOwnerToken: selectedEvent.token
			}
			// transaction
			const formData = new FormData();
			formData.append("token", user.token);
			formData.append("eventId", selectedEvent.id);
			formData.append("receipt", transactionData.receipt);
			formData.append("name", data.fullname);
			formData.append("paymentType", selectedEvent.payment_type);
			formData.append("studentId", data.studentId);
			formData.append("amount", selectedEvent.fee);
			formData.append("activity", `${ selectedEvent.title } ( Event )`);
			formData.append("targetName", selectedEvent.owner);
			formData.append("targetToken", selectedEvent.token);
			await fetch(`${ API_BASE_URL }/transaction/store`, { method: "POST", body: formData });
			await fetchAPI("/registration/store", "POST", data);
			await fetchAPI(`/event/edit/${ selectedEvent.id }`, "PUT", { joined: String(joinedNum) });
			setLoadingSubmition(false);
			handleClose();
			alert(`You have successfuly registered to ${ selectedEvent.title }`);
			// refresh event data
			setLoading(true);
			const eventDatas = await fetchAPI("/event/get/all", "GET");
			const joinedDatas = await fetchAPI(`/registration/get/student/${ user.token }`, "GET");
			setEvents(( eventDatas.data.cause ) ? [] : eventDatas.data);
			setFilteredEvents(( eventDatas.data.cause ) ? [] : eventDatas.data);
			setJoinedEvents(( joinedDatas.data.cause ) ? [] : joinedDatas.data);
			setLoading(false);
		} catch (e) {
			console.error(e);
			alert("Unable to process your registration.");
		}
	};

	const steps = [ 'Event Details', 'Personal Information', 'Payment Method', 'Confirmation' ];

	const getStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<Box>
						<Typography variant="h6" gutterBottom>
							{ selectedEvent?.title }
						</Typography>
						
						<Box sx={{ overflow: 'auto', maxHeight: '200px', mb: 2 }} >
							<Typography variant="body2" color="text.secondary" paragraph>
								{ selectedEvent?.description }
							</Typography>
						</Box>

						<Grid container spacing={2}>
							<Grid size={{ xs: 6 }}>
								<Typography variant="body2">
									<strong>Date:</strong> { new Date(selectedEvent?.date).toDateString() }
								</Typography>
							</Grid>
							<Grid size={{ xs: 6 }}>
								<Typography variant="body2">
									<strong>Time:</strong> { convertTo12Hour(selectedEvent?.time_start) } to { convertTo12Hour(selectedEvent?.time_end) }
								</Typography>
							</Grid>
							<Grid size={{ xs: 6 }}>
								<Typography variant="body2">
									<strong>Location:</strong> { selectedEvent?.location }
								</Typography>
							</Grid>
							<Grid size={{ xs: 6 }}>
								<Typography variant="body2">
									<strong>Fee:</strong> ₱{ selectedEvent?.fee }
								</Typography>
							</Grid>
						</Grid>
					</Box>
				);
			case 1: // register
				return (
					<Box>
						<Grid container sx={{ mt: 1 }} spacing={ 2 } >
							<Grid size={{ xs: 12, sm: 5 }} >
								<TextField
									fullWidth
									label="Last Name"
									sx={{ mb: 2 }}
									required
									value={ personalData.lastName }
									onChange={
										(e) => setPersonalData(prev => ({
											...prev,
											lastName: e.target.value
										}))
									}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 5 }} >
								<TextField
									fullWidth
									label="First Name"
									sx={{ mb: 2 }}
									required
									value={ personalData.firstName }
									onChange={
										(e) => setPersonalData(prev => ({
											...prev,
											firstName: e.target.value
										}))
									}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 2 }} >
								<Tooltip title='Your name extension like "Jr."' >
									<TextField
										fullWidth
										label="Ext."
										sx={{ mb: 2 }}
										value={ personalData.suffix }
										onChange={
											(e) => setPersonalData(prev => ({
												...prev,
												suffix: e.target.value
											}))
										}
									/>
								</Tooltip>
							</Grid>
						</Grid>
						<Grid container >
							<Grid size={{ xs: 12 }} >
								<TextField
									fullWidth
									label="Student ID"
									sx={{ mb: 2 }}
									required
									value={ personalData.studentId }
									onChange={
										(e) => setPersonalData(prev => ({
											...prev,
											studentId: e.target.value
										}))
									}
								/>
							</Grid>
							<Grid size={{ xs: 12 }} >
								<TextField
									fullWidth
									label="Email"
									sx={{ mb: 2 }}
									required
									value={ personalData.email }
									onChange={
										(e) => setPersonalData(prev => ({
											...prev,
											email: e.target.value
										}))
									}
								/>
							</Grid>
							<Grid size={{ xs: 12 }} sx={{ mb: 2 }} >
								<FormControl fullWidth required >
									<InputLabel>Department</InputLabel>
									<Select
										value={ personalData.department }
										label="Department"
										onChange={
											(e) => setPersonalData(prev => ({
												...prev,
												department: e.target.value
											}))
										}
									>
										<MenuItem value="cea">CEA</MenuItem>
										<MenuItem value="cstc">CSTC</MenuItem>
										<MenuItem value="cot">COT</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid size={{ xs: 12 }} sx={{ mb: 2 }} >
								<FormControl fullWidth required >
									<InputLabel>Year</InputLabel>
									<Select
										value={ personalData.year }
										label="Year"
										onChange={
											(e) => setPersonalData(prev => ({
												...prev,
												year: e.target.value
											}))
										}
									>
										<MenuItem value="1st">1st Year</MenuItem>
										<MenuItem value="2nd">2nd Year</MenuItem>
										<MenuItem value="3rd">3rd Year</MenuItem>
										<MenuItem value="4th">4th Year</MenuItem>
										<MenuItem value="5th">5th Year</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid size={{ xs: 12 }} >
								<FormControl fullWidth required >
									<InputLabel>Course</InputLabel>
									<Select
										value={ personalData.course }
										label="Course"
										onChange={
											(e) => setPersonalData(prev => ({
												...prev,
												course: e.target.value
											}))
										}
									>
										{/*<MenuItem value="cpe">CPE</MenuItem>
										<MenuItem value="ee">EE</MenuItem>
										<MenuItem value="ece">ECE</MenuItem>
										<MenuItem value="ce">CE</MenuItem>
										<MenuItem value="arc">Architecture</MenuItem>*/}
										{ courses.map(course => <MenuItem key={course} value={course} >{ course }</MenuItem>) }
									</Select>
								</FormControl>
							</Grid>
							<Grid size={{ xs: 12 }} >
								<Alert fullWidth severity="info" sx={{ mt: 2 }} >
									By providing your personal information, you consent to its collection, use, and disclosure for the purpose of event registration, communication, and event management. <br />
									Your data will be handled in accordance with applicable privacy laws and will not be shared with third parties except as necessary for event operations. <br />
									You are not required to provide more information than is reasonably needed to register for and participate in the event.
								</Alert>
							</Grid>
						</Grid>
					</Box>
				);
			case 2: // payment
				return (
					<Box>
						<Typography gutterBottom sx={{ mb: 2 }}>Select the method of payment</Typography>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Payment Method</InputLabel>
							<Select
								value={ selectedEvent?.payment_type }
								label="Payment Method"
								disabled
							>
								{ ( selectedEvent?.payment_type === "gcash_qr" ) && <MenuItem value="gcash_qr">GCash</MenuItem> }
								{ ( selectedEvent?.payment_type === "gcash_nm" ) && <MenuItem value="gcash_nm">GCash</MenuItem> }
								{ ( selectedEvent?.payment_type === "free" ) && <MenuItem value="free">Free</MenuItem> }
								{ ( selectedEvent?.payment_type === "on-site" ) && <MenuItem value="on-site">On site payment</MenuItem> }
							</Select>
						</FormControl>

						<Typography sx={{ mb: 2 }} >
							{ ( selectedEvent?.payment_type === "gcash_nm" ) && "Send your payment using the information below." }
							{ ( selectedEvent?.payment_type === "gcash_qr" ) && "Scan the QR below to complete the payment." }
							{ ( selectedEvent?.payment_type === "free" ) && "This event has not issued a payment." }
							{ ( selectedEvent?.payment_type === "on-site" ) && "This event must be paid face-to-face." }
						</Typography>
						
						{
							( selectedEvent?.payment_type.includes("gcash") ) && (
								<>
									<Grid container spacing={ 2 } >
										{
											( selectedEvent?.payment_type.includes("nm") ) && (
												<>
													<Grid size={{ xs: 12, sm: 6 }} >
														<TextField
															fullWidth
															label="GCash Number"
															value={ selectedEvent?.payment_props.number }
															sx={{ mb: 2 }}
															inputProps={{ readOnly: true }}
														/>
													</Grid>
													<Grid size={{ xs: 12, sm: 6 }} >
														<TextField
															fullWidth
															label="Account Name"
															value={ selectedEvent?.payment_props.name }
															sx={{ mb: 2 }}
															inputProps={{ readOnly: true }}
														/>
													</Grid>
												</>
											)
										}
										{
											( selectedEvent?.payment_type.includes("qr") && selectedEvent?.payment_img ) && (
												<>
													<Grid size={{ xs: 12, sm: 6 }} >
														<img
															src={ selectedEvent?.payment_img }
															alt="GCash QR Code"
															style={{ width: '300px' }}
														/>
													</Grid>
												</>
											)
										}
									</Grid>

									<Typography gutterBottom>Upload your receipt here.</Typography>
									
									<TextField
										fullWidth
										type="file"
										inputProps={{ accept: 'image/*' }}
										onChange={ (e) => setTransactionData(prev => ({ ...prev, receipt: e.target.files[0] })) }
									/>
								</>
							)
						}
						
						{
							selectedEvent?.payment_type === 'on-site' && (
								<Alert severity="info" sx={{ mt: 2 }}>On site payment. Proceed to the event location for further transaction.</Alert>
							)
						}

						{
							selectedEvent?.payment_type === 'free' && (
								<Alert severity="info" sx={{ mt: 2 }}>No payment needed for this event you may proceed.</Alert>
							)
						}
						
					</Box>
				);
			case 3:
				return (
					<Box>
						<Alert severity="info" sx={{ mb: 2 }}>
							Please review your registration details
						</Alert>
						<Grid container spacing={2}>
							<Grid size={{ xs: 6 }}>
								<Typography variant="body2">
									<strong>Event:</strong> { selectedEvent?.title }
								</Typography>
							</Grid>
							<Grid size={{ xs: 6 }}>
								<Typography variant="body2">
									<strong>Amount:</strong> ₱{ ( selectedEvent.payment_type === "free" ) ? 0 : selectedEvent?.fee }
								</Typography>
							</Grid>
							<Grid size={{ xs: 6 }}>
								<Typography variant="body2">
									<strong>Payment Method: </strong> 
									{ ( selectedEvent?.payment_type.includes("gcash") ) ? "GCash" : null }
									{ ( !selectedEvent?.payment_type.includes("gcash") ) ? selectedEvent?.payment_type.charAt(0).toUpperCase() + selectedEvent?.payment_type.slice(1) : null }
								</Typography>
							</Grid>
							{/*registrationData.paymentMethod === 'gcash' && (
								<>
									<Grid size={{ xs: 6 }}>
										<Typography variant="body2">
											<strong>GCash No:</strong> {registrationData.gcashNumber}
										</Typography>
									</Grid>
									<Grid size={{ xs: 6 }}>
										<Typography variant="body2">
											<strong>Account Name:</strong> {registrationData.gcashName}
										</Typography>
									</Grid>
								</>
							)*/}
						</Grid>
					</Box>
				);
			default:
				return 'Unknown step';
		}
	};

	return (
		<Box>
			{/*<Typography variant="h5" gutterBottom>
				Events
			</Typography>*/}

			<Paper sx={{ p: 2, mb: 3 }}>
				<Grid container spacing={2} alignItems="center">
					<Grid size={{ xs: 12, md: 6 }}>
						<TextField
							fullWidth
							label="Search events"
							value={ searchTerm }
							onChange={(e) => setSearchTerm(e.target.value)}
							variant="outlined"
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<FormControl fullWidth>
							<InputLabel>Filter by Category</InputLabel>
							<Select
								value={ filterType }
								label="Filter by Category"
								onChange={(e) => setFilterType(e.target.value)}
							>
								<MenuItem value="all">All Categories</MenuItem>
								<MenuItem value="academic">Academic</MenuItem>
								<MenuItem value="workshop">Workshop</MenuItem>
								<MenuItem value="community">Community</MenuItem>
								<MenuItem value="sports">Sports</MenuItem>
								<MenuItem value="cultural">Cultural</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>
			</Paper>
			
			<Grid container spacing={3} sx={{ mb: { xs: 2 } }}>
				{
					filteredEvents.map((event) => (
						<Grid 
							size={{ xs: 12, md: 6 }} 
							key={ event?.id }
						>
							<Card sx={{ height: '100%' }}>
								<CardContent>
									<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
										<Typography variant="h6" component="div">
											{event?.title}
										</Typography>
										<Chip
											label={event?.category}
											color="primary"
											size="small"
										/>
									</Box>
									
									<Typography variant="body2" color="text.secondary" paragraph>
										{ event?.description.slice(0, 50) + "..." }
									</Typography>
									
									<Grid container spacing={1}>
										<Grid size={{ xs: 6 }}>
											<Typography variant="caption" display="block">
												<strong>Date:</strong> { new Date(event?.date).toDateString() }
											</Typography>
										</Grid>
										<Grid size={{ xs: 6 }}>
											<Typography variant="caption" display="block">
												<strong>Time:</strong> { convertTo12Hour(event?.time_start) } to { convertTo12Hour(event?.time_end) }
											</Typography>
										</Grid>
										<Grid size={{ xs: 6 }}>
											<Typography variant="caption" display="block">
												<strong>Location:</strong> { event?.location }
											</Typography>
										</Grid>
										<Grid size={{ xs: 6 }}>
											<Typography variant="caption" display="block">
												<strong>Fee:</strong> ₱{ ( event.payment_type === "free" ) ? 0 : event?.fee }
											</Typography>
										</Grid>
										{/*<Grid size={{ xs: 6 }}>
											<Typography variant="caption" display="block">
												<strong>Participants:</strong> { ( event?.joined ) && JSON.parse(event?.joined).length || 0 } / { event?.max_people }
											</Typography>
										</Grid>*/}
										<Grid size={{ xs: 6 }}>
											<Typography variant="caption" display="block">
												<strong>Posted on:</strong> { new Date(event?.created_at).toDateString() }
											</Typography>
										</Grid>
										<Grid size={{ xs: 6 }}>
											<Typography variant="caption" display="block">
												<strong>Posted by:</strong> <Link href="#" >{ event.owner }</Link>
											</Typography>
										</Grid>
									</Grid>
								</CardContent>
								<CardActions sx={{ p: 2 }}>
									<Button
										size="small"
										variant="contained"
										onClick={ () => handleRegisterClick(event) }
										disabled={ parseInt(event?.joined) >= parseInt(event?.max_people) || event.is_active === "false" || joinedEvents.filter(e => parseInt(event.id) === parseInt(e.event_id)).length > 0 }
									>
										{
											( parseInt(event?.joined) >= parseInt(event?.max_people) ) ? 'Full' 
											: ( event.is_active === "false" ) ? 'Closed' 
											: ( joinedEvents.filter(e => parseInt(event.id) === parseInt(e.event_id)).length > 0 ) ? "Registered" : "Register"
										}
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))
				}
			</Grid>

			{ ( loading ) && <Box fullWidth align="center" ><CircularProgress /></Box> }

			{
				( filteredEvents.length === 0 && !loading ) && (
					<Typography color="text.secondary" align="center">No events was posted.</Typography>
				)
			}
			
			<Dialog
				open={ openDialog }
				onClose={ handleClose }
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Register for Event</DialogTitle>
				<DialogContent>
					<Stepper activeStep={ activeStep } sx={{ mb: 3, overflow: 'auto' }}>
						{
							steps.map((label) => (
								<Step key={ label }>
									<StepLabel>{ label }</StepLabel>
								</Step>
							))
						}
					</Stepper>
					{ getStepContent(activeStep) }
				</DialogContent>
				<DialogActions>
					<Button onClick={ handleBack } disabled={ activeStep === 0 } >Back</Button>
					<Button
						onClick={ activeStep === steps.length - 1 ? handleSubmitRegistration : handleNext }
						variant="contained"
						disabled={
							( 
								( activeStep === 1 && ( !personalData.lastName || !personalData.firstName ||
								!personalData.studentId || !personalData.email || !personalData.department || 
								!personalData.year || !personalData.course ) ) || loadingSubmition ||
								( activeStep === 2 && !transactionData.receipt && ( selectedEvent.payment_type.includes("gcash") ) )
							) ? true : false
						}
						loading={ loadingSubmition }
						loadingPosition="start"
					>
						{ activeStep === steps.length - 1 ? 'Submit' : 'Next' }
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default EventRegistration;
