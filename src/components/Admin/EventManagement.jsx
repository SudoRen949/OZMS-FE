// src/components/Admin/EventManagement.jsx
import React, { useState, useEffect } from 'react';
import {
	Paper,
	Typography,
	Grid,
	Card,
	CardContent,
	Button,
	Box,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
	IconButton,
	Switch,
	FormControlLabel,
	CircularProgress,
	useTheme,
	useMediaQuery,
} from '@mui/material';
import {
	Add as AddIcon, 
	Edit as EditIcon, 
	Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { fetchAPI, API_BASE_URL } from '../../services/api';
import { convertTo12Hour } from '../../services/helpers';

const EventManagement = () => 
{
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const { user } = useAuth();
	
	const eventFormFormat = {
		title: '', 
		description: '',
		date: '', 
		timeStart: '',
		timeEnd: '', 
		location: '',
		category: 'Academic',
		fee: 0,
		maxPeople: 0,
		isActive: 'true',
		paymentType: '', 
		paymentImage: null,
		paymentProps: {
			name: '',
			number: ''
		}
	}

	const [events, setEvents] = useState([]);
	const [currentEvent, setCurrentEvent] = useState(null);

	const [isEditMode, setIsEditMode] = useState(false);
	
	const [loadingEvents, setLoadingEvents] = useState(false);
	const [loadingParticipants, setLoadingParticipants] = useState(true);
	
	const [eventForm, setEventForm] = useState(eventFormFormat);
	const [participants, setParticipants] = useState(null);

	const [openEventDialog, setOpenEventDialog] = useState(false);
	const [openParticipantDialog, setOpenParticipantDialog] = useState(false);

	const [loading, setLoading] = useState(false);

	// const [tempQR, setTempQR] = useState(null);

	useEffect(() => {
		async function loadEvents() {
			try {
				setLoadingEvents(true);
				const response = await fetchAPI(`/event/get/own/${ user.token }`, "GET");
				setEvents(( response.data.cause ) ? [] : response.data);
				setLoadingEvents(false);
			} catch (e) {
				console.error(e);
				alert("An error occured while loading event datas.");
			}
		}
		loadEvents();
	}, []);

	const handleOpenCreate = () => {
		setIsEditMode(false);
		setEventForm(eventFormFormat);
		setOpenEventDialog(true);
	};

	const handleOpenEdit = (event) => {
		setIsEditMode(true);
		setCurrentEvent(event);
		setEventForm({
			title: event.title, 
			description: event.description,
			date: event.date, 
			timeStart: event.time_start,
			timeEnd: event.time_end, 
			location: event.location,
			category: event.category, 
			fee: event.fee,
			maxPeople: event.max_people, 
			isActive: event.is_active,
			paymentType: event.payment_type, 
			paymentImage: event.payment_img,
			paymentProps: JSON.parse(event.payment_props) || null
		});
		setOpenEventDialog(true);
	};

	const handleDelete = async (id) => {
		if ( window.confirm('Are you sure you want to delete this event?') ) {
			try {
				await fetchAPI(`/event/delete/${ id }`, "DELETE");
				await fetchAPI(`/registration/delete/${ id }`, "DELETE");
				await fetchAPI(`/transaction/delete/${ id }`, "DELETE");
				setEvents(events.filter(event => event.id !== id));
			} catch (e) {
				console.error(e);
				alert("Unable to delete event");
			}
		}
	};

	const handleSubmit = async () => {
		try {
			setLoading(true);
			if (!isEditMode) {
				const formData = new FormData();
				formData.append('token', user.token);
				formData.append('owner', ` ${ user.first_name } ${ user.last_name } ${ user.suffix || '' } `);
				formData.append('title', eventForm.title);
				formData.append('description', eventForm.description);
				formData.append('date', eventForm.date);
				formData.append('timeStart', eventForm.timeStart);
				formData.append('timeEnd', eventForm.timeEnd);
				formData.append('location', eventForm.location);
				formData.append('category', eventForm.category);
				formData.append('fee', eventForm.fee);
				formData.append('maxPeople', eventForm.maxPeople);
				formData.append('isActive', eventForm.isActive);
				formData.append("paymentImage", eventForm.paymentImage);
				formData.append('paymentType', eventForm.paymentType);
				formData.append('paymentProps', JSON.stringify(eventForm.paymentProps));
				await fetch(`${ API_BASE_URL }/event/post`, { method: "POST", body: formData });
			} else if (isEditMode) {
				const datas = {
					token: user.token,
					owner: ` ${ user.first_name } ${ user.last_name } ${ user.suffix || '' } `,
					title: eventForm.title,
					description: eventForm.description,
					date: eventForm.date,
					timeStart: eventForm.timeStart,
					timeEnd: eventForm.timeEnd,
					location: eventForm.location,
					category: eventForm.category,
					fee: eventForm.fee,
					maxPeople: eventForm.maxPeople,
					isActive: eventForm.isActive
				};
				await fetchAPI(`/event/edit/${ currentEvent.id }`, "PUT", datas);
			}
			setLoading(false);
			setOpenEventDialog(false);
			// reload all data
			setEvents([]);
			setLoadingEvents(true);
			const response = await fetchAPI(`/event/get/own/${ user.token }`, "GET");
			const datas = await response?.data;
			if (datas && response?.response.ok) setEvents(datas);
			setLoadingEvents(false);
		} catch (e) {
			console.error(e);
			alert("Unable to post your event information, an error occured.\nPlease try again.");
		}
	};

	const handleToggleActive = async (e,id) => {
		try {
			setEvents(events.map(event =>
				event.id === id ? {
					...event,
					is_active: String(e.target.checked),
					status: ( e.target.checked ) ? "active" : "inactive"
				} : event
			));
			await fetchAPI(`/event/edit/${ id }`, "PUT", { isActive: String(e.target.checked) });
		} catch (e) {
			console.error(e);
		}
	};

	const handleOpenParticipantDialog = async (event) => {
		try {
			setLoadingParticipants(true);
			setCurrentEvent(event);
			setOpenParticipantDialog(true);
			const a = await fetchAPI(`/registration/get/admin/id/${ event.id }`, "GET");
			if (a.data.cause) setParticipants(null);
			else setParticipants(a.data);
			setLoadingParticipants(false);
		} catch (e) {
			console.log(e);
		}
	}

	const handleCloseParticipantDialog = () => {
		setCurrentEvent(null);
		setParticipants(null);
		setOpenParticipantDialog(false);
	}

	const handleCloseEventDialog = () => {
		// setTempQR(null);
		setOpenEventDialog(false);
	}

	const handleFormInput = (e) => {
		const { name, value } = e.target;
		setEventForm(prev => ({
			...prev,
			[name]: value
		}));
	}

	return (
		<Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
				<Typography variant="h5">
					Event Management
				</Typography>
				<Button
					variant="contained"
					startIcon={ (isMobile) ? null : <AddIcon /> }
					onClick={ handleOpenCreate }
				>
					{ (isMobile) ? <AddIcon /> : "Create Event" }
				</Button>
			</Box>
			
			<Grid container spacing={3}>
				<Grid size={{ xs: 12 }}>
					<Paper sx={{ p: 3 }}>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: 'bold' }} >Event Title</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Date & Time</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Location</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Category</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Fee</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Participants</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Status</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Actions</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										events.map((event) => (
											<TableRow key={ event.id }>
												<TableCell>
													<Typography variant="subtitle2">
														{ event.title }
													</Typography>
													<Typography variant="caption" color="text.secondary">
														{ event.description.substring(0, 50) }...
													</Typography>
												</TableCell>
												<TableCell>
													{ event.date }<br />
													<Typography variant="caption">
														{ convertTo12Hour(event.time_start) } to { convertTo12Hour(event.time_end) }
													</Typography>
												</TableCell>
												<TableCell>{ event.location }</TableCell>
												<TableCell>
													<Chip label={ event.category } size="small" />
												</TableCell>
												<TableCell>₱{ event.fee }</TableCell>
												<TableCell>
													{ event.joined } / { event.max_people }
													<Button
														sx={{ marginLeft: '5px' }}
														onClick={ () => handleOpenParticipantDialog(event) }
													>View</Button>
												</TableCell>
												<TableCell>
													<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
														<Chip
															label={ ( event.is_active === "true" ) ? 'Active' : 'Inactive' }
															color={ ( event.is_active === "true" ) ? 'success' : 'default' }
															size="small"
														/>
														<Switch
															size="small"
															checked={ event.is_active === "true" }
															onChange={ (e) => handleToggleActive(e,event.id) }
														/>
													</Box>
												</TableCell>
												<TableCell>
													<IconButton
														size="small"
														onClick={ () => handleOpenEdit(event) }
													>
														<EditIcon />
													</IconButton>
													<IconButton
														size="small"
														color="error"
														onClick={ () => handleDelete(event.id) }
													>
														<DeleteIcon />
													</IconButton>
												</TableCell>
											</TableRow>
										))
									}
								</TableBody>
							</Table>
						</TableContainer>

						{ ( loadingEvents ) && <Box fullWidth align="center" sx={{ mt: 2 }} ><CircularProgress /></Box> }

						{
							( events?.length === 0 && !loadingEvents ) && (
								<Typography 
									align="center" 
									color="text.secondary"
									sx={{ mt: 2 }}
								>You don't have any events posted yet</Typography>
							)
						}
					</Paper>
				</Grid>
			</Grid>
			
			<Dialog 
				open={ openEventDialog } 
				onClose={ handleCloseEventDialog } 
				maxWidth="md" 
				fullWidth
			>
				<DialogTitle>
					{ isEditMode ? 'Edit Event' : 'Create New Event' }
				</DialogTitle>
				<DialogContent>
					<Box sx={{ pt: 2 }}>
						<Grid container spacing={ 2 }>
							<Grid size={{ xs: 12 }}>
								<TextField
									fullWidth
									name="title"
									label="Event Title"
									value={ eventForm.title }
									onChange={ handleFormInput }
									required
								/>
							</Grid>
							
							<Grid size={{ xs: 12 }}>
								<TextField
									fullWidth
									name="description"
									label="Description"
									value={ eventForm.description }
									onChange={ handleFormInput }
									multiline
									rows={3}
									required
								/>
							</Grid>
							
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="Event Date"
									type="date"
									name="date"
									value={ eventForm.date }
									onChange={ handleFormInput }
									InputLabelProps={{ shrink: true }}
									required
								/>
							</Grid>
							
							<Grid container size={{ xs: 12, sm: 6 }}>
								<Grid size={{ xs: 12, sm: 6 }}>
									<TextField
										fullWidth
										label="Time Start"
										type="time"
										name="timeStart"
										value={ eventForm.timeStart }
										onChange={ handleFormInput }
										InputLabelProps={{ shrink: true }}
										required
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }}>
									<TextField
										fullWidth
										label="Time End"
										type="time"
										name="timeEnd"
										value={ eventForm.timeEnd }
										onChange={ handleFormInput }
										InputLabelProps={{ shrink: true }}
										required
									/>
								</Grid>
							</Grid>
							
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="Location"
									name="location"
									value={ eventForm.location }
									onChange={ handleFormInput }
									required
								/>
							</Grid>
							
							<Grid size={{ xs: 12, sm: 6 }}>
								<FormControl fullWidth>
									<InputLabel>Category</InputLabel>
									<Select
										name="category"
										value={ eventForm.category }
										label="Category"
										onChange={ handleFormInput }
									>
										<MenuItem value="Academic">Academic</MenuItem>
										<MenuItem value="Workshop">Workshop</MenuItem>
										<MenuItem value="Community">Community</MenuItem>
										<MenuItem value="Sports">Sports</MenuItem>
										<MenuItem value="Cultural">Cultural</MenuItem>
										<MenuItem value="Social">Social</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="Registration Fee"
									type="number"
									name="fee"
									value={ eventForm.fee }
									onChange={ handleFormInput }
									InputProps={{ startAdornment: '₱', inputProps: { min: 0 } }}
								/>
							</Grid>
							
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="Maximum Participants"
									type="number"
									name="maxPeople"
									value={ eventForm.maxPeople }
									InputProps={{ inputProps: { min: 0 } }}
									onChange={ handleFormInput }
								/>
							</Grid>
							
							<Grid size={{ xs: 12, sm: 6 }}>
								{/*<FormControlLabel
									control={
										<Switch
											checked={ eventForm.isActive }
											onChange={(e) => setEventForm({
												...eventForm,
												isActive: ( e.target.checked ) ? true : false
											})}
										/>
									}
									label="Active Event"
								/>*/}
								<FormControl fullWidth>
									<InputLabel>Event status</InputLabel>
									<Select
										name="isActive"
										value={ eventForm.isActive }
										label="Event status"
										onChange={ handleFormInput }
									>
										<MenuItem value="true">Active</MenuItem>
										<MenuItem value="false">Inactive</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							<Grid size={{ xs: 12, sm: 6 }}>
								<FormControl fullWidth>
									<InputLabel>Payment method</InputLabel>
									<Select
										name="paymentType"
										value={ eventForm.paymentType }
										label="Payment method"
										onChange={ handleFormInput }
										disabled={ ( isEditMode && eventForm.paymentType === "gcash_qr" ) }
									>
										<MenuItem value="gcash_qr">GCash (QR Code)</MenuItem>
										<MenuItem value="gcash_nm">GCash (Number)</MenuItem>
										<MenuItem value="free">Free</MenuItem>
										{/*<MenuItem value="on-site">On site</MenuItem>*/}
									</Select>
								</FormControl>
							</Grid>
						</Grid>

						{
							( ( eventForm.paymentType === "gcash_qr" || eventForm.paymentType === "gcash_nm" ) && !isEditMode ) && (
								<Typography sx={{ mt: 2 }} >Transaction information setup</Typography>
							)
						}

						{
							( ( eventForm.paymentType === "gcash_qr" || eventForm.paymentType === "gcash_nm" ) && isEditMode ) && (
								<>
									<Typography sx={{ mt: 2 }} >Uploaded QR Code</Typography>
									<img src={ eventForm.paymentImage } style={{ width: '500px' }} alt="uploaded qr" />
								</>
							)
						}

						<Grid container spacing={ 2 } sx={{ mt: 2 }} >
							{
								( eventForm.paymentType === "gcash_qr" && !isEditMode ) && (
									<>
										<Grid size={{ xs: 12 }}>
											<TextField
												fullWidth
												label="Upload GCash QR Code"
												type="file"
												InputProps={{ inputProps: { min: 0, accept: "image/*" } }}
												InputLabelProps={{ shrink: true }}
												onChange={ (e) => setEventForm(prev => ({
													...prev,
													paymentImage: e.target.files[0]
												}))}
												// helperText={ ( isEditMode ) ? "Upload new QR or leave empty to use old QR" : null }
											/>
										</Grid>
									</>
								)
							}
							{
								( eventForm.paymentType === "gcash_nm" ) && (
									<>
										<Grid size={{ xs: 12, sm: 6 }}>
											<TextField
												fullWidth
												label="Enter your GCash number"
												InputProps={{ inputProps: { min: 0, maxLength: 11 } }}
												value={ eventForm.paymentProps.number }
												onChange={(e) => setEventForm(prev => ({
													...prev,
													paymentProps: {
														...prev.paymentProps,
														number: e.target.value
													}
												}))}
											/>
										</Grid>
										<Grid size={{ xs: 12, sm: 6 }}>
											<TextField
												fullWidth
												label="Enter your GCash name"
												InputProps={{ inputProps: { min: 0, maxLength: 40 } }}
												value={ eventForm.paymentProps.name }
												onChange={(e) => setEventForm(prev => ({
													...prev,
													paymentProps: {
														...prev.paymentProps,
														name: e.target.value,
													}
												}))}
											/>
										</Grid>
									</>
								)
							}
						</Grid>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={ handleCloseEventDialog } >Cancel</Button>
					<Button
						onClick={ handleSubmit }
						variant="contained"
						disabled={
							!eventForm.title || !eventForm.description || !eventForm.date || !eventForm.location ||
							!eventForm.timeStart || !eventForm.timeEnd || loading ||
							( ( eventForm.paymentType !== "free" && eventForm.paymentType !== "on-site" ) && !eventForm.paymentImage && ( !eventForm.paymentProps.name || !eventForm.paymentProps.number ) )
						}
						loading={ loading }
						loadingPosition="start"
					>
						{ isEditMode ? 'Save changes' : 'Create Event' }
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={ openParticipantDialog }
				onClose={ handleCloseParticipantDialog }
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Participants of { currentEvent?.title }</DialogTitle>
				<DialogContent>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell sx={{ fontWeight: 'bold' }} >Student ID</TableCell>
									<TableCell sx={{ fontWeight: 'bold' }} >Name</TableCell>
									<TableCell sx={{ fontWeight: 'bold' }} >Year</TableCell>
									<TableCell sx={{ fontWeight: 'bold' }} >Course</TableCell>
									<TableCell sx={{ fontWeight: 'bold' }} >Date Joined</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									( participants?.length !== 0 ) && participants?.map(student => (
										<TableRow key={ participants.id } >
											<TableCell> { student.student_id } </TableCell>
											<TableCell> { student.fullname } </TableCell>
											<TableCell> { student.year } </TableCell>
											<TableCell> { student.course.toUpperCase() } </TableCell>
											<TableCell> { new Date(student.created_at).toDateString() } </TableCell>
										</TableRow>
									))
								}
							</TableBody>
						</Table>
					</TableContainer>
					{
						( !loadingParticipants && participants?.length === 0 ) && (
							<Typography fullWidth sx={{ mt: 2 }} align="center" >No student have joined yet</Typography>
						)
					}
					{
						( loadingParticipants ) && (
							<Box fullWidth align="center" sx={{ mt: 2 }} >
								<CircularProgress />
							</Box>
						)
					}
				</DialogContent>
				<DialogActions>
					<Button onClick={ handleCloseParticipantDialog } >Close</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default EventManagement;
