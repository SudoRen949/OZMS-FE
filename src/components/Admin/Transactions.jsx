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
	CircularProgress
} from '@mui/material';
import {
	Search as SearchIcon, 
	FilterList as FilterIcon, 
	Check as CheckIcon, 
	Close as CloseIcon
} from '@mui/icons-material';
import { fetchAPI, API_BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Transactions = () => 
{
	const { user } = useAuth();

	const [transactions, setTransactions] = useState([]);
	const [filteredTransactions, setFilteredTransactions] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [filterMethod, setFilterMethod] = useState('all');
	// const [openDialog, setOpenDialog] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [actionType, setActionType] = useState('');
	const [loading, setLoading] = useState(false);
	const [openReceiptDialog, setOpenReceiptDialog] = useState(false);

	useEffect(() => {
		// Mock data
		// const mockTransactions = [
		// 	{
		// 		id: 1,
		// 		studentName: 'John Doe',
		// 		studentId: '2023-00123',
		// 		eventName: 'National Architecture Week',
		// 		amount: 500,
		// 		paymentMethod: 'GCash',
		// 		reference: 'GCASH123456',
		// 		status: 'Paid',
		// 		date: '2024-04-01',
		// 		verifiedBy: 'Admin 1',
		// 	},
		// 	{
		// 		id: 2,
		// 		studentName: 'Jane Smith',
		// 		studentId: '2023-00234',
		// 		eventName: 'Software Tutorial Workshop',
		// 		amount: 300,
		// 		paymentMethod: 'On-site',
		// 		reference: 'OSA-2024-001',
		// 		status: 'Pending',
		// 		date: '2024-04-05',
		// 		verifiedBy: '',
		// 	},
		// 	{
		// 		id: 3,
		// 		studentName: 'Bob Wilson',
		// 		studentId: '2023-00345',
		// 		eventName: 'Sports Fest 2024',
		// 		amount: 200,
		// 		paymentMethod: 'GCash',
		// 		reference: 'GCASH789012',
		// 		status: 'Failed',
		// 		date: '2024-03-25',
		// 		verifiedBy: '',
		// 	},
		// 	{
		// 		id: 4,
		// 		studentName: 'Alice Johnson',
		// 		studentId: '2023-00456',
		// 		eventName: 'Cultural Festival',
		// 		amount: 150,
		// 		paymentMethod: 'On-site',
		// 		reference: 'OSA-2024-002',
		// 		status: 'Paid',
		// 		date: '2024-04-03',
		// 		verifiedBy: 'Admin 2',
		// 	},
		// ];
		async function fetchDatas() {
			try {
				setLoading(true);
				const transactionDatas = await fetchAPI(`/transaction/get/admin/${ user.token }`, "GET");
				setTransactions(transactionDatas.data);
				setFilteredTransactions(transactionDatas.data);
				setLoading(false);
			} catch (e) {
				console.error(e);
			}
		}
		fetchDatas();
	}, []);

	useEffect(() => {
		let filtered = transactions;
		if (searchTerm) {
			filtered = filtered.filter(transaction =>
				transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				transaction.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				transaction.activity.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}
		// if (filterStatus !== 'all') {
		// 	filtered = filtered.filter(transaction => transaction.status === filterStatus);
		// }
		if (filterMethod !== 'all') {
			filtered = filtered.filter(transaction => transaction.payment_type.includes(filterMethod.toLowerCase().replaceAll("_"," ")));
		}
		setFilteredTransactions(filtered);
	}, [searchTerm, filterStatus, filterMethod, transactions]);

	const handleActionClick = (transaction, action) => {
		setSelectedTransaction(transaction);
		setActionType(action);
		setOpenDialog(true);
	};

	const handleConfirmAction = () => {
		// In real app, update via API
		// if (actionType === 'approve') {
		// 	setTransactions(transactions.map(t => 
		// 		t.id === selectedTransaction.id 
		// 			? { ...t, status: 'Paid', verifiedBy: 'Current Admin' }
		// 			: t
		// 	));
		// 	alert('Payment approved successfully!');
		// } else if (actionType === 'reject') {
		// 	setTransactions(transactions.map(t => 
		// 		t.id === selectedTransaction.id 
		// 			? { ...t, status: 'Failed', verifiedBy: 'Current Admin' }
		// 			: t
		// 	));
		// 	alert('Payment rejected!');
		// }
		setOpenDialog(false);
	};

	const handleOpenReceipt = (transaction) => {
		setOpenReceiptDialog(true);
		setSelectedTransaction(transaction);
	}

	const handleCloseReceipt = () => {
		setOpenReceiptDialog(false);
		setSelectedTransaction(null);
	}

	/*

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case 'paid':
				return 'success';
			case 'pending':
				return 'warning';
			case 'failed':
				return 'error';
			default:
				return 'default';
		}
	};

	const calculateStats = () => {
		const total = filteredTransactions.length;
		const paid = filteredTransactions.filter(t => t.status === 'Paid').length;
		const pending = filteredTransactions.filter(t => t.status === 'Pending').length;
		const totalAmount = filteredTransactions
			.filter(t => t.status === 'Paid')
			.reduce((sum, t) => sum + t.amount, 0);
		
		return { total, paid, pending, totalAmount };
	};

	const stats = calculateStats();

	*/

	return (
		<Box>
			<Typography variant="h5" gutterBottom>Payment Transactions</Typography>
			
			{/*<Grid container spacing={3} sx={{ mb: 3 }}>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<Paper sx={{ p: 2, textAlign: 'center' }}>
						<Typography variant="h6" color="primary">
							{stats.total}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Total Transactions
						</Typography>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<Paper sx={{ p: 2, textAlign: 'center' }}>
						<Typography variant="h6" color="success.main">
							{stats.paid}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Paid
						</Typography>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<Paper sx={{ p: 2, textAlign: 'center' }}>
						<Typography variant="h6" color="warning.main">
							{stats.pending}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Pending
						</Typography>
					</Paper>
				</Grid>
				<Grid size={{ xs: 12, sm: 6, md: 3 }}>
					<Paper sx={{ p: 2, textAlign: 'center' }}>
						<Typography variant="h6" color="primary">
							₱{stats.totalAmount}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Total Amount
						</Typography>
					</Paper>
				</Grid>
			</Grid>*/}
			
			<Paper sx={{ p: 3, mb: 3 }}>
				<Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
					<Grid size={{ xs: 12, md: 6 }}>
						<TextField
							fullWidth
							label="Search transactions"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							InputProps={{
								startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
							}}
						/>
					</Grid>
					{/*<Grid size={{ xs: 12, md: 4 }}>
						<FormControl fullWidth>
							<InputLabel>Filter by Status</InputLabel>
							<Select
								value={filterStatus}
								label="Filter by Status"
								onChange={(e) => setFilterStatus(e.target.value)}
							>
								<MenuItem value="all">All Status</MenuItem>
								<MenuItem value="Paid">Paid</MenuItem>
								<MenuItem value="Pending">Pending</MenuItem>
								<MenuItem value="Failed">Failed</MenuItem>
							</Select>
						</FormControl>
					</Grid>*/}
					<Grid size={{ xs: 12, md: 6 }}>
						<FormControl fullWidth>
							<InputLabel>Filter by Method</InputLabel>
							<Select
								value={filterMethod}
								label="Filter by Method"
								onChange={(e) => setFilterMethod(e.target.value)}
							>
								<MenuItem value="all">All Methods</MenuItem>
								<MenuItem value="GCash">GCash</MenuItem>
								<MenuItem value="On-site">On-site</MenuItem>
								<MenuItem value="Free">Free</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>
				
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 'bold' }} >Student</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} >Activity</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} >Amount</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} >Method</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} >Receipt</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} >Date Paid</TableCell>
								{/*<TableCell>Status</TableCell>*/}
								{/*<TableCell>Verified By</TableCell>*/}
								{/*<TableCell>Actions</TableCell>*/}
							</TableRow>
						</TableHead>
						<TableBody>
							{
								filteredTransactions?.map(transaction => (
									<TableRow key={ transaction.id }>
										<TableCell>
											<Typography variant="subtitle2">
												{ transaction.name }
											</Typography>
											<Typography variant="caption" color="text.secondary">
												{ transaction.student_id }
											</Typography>
										</TableCell>
										<TableCell>{ transaction.activity }</TableCell>
										<TableCell>₱{ transaction.amount }</TableCell>
										<TableCell>
											{
												( transaction.payment_type.includes("gcash") ) ? "GCash" : transaction.payment_type.charAt(0).toUpperCase() + transaction.payment_type.slice(1)
											}
										</TableCell>
										{/*<TableCell>{ transaction.reference }</TableCell>
										<TableCell>{ transaction.date }</TableCell>*/}
										<TableCell>
											{ ( transaction.payment_type.includes("gcash") ) ? <Button onClick={ () => handleOpenReceipt(transaction) } >View Receipt</Button> : "-" }
										</TableCell>
										<TableCell>{ new Date(transaction.created_at).toDateString() }</TableCell>
										{/*<TableCell>
											<Chip
												label={transaction.status}
												color={getStatusColor(transaction.status)}
												size="small"
											/>
										</TableCell>*/}
										{/*<TableCell>
											{transaction.verifiedBy || '-'}
										</TableCell>*/}
										{/*<TableCell>
											{transaction.status === 'Pending' && (
												<Box sx={{ display: 'flex', gap: 1 }}>
													<IconButton
														size="small"
														color="success"
														onClick={() => handleActionClick(transaction, 'approve')}
													>
														<CheckIcon />
													</IconButton>
													<IconButton
														size="small"
														color="error"
														onClick={() => handleActionClick(transaction, 'reject')}
													>
														<CloseIcon />
													</IconButton>
												</Box>
											)}
										</TableCell>*/}
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</TableContainer>
				{ ( loading ) && <Box fullWidth align="center" sx={{ mt: 2 }} ><CircularProgress /></Box> }
				{
					( !loading && filteredTransactions.length === 0 ) && (
						<Typography align="center" sx={{ mt: 2 }} >No transactions found</Typography>
					)
				}
			</Paper>
			
			{/*<Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
				<DialogTitle>
					{actionType === 'approve' ? 'Approve Payment' : 'Reject Payment'}
				</DialogTitle>
				<DialogContent>
					{selectedTransaction && (
						<Box sx={{ pt: 2 }}>
							<Alert severity={actionType === 'approve' ? 'info' : 'warning'} sx={{ mb: 2 }}>
								{actionType === 'approve' 
									? 'Are you sure you want to approve this payment?'
									: 'Are you sure you want to reject this payment?'}
							</Alert>
							
							<Grid container spacing={2}>
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2">
										<strong>Student:</strong> {selectedTransaction.studentName}
									</Typography>
								</Grid>
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2">
										<strong>ID:</strong> {selectedTransaction.studentId}
									</Typography>
								</Grid>
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2">
										<strong>Event:</strong> {selectedTransaction.eventName}
									</Typography>
								</Grid>
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2">
										<strong>Amount:</strong> ₱{selectedTransaction.amount}
									</Typography>
								</Grid>
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2">
										<strong>Method:</strong> {selectedTransaction.paymentMethod}
									</Typography>
								</Grid>
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2">
										<strong>Reference:</strong> {selectedTransaction.reference}
									</Typography>
								</Grid>
							</Grid>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmAction}
						variant="contained"
						color={actionType === 'approve' ? 'success' : 'error'}
					>
						{actionType === 'approve' ? 'Approve' : 'Reject'}
					</Button>
				</DialogActions>
			</Dialog>*/}
			<Dialog
				open={ openReceiptDialog }
				onClose={ () => setOpenReceiptDialog(false) }
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle> Receipt of { selectedTransaction?.name } </DialogTitle>
				<DialogContent>
					<img src={ selectedTransaction?.receipt } alt="Image of a receipt" />
				</DialogContent>
				<DialogActions>
					<Button onClick={ handleCloseReceipt } >Close</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default Transactions;
