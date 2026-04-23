import React, { useState, useEffect } from 'react';
import {
	Paper,
	Typography,
	Grid,
	Box,
	TextField,
	Button,
	Avatar,
	Divider,
	Alert,
	Tab,
	Tabs,
	Card,
	CardContent,
	IconButton,
	Switch,
	FormControlLabel,
	InputAdornment,
	CircularProgress,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
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
	LinearProgress,
	useTheme,
	useMediaQuery
} from '@mui/material';
import {
	Edit as EditIcon,
	Save as SaveIcon,
	Cancel as CancelIcon,
	Person as PersonIcon,
	Lock as LockIcon,
	Notifications as NotificationsIcon,
	Security as SecurityIcon,
	PhotoCamera as PhotoCameraIcon,
	Visibility as VisibilityIcon,
	VisibilityOff as VisibilityOffIcon,
	AdminPanelSettings as AdminIcon,
	History as HistoryIcon,
	Devices as DevicesIcon,
	AccountBalanceWallet as BillIcon,
	CheckCircle as CheckCircleIcon,
	CalendarMonth as CalendarIcon,
	TrendingUp as TrendingUpIcon,
	AccountBalance as AccountBalanceIcon,
	CreditCard as CreditCardIcon,
	QrCode as QrCodeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchAPI, emailSend } from '../../services/api';
import { generateOTP } from '../../services/helpers';

const AdminProfileSettings = () => 
{
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const token = localStorage.getItem("token");
	const navigate = useNavigate();
	
	const { user, logout, setUser } = useAuth();

	const [loading, setLoading] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const [isEditing, setIsEditing] = useState(false);
	const [message, setMessage] = useState({ type: '', text: '' });
	const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false);
	const [dialogOTPOpen, setDialogOTPOpen] = useState(false);
	const [currentSubscription, setCurrentSubscription] = useState(null);
	const [openCancelSubscriptionDialog, setOpenCancelSubscriptionDialog] = useState(false);
	const [loadingCancelSubscription, setLoadingCancelSubscription] = useState(false);
	const [cancelPlanReason, setCancelPlanReason] = useState('');

	const [otp, setOTP] = useState({
		value: '',
		correct: false
	});
	
	// Profile Data
	const [profileData, setProfileData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		position: '',
		department: '',
		phone: '',
		officeLocation: '',
		// bio: '',
		profilePicture: '',
	});
	
	// Account Settings
	const [accountSettings, setAccountSettings] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
		showPassword: false,
		showNewPassword: false,
	});

	/*
	// Admin-specific settings
	const [adminSettings, setAdminSettings] = useState({
		systemNotifications: true,
		userRegistrationAlerts: true,
		paymentApprovalAlerts: true,
		eventApprovalAlerts: true,
		reportGeneration: true,
		autoLogout: false,
		auditLogs: true,
		backupNotifications: true,
	});
	
	// Security Settings
	const [securitySettings, setSecuritySettings] = useState({
		twoFactorAuth: true,
		loginAlerts: true,
		sessionTimeout: 15,
		ipWhitelist: '',
		requireAdminApproval: false,
		failedLoginLockout: true,
		passwordHistory: 5,
	});

	// Activity Logs
	const [activityLogs, setActivityLogs] = useState([
		{ id: 1, action: 'Logged in', timestamp: '2024-04-10 09:30:15', ip: '192.168.1.100', device: 'Chrome on Windows' },
		{ id: 2, action: 'Approved event registration', timestamp: '2024-04-10 10:15:22', ip: '192.168.1.100', device: 'Chrome on Windows' },
		{ id: 3, action: 'Updated system settings', timestamp: '2024-04-10 11:45:30', ip: '192.168.1.100', device: 'Chrome on Windows' },
		{ id: 4, action: 'Logged in', timestamp: '2024-04-09 14:20:45', ip: '192.168.1.150', device: 'Safari on Mac' },
		{ id: 5, action: 'Deleted user account', timestamp: '2024-04-09 15:30:10', ip: '192.168.1.150', device: 'Safari on Mac' },
	]);

	// Active Sessions
	const [activeSessions, setActiveSessions] = useState([
		{ id: 1, device: 'Chrome on Windows', ip: '192.168.1.100', location: 'Manila, PH', lastActive: '2 minutes ago', current: true },
		{ id: 2, device: 'Safari on iPhone', ip: '103.45.67.89', location: 'Quezon City, PH', lastActive: '5 hours ago', current: false },
	]);
	*/

	useEffect(() => {
		if (user) {
			// const nameParts = user.name?.split(' ') || ['', ''];
			setProfileData({
				// firstName: nameParts[0] || '',
				// lastName: nameParts.slice(1).join(' ') || '',
				firstName: user.first_name,
				lastName: user.last_name,
				email: user.email || '',
				position: 'Administrator',
				department: user.department,
				phone: user.phone || '',
				officeLocation: user.location,
				// bio: 'System administrator for OrganiZerving Management System',
				profilePicture: user.profile,
			});
		}
		async function fetchDatas() {
			try {
				const billingDatas = await fetchAPI(`/plan/get/${ user.email }`, "GET");
				setCurrentSubscription(( billingDatas.data.cause ) ? null : JSON.parse(atob(billingDatas.data.plan)));
			} catch (e) {
				console.error(e);
				alert("Unable to load your billing datas.\nPlease email <catucod.renatojr@gmail.com> for support.");
			}
		}
		fetchDatas();
	}, [user]);

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	const handleProfileChange = (e) => {
		const { name, value } = e.target;
		setProfileData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleAccountChange = (e) => {
		const { name, value } = e.target;
		setAccountSettings(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleAdminSettingChange = (name) => (event) => {
		setAdminSettings(prev => ({
			...prev,
			[name]: event.target.checked
		}));
	};

	const handleSecurityChange = (name) => (event) => {
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
		setSecuritySettings(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSaveProfile = async () => {
		setLoading(true);
		setMessage({ type: '', text: '' });
		// Validate required fields
		if (!profileData.firstName || !profileData.lastName || !profileData.email) {
			setMessage({ type: 'error', text: 'Please fill in all required fields' });
			setLoading(false);
			return;
		}
		try {
			// const token = localStorage.getItem("token");
			const data = {
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				phone: profileData.phone,
				department: profileData.department,
				location: profileData.officeLocation
			};
			const response = await fetchAPI(`/admin/update/${ user.token }`, "PUT", data);
			setMessage({ type: 'success', text: 'Profile updated successfully!' });
		} catch (e) {
			console.error(e);
			setMessage({ type: 'error', text: 'Error occured while saving data, please try again.' });
		} finally {
			setIsEditing(false);
			setLoading(false);
		}
	};

	const handleChangePassword = async () => {
		setLoading(true);
		setMessage({ type: '', text: '' });
		// Validate passwords
		if (!accountSettings.currentPassword || !accountSettings.newPassword || !accountSettings.confirmPassword) {
			setMessage({ type: 'error', text: 'Please fill in all password fields' });
			setLoading(false);
			return;
		}
		if (accountSettings.newPassword.length < 8) {
			setMessage({ type: 'error', text: 'New password must be at least 8 characters' });
			setLoading(false);
			return;
		}
		if (accountSettings.newPassword !== accountSettings.confirmPassword) {
			setMessage({ type: 'error', text: 'Passwords do not match' });
			setLoading(false);
			return;
		}
		// update password
		try {
			// const token = localStorage.getItem("token");
			const data = {
				currentPassword: accountSettings.currentPassword,
				password: accountSettings.newPassword
				// password_confirmation: accountSettings.confirmPassword
			};
			await fetchAPI(`/admin/update/${ user.token }`, "PUT", data);
			setMessage({ type: 'success', text: 'Password changed successfully!' });
			setAccountSettings({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
				showPassword: false,
				showNewPassword: false,
			});
		} catch (e) {
			console.error(e);
			setMessage({ type: 'error', text: 'Error occured while changing your password, try again.' });
		} finally {
			setLoading(false);
		}
	};

	const handleProfilePictureChange = async (event) =>
	{
		const file = event.target.files[0];
		if (file) {
			if (file.size > 5242880) {
				setMessage({ type: 'error', text: 'File size must be less than 5MB' });
				return;
			}
			// const reader = new FileReader();
			// reader.readAsDataURL(file);
			// reader.onload = async (e) => {
			// 	if (!user.token) {
			// 		console.log("No token is present");
			// 		return;
			// 	}
			// 	try {
			// 		// const token = localStorage.getItem("token");
			// 		const data = { profile: e.target.result };
			// 		await fetchAPI(`/admin/update/${ user.token }`, "PUT", data);
			// 		setProfileData(prev => ({
			// 			...prev,
			// 			profilePicture: e.target.result
			// 		}));
			// 		setMessage({ type: 'success', text: 'Profile picture has been updated.' });
			// 	} catch (err) {
			// 		console.error(err);
			// 		setMessage({ type: 'error', text: 'Could not upload profile picture, please try again.' });
			// 	} finally {
			// 		location.reload(); //< this fixed temporary CORS error (idk y)
			// 		navigate("/admin/profile");
			// 	}
			// };
			try {
				const formData = new FormData();
				formData.append("profile", file);
				await fetch(`${ API_BASE_URL }/admin/update/${ user.token }`, { method: "POST", body: formData });
				const adminData = await fetchAPI(`/admin/get/${ user.token }`, "GET");
				setProfileData(prev => ({
					...prev,
					profilePicture: adminData.data.profile
				}));
				setUser(prev => ({ ...prev, profile: adminData.data.profile }));
				setMessage({ type: 'success', text: 'Profile picture has been updated.' });
			} catch (e) {
				console.log(e);
				setMessage({ type: 'error', text: 'Could not upload profile picture, please try again.' });
			}
		}
	}

	const togglePasswordVisibility = (field) => {
		setAccountSettings(prev => ({
			...prev,
			[field]: !prev[field]
		}));
	};

	const terminateSession = (sessionId) => {
		setActiveSessions(activeSessions.filter(session => session.id !== sessionId));
		setMessage({ type: 'success', text: 'Session terminated successfully!' });
	};

	const terminateAllSessions = () => {
		setActiveSessions([]);
		setMessage({ type: 'success', text: 'All other sessions terminated!' });
	};

	const handleDialogOpen = (dialog) => {
		async function otpSend() {
			try {
				const newOTP = generateOTP();
				sessionStorage.setItem("otp", btoa(newOTP));
				await emailSend(null, user.email, "OZMS OTP", "OZMS One Time Password", `${newOTP}`);
			} catch (e) {
				console.error(e);
			}
		}
		switch (dialog) {
			case "delete_account":
				setDialogDeleteOpen(true);
				break;
			case "otp":
				otpSend();
				setDialogOTPOpen(true);
				break;
			default: break;
		}
	}

	const handleDialogClose = (dialog) => {
		switch (dialog) {
			case "delete_account":
				setDialogDeleteOpen(false);
				break;
			case "otp":
				setOTP({ value: '', correct: false });
				setDialogOTPOpen(false);
				break;
			default: break;
		}
	}

	const handleDialogConfirm = (dialog) => {
		async function deleteAccount() {
			try {
				await fetchAPI(`/admin/delete/${token}`, "DELETE");
				localStorage.removeItem("token");
				localStorage.removeItem("otp");
				navigate("/");
			} catch (e) {
				console.error(e);
			}
		}
		switch (dialog) {
			case "delete_confirm":
				deleteAccount();
				break;
		}
	}

	const handleCancelSubscription = async () => {
		try {
			await emailSend(user.email, null, "OZMS Cancelation of Admin Plan", `${ user.first_name } Cancelled his/her billing plan.`, `
				<strong>Name:</strong> ${ user.first_name } ${ user.last_name } ${ user.suffix || '' } <br/>
				<strong>Department:</strong> ${ user.department } <br/>
				<strong>Organization:</strong> ${ user.organization } <br/>
				<strong>What:</strong> Cancellation of Plan "${ currentSubscription.plan }" <br/>
				<strong>Why:</strong> "${ cancelPlanReason }" <br/><br/>
				<strong>Cancellation Date:</strong> ${ new Date().toDateString() } ${ new Date().toTimeString() } <br/>
				<strong>Date Applied:</strong> ${ new Date(user.created_at).toISOString() }
			`);
			localStorage.removeItem(btoa("plan_applied"));
			alert("Your request has been sent.\nThank you for using OrganiZerving.");
			setOpenCancelSubscriptionDialog(false);
			logout();
			navigate("/");
		} catch (e) {
			console.error(e);
			alert("Unable to process bill cancelation.\nPlease try again.");
		}
	}

	const daysUntilBilling = () => {
        const today = new Date();
        const nextBilling = new Date(currentSubscription?.nextBilling);
        const diffTime = nextBilling - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

	const renderProfileTab = () => (
		<Box>
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
				<Box sx={{ position: 'relative', mr: 3 }}>
					<Avatar
						src={ profileData.profilePicture }
						sx={{ width: { xs: 75, md: 120 }, height: { xs: 75, md: 120 } }}
					/>
					<input
						accept="image/*"
						style={{ display: 'none' }}
						id="profile-picture-upload"
						type="file"
						onChange={ handleProfilePictureChange }
					/>
					<label htmlFor="profile-picture-upload">
						<IconButton
							component="span"
							sx={{
								position: 'absolute',
								bottom: 0,
								right: 0,
								bgcolor: 'background.paper',
								boxShadow: 2,
								'&:hover': {
									bgcolor: 'background.default',
								},
							}}
						>
							<PhotoCameraIcon />
						</IconButton>
					</label>
				</Box>
				<Box>
					<Box sx={{ display: 'flex', alignItems: { xs: 'left', md: 'center' }, gap: 1, mb: 1, flexDirection: { xs: 'column', md: 'row' } }}>
						<Typography variant="h6">
							{ profileData.firstName } { profileData.lastName }
						</Typography>
						<Chip 
							icon={<AdminIcon />} 
							label="Administrator" 
							size="small" 
							color="primary" 
						/>
					</Box>
					<Typography variant="body2" color="text.secondary">
						{ profileData.position }
					</Typography>
					<Typography variant="caption" color="text.secondary" display="block">
						{ profileData.department } • { profileData.officeLocation }
					</Typography>
				</Box>
			</Box>

			<Grid container spacing={3}>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="First Name"
						name="firstName"
						value={profileData.firstName}
						onChange={handleProfileChange}
						disabled={!isEditing}
						required
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Last Name"
						name="lastName"
						value={profileData.lastName}
						onChange={handleProfileChange}
						disabled={!isEditing}
						required
					/>
				</Grid>
				
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Email"
						name="email"
						type="email"
						value={profileData.email}
						onChange={handleProfileChange}
						// disabled={!isEditing}
						disabled
						required
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Phone Number"
						name="phone"
						value={profileData.phone}
						onChange={handleProfileChange}
						disabled={!isEditing}
						placeholder="+63 912 345 6789"
					/>
				</Grid>
				
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Position"
						name="position"
						value={profileData.position}
						onChange={handleProfileChange}
						// disabled={!isEditing}
						disabled
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Department"
						name="department"
						value={profileData.department}
						onChange={handleProfileChange}
						disabled={!isEditing}
					/>
				</Grid>
				
				<Grid size={{ xs: 12 }}>
					<TextField
						fullWidth
						label="Office Location"
						name="officeLocation"
						value={profileData.officeLocation}
						onChange={handleProfileChange}
						disabled={!isEditing}
					/>
				</Grid>
			</Grid>

			<Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
				{isEditing ? (
					<>
						<Button
							variant="outlined"
							startIcon={ (isMobile) ? null : <CancelIcon /> }
							onClick={() => setIsEditing(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							startIcon={loading ? <CircularProgress size={20} /> : (isMobile) ? null : <SaveIcon /> }
							onClick={handleSaveProfile}
							disabled={loading}
						>
							Save Changes
						</Button>
					</>
				) : (
					<Button
						variant="contained"
						startIcon={ <EditIcon /> }
						onClick={() => setIsEditing(true)}
					>
						Edit Profile
					</Button>
				)}
			</Box>
		</Box>
	);

	const renderAccountTab = () => (
		<Box>
			<Typography variant="h6" gutterBottom>
				Change Password
			</Typography>
			
			<Grid container spacing={3}>
				<Grid size={{ xs: 12 }}>
					<TextField
						fullWidth
						label="Current Password"
						name="currentPassword"
						type={accountSettings.showPassword ? 'text' : 'password'}
						value={accountSettings.currentPassword}
						onChange={handleAccountChange}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => togglePasswordVisibility('showPassword')}
										edge="end"
									>
										{accountSettings.showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Grid>
				
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="New Password"
						name="newPassword"
						type={accountSettings.showNewPassword ? 'text' : 'password'}
						value={accountSettings.newPassword}
						onChange={handleAccountChange}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => togglePasswordVisibility('showNewPassword')}
										edge="end"
									>
										{accountSettings.showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
									</IconButton>
								</InputAdornment>
							),
						}}
						helperText="At least 8 characters with uppercase, lowercase, and numbers"
					/>
				</Grid>
				
				<Grid size={{ xs: 12, sm: 6 }}>
					<TextField
						fullWidth
						label="Confirm New Password"
						name="confirmPassword"
						type={accountSettings.showNewPassword ? 'text' : 'password'}
						value={accountSettings.confirmPassword}
						onChange={handleAccountChange}
						error={accountSettings.newPassword !== accountSettings.confirmPassword}
						helperText={accountSettings.newPassword !== accountSettings.confirmPassword ? 'Passwords do not match' : ''}
					/>
				</Grid>
			</Grid>
			
			<Box sx={{ mt: 4 }}>
				<Button
					variant="contained"
					startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
					onClick={handleChangePassword}
					disabled={loading || !accountSettings.currentPassword || !accountSettings.newPassword || !accountSettings.confirmPassword}
				>
					Change Password
				</Button>
			</Box>
			
			{
				( user.role === "student" ) && (
					<>
						<Divider sx={{ my: 4 }} />
						<Typography variant="h6" gutterBottom>Account Actions</Typography>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, sm: 12 }}>
								<Card variant="outlined" sx={{ borderColor: 'error.main' }}>
									<CardContent>
										<Typography variant="subtitle2" gutterBottom color="error">
											Delete Account
										</Typography>
										<Typography variant="body2" color="text.secondary" paragraph>
											Permanently delete your account and all associated data.
										</Typography>
										<Button variant="outlined" color="error" size="small" onClick={ () => handleDialogOpen("delete_account") }>
											Delete Account
										</Button>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</>
				)
			}
		</Box>
	);

	const renderBillingTab = () => (
		<Box>
            {/* Current Plan Section */}
            <Card sx={{ mb: 4, bgcolor: ( localStorage.getItem("context") === 'theme.dark' ) ? "primary.dark" : 'primary.light' , color: 'white' }} >
                <CardContent>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h6" gutterBottom>Current Plan</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h3" fontWeight="bold">
                                    { currentSubscription?.plan.charAt(0).toUpperCase() + currentSubscription?.plan.slice(1) || 'No Data' }
                                </Typography>
                                <Chip 
									icon={ ( currentSubscription?.status === "active" ) ? <CheckCircleIcon /> : <CancelIcon /> }
                                    label={ currentSubscription?.status.toUpperCase() } 
                                    color={ ( currentSubscription?.status === "active" ) ? "sucess" : "error" }
                                    sx={{ bgcolor: ( localStorage.getItem("context") === 'theme.dark' ) ? "black" : "white" , fontWeight: 'bold' }}
                                />
                            </Box>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                ₱{ currentSubscription?.price }/{ currentSubscription?.billingCycle === 'yearly' ? 'year' : 'month' }
                            </Typography>
                        </Grid>
                        <Grid item>
                            {/*
                            	currentSubscription.plan !== 'premium' && currentSubscription.status === 'active' && (
	                                <Button 
	                                    variant="contained" 
	                                    sx={{ bgcolor: 'white', color: 'primary.main' }}
	                                    onClick={() => setOpenUpgradeDialog(true)}
	                                >
	                                    Upgrade Plan
	                                </Button>
	                            )
                            */}
                            {
                            	currentSubscription?.status === 'active' && (
	                                <Button 
	                                    variant="outlined" 
	                                    sx={{ borderColor: 'white', color: 'white', ml: 2 }}
	                                    onClick={ () => setOpenCancelSubscriptionDialog(true) }
	                                >
	                                    Cancel Subscription
	                                </Button>
	                            )
                            }
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Billing Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                    <Card sx={{ height: '100%' }} >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CalendarIcon sx={{ color: 'primary.main', mr: 1 }} />
                                <Typography color="text.secondary">Next Billing Date</Typography>
                            </Box>
                            <Typography variant="h5" fontWeight="bold">
                                { currentSubscription?.nextBilling }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                { daysUntilBilling() } days remaining
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={ (30 - daysUntilBilling()) / 30 * 100 } 
                                sx={{ mt: 2, height: 8, borderRadius: 4 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/*<Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PaymentIcon sx={{ color: 'primary.main', mr: 1 }} />
                                <Typography color="text.secondary">Total Spent</Typography>
                            </Box>
                            <Typography variant="h5" fontWeight="bold">
                                ₱{ billingHistory.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0) }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Since { currentSubscription.startDate }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>*/}

                <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                    <Card sx={{ height: '100%' }} >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
                                <Typography color="text.secondary">Billing Cycle</Typography>
                            </Box>
                            <Typography variant="h5" fontWeight="bold" textTransform="capitalize">
                                { currentSubscription?.billingCycle }
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                { currentSubscription?.billingCycle === 'yearly' ? 'Annual savings: 16%' : 'Cancel anytime' }
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }} >
                    <Card sx={{ height: '100%' }} >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AccountBalanceIcon sx={{ color: 'primary.main', mr: 1 }} />
                                <Typography color="text.secondary">Payment Method</Typography>
                            </Box>
                            <Typography variant="h5" fontWeight="bold">GCash</Typography>
                            {/*<Typography variant="body2" color="text.secondary">
                                ********0912
                            </Typography>*/}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Feature Comparison */}
            {/*<Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 3 }}>Plan Features Comparison</Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell>Features</TableCell>
                            <TableCell align="center">Free</TableCell>
                            <TableCell align="center">Professional</TableCell>
                            <TableCell align="center">Premium</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(plans).map((planKey) => (
                            <React.Fragment key={planKey}>
                                {plans[planKey].features.map((feature, idx) => (
                                    <TableRow key={`${planKey}-${idx}`}>
                                        {idx === 0 && (
                                            <TableCell rowSpan={plans[planKey].features.length}>
                                                <Typography fontWeight="bold">{plans[planKey].name}</Typography>
                                            </TableCell>
                                        )}
                                        <TableCell align="center">
                                            <CheckCircleIcon sx={{ color: 'success.main' }} />
                                        </TableCell>
                                        <TableCell align="center">
                                            {planKey !== 'free' ? (
                                                <CheckCircleIcon sx={{ color: 'success.main' }} />
                                            ) : (
                                                <CancelIcon color="disabled" />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {planKey === 'premium' ? (
                                                <CheckCircleIcon sx={{ color: 'success.main' }} />
                                            ) : (
                                                <CancelIcon color="disabled" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>*/}

            {/* Billing History */}
            {/*<Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 3 }}>
                <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Billing History
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Invoice</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {billingHistory.map((bill) => (
                            <TableRow key={bill.id}>
                                <TableCell>{bill.date}</TableCell>
                                <TableCell>{bill.description}</TableCell>
                                <TableCell align="right">₱{bill.amount}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={bill.status} 
                                        color={bill.status === 'paid' ? 'success' : 'warning'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{bill.invoice}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Download Invoice">
                                        <IconButton size="small">
                                            <DownloadIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>*/}

            {/* Payment Method Section */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 3 }}>
                <CreditCardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Payment Methods
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }} >
                    <Card variant="outlined" sx={{ borderColor: 'success.main' }} >
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#006B3D' }}>
                                        <QrCodeIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">GCash</Typography>
                                        {/*<Typography variant="body2" color="text.secondary">
                                            ••••••••••••0912
                                        </Typography>*/}
                                    </Box>
                                </Box>
                                <Chip label="Default" color="success" size="small" />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                {/*<Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'grey.600' }}>
                                        <CreditCardIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">Credit Card</Typography>
                                        <Typography variant="body2" color="text.secondary">Not added yet</Typography>
                                    </Box>
                                </Box>
                                <Button size="small" variant="outlined">Add</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>*/}
            </Grid>

            {/* Upgrade Dialog */}
            {/*<Dialog
				open={ openUpgradeDialog }
				onClose={ () => setOpenUpgradeDialog(false) }
				maxWidth="md"
				fullWidth
	       	>
                <DialogTitle>
                    <Typography variant="h5">Upgrade Your Plan</Typography>
                    <Typography variant="body2" color="text.secondary">Choose the perfect plan for your needs</Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {Object.entries(plans).filter(([key]) => key !== currentSubscription.plan && key !== 'free').map(([key, plan]) => (
                            <Grid item xs={12} md={6} key={key}>
                                <MotionCard
                                    whileHover={{ y: -4 }}
                                    sx={{ cursor: 'pointer', height: '100%' }}
                                    onClick={() => handleUpgradeClick(key)}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" fontWeight="bold" color={plan.color}>
                                                {plan.name}
                                            </Typography>
                                            {key === 'premium' && (
                                                <Chip label="Best Value" color="primary" size="small" />
                                            )}
                                        </Box>
                                        <Typography variant="h4" fontWeight="bold" color={plan.color}>
                                            ₱{plan.price}
                                            <Typography component="span" variant="body2" color="text.secondary">
                                                /month
                                            </Typography>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            or ₱{plan.yearlyPrice}/year (save 16%)
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                        {plan.features.slice(0, 4).map((feature, idx) => (
                                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                                <Typography variant="body2">{feature}</Typography>
                                            </Box>
                                        ))}
                                    </CardContent>
                                </MotionCard>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUpgradeDialog(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>*/}

            {/* Payment Dialog */}
            {/*<Dialog 
            	open={ openPaymentDialog } 
	            onClose={ () => setOpenPaymentDialog(false) } 
	            maxWidth="md" 
	            fullWidth
	        >
                <DialogTitle>
                    Complete Payment for {selectedPlan && plans[selectedPlan]?.name}
                </DialogTitle>
                <DialogContent>
                    <Stepper activeStep={paymentStep} sx={{ mb: 3, mt: 2 }}>
                        <Step><StepLabel>Plan & Billing</StepLabel></Step>
                        <Step><StepLabel>Payment Method</StepLabel></Step>
                        <Step><StepLabel>Confirm</StepLabel></Step>
                    </Stepper>

                    {paymentStep === 0 && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>Select Billing Cycle</Typography>
                            <RadioGroup value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
                                <FormControlLabel 
                                    value="monthly" 
                                    control={<Radio />} 
                                    label={
                                        <Box>
                                            <Typography>Monthly Billing</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ₱{selectedPlan && plans[selectedPlan]?.monthlyPrice}/month
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <FormControlLabel 
                                    value="yearly" 
                                    control={<Radio />} 
                                    label={
                                        <Box>
                                            <Typography>Yearly Billing</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                ₱{selectedPlan && plans[selectedPlan]?.yearlyPrice}/year (Save 16%)
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </RadioGroup>
                        </Box>
                    )}

                    {paymentStep === 1 && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>Select Payment Method</Typography>
                            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <FormControlLabel 
                                    value="gcash" 
                                    control={<Radio />} 
                                    label="GCash"
                                />
                                <FormControlLabel 
                                    value="card" 
                                    control={<Radio />} 
                                    label="Credit/Debit Card"
                                />
                            </RadioGroup>

                            {paymentMethod === 'gcash' && (
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="GCash Number"
                                        value={paymentDetails.gcashNumber}
                                        onChange={(e) => setPaymentDetails({...paymentDetails, gcashNumber: e.target.value})}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Account Name"
                                        value={paymentDetails.gcashName}
                                        onChange={(e) => setPaymentDetails({...paymentDetails, gcashName: e.target.value})}
                                    />
                                </Box>
                            )}

                            {paymentMethod === 'card' && (
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Card Number"
                                        value={paymentDetails.cardNumber}
                                        onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Cardholder Name"
                                        value={paymentDetails.cardName}
                                        onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
                                        sx={{ mb: 2 }}
                                    />
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="Expiry Date"
                                                placeholder="MM/YY"
                                                value={paymentDetails.expiry}
                                                onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="CVV"
                                                type="password"
                                                value={paymentDetails.cvv}
                                                onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Box>
                    )}

                    {paymentStep === 2 && (
                        <Box>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Please review your order summary
                            </Alert>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Plan</Typography>
                                        <Typography fontWeight="bold">{selectedPlan && plans[selectedPlan]?.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Billing Cycle</Typography>
                                        <Typography fontWeight="bold" textTransform="capitalize">{billingCycle}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                        <Typography>₱{selectedPlan && (billingCycle === 'yearly' ? plans[selectedPlan]?.yearlyPrice : plans[selectedPlan]?.monthlyPrice)}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">VAT (12%)</Typography>
                                        <Typography>₱{selectedPlan && ((billingCycle === 'yearly' ? plans[selectedPlan]?.yearlyPrice : plans[selectedPlan]?.monthlyPrice) * 0.12).toFixed(2)}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle2">Total</Typography>
                                        <Typography variant="h6" color="primary">₱{selectedPlan && ((billingCycle === 'yearly' ? plans[selectedPlan]?.yearlyPrice : plans[selectedPlan]?.monthlyPrice) * 1.12).toFixed(2)}</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => paymentStep === 0 ? setOpenPaymentDialog(false) : setPaymentStep(paymentStep - 1)}>
                        {paymentStep === 0 ? 'Cancel' : 'Back'}
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={paymentStep === 2 ? handlePaymentSubmit : () => setPaymentStep(paymentStep + 1)}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : paymentStep === 2 ? 'Confirm Payment' : 'Continue'}
                    </Button>
                </DialogActions>
            </Dialog>*/}

            {/* Cancel Subscription Dialog */}
            <Dialog
            	open={ openCancelSubscriptionDialog }
            	onClose={ () => setOpenCancelSubscriptionDialog(false) }
            	maxWidth="sm"
            	fullWidt
            >
                <DialogTitle>
                    <Typography variant="h5" color="error">Cancel Subscription</Typography>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>Are you sure you want to cancel your subscription?</Alert>
                    <Typography variant="body2" paragraph>If you cancel your subscription:</Typography>
                    <ul style={{ marginLeft: '15px' }} >
                        <li><Typography variant="body2">You will lose access to the features</Typography></li>
                        <li><Typography variant="body2">Your data will be preserved for 30 days</Typography></li>
                        <li><Typography variant="body2">You can reactivate anytime</Typography></li>
                        <li><Typography variant="body2">No refunds for partial billing periods</Typography></li>
                    </ul>
                    <TextField
                        fullWidth
                        label="Reason for cancellation (optional)"
                        multiline
                        rows={3}
                        placeholder="Help us improve by telling us why you're leaving..."
                        sx={{ mt: 2 }}
                        value={ cancelPlanReason }
                        onChange={ (e) => setCancelPlanReason(e.target.value) }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => setOpenCancelSubscriptionDialog(false) } >Keep Subscription</Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={ handleCancelSubscription }
                        disabled={ loadingCancelSubscription }
                    >
                        { loadingCancelSubscription ? 'Processing...' : 'Yes, Cancel Subscription' }
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
	)

	/*
	const renderAdminSettingsTab = () => (
		<Box>
			<Typography variant="h6" gutterBottom>
				Administrator Settings
			</Typography>
			
			<Grid container spacing={3}>
				<Grid size={{ xs: 12 }}>
					<Card variant="outlined">
						<CardContent>
							<Typography variant="subtitle2" gutterBottom>
								System Notifications
							</Typography>
							<FormControlLabel
								control={
									<Switch
										checked={adminSettings.systemNotifications}
										onChange={handleAdminSettingChange('systemNotifications')}
									/>
								}
								label="System-wide notifications"
							/>
							<br />
							<FormControlLabel
								control={
									<Switch
										checked={adminSettings.userRegistrationAlerts}
										onChange={handleAdminSettingChange('userRegistrationAlerts')}
									/>
								}
								label="New user registration alerts"
							/>
							<br />
							<FormControlLabel
								control={
									<Switch
										checked={adminSettings.paymentApprovalAlerts}
										onChange={handleAdminSettingChange('paymentApprovalAlerts')}
									/>
								}
								label="Payment approval alerts"
							/>
							<br />
							<FormControlLabel
								control={
									<Switch
										checked={adminSettings.eventApprovalAlerts}
										onChange={handleAdminSettingChange('eventApprovalAlerts')}
									/>
								}
								label="Event approval alerts"
							/>
						</CardContent>
					</Card>
				</Grid>
				
				<Grid size={{ xs: 12 }}>
					<Card variant="outlined">
						<CardContent>
							<Typography variant="subtitle2" gutterBottom>
								System Preferences
							</Typography>
							<FormControlLabel
								control={
									<Switch
										checked={adminSettings.reportGeneration}
										onChange={handleAdminSettingChange('reportGeneration')}
									/>
								}
								label="Auto-generate daily reports"
							/>
							<br />
							<FormControlLabel
								control={
									<Switch
										checked={adminSettings.autoLogout}
										onChange={handleAdminSettingChange('autoLogout')}
									/>
								}
								label="Auto-logout after system maintenance"
							/>
							<br />
							<FormControlLabel
								control={
									<Switch
										checked={adminSettings.auditLogs}
										onChange={handleAdminSettingChange('auditLogs')}
									/>
								}
								label="Enable audit logs"
							/>
							<br />
							<FormControlLabel
								control={
									<Switch
										checked={adminSettings.backupNotifications}
										onChange={handleAdminSettingChange('backupNotifications')}
									/>
								}
								label="Backup completion notifications"
							/>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			
			<Box sx={{ mt: 4 }}>
				<Button
					variant="contained"
					startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
					onClick={() => {
						setLoading(true);
						setTimeout(() => {
							setMessage({ type: 'success', text: 'Admin settings saved!' });
							setLoading(false);
						}, 500);
					}}
					disabled={loading}
				>
					Save Admin Settings
				</Button>
			</Box>
		</Box>
	);

	const renderSecurityTab = () => (
		<Box>
			<Typography variant="h6" gutterBottom>
				Security Settings
			</Typography>
			
			<Grid container spacing={3}>
				<Grid size={{ xs: 12 }}>
					<Card variant="outlined">
						<CardContent>
							<FormControlLabel
								control={
									<Switch
										checked={securitySettings.twoFactorAuth}
										onChange={handleSecurityChange('twoFactorAuth')}
									/>
								}
								label="Require Two-Factor Authentication"
							/>
							<Typography variant="caption" color="text.secondary" display="block">
								All admin accounts must use 2FA
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				
				<Grid size={{ xs: 12 }}>
					<Card variant="outlined">
						<CardContent>
							<FormControlLabel
								control={
									<Switch
										checked={securitySettings.failedLoginLockout}
										onChange={handleSecurityChange('failedLoginLockout')}
									/>
								}
								label="Account Lockout after Failed Attempts"
							/>
							<Typography variant="caption" color="text.secondary" display="block">
								Lock account after 5 failed login attempts
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				
				<Grid size={{ xs: 12 }}>
					<Card variant="outlined">
						<CardContent>
							<FormControlLabel
								control={
									<Switch
										checked={securitySettings.requireAdminApproval}
										onChange={handleSecurityChange('requireAdminApproval')}
									/>
								}
								label="Require Admin Approval for Critical Actions"
							/>
						</CardContent>
					</Card>
				</Grid>
				
				<Grid size={{ xs: 12, sm: 6 }}>
					<FormControl fullWidth>
						<InputLabel>Session Timeout</InputLabel>
						<Select
							value={securitySettings.sessionTimeout}
							label="Session Timeout"
							onChange={handleSecurityChange('sessionTimeout')}
						>
							<MenuItem value={15}>15 minutes</MenuItem>
							<MenuItem value={30}>30 minutes</MenuItem>
							<MenuItem value={60}>1 hour</MenuItem>
							<MenuItem value={0}>Never</MenuItem>
						</Select>
					</FormControl>
					<Typography variant="caption" color="text.secondary">
						Admin session timeout (shorter for security)
					</Typography>
				</Grid>
				
				<Grid size={{ xs: 12, sm: 6 }}>
					<FormControl fullWidth>
						<InputLabel>Password History</InputLabel>
						<Select
							value={securitySettings.passwordHistory}
							label="Password History"
							onChange={handleSecurityChange('passwordHistory')}
						>
							<MenuItem value={3}>3 passwords</MenuItem>
							<MenuItem value={5}>5 passwords</MenuItem>
							<MenuItem value={10}>10 passwords</MenuItem>
						</Select>
					</FormControl>
					<Typography variant="caption" color="text.secondary">
						Remember previous passwords to prevent reuse
					</Typography>
				</Grid>
				
				<Grid size={{ xs: 12 }}>
					<TextField
						fullWidth
						label="IP Whitelist (Optional)"
						name="ipWhitelist"
						value={securitySettings.ipWhitelist}
						onChange={handleSecurityChange('ipWhitelist')}
						multiline
						rows={2}
						placeholder="Enter IP addresses separated by commas&#10;Example: 192.168.1.100, 10.0.0.50"
						helperText="Restrict admin access to specific IP addresses"
					/>
				</Grid>
			</Grid>
			
			<Box sx={{ mt: 4 }}>
				<Button
					variant="contained"
					fullWidth={ (isMobile) ? true : false }
					startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
					onClick={() => {
						setLoading(true);
						setTimeout(() => {
							setMessage({ type: 'success', text: 'Security settings saved!' });
							setLoading(false);
						}, 500);
					}}
					disabled={loading}
				>
					Save Security Settings
				</Button>
			</Box>
			
			<Divider sx={{ my: 4 }} />
			
			<Typography variant="h6" gutterBottom>
				Active Sessions
			</Typography>
			
			<TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>Device</TableCell>
							<TableCell>IP Address</TableCell>
							<TableCell>Location</TableCell>
							<TableCell>Last Active</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{activeSessions.map((session) => (
							<TableRow key={session.id}>
								<TableCell>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
										<DevicesIcon fontSize="small" />
										{session.device}
										{session.current && (
											<Chip label="Current" size="small" color="primary" />
										)}
									</Box>
								</TableCell>
								<TableCell>{session.ip}</TableCell>
								<TableCell>{session.location}</TableCell>
								<TableCell>{session.lastActive}</TableCell>
								<TableCell>
									{!session.current && (
										<Button
											size="small"
											variant="outlined"
											color="error"
											onClick={() => terminateSession(session.id)}
										>
											Terminate
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			
			<Button
				variant="outlined"
				color="error"
				onClick={terminateAllSessions}
				disabled={activeSessions.length <= 1}
				fullWidth={ (isMobile) ? true : false }
			>
				Terminate All Other Sessions
			</Button>
		</Box>
	);

	const renderActivityTab = () => (
		<Box>
			<Typography variant="h6" gutterBottom>
				Activity Logs
			</Typography>
			
			<TableContainer component={Paper} variant="outlined">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Action</TableCell>
							<TableCell>Timestamp</TableCell>
							<TableCell>IP Address</TableCell>
							<TableCell>Device</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{activityLogs.map((log) => (
							<TableRow key={log.id}>
								<TableCell>{log.action}</TableCell>
								<TableCell>{log.timestamp}</TableCell>
								<TableCell>{log.ip}</TableCell>
								<TableCell>{log.device}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			
			<Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
				<Button
					variant="outlined"
					startIcon={<HistoryIcon />}
				>
					View Full History
				</Button>
				<Button
					variant="outlined"
					color="error"
				>
					Clear Logs
				</Button>
			</Box>
		</Box>
	);
	*/

	return (
		<Box>
			<Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Administrator Settings</Typography>
			
			{
				message.text && (
					<Alert 
						severity={message.type} 
						sx={{ mb: 3 }}
						onClose={() => setMessage({ type: '', text: '' })}
					>
						{message.text}
					</Alert>
				)
			}
			
			<Paper sx={{ p: 3 }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
					<Tabs value={activeTab} onChange={handleTabChange} variant="scrollable">
						<Tab icon={<PersonIcon />} iconPosition="start" label="Profile" />
						<Tab icon={<LockIcon />} iconPosition="start" label="Account" />
						<Tab icon={<BillIcon />} iconPosition="start" label="Billing" />
						{/*<Tab icon={<AdminIcon />} iconPosition="start" label="Admin Settings" />
						<Tab icon={<SecurityIcon />} iconPosition="start" label="Security" />
						<Tab icon={<HistoryIcon />} iconPosition="start" label="Activity" />*/}
					</Tabs>
				</Box>
				
				{ activeTab === 0 && renderProfileTab() }
				{ activeTab === 1 && renderAccountTab() }
				{ activeTab === 2 && renderBillingTab() }
				{/*{activeTab === 2 && renderAdminSettingsTab()}
				{activeTab === 3 && renderSecurityTab()}
				{activeTab === 4 && renderActivityTab()}*/}
			</Paper>

			{/*<Dialog 
				id="delete_account"
				open={ dialogDeleteOpen }
				onClose={ () => handleDialogClose("delete_account") }
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Confirm account deletion</DialogTitle>
				<DialogContent>
					<Typography sx={{ mb: 2 }}>Are you sure you want to delete your account?</Typography>
					<Typography sx={{ mb: 2 }}>If you do, make sure that you { "don't" } have any pending transactions.</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={ () => handleDialogClose("delete_account") }>Close</Button>
					<Button 
						variant="contained"
						color="error"
						onClick={ () => {
							handleDialogClose("delete_account");
							handleDialogOpen("otp");
						}}
					>Confirm Deletion</Button>
				</DialogActions>
			</Dialog>

			<Dialog 
				id="delete_otp"
				open={ dialogOTPOpen } 
				onClose={ () => handleDialogClose("otp") } 
				maxWidth="sm" 
				fullWidth
			>
				<DialogTitle>Confirm Changes</DialogTitle>
				<DialogContent>
					<Typography sx={{ mb: 2 }}>To confirm your changes, {"we've"} sent you an OTP to your email.</Typography>
					<TextField
						fullWidth
						label="Enter OTP code here"
						value={ otp.value }
						onChange={
							(e) => {
								const otp = sessionStorage.getItem("otp");
								setOTP(prev => ({
									value: e.target.value,
									correct: ( otp && parseInt(e.target.value) === parseInt(atob(otp)) ) ? true : false
								}))
							}
						}
						required
					/>
					{ ( otp.correct === false && otp.value !== '' ) && ( <Typography color="error" sx={{ mt: 1, mb: 2 }}>Wrong OTP code</Typography> ) }
				</DialogContent>
				<DialogActions>
					<Button type="button" onClick={ () => handleDialogClose("otp") }>Close</Button>
					<Button
						type="submit"
						variant="contained"
						color="error"
						onClick={
							() => {
								handleDialogClose("otp");
								handleDialogConfirm("delete_confirm");
							}
						}
						disabled={ ( otp.correct === false || otp.value === '' ) }
					>Confirm Changes</Button>
				</DialogActions>
			</Dialog>*/}
		</Box>
	);
};

export default AdminProfileSettings;
