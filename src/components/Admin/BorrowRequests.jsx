import React, { useState, useEffect } from 'react';
import {
	Paper,
	Typography,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Box,
	Chip,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Alert,
	Tab,
	Tabs,
	Card,
	CardContent,
	CircularProgress
} from '@mui/material';
import {
	Search as SearchIcon,
	FilterList as FilterIcon,
	Check as CheckIcon,
	Close as CloseIcon,
	Visibility as ViewIcon,
	Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { fetchAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BorrowRequests = () => 
{
	const { user } = useAuth();

	const [requests, setRequests] = useState([]);
	const [filteredRequests, setFilteredRequests] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [tabValue, setTabValue] = useState(0);
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [actionType, setActionType] = useState('');
	const [actionNotes, setActionNotes] = useState('');
	const [loading, setLoading] = useState(false);
	const [loadingAction, setLoadingAction] = useState(false);
	const [loadingReturned, setLoadingReturned] = useState(false);

	useEffect(() => {
		async function fetchDatas() {
			try {
				setLoading(true);
				const requestDatas = await fetchAPI("/item/request/get/all", "GET");
				setRequests(( requestDatas.data.cause ) ? [] : requestDatas.data);
				setFilteredRequests(( requestDatas.data.cause ) ? [] : requestDatas.data);
				setLoading(false);
			} catch (e) {
				console.error(e);
			}
		}
		fetchDatas();
	}, []);

	useEffect(() => {
		let filtered = requests;
		if (searchTerm) {
			filtered = filtered.filter(request =>
				request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				request.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				request.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
				request.course.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
		if (filterStatus !== 'all') filtered = filtered.filter(request => request.is_approved === filterStatus);
		// Filter by tab
		if (tabValue === 1) { // Pending
			filtered = filtered.filter(request => request.is_approved === 'neutral');
		} else if (tabValue === 2) { // Approved
			filtered = filtered.filter(request => request.is_approved === 'true');
		} else if (tabValue === 3) { // Rejected
			filtered = filtered.filter(request => request.is_approved === 'false');
		}
		setFilteredRequests(filtered);
	}, [searchTerm, filterStatus, tabValue, requests]);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleViewDetails = (request) => {
		setSelectedRequest(request);
		setActionType('view');
		setOpenDialog(true);
	};

	const handleActionClick = (request, action) => {
		setSelectedRequest(request);
		setActionType(action);
		setActionNotes('');
		setOpenDialog(true);
	};

	const handleMarkReturned = async (request) => {
		try {
			setLoadingReturned(true);
			await fetchAPI(`/item/request/edit/${ request.id }`, "PUT", { isReturned: "true" });
			const requestDatas = await fetchAPI("/item/request/get/all", "GET");
			setRequests(( requestDatas.data.cause ) ? [] : requestDatas.data);
			setFilteredRequests(( requestDatas.data.cause ) ? [] : requestDatas.data);
			setLoadingReturned(false);
		} catch (e) {
			console.error(e);
		}
	};

	const handleConfirmAction = async () => {
		try {
			setLoadingAction(true);
			if ( actionType === 'approve' ) {
				await fetchAPI(`/item/request/edit/${ selectedRequest.id }`, "PUT", { isApproved: "true" });
			} else if ( actionType === 'reject' ) {
				await fetchAPI(`/item/request/edit/${ selectedRequest.id }`, "PUT", {
					isApproved: "false",
					rejectionNote: actionNotes
				});
			}
			setLoadingAction(false);
			setOpenDialog(false);
			setLoading(true);
			const requestDatas = await fetchAPI("/item/request/get/all", "GET");
			setRequests(( requestDatas.data.cause ) ? [] : requestDatas.data);
			setFilteredRequests(( requestDatas.data.cause ) ? [] : requestDatas.data);
			setLoading(false);
		} catch (e) {
			console.error(e);
		}
	};

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case 'true':
				return 'success';
			case 'false':
				return 'error';
			case 'neutral':
				return 'warning';
			default:
				return 'default';
		}
	};

	const getReturnStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case 'true':
				return 'success';
			case 'false':
				return 'warning';
			// case 'overdue':
			// 	return 'error';
			default:
				return 'default';
		}
	};

	const calculateStats = () => {
		const total = requests.length;
		const pending = requests.filter(r => r.is_approved === 'neutral').length;
		const approved = requests.filter(r => r.is_approved === 'true').length;
		const rejected = requests.filter(r => r.is_approved === 'false').length;
		const returned = requests.filter(r => r.is_returned === 'true').length;
		
		return { total, pending, approved, rejected, returned };
	};

	const stats = calculateStats();

	return (
		<Box>
			<Typography variant="h5" gutterBottom>
				Borrow Requests Management
			</Typography>
			
			{/* Stats Cards */}
			<Grid container spacing={2} sx={{ mb: 3 }}>
				<Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
					<Card>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography variant="h6" color="primary">{ stats.total }</Typography>
							<Typography variant="body2" color="text.secondary">Total Requests</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
					<Card>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography variant="h6" color="warning.main">{ stats.pending }</Typography>
							<Typography variant="body2" color="text.secondary">Pending</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
					<Card>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography variant="h6" color="success.main">{stats.approved}</Typography>
							<Typography variant="body2" color="text.secondary">Approved</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
					<Card>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography variant="h6" color="error.main">{stats.rejected}</Typography>
							<Typography variant="body2" color="text.secondary">Rejected</Typography>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
					<Card>
						<CardContent sx={{ textAlign: 'center' }}>
							<Typography variant="h6" color="info.main">{stats.returned}</Typography>
							<Typography variant="body2" color="text.secondary">Returned</Typography>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			
			{/* Filters and Tabs */}
			<Paper sx={{ p: 2, mb: 3 }}>
				<Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
					<Grid size={{ xs: 12, md: 6 }}>
						<TextField
							fullWidth
							label="Search requests"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							InputProps={{
								startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
							}}
						/>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<FormControl fullWidth>
							<InputLabel>Filter by Status</InputLabel>
							<Select
								value={filterStatus}
								label="Filter by Status"
								onChange={(e) => setFilterStatus(e.target.value)}
							>
								<MenuItem value="all">All Status</MenuItem>
								<MenuItem value="neutral">Pending</MenuItem>
								<MenuItem value="true">Approved</MenuItem>
								<MenuItem value="false">Rejected</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>
				
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={tabValue} onChange={handleTabChange}>
						<Tab label="All Requests" />
						<Tab label="Pending" />
						<Tab label="Approved" />
						<Tab label="Rejected" />
					</Tabs>
				</Box>
			</Paper>
			
			{/* Requests Table */}
			<Paper sx={{ p: 3 }}>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }} >Student</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} >Item</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} >Purpose</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} >Borrow Dates</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} >Status</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} >Return Status</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} >Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								filteredRequests?.map((request) => (
									<TableRow key={ request.id } hover >
										<TableCell>
											<Typography variant="subtitle2">
												{ request.name }
											</Typography>
											<Typography variant="caption" display="block" color="text.secondary">
												{ request.student_id }
											</Typography>
											<Typography variant="caption" display="block" color="text.secondary">
												{ request.course }
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="subtitle2">
												{ request.item }
											</Typography>
											<Typography variant="caption" display="block" color="text.secondary">
												{ request.category } • Qty: { request.quantity }
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="body2">
												{ request.purpose.substring(0, 50) }...
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="body2">
												{ new Date(request.borrow_date_start).toDateString() } to { new Date(request.borrow_date_end).toDateString() }
											</Typography>
											<Typography variant="caption" display="block" color="text.secondary">
												Requested: { new Date(request.created_at).toDateString() }
											</Typography>
										</TableCell>
										<TableCell>
											<Chip
												label={ ( request.is_approved === "neutral" ) ? "Pending" : ( request.is_approved === "true" ) ? "Approved" : "Rejected" }
												color={ getStatusColor(request.is_approved) }
												size="small"
											/>
											{/*
												request.approvedBy && (
													<Typography variant="caption" display="block" color="text.secondary">
														By: {request.approvedBy}
													</Typography>
												)
											*/}
										</TableCell>
										<TableCell>
											{
												( request.is_approved !== "false" ) && (
													<Chip
														label={ ( request.is_returned === "true" ) ? "Returned" : "Not Returned" }
														color={ getReturnStatusColor(request.is_returned) }
														size="small"
													/>
												)
											}
											{/*
												request.returnDate && (
													<Typography variant="caption" display="block" color="text.secondary">
														Date: { request.returnDate }
													</Typography>
												)
											*/}
										</TableCell>
										<TableCell>
											<Box sx={{ display: 'flex', gap: 1 }}>
												<IconButton
													size="small"
													color="info"
													onClick={() => handleViewDetails(request)}
													title="View Details"
												>
													<ViewIcon />
												</IconButton>
												
												{
													request.is_approved === 'neutral' && (
														<>
															<IconButton
																size="small"
																color="success"
																onClick={() => handleActionClick(request, 'approve')}
																title="Approve Request"
															>
																<CheckIcon />
															</IconButton>
															<IconButton
																size="small"
																color="error"
																onClick={() => handleActionClick(request, 'reject')}
																title="Reject Request"
															>
																<CloseIcon />
															</IconButton>
														</>
													)
												}
												
												{
													request.is_approved === 'true' && request.is_returned === 'false' && (
														<Button
															size="small"
															variant="outlined"
															color="primary"
															onClick={() => handleMarkReturned(request)}
															disabled={ loadingReturned }
															loading={ loadingReturned }
															loadingPosition="start"
														>
															Mark Returned
														</Button>
													)
												}
											</Box>
										</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</TableContainer>
				{ ( loading ) && <Box fullWidth align="center" sx={{ mt: 2 }} ><CircularProgress /></Box> }
				{ ( !loading && requests.length === 0 ) && <Typography sx={{ mt: 2 }} align="center" >No list of requests</Typography> }
			</Paper>
			
			{/* Action Dialog */}
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					{actionType === 'view' ? 'Request Details' : 
					 actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
				</DialogTitle>
				<DialogContent>
					{
						selectedRequest && (
							<Box sx={{ pt: 2 }}>
								{
									actionType !== 'view' && (
										<Alert severity={actionType === 'approve' ? 'info' : 'warning'} sx={{ mb: 2 }}>
											{actionType === 'approve' 
												? 'Are you sure you want to approve this borrow request?'
												: 'Are you sure you want to reject this borrow request?'}
										</Alert>
									)
								}
								
								<Grid container spacing={2}>
									{/* Student Information */}
									<Grid size={{ xs: 12 }}>
										<Typography variant="subtitle1" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>
											Student Information
										</Typography>
									</Grid>
									<Grid size={{ xs: 12 }}>
										<Typography variant="body2">
											<strong>Name:</strong> {selectedRequest.name}
										</Typography>
									</Grid>
									<Grid size={{ xs: 12 }}>
										<Typography variant="body2">
											<strong>Student ID:</strong> {selectedRequest.student_id}
										</Typography>
									</Grid>
									<Grid size={{ xs: 12 }}>
										<Typography variant="body2">
											<strong>Course:</strong> {selectedRequest.course}
										</Typography>
									</Grid>
									{/*<Grid size={{ xs: 12 }}>
										<Typography variant="body2">
											<strong>Email:</strong> {selectedRequest.email}
										</Typography>
									</Grid>*/}
									
									{/* Item Information */}
									<Grid size={{ xs: 12 }}>
										<Typography variant="subtitle1" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mt: 2 }}>
											Item Information
										</Typography>
									</Grid>
									<Grid size={{ xs: 12, sm: 6 }}>
										<Typography variant="body2">
											<strong>Item:</strong> {selectedRequest.item}
										</Typography>
									</Grid>
									<Grid size={{ xs: 12, sm: 6 }}>
										<Typography variant="body2">
											<strong>Category:</strong> {selectedRequest.category}
										</Typography>
									</Grid>
									<Grid size={{ xs: 12, sm: 6 }}>
										<Typography variant="body2">
											<strong>Quantity:</strong> {selectedRequest.quantity}
										</Typography>
									</Grid>
									
									{/* Request Details */}
									<Grid size={{ xs: 12 }}>
										<Typography variant="subtitle1" gutterBottom sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mt: 2 }}>
											Request Details
										</Typography>
									</Grid>
									<Grid size={{ xs: 12 }}>
										<Typography variant="body2">
											<strong>Purpose:</strong> {selectedRequest.purpose}
										</Typography>
									</Grid>
									<Grid size={{ xs: 12 }}>
										<Typography variant="body2">
											<strong>Borrow Date:</strong> { new Date(selectedRequest.borrow_date_start).toDateString() }
										</Typography>
									</Grid>
									<Grid size={{ xs: 12 }}>
										<Typography variant="body2">
											<strong>Return Date:</strong> { new Date(selectedRequest.borrow_date_end).toDateString() }
										</Typography>
									</Grid>
									<Grid size={{ xs: 12 }}>
										<Typography variant="body2">
											<strong>Request Date:</strong> { new Date(selectedRequest.created_at).toDateString() }
										</Typography>
									</Grid>
									<Grid size={{ xs: 12 }}>
										<Typography variant="body2">
											<strong>Current Status:</strong> 
											<Chip
												label={ ( selectedRequest.is_approved === "neutral" ) ? "Pending" : ( selectedRequest.is_approved === "true" ) ? "Approved" : "Rejected" }
												color={ getStatusColor(selectedRequest.is_approved) }
												size="small"
												sx={{ ml: 1 }}
											/>
										</Typography>
									</Grid>

									{
										( actionType === "reject" ) && (
											<Grid size={{ xs: 12 }}>
												<TextField
													fullWidth
													label="Additional Notes"
													value={ actionNotes }
													onChange={ (e) => setActionNotes(e.target.value) }
													multiline
													rows={ 3 }
													placeholder="Add any notes or instructions for the student..."
													sx={{ mt: 2 }}
												/>
											</Grid>
										)
									}
									
									{/*
										selectedRequest.notes && (
											<Grid size={{ xs: 12 }}>
												<Typography variant="body2">
													<strong>Notes:</strong> {selectedRequest.notes}
												</Typography>
											</Grid>
										)
									*/}
									
									{/* Action Notes for Approve/Reject */}
									{/*
										(actionType === 'approve' || actionType === 'reject') && (
											<Grid size={{ xs: 12 }}>
												<TextField
													fullWidth
													label="Additional Notes (Optional)"
													value={actionNotes}
													onChange={(e) => setActionNotes(e.target.value)}
													multiline
													rows={3}
													placeholder="Add any notes or instructions for the student..."
													sx={{ mt: 2 }}
												/>
											</Grid>
										)
									*/}
								</Grid>
							</Box>
						)
					}
				</DialogContent>
				<DialogActions>
					<Button onClick={ () => setOpenDialog(false) }>
						{ actionType === 'view' ? 'Close' : 'Cancel' }
					</Button>
					{
						(actionType === 'approve' || actionType === 'reject') && (
							<Button
								onClick={ handleConfirmAction }
								variant="contained"
								color={ actionType === 'approve' ? 'success' : 'error' }
								disabled={ actionType === "reject" && actionNotes === "" || loadingAction }
								loading={ loadingAction }
								loadingPosition="start"
							>
								{ actionType === 'approve' ? 'Approve Request' : 'Reject Request' }
							</Button>
						)
					}
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default BorrowRequests;
