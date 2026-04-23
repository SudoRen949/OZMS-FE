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
import { fetchAPI } from '../../services/api';

const ItemManagement = () => 
{
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const { user } = useAuth();

	const itemFormDatas = {
		token: user.token,
		owner: `${ user.firstName } ${ user.lastName } ${ user.suffix }`,
		name: '',
		category: '',
		maxAvailable: 0,
		location: ''
	}
	
	const [items, setItems] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [currentItem, setCurrentItem] = useState(null);
	const [loadingItems, setLoadingItems] = useState(false);
	const [itemForm, setItemForm] = useState(itemFormDatas);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchDatas() {
			try {
				setLoadingItems(true);
				const itemDatas = await fetchAPI(`/item/get/own/${ user.token }`, "GET");
				setItems(( itemDatas.data.cause ) ? [] : itemDatas.data);
				setLoadingItems(false);
			} catch (e) {
				console.error(e);
			}
		}
		fetchDatas();
	}, []);

	const handleOpenAdd = () => {
		setIsEditMode(false);
		setOpenDialog(true);
		setItemForm(itemFormDatas);
	};

	const handleOpenEdit = (item) => {
		setIsEditMode(true);
		setCurrentItem(item);
		setItemForm({
			name: item.name,
			category: item.category,
			avail: item.avail,
			maxAvailable: item.max_available,
			location: item.location,
		});
		setOpenDialog(true);
	};

	const handleDelete = async (id) => {
		if ( window.confirm('Are you sure you want to delete this item?') ) {
			try {
				await fetchAPI(`/item/remove/${ id }`, "DELETE");
				await fetchAPI(`/item/request/delete/admin/${ id }`, "DELETE");
				setItems(items.filter(item => item.id !== id));
			} catch (e) {
				console.error(e);
			}
		}
	};

	const handleSubmit = async () => {
		try {
			setLoading(true);
			if (!isEditMode) await fetchAPI("/item/save", "POST", itemForm);
			else await fetchAPI(`/item/edit/${ currentItem.id }`, "PUT", itemForm);
			setLoading(false);
			setOpenDialog(false);
			// load datas again
			setLoadingItems(true);
			const itemDatas = await fetchAPI(`/item/get/own/${ user.token }`, "GET");
			setItems(( itemDatas.data.cause ) ? [] : itemDatas.data);
			setItemForm(itemFormDatas);
			setLoadingItems(false);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
				<Typography variant="h5">Item Management</Typography>
				<Button
					variant="contained"
					startIcon={ (isMobile) ? null : <AddIcon /> }
					onClick={ handleOpenAdd }
				>
					{ (isMobile) ? <AddIcon /> : "Add Item" }
				</Button>
			</Box>
			<Grid container spacing={3}>
				<Grid size={{ xs: 12 }}>
					<Paper sx={{ p: 3 }}>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: 'bold' }} >Item Name</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Category</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Location</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Availability</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Actions</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										items.map(item => (
											<TableRow key={ item.id } >
												<TableCell>
													<Typography variant="subtitle1">{ item.name }</Typography>
												</TableCell>
												<TableCell>{ item.category }</TableCell>
												<TableCell>{ item.location }</TableCell>
												<TableCell>{ item.max_available }</TableCell>
												<TableCell>
													<IconButton
														size="small"
														onClick={ () => handleOpenEdit(item) }
													>
														<EditIcon />
													</IconButton>
													<IconButton
														size="small"
														color="error"
														onClick={ () => handleDelete(item.id) }
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
						{ ( loadingItems ) && <Box fullWidth align="center" sx={{ mt: 2 }} ><CircularProgress /></Box> }
						{
							( !loadingItems && items.length === 0 ) && <Typography align="center" sx={{ mt: 2 }} >No items</Typography>
						}
					</Paper>
				</Grid>
			</Grid>

			<Dialog
				open={ openDialog }
				onClose={ () => setOpenDialog(false) }
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>
					{ isEditMode ? 'Edit Item' : 'Add New Item' }
				</DialogTitle>
				<DialogContent>
					<Box sx={{ pt: 2 }}>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12 }}>
								<TextField
									fullWidth
									label="Item Name"
									value={ itemForm.name }
									onChange={(e) => setItemForm({
										...itemForm,
										name: e.target.value
									})}
									required
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<FormControl fullWidth>
									<InputLabel>Category</InputLabel>
									<Select
										value={ itemForm.category }
										label="Category"
										onChange={(e) => setItemForm({
											...itemForm,
											category: e.target.value
										})}
									>
										<MenuItem value="Electronics">Electronics</MenuItem>
										<MenuItem value="Furniture">Furniture</MenuItem>
										<MenuItem value="Supplies">Supplies</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="Available"
									type="number"
									value={ itemForm.maxAvailable }
									InputProps={{ inputProps: { min: 0 } }}
									onChange={(e) => setItemForm({
										...itemForm,
										maxAvailable: parseInt(e.target.value) || 0
									})}
								/>
							</Grid>
							<Grid size={{ xs: 12 }}>
								<TextField
									fullWidth
									label="Location"
									value={ itemForm.location }
									onChange={(e) => setItemForm({
										...itemForm,
										location: e.target.value
									})}
									required
								/>
							</Grid>
						</Grid>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={ () => setOpenDialog(false) } >Cancel</Button>
					<Button
						onClick={ handleSubmit }
						variant="contained"
						disabled={ !itemForm.name || !itemForm.category || !itemForm.maxAvailable || !itemForm.location || loading }
						loading={ loading }
						loadingPosition="start"
					>
						{ isEditMode ? 'Update Item' : 'Add Item' }
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default ItemManagement;
