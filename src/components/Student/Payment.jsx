// src/components/Student/Payment.jsx
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
	Stepper,
	Step,
	StepLabel,
	CircularProgress
} from '@mui/material';
import {
	Receipt as ReceiptIcon,
	QrCode as QrCodeIcon
} from '@mui/icons-material';
import { fetchAPI, API_BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Payment = () => 
{
	const { user } = useAuth();

	const [payments, setPayments] = useState([]);
	const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [receipt, setRecipt] = useState(null);
	const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState(null);
	
	const [paymentForm, setPaymentForm] = useState({
		eventId: '',
		eventName: '',
		amount: 0,
		paymentMethod: 'gcash',
		gcashNumber: '',
		referenceNumber: '',
	});

	useEffect(() => {
		// Mock data
		// const mockPayments = [
		// 	{
		// 		id: 1,
		// 		eventName: 'National Architecture Week',
		// 		amount: 500,
		// 		paymentMethod: 'GCash',
		// 		status: 'Paid',
		// 		date: '2024-04-01',
		// 		reference: 'GCASH123456',
		// 	},
		// 	{
		// 		id: 2,
		// 		eventName: 'Software Tutorial Workshop',
		// 		amount: 300,
		// 		paymentMethod: 'On-site',
		// 		status: 'Pending',
		// 		date: '2024-04-05',
		// 		reference: 'OSA-2024-001',
		// 	},
		// 	{
		// 		id: 3,
		// 		eventName: 'Sports Fest 2024',
		// 		amount: 200,
		// 		paymentMethod: 'GCash',
		// 		status: 'Failed',
		// 		date: '2024-03-25',
		// 		reference: 'GCASH789012',
		// 	},
		// ];
		async function fetchDatas() {
			try {
				setLoading(true);
				const datas = await fetchAPI(`/transaction/get/student/${ user.token }`, "GET");
				setPayments(( datas.data.cause ) ? null : datas.data);
				setLoading(false);
			} catch (e) {
				console.error(e);
			}
		}
		fetchDatas();
	}, []);

	const handleMakePayment = () => {
		setPaymentForm({
			eventId: '1',
			eventName: 'National Architecture Week',
			amount: 500,
			paymentMethod: 'gcash',
			gcashNumber: '',
			referenceNumber: '',
		});
		setActiveStep(0);
		setOpenPaymentDialog(true);
	};

	const handleNext = () => {
		setActiveStep((prevStep) => prevStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	const handleClose = () => {
		setOpenPaymentDialog(false);
		setActiveStep(0);
	};

	const handleSubmitPayment = () => {
		// In real app, submit to API
		console.log('Payment submitted:', paymentForm);
		alert('Payment submitted successfully!');
		handleClose();
	};

	const handleOpenReceipt = (payment) => {
		setOpenReceiptDialog(true);
		setSelectedPayment(payment);
	}

	const handleCloseReceipt = () => {
		setOpenReceiptDialog(false);
		setSelectedPayment(null);
	}

	const steps = ['Select Payment Method', 'Enter Details', 'Confirmation'];

	const getStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<Box>
						<Typography variant="body1" gutterBottom>
							<strong>Event:</strong> {paymentForm.eventName}
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Amount:</strong> ₱{paymentForm.amount}
						</Typography>
						
						<FormControl fullWidth sx={{ mt: 2 }}>
							<InputLabel>Payment Method</InputLabel>
							<Select
								value={paymentForm.paymentMethod}
								label="Payment Method"
								onChange={(e) => setPaymentForm({
									...paymentForm,
									paymentMethod: e.target.value
								})}
							>
								<MenuItem value="gcash">GCash</MenuItem>
								<MenuItem value="onsite">On-site Payment</MenuItem>
							</Select>
						</FormControl>
						
						{paymentForm.paymentMethod === 'gcash' && (
							<Alert severity="info" sx={{ mt: 2 }}>
								<Typography variant="body2">
									Please prepare your GCash app for payment. A QR code will be shown in the next step.
								</Typography>
							</Alert>
						)}
						
						{paymentForm.paymentMethod === 'onsite' && (
							<Alert severity="info" sx={{ mt: 2 }}>
								<Typography variant="body2">
									Please proceed to the Office of Student Affairs to make your payment.
									Office hours: Monday-Friday, 8:00 AM - 5:00 PM
								</Typography>
							</Alert>
						)}
					</Box>
				);
			case 1:
				if (paymentForm.paymentMethod === 'gcash') {
					return (
						<Box>
							<Box sx={{ textAlign: 'center', mb: 3 }}>
								<QrCodeIcon sx={{ fontSize: 200, color: 'primary.main' }} />
								<Typography variant="caption" display="block">
									Scan this QR code using GCash app
								</Typography>
							</Box>
							
							<TextField
								fullWidth
								label="GCash Number"
								value={paymentForm.gcashNumber}
								onChange={(e) => setPaymentForm({
									...paymentForm,
									gcashNumber: e.target.value
								})}
								sx={{ mb: 2 }}
							/>
							
							<TextField
								fullWidth
								label="GCash Reference Number"
								value={paymentForm.referenceNumber}
								onChange={(e) => setPaymentForm({
									...paymentForm,
									referenceNumber: e.target.value
								})}
								placeholder="Enter reference number from GCash"
							/>
						</Box>
					);
				} else {
					return (
						<Box>
							<Alert severity="success" sx={{ mb: 2 }}>
								<Typography variant="body1" gutterBottom>
									On-site Payment Instructions:
								</Typography>
								<Typography variant="body2">
									1. Go to Office of Student Affairs<br />
									2. Present your student ID<br />
									3. Pay ₱{paymentForm.amount} to the cashier<br />
									4. Get your official receipt
								</Typography>
							</Alert>
							
							<TextField
								fullWidth
								label="Receipt Number"
								value={paymentForm.referenceNumber}
								onChange={(e) => setPaymentForm({
									...paymentForm,
									referenceNumber: e.target.value
								})}
								placeholder="Enter receipt number from OSA"
							/>
						</Box>
					);
				}
			case 2:
				return (
					<Box>
						<Alert severity="info" sx={{ mb: 2 }}>
							Please review your payment details:
						</Alert>
						
						<Grid container spacing={2}>
							<Grid size={{ xs: 6 }}>
								<Typography variant="body2">
									<strong>Event:</strong> {paymentForm.eventName}
								</Typography>
							</Grid>
							<Grid size={{ xs: 6 }}>
								<Typography variant="body2">
									<strong>Amount:</strong> ₱{paymentForm.amount}
								</Typography>
							</Grid>
							<Grid size={{ xs: 6 }}>
								<Typography variant="body2">
									<strong>Method:</strong> {paymentForm.paymentMethod === 'gcash' ? 'GCash' : 'On-site'}
								</Typography>
							</Grid>
							<Grid size={{ xs: 6 }}>
								<Typography variant="body2">
									<strong>Reference:</strong> {paymentForm.referenceNumber}
								</Typography>
							</Grid>
							{paymentForm.paymentMethod === 'gcash' && (
								<Grid size={{ xs: 6 }}>
									<Typography variant="body2">
										<strong>GCash No:</strong> {paymentForm.gcashNumber}
									</Typography>
								</Grid>
							)}
						</Grid>
					</Box>
				);
			default:
				return 'Unknown step';
		}
	};

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

	return (
		<Box>
			{/*<Typography variant="h5" gutterBottom>
				Payment Transactions
			</Typography>*/}
			
			<Grid container spacing={3}>
				{/*<Grid size={{ xs: 12 }}>
					<Card sx={{ mb: 1 }}>
						<CardContent>
							<Grid container alignItems="center" justifyContent="space-between">
								<Grid item>
									<Typography variant="h6">
										Make a Payment
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Pay for registered events
									</Typography>
								</Grid>
								<Grid item>
									<Button
										variant="contained"
										startIcon={<ReceiptIcon />}
										onClick={handleMakePayment}
									>
										Make Payment
									</Button>
								</Grid>
							</Grid>
						</CardContent>
					</Card>
				</Grid>*/}
				
				<Grid size={{ xs: 12 }}>
					<Paper sx={{ p: 3 }}>
						<Typography variant="h6" gutterBottom>
							Payment History
						</Typography>
						
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: 'bold' }} >Activity</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Amount</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Payment Method</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Date Paid</TableCell>
										<TableCell sx={{ fontWeight: 'bold' }} >Receipt</TableCell>
										{/*<TableCell sx={{ fontWeight: 'bold' }} >Status</TableCell>*/}
									</TableRow>
								</TableHead>
								<TableBody>
									{
										( payments.length !== 0 && !loading ) && payments.map(payment => (
											<TableRow key={ payment.id }>
												<TableCell>{ payment.activity }</TableCell>
												<TableCell>₱{ payment.amount }</TableCell>
												<TableCell>{ ( payment.payment_type.includes("gcash") ? "GCash" : payment.payment_type.charAt(0).toUpperCase() + payment.payment_type.slice(1) ) }</TableCell>
												<TableCell>{ new Date(payment.created_at).toDateString() }</TableCell>
												<TableCell>
													{ ( payment.payment_type.includes("gcash") ) ? <Button onClick={ () => handleOpenReceipt(payment) } >View Receipt</Button> : "-" }
												</TableCell>
												{/*<TableCell sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
													<Box sx={{ width: '100%' }}>
														<Chip
															label={payment.status}
															color={getStatusColor(payment.status)}
															size="small"
														/>
													</Box>
													<Box sx={{ width: '50%' }}>
														<Button>View Details</Button>
													</Box>
												</TableCell>*/}
											</TableRow>
										))
									}
								</TableBody>
							</Table>
						</TableContainer>
						{ ( loading ) && <Box fullWidth align="center" sx={{ mt: 2 }} ><CircularProgress /></Box> }
						{
							( !loading && payments.length === 0 ) && (
								<Typography align="center" sx={{ mt: 2 }} >You don't have any payments</Typography>
							)
						}
					</Paper>
				</Grid>
			</Grid>
			
			<Dialog
				open={ openPaymentDialog }
				onClose={ handleClose }
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>
					Make Payment
				</DialogTitle>
				<DialogContent>
					<Stepper activeStep={activeStep} sx={{ mb: 3 }}>
						{
							steps.map(label => (
								<Step key={label}>
									<StepLabel>{label}</StepLabel>
								</Step>
							))
						}
					</Stepper>
					{ getStepContent(activeStep) }
				</DialogContent>
				<DialogActions>
					<Button onClick={handleBack} disabled={activeStep === 0}>
						Back
					</Button>
					<Button
						onClick={activeStep === steps.length - 1 ? handleSubmitPayment : handleNext}
						variant="contained"
						disabled={
							(activeStep === 1 && paymentForm.paymentMethod === 'gcash' && 
							(!paymentForm.gcashNumber || !paymentForm.referenceNumber)) ||
							(activeStep === 1 && paymentForm.paymentMethod === 'onsite' && 
							!paymentForm.referenceNumber)
						}
					>
						{activeStep === steps.length - 1 ? 'Submit Payment' : 'Next'}
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={ openReceiptDialog }
				onClose={ handleCloseReceipt }
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Receipt of { selectedPayment?.activity.replaceAll("Event |","") } </DialogTitle>
				<DialogContent>
					<img src={ selectedPayment?.receipt } alt="image of your receipt" />
				</DialogContent>
				<DialogActions>
					<Button onClick={ handleCloseReceipt } >Close</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default Payment;
