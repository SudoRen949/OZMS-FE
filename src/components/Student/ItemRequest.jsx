import React, { useState, useEffect } from 'react';
import {
	Paper,
	Typography,
	Grid,
	Card,
	CardContent,
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
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	CircularProgress
} from '@mui/material';
import {
	Add as AddIcon,
	Delete as DeleteIcon
} from '@mui/icons-material';
import { fetchAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ItemRequest = () => 
{
	const { user } = useAuth();

	const requestFormDatas = {
		quantity: 0,
		purpose: '',
		borrowDateStart: '',
		borrowDateEnd: ''
	}

	const [availableItems, setAvailableItems] = useState([]);
	const [myRequests, setMyRequests] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [requestForm, setRequestForm] = useState(requestFormDatas);
	const [selectedItem, setSelectedItem] = useState(null);
	const [loading, setLoading] = useState(false);
	const [viewNote, setViewNote] = useState(false);
	const [loadingSubmition, setLoadingSubmition] = useState(false);

	useEffect(() => {
		// Mock data
		// const mockItems = [
		//     { id: 1, name: 'Projector', category: 'Electronics', total: 10, available: 8, location: 'IT Room' },
		//     { id: 2, name: 'Sound System', category: 'Electronics', total: 5, available: 3, location: 'Audio Visual Room' },
		//     { id: 3, name: 'Chairs', category: 'Furniture', total: 200, available: 150, location: 'Storage Room' },
		//     { id: 4, name: 'Tables', category: 'Furniture', total: 50, available: 30, location: 'Storage Room' },
		//     { id: 5, name: 'Whiteboard', category: 'Supplies', total: 20, available: 6, location: 'Faculty Room' },
		//     { id: 6, name: 'Microphone Set', category: 'Electronics', total: 8, available: 6, location: 'Audio Visual Room' },
		// ];
		// const mockRequests = [
		//     { id: 1, name: 'Projector', quantity: 1, purpose: 'Class Presentation', 
		//       borrow_date_start: '2024-04-10', borrow_date_end: '2024-04-10', is_approved: 'true' },
		//     { id: 2, name: 'Chairs', quantity: 20, purpose: 'Meeting', 
		//       borrow_date_start: '2024-04-15', borrow_date_end: '2024-04-15', is_approved: 'neutral' },
		// ];
		// setMyRequests(mockRequests);
		async function fetchDatas() {
			try {
				setLoading(true);
				const itemDatas = await fetchAPI("/item/get/all/data", "GET");
				const requestsDatas = await fetchAPI(`/item/request/get/student/${ user.token }`, "GET");
				setAvailableItems(( itemDatas.data.cause ) ? [] : itemDatas.data);
				setMyRequests(( requestsDatas.data.cause ) ? [] : requestsDatas.data);
				setLoading(false);
			} catch (e) {
				console.error(e);
			}
		}
		fetchDatas();
	}, []);

	const handleRequestClick = (item) => {
		setSelectedItem(item);
		setRequestForm(requestFormDatas);
		setOpenDialog(true);
		setViewNote(false);
	};

	const handleSubmitRequest = async () => {
		try {
			setLoadingSubmition(true);
			const newRequestForm = {
				...requestForm,
				token: user.token,
				name: `${ user.first_name } ${ user.last_name } ${ user.suffix }`,
				studentId: user.student_id,
				course: user.course,
				item: selectedItem.name,
				itemId: selectedItem.id,
				category: selectedItem.category,
				targetToken: selectedItem.token
			}
			const newMaxAvailable = String( parseInt(selectedItem.max_available) - requestForm.quantity );
			await fetchAPI("/item/request/send", "POST", newRequestForm);
			await fetchAPI(`/item/edit/${ selectedItem.id }`, "PUT", { maxAvailable: newMaxAvailable });
			setLoadingSubmition(false);
			setOpenDialog(false);
			// refresh item datas
			setLoading(true);
			const itemDatas = await fetchAPI("/item/get/all/data", "GET");
			const requestsDatas = await fetchAPI(`/item/request/get/student/${ user.token }`, "GET");
			setAvailableItems(( itemDatas.data.cause ) ? [] : itemDatas.data);
			setMyRequests(( requestsDatas.data.cause ) ? [] : requestsDatas.data);
			setLoading(false);
			setTimeout(() => alert('Request submitted successfully!'), 200);
		} catch (e) {
			console.error(e);
		}
	};

	const handleDeleteRequest = async (item) => {
		if ( window.confirm("Do you want to delete item request?") ) {
			try {
				const newMaxAvailable = parseInt( availableItems.filter(e => parseInt(e.id) === parseInt(item.item_id))[0].max_available ) + parseInt(item.quantity);
				await fetchAPI(`/item/edit/${ item.item_id }`, "PUT", { maxAvailable: String( newMaxAvailable ) });
				await fetchAPI(`/item/request/delete/target/${ item.id }`, "DELETE");
				const itemDatas = await fetchAPI("/item/get/all/data", "GET");
				setAvailableItems(( itemDatas.data.cause ) ? [] : itemDatas.data);
				setMyRequests(myRequests.filter(request => request.id !== item.id));
			} catch (e) {
				console.error(e);
			}
		}
	};

	const handleViewNote = (request) => {
		setSelectedItem(request);
		setViewNote(true);
		setOpenDialog(true);
	}

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case 'true': return 'success';
			case 'false': return 'error';
			default: return 'warning';
		}
	};

	return (
		<Box>
			{/*<Typography variant="h5" gutterBottom>
				Borrow Item Requests
			</Typography>*/}
			
			<Grid container spacing={3} sx={{ mb: 2 }}>
				<Grid size={{ xs: 12 }}>
					<Paper sx={{ p: 3 }}>
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'left', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, mb: 3 }}>
							<Typography variant="h6">
								Available Items for Borrowing
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Note: Borrowing is free of charge
							</Typography>
						</Box>
						
						<Grid container spacing={2}>
							{
								availableItems.map(item => (
									<Grid size={{ xs: 12, sm: 6, md: 4 }} key={ item.id }>
										<Card variant="outlined">
											<CardContent>
												<Typography variant="h6" gutterBottom>{ item.name }</Typography>
												<Chip
													label={ item.category }
													size="small"
													sx={{ mb: 1 }}
												/>
												<Typography variant="body2" color="text.secondary">
													Available: { item.max_available }
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Location: { item.location }
												</Typography>
											</CardContent>
											<Box sx={{ p: 2, pt: 0 }}>
												<Button
													fullWidth
													variant="outlined"
													onClick={ () => handleRequestClick(item) }
													disabled={ item.max_available === "0" }
												>
													{ item.max_available === "0" ? 'Out of Stock' : 'Request Item' }
												</Button>
											</Box>
										</Card>
									</Grid>
								))
							}
						</Grid>
						{ ( loading ) && <Box fullWidth align="center" sx={{ mt: 2 }} ><CircularProgress /></Box> }
						{ ( !loading && !availableItems.length ) && <Typography align="center" >No list of items</Typography> }
					</Paper>
				</Grid>
				
				<Grid size={{ xs: 12 }}>
					<Paper sx={{ p: 3 }}>
						<Typography variant="h6" gutterBottom >My Borrow Requests</Typography>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: 'bold' }} >Item</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Quantity</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Purpose</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Borrow Date</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Return Date</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Status</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Actions</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										myRequests.map(request => (
											<TableRow key={ request.id }>
												<TableCell>{ request.item }</TableCell>
												<TableCell>{ request.quantity }</TableCell>
												<TableCell>{ request.purpose }</TableCell>
												<TableCell>{ new Date(request.borrow_date_start).toDateString() }</TableCell>
												<TableCell>{ new Date(request.borrow_date_end).toDateString() }</TableCell>
												<TableCell>
													<Chip
														label={ ( request.is_approved === "true" ) ? "Approved" : ( request.is_approved === "neutral" ) ? "Pending" : "Rejected" }
														color={ getStatusColor(request.is_approved) }
														size="small"
													/>
													{
														( request.is_approved === "true" ) && (
															<Chip
																label={ ( request.is_returned === "true" ) ? "Returned" : "Not Returned" }
																color={ ( request.is_returned === "true" ) ? "success" : "warning" }
																size="small"
															/>
														)
													}
												</TableCell>
												<TableCell>
													{
														request.is_approved === 'neutral' && (
															<IconButton
																size="small"
																color="error"
																onClick={ () => handleDeleteRequest(request) }
															>
																<DeleteIcon />
															</IconButton>
														)
													}
													{
														request.is_approved === 'false' && (
															<Button 
																variant="outlined"
																onClick={ () => handleViewNote(request) }
															>
																View Note
															</Button>
														)
													}
												</TableCell>
											</TableRow>
										))
									}
								</TableBody>
							</Table>
						</TableContainer>
						{ ( loading ) && <Box fullWidth align="center" sx={{ mt: 2 }} ><CircularProgress /></Box> }
						{ ( !loading && !myRequests.length ) && <Typography align="center" sx={{ mt: 2 }} >No list of items</Typography> }
					</Paper>
				</Grid>
			</Grid>
			
			<Dialog
				open={ openDialog }
				onClose={ () => setOpenDialog(false) }
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle> { ( viewNote ) ? "Request Note" : `Request Item: ${ selectedItem?.name }` } </DialogTitle>
				<DialogContent>
					{
						( !viewNote ) && (
							<Box sx={{ pt: 2 }}>
								<Grid container spacing={2}>
									<Grid size={{ xs: 12 }}>
										<TextField
											fullWidth
											label="Purpose"
											value={ requestForm.purpose }
											onChange={(e) => setRequestForm({
												...requestForm,
												purpose: e.target.value
											})}
											multiline
											rows={2}
										/>
									</Grid>
									
									<Grid size={{ xs: 12, sm: 6 }}>
										<TextField
											fullWidth
											label="Borrow Date"
											type="date"
											value={ requestForm.borrowDateStart }
											onChange={(e) => setRequestForm({
												...requestForm,
												borrowDateStart: e.target.value
											})}
											InputLabelProps={{ shrink: true }}
										/>
									</Grid>
									
									<Grid size={{ xs: 12, sm: 6 }}>
										<TextField
											fullWidth
											label="Return Date"
											type="date"
											value={ requestForm.borrowDateEnd }
											onChange={(e) => setRequestForm({
												...requestForm,
												borrowDateEnd: e.target.value
											})}
											InputLabelProps={{ shrink: true }}
										/>
									</Grid>
									
									<Grid size={{ xs: 12 }}>
										<TextField
											fullWidth
											label="Quantity"
											type="number"
											value={ requestForm.quantity }
											onChange={(e) => {
												const value = parseInt(e.target.value);
												if (value <= selectedItem.max_available) {
													setRequestForm({
														...requestForm,
														quantity: value
													});
												}
											}}
											InputProps={{ inputProps: { min: 1, max: selectedItem?.available } }}
										/>
									</Grid>
									
									{/*<Grid size={{ xs: 12 }}>
										<TextField
											fullWidth
											label="Additional Notes (Optional)"
											value={ requestForm.notes }
											onChange={(e) => setRequestForm({
												...requestForm,
												notes: e.target.value
											})}
											multiline
											rows={2}
										/>
									</Grid>*/}
								</Grid>
							</Box>
						)
					}
					{
						( viewNote ) && ( selectedItem?.rejection_note )
					}
				</DialogContent>
				<DialogActions>
					<Button onClick={ () => setOpenDialog(false) } >
						{ ( viewNote ) ? "Close" : "Cancel" }
					</Button>
					{
						( !viewNote ) && (
							<Button
								onClick={ handleSubmitRequest }
								variant="contained"
								disabled={ !requestForm.purpose || !requestForm.borrowDateStart || !requestForm.borrowDateEnd || loadingSubmition }
								loading={ loadingSubmition }
								loadingPosition="start"
							>
								Submit Request
							</Button>
						)
					}
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default ItemRequest;
