import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Container,
	Paper,
	Typography,
	Grid,
	Card,
	CardContent,
	CardActions,
	Button,
	Box,
	Chip,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	Alert,
	Stepper,
	Step,
	StepLabel,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Radio,
	RadioGroup,
	FormControlLabel,
	IconButton,
	Tooltip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Avatar,
	Stack,
	CircularProgress,
	useTheme,
	useMediaQuery
} from '@mui/material';
import {
	CheckCircle as CheckIcon,
	Cancel as CancelIcon,
	Star as StarIcon,
	WorkspacePremium as PremiumIcon,
	Business as BusinessIcon,
	School as SchoolIcon,
	Security as SecurityIcon,
	Analytics as AnalyticsIcon,
	People as PeopleIcon,
	Event as EventIcon,
	Inventory as InventoryIcon,
	Notifications as NotificationsIcon,
	CreditCard as CreditCardIcon,
	Receipt as ReceiptIcon,
	History as HistoryIcon,
	Info as InfoIcon,
	Home as HomeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { API_BASE_URL, emailSend, WEB_URL } from '../../services/api';

const Plans = () => 
{
	const theme = useTheme();
	const navigate = useNavigate();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const paymentDetailsValue = {
		// gcashNumber: '',
		// gcashName: '',
		gcashReceipt: null,
		email: '',
		firstName: '',
		lastName: '',
		department: '',
		organization: '',
	}
	
	const [selectedPlan, setSelectedPlan] = useState('pro');
	const [paymentStep, setPaymentStep] = useState(0);
	const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
	const [billingCycle, setBillingCycle] = useState('monthly');
	const [paymentMethod, setPaymentMethod] = useState('gcash');
	const [paymentDetails, setPaymentDetails] = useState(paymentDetailsValue);
	const [subscriptionHistory, setSubscriptionHistory] = useState([]);
	const [currentSubscription, setCurrentSubscription] = useState(null);
	const [loading, setLoading] = useState(false);
	const [applied, setApplied] = useState(false);

	// Subscription Plans Data
	const plans = {
		pro: {
			// name: 'Professional',
			name: 'Administrator Plan',
			price: 100,
			// monthlyPrice: 49,
			yearlyPrice: 490,
			color: '#2196F3',
			icon: <StarIcon />,
			features: [
				{ text: 'Access/Manage Organization Events', included: true },
				{ text: 'Manage Transactions', included: true },
				{ text: 'Manage Student Item Requests', included: true },
				// { text: 'Up to 500 Student Users', included: true },
				// { text: 'Advanced Analytics', included: true },
				// { text: 'Bulk Operations', included: true },
				// { text: 'Priority Email Support', included: true },
				// { text: 'Custom Event Categories', included: true },
				// { text: 'Resource Management', included: true },
				// { text: 'Payment Processing', included: true },
				// { text: 'Custom Branding', included: false },
				// { text: 'Dedicated Support', included: false },
				// { text: 'API Access', included: false },
				// { text: 'Custom Reports', included: false },
			],
			limits: {
				events: 'Unlimited',
				students: 500,
				storage: '1GB',
				admins: 3,
				support: 'Priority Email',
			},
			popular: true,
		}
	};

	// Feature categories for comparison
	// const featureCategories = [
	// 	{
	// 		title: 'Event Management',
	// 		features: [
	// 			'Create & Manage Events',
	// 			'Event Categories',
	// 			'Registration Forms',
	// 			'Event Reminders',
	// 			'Attendance Tracking',
	// 			'Event Analytics',
	// 		],
	// 		icon: <EventIcon />,
	// 	},
	// 	{
	// 		title: 'Resource Management',
	// 		features: [
	// 			'Item Borrowing System',
	// 			'Resource Categories',
	// 			'Automated Approvals',
	// 			'Return Tracking',
	// 			'Inventory Management',
	// 			'Resource Analytics',
	// 		],
	// 		icon: <InventoryIcon />,
	// 	},
	// 	{
	// 		title: 'User Management',
	// 		features: [
	// 			'Student Management',
	// 			'Role-based Access',
	// 			'Bulk User Import',
	// 			'User Activity Logs',
	// 			'Custom User Fields',
	// 			'Advanced Permissions',
	// 		],
	// 		icon: <PeopleIcon />,
	// 	},
	// 	{
	// 		title: 'Analytics & Reporting',
	// 		features: [
	// 			'Basic Dashboard',
	// 			'Advanced Analytics',
	// 			'Custom Reports',
	// 			'Export Options',
	// 			'Real-time Updates',
	// 			'Predictive Analytics',
	// 		],
	// 		icon: <AnalyticsIcon />,
	// 	},
	// 	{
	// 		title: 'Support & Security',
	// 		features: [
	// 			'Email Support',
	// 			'Priority Support',
	// 			'Dedicated Support',
	// 			'Two-factor Auth',
	// 			'Audit Logs',
	// 			'SLA Guarantee',
	// 		],
	// 		icon: <SecurityIcon />,
	// 	},
	// ];

	// Current usage stats
	// const usageStats = {
	// 	events: { used: 3, total: plans.free.limits.events },
	// 	students: { used: 85, total: plans.free.limits.students },
	// 	storage: { used: '45MB', total: plans.free.limits.storage },
	// 	admins: { used: 1, total: plans.free.limits.admins },
	// };

	useEffect(() => {
		// Mock current subscription (Free tier)
		// setCurrentSubscription({
		// 	plan: 'free',
		// 	status: 'active',
		// 	nextBilling: '2024-05-10',
		// 	price: 0,
		// 	billingCycle: 'monthly',
		// 	startDate: '2024-01-10',
		// });
		// Mock subscription history
		// setSubscriptionHistory([
		// 	{ id: 1, date: '2024-04-01', plan: 'Free', amount: 0, status: 'active', invoice: 'INV-2024-001' },
		// 	{ id: 2, date: '2024-03-01', plan: 'Free', amount: 0, status: 'active', invoice: 'INV-2024-002' },
		// 	{ id: 3, date: '2024-02-01', plan: 'Free', amount: 0, status: 'active', invoice: 'INV-2024-003' },
		// ]);
		const myPlan = localStorage.getItem(btoa("plan_applied"));
		if ( myPlan && atob( myPlan ) === "true" ) {
			setApplied(true);
		}
		// setCurrentSubscription( ( myPlan ) ? JSON.parse(atob(myPlan)) : null );
	}, []);

	const handlePlanSelect = (plan) => {
		setSelectedPlan(plan);
		setOpenPaymentDialog(true);
		setPaymentStep(0);
		setLoading(false);
	};

	const handleNextStep = () => {
		setPaymentStep(prev => prev + 1);
	};

	const handleBackStep = () => {
		setPaymentStep(prev => prev - 1);
	};

	const handlePaymentSubmit = async () => {
		// Process payment
		setLoading(true);
		try {
			// setCurrentSubscription({
			//     plan: selectedPlan,
			//     status: 'active',
			//     nextBilling: billingCycle === 'yearly' 
			//         ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
			//         : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			//     price: billingCycle === 'yearly' ? plans[selectedPlan].yearlyPrice : plans[selectedPlan].price,
			//     billingCycle: billingCycle,
			//     startDate: new Date().toISOString().split('T')[0],
			// });
			const subscription = {
			    plan: selectedPlan,
			    status: 'active',
			    nextBilling: billingCycle === 'yearly' 
			        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
			        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			    price: billingCycle === 'yearly' ? plans[selectedPlan].yearlyPrice : plans[selectedPlan].price,
			    billingCycle: billingCycle,
			    startDate: new Date().toISOString().split('T')[0]
			}
			const formData = new FormData();
			formData.append("email", paymentDetails.email);
			formData.append("receipt", paymentDetails.gcashReceipt);
			formData.append("plan", btoa(JSON.stringify(subscription)));
			const result = await fetch(`${ API_BASE_URL }/plan/save`, { method: "POST", body: formData });
			const data = await result.json();
			console.log(data);
			await emailSend(null, paymentDetails.email, "OZMS Verification", "OZMS Verification", `
				Hi ${ paymentDetails.email }, You are successfully applied for Administrator for OrganiZerving. <br/>
				To start, click <a href="${ WEB_URL + "/#/admin/setup" }">here</a> to setup your account.
			`);
			await emailSend(null, null, "OZMS Admin Applicant", "OZMS Admin Applicant", `
				Hi Renato, an application has applied for administrator for OrganiZerving <br/>
				Name: ${ paymentDetails.firstName } ${ paymentDetails.lastName } <br/>
				Department: ${ paymentDetails.department } <br/>
				Organization: ${ paymentDetails.organization } <br/><br/>
				--------------- PAYMENT ---------------- <br/><br/>
				Date paid: ${ new Date().toDateString() } at ${ new Date().toTimeString() } <br/>
				Billing Type: ${ billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1) } <br/>
				Receipt: <a href="${ data.receipt }">View receipt</a>
			`);
			// localStorage.setItem(btoa("my_plan"),btoa(JSON.stringify(currentSubscription)));  // I don't this has any use :/
			localStorage.setItem(btoa("plan_applied"),btoa("true"));
			alert("Your plan has been applied. An email will be sent to you for further info.");
			setOpenPaymentDialog(false);
			setLoading(false);
		} catch (e) {
			console.error(e);
		}
		// alert(`Subscription to ${ plans[selectedPlan].name } plan successful!\nWe'll send you an email for account registration.`);
		// setOpenPaymentDialog(false);
		// navigate("/");
		// alert(`Subscription to ${plans[selectedPlan].name} plan successful!`);
		// setOpenPaymentDialog(false);
		// Update current subscription
		// setCurrentSubscription({
		//     plan: selectedPlan,
		//     status: 'active',
		//     nextBilling: billingCycle === 'yearly' 
		//         ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
		//         : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
		//     price: billingCycle === 'yearly' ? plans[selectedPlan].yearlyPrice : plans[selectedPlan].monthlyPrice,
		//     billingCycle: billingCycle,
		//     startDate: new Date().toISOString().split('T')[0],
		// });
	};

	const getPlanPrice = (planKey) => {
		const plan = plans[planKey];
		return billingCycle === 'yearly' ? plan.yearlyPrice : plan.price;
	};

	const getSavings = (planKey) => {
		const plan = plans[planKey];
		if (billingCycle === 'yearly') {
			return plan.price * 12 - plan.yearlyPrice;
		}
		return 0;
	};

	const renderPaymentStep = (step) => {
		switch (step) {
			case 0: // Plan selection
				return (
					<Box>
						<Typography variant="h6" gutterBottom>Select Billing Cycle</Typography>
						<RadioGroup
							value={ billingCycle }
							onChange={(e) => setBillingCycle(e.target.value)}
							sx={{ mb: 3 }}
						>
							<FormControlLabel
								value="monthly"
								control={ <Radio /> }
								label={
									<Box>
										<Typography>Monthly Billing</Typography>
										{/*<Typography variant="body2" color="text.secondary">
											Pay monthly, cancel anytime
										</Typography>*/}
									</Box>
								}
							/>
							<FormControlLabel
								value="yearly"
								control={ <Radio /> }
								label={
									<Box>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											<Typography>Yearly Billing</Typography>
											{/*<Chip label="Save 16%" color="success" size="small" />*/}
										</Box>
										{/*<Typography variant="body2" color="text.secondary">
											Pay annually, get 2 months free
										</Typography>*/}
									</Box>
								}
							/>
						</RadioGroup>

						<Typography variant="h6" gutterBottom>Selected Plan: { plans[selectedPlan].name }</Typography>
						
						<Card variant="outlined" sx={{ mb: 2 }}>
							<CardContent>
								<Grid container alignItems="center" justifyContent="space-between">
									<Grid>
										<Typography variant="h5" color={ plans[selectedPlan].color }>
											{ plans[selectedPlan].name }
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{ billingCycle === 'monthly' ? 'Monthly' : 'Yearly' } Plan
										</Typography>
									</Grid>
									<Grid>
										<Typography variant="h4">
											₱{ getPlanPrice(selectedPlan) }
											<Typography component="span" variant="body1" color="text.secondary">
												/{ billingCycle === 'monthly' ? 'month' : 'year' }
											</Typography>
										</Typography>
										{
											getSavings(selectedPlan) > 0 && (
												<Typography variant="caption" color="success.main">
													Save ₱{getSavings(selectedPlan)} per year
												</Typography>
											)
										}
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Box>
				);
			case 1: // Payment method
				return (
					<>
						<Stack direction={ (isMobile) ? "column" : "row" } spacing={ (isMobile) ? 3 : 8 }>
							<Box sx={{ width: { xs: '100%', md: '30%' } }}>
								<Typography variant="h6" gutterBottom>Payment Method</Typography>
								<RadioGroup
									value={ paymentMethod }
									onChange={(e) => setPaymentMethod(e.target.value)}
									sx={{ mb: { md: 3 } }}
								>
									{/*<FormControlLabel
										value="gcash"
										control={<Radio />}
										label={
										}
									/>*/}
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
										<Box sx={{ width: 40, height: 40, bgcolor: '#006B3D', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
											<Typography variant="body2" color="white" fontWeight="bold">GCash</Typography>
										</Box>
										<Box>
											<Typography>GCash</Typography>
											<Typography variant="body2" color="text.secondary">Pay via GCash mobile app</Typography>
										</Box>
									</Box>
									{/*<FormControlLabel
										disabled
										value="credit"
										control={<Radio />}
										label={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
												<CreditCardIcon sx={{ fontSize: 40 }} />
												<Box>
													<Typography>Credit/Debit Card</Typography>
													<Typography variant="body2" color="text.secondary">
														Visa, Mastercard, or Amex
													</Typography>
												</Box>
											</Box>
										}
									/>
									<FormControlLabel
										disabled
										value="bank"
										control={<Radio />}
										label={
											<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
												<ReceiptIcon sx={{ fontSize: 40 }} />
												<Box>
													<Typography>Bank Transfer</Typography>
													<Typography variant="body2" color="text.secondary">
														Direct bank deposit
													</Typography>
												</Box>
											</Box>
										}
									/>*/}
								</RadioGroup>
							</Box>

							<Divider sx={{ display: { xs: 'block', md: 'none' } }} />

							{
								paymentMethod === 'gcash' && (
									<Box sx={{ p: { md: 1 }, width: { xs: '100%', md: '60%' } }}>
										<Typography sx={{ mb: 3 }}>To pay using GCash, Log in to GCash and scan QR code below.</Typography>
										<Box sx={{ mt: { md: 1 } }}>
											{/*<TextField
												fullWidth
												label="GCash Number"
												value={"09918901532"}
												sx={{ mb: 2 }}
											/>
											<TextField
												fullWidth
												label="Account Name"
												value={"RE** O* C*"}
												sx={{ mb: 2 }}
											/>*/}
											<img
												// src="https://58hpiet7133x.explorer.wasmer.app/?action=file&file=ozms-storage%2Fplan.jpg"
												src={ import.meta.env.VITE_PLAN_IMG_URI }
												alt="QR Code"
												style={{
													width: '250px'
												}}
											/>
										</Box>
									</Box>
								)
							}
						</Stack>
						<Box>
							<Typography gutterBottom sx={{ mt: 2 }} >Upload your receipt here</Typography>
							<TextField
								fullWidth
								type="file"
								inputProps={{ accept: "image/*" }}
								onChange={(e) => setPaymentDetails({...paymentDetails, gcashReceipt: e.target.files[0]})}
								required
								sx={{ mb: 2 }}
								disabled={ paymentDetails.gcashReceipt !== null }
							/>
							<TextField
								fullWidth
								type="email"
								label="Enter Email"
								value={paymentDetails.email}
								sx={{ mb: 2 }}
								onChange={(e) => setPaymentDetails({ ...paymentDetails, email: e.target.value })}
								required
							/>
							<Divider sx={{ mb: 1 }} />
							<Typography sx={{ mb: 1 }} >Personal Information</Typography>
							<Grid container spacing={ 2 } >
								<Grid size={{ xs: 12, sm: 6 }} >
									<TextField
										fullWidth
										label="Enter First Name"
										value={ paymentDetails.firstName }
										onChange={ (e) => setPaymentDetails({ ...paymentDetails, firstName: e.target.value }) }
										required
									/>
								</Grid>
								<Grid size={{ xs: 12, sm: 6 }} >
									<TextField
										fullWidth
										label="Enter Last Name"
										value={ paymentDetails.lastName }
										onChange={ (e) => setPaymentDetails({ ...paymentDetails, lastName: e.target.value }) }
										required
									/>
								</Grid>
								<Grid size={{ xs: 12 }} >
									<TextField
										fullWidth
										label="Enter Department"
										value={ paymentDetails.department }
										onChange={ (e) => setPaymentDetails({ ...paymentDetails, department: e.target.value }) }
										required
									/>
								</Grid>
								<Grid size={{ xs: 12 }} >
									<TextField
										fullWidth
										label="Enter Organization"
										value={ paymentDetails.organization }
										onChange={ (e) => setPaymentDetails({ ...paymentDetails, organization: e.target.value }) }
										required
									/>
								</Grid>
							</Grid>
						</Box>
					</>
				);
			case 2: // Review & confirm
				return (
					<Box>
						<Alert severity="info" sx={{ mb: 3 }}>
							Please review your subscription details before confirming.
						</Alert>

						<Grid container spacing={3}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<Card variant="outlined">
									<CardContent>
										<Typography variant="subtitle2" color="text.secondary" gutterBottom>Plan Details</Typography>
										<Typography variant="h6" color={ plans[selectedPlan].color } gutterBottom>
											{ plans[selectedPlan].name }
										</Typography>
										<Typography variant="h4">
											₱{getPlanPrice(selectedPlan)}
											<Typography component="span" variant="body1" color="text.secondary">
												/{ billingCycle === 'monthly' ? 'month' : 'year' }
											</Typography>
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Billing: {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }} >
								<Card variant="outlined" sx={{ height: '100%' }} >
									<CardContent>
										<Typography variant="subtitle2" color="text.secondary" gutterBottom>
											Payment Method
										</Typography>
										<Typography variant="h6" gutterBottom>
											{ paymentMethod === 'gcash' ? 'GCash' : 
											 paymentMethod === 'credit' ? 'Credit Card' : 'Bank Transfer' }
										</Typography>
										{/*{paymentMethod === 'gcash' && (
											<Typography variant="body2">
												{ paymentDetails.gcashNumber }
											</Typography>
										)}
										{paymentMethod === 'credit' && (
											<Typography variant="body2">
												Card ending in { paymentDetails.cardNumber.slice(-4) }
											</Typography>
										)}*/}
									</CardContent>
								</Card>
							</Grid>
						</Grid>

						<Divider sx={{ my: 3 }} />

						<Typography variant="h6" gutterBottom>Order Summary</Typography>
						<TableContainer component={ Paper } variant="outlined">
							<Table size="small">
								<TableBody>
									<TableRow>
										<TableCell>Plan Subscription</TableCell>
										<TableCell align="right">₱{ getPlanPrice(selectedPlan) }</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Billing Cycle</TableCell>
										<TableCell align="right">
											{ billingCycle === 'monthly' ? 'Monthly' : 'Yearly' }
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				);
			default: return null;
		}
	};

	const MotionCard = motion.create(Card);

	return (
		<Container maxWidth="xl">
			<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography
					variant={ ( isMobile ) ? "h5" : "h4" }
					gutterBottom
					py={ 3 }
				>
					OrganiZerving Administrator Plans
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<IconButton size="large" onClick={()=>navigate('/')}>
						<HomeIcon sx={{ fontSize: '2rem' }} />
					</IconButton>
				</Box>
			</Box>

			<Grid 
				container 
				spacing={3} 
				sx={{ mb: 4, disply: 'flex', justifyContent: 'center' }}
			>
				{
					Object.entries(plans).map(([key, plan]) => (
						<Grid size={{ xs: 12, md: 3 }} key={ key }>
							<MotionCard
								whileHover={{ y: -8 }}
								sx={{
									height: '500px',
									display: 'flex',
									flexDirection: 'column',
									border: ( selectedPlan === key ) ? `2px solid ${ plan.color }` : '1px solid #e0e0e0',
									position: 'relative',
									overflow: 'visible',
								}}
							>
								{/*plan.popular && (
									<Chip
										label="MOST POPULAR"
										color="primary"
										size="small"
										sx={{
											position: 'absolute',
											top: -10,
											left: '50%',
											transform: 'translateX(-50%)',
											zIndex: 1,
										}}
									/>
								)*/}
								
								<CardContent sx={{ flexGrow: 1, pt: plan.popular ? 4 : 2 }}>
									<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
										<Avatar sx={{ bgcolor: `${plan.color}20`, color: plan.color, mr: 2 }}>
											{plan.icon}
										</Avatar>
										<Box>
											<Typography variant="h5" fontWeight="bold" color={plan.color}>
												{plan.name}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{plan.custom ? 'Custom Solution' : 'Standard Plan'}
											</Typography>
										</Box>
									</Box>

									<Box sx={{ mb: 3 }}>
										<Typography variant="h3" component="div" sx={{ color: plan.color }}>
											₱{plan.price}
											<Typography component="span" variant="h6" color="text.secondary">
												/month
											</Typography>
										</Typography>
										{plan.price > 0 && (
											<Typography variant="body2" color="text.secondary">
												Yearly: ₱{plan.yearlyPrice}/year
											</Typography>
										)}
									</Box>

									<List dense disablePadding>
										{plan.features.slice(0, 6).map((feature, index) => (
											<ListItem key={index} disablePadding sx={{ mb: 1 }}>
												<ListItemIcon sx={{ minWidth: 36 }}>
													{feature.included ? (
														<CheckIcon sx={{ color: plan.color }} />
													) : (
														<CancelIcon color="disabled" />
													)}
												</ListItemIcon>
												<ListItemText
													primary={feature.text}
													primaryTypographyProps={{
														variant: 'body2',
														color: feature.included ? 'text.primary' : 'text.disabled',
													}}
												/>
											</ListItem>
										))}
									</List>
								</CardContent>

								<CardActions sx={{ p: 2, pt: 0 }}>
									<Button
										fullWidth
										variant={selectedPlan === key ? 'contained' : 'outlined'}
										sx={{
											bgcolor: selectedPlan === key ? plan.color : 'transparent',
											color: selectedPlan === key ? 'white' : plan.color,
											borderColor: plan.color,
											'&:hover': {
												bgcolor: selectedPlan === key ? plan.color : `${plan.color}10`,
											},
										}}
										onClick={() => handlePlanSelect(key)}
										disabled={ applied }
									>
										{ applied ? 'Current Plan' : 'Apply Plan' }
									</Button>
								</CardActions>
							</MotionCard>
						</Grid>
					))
				}
			</Grid>

			{/* Payment Dialog */}
			<Dialog 
				open={ openPaymentDialog } 
				onClose={
					() => {
						setOpenPaymentDialog(false);
						setPaymentDetails(paymentDetailsValue);
					}
				} 
				maxWidth="sm" 
				fullWidth
			>
				<DialogTitle>
					Apply to { plans[selectedPlan].name }
					<Stepper activeStep={ paymentStep } sx={{ mt: 2 }}>
						<Step>
							<StepLabel>Plan</StepLabel>
						</Step>
						<Step>
							<StepLabel>Payment</StepLabel>
						</Step>
						<Step>
							<StepLabel>Confirm</StepLabel>
						</Step>
					</Stepper>
				</DialogTitle>
				<DialogContent>
					{ renderPaymentStep(paymentStep) }
				</DialogContent>
				<DialogActions>
					<Button onClick={ handleBackStep } disabled={ paymentStep === 0 }>Back</Button>
					<Button
						variant="contained"
						onClick={ paymentStep === 2 ? handlePaymentSubmit : handleNextStep }
						disabled={
							(paymentStep === 1 && paymentMethod === 'gcash' && 
							(!paymentDetails.gcashReceipt || !paymentDetails.email)) ||
							(paymentStep === 2 && loading)
						}
						loading={ loading }
						loadingPosition="start"
					>
						{ paymentStep === 2 ? 'Confirm & Pay' : 'Next' }
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default Plans;
