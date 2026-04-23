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
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Switch,
	FormControlLabel,
	InputAdornment,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchAPI, emailSend } from '../../services/api';
import { generateOTP } from '../../services/helpers';

const ProfileSettings = () => 
{
	const navigate = useNavigate();

	const { user, setUser } = useAuth();
	
	const [activeTab, setActiveTab] = useState(0);
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState({ type: '', text: '' });
	const [otp, setOTP] = useState(null);
	const [openOTPDialog, setOpenOTPDialog] = useState(false);
	const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
	const [correctOTP, setCorrectOTP] = useState(true);

	const dialogIds = [
		"otp",
		"rqdt"
	];
	
	// Profile Data
	const [profileData, setProfileData] = useState({
		firstName: '',
		lastName: '',
		suffix: '',
		email: '',
		studentId: '',
		course: '',
		yearLevel: '',
		phone: '',
		// address: '',
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
	
	// Notification Preferences
	const [notifications, setNotifications] = useState({
		emailNotifications: true,
		eventReminders: true,
		paymentUpdates: true,
		requestStatus: true,
		newsletter: false,
		marketingEmails: false,
		pushNotifications: true,
	});
	
	// Security Settings
	const [securitySettings, setSecuritySettings] = useState({
		twoFactorAuth: false,
		loginAlerts: true,
		sessionTimeout: 30,
		showLastLogin: true,
		requirePasswordChange: false,
	});

	useEffect(() => {
		if (user) {
			setProfileData({
				firstName: user.first_name || '',
				lastName: user.last_name || '',
				suffix: user.suffix || '',
				email: user.email || '',
				studentId: user.student_id || '',
				course: user.course || '',
				yearLevel: user.year_level || '',
				phone: user.phone || '',
				address: user.address || '',
				bio: user.bio || '',
				profilePicture: user.profile || `https://ui-avatars.com/api/?name=${ user.first_name }&background=random&color=fff`,
			});
		}
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

	const handleNotificationChange = (name) => (event) => {
		setNotifications(prev => ({
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

	const handleProfilePictureChange = async (event) => {
		const file = event.target.files[0];
		if (file) {
			if (file.size > 5242880) { // 5MB file limit 5 * ( 1024 ^ 2 )
				setMessage({ type: 'error', text: 'File size must be less than 5MB' });
				return;
			}
			// const reader = new FileReader();
			// reader.readAsDataURL(file);
			// reader.onload = async (e) => {
			// 	try {
			// 		const token = localStorage.getItem("token");
			// 		if (!token) return;
			// 		const data = { profile: e.target.result };
			// 		const response = await fetchAPI(`/student/update/${token}`, "PUT", data);
			// 		setProfileData(prev => ({
			// 			...prev,
			// 			profilePicture: e.target.result
			// 		}));
			// 		setMessage({ type: 'success', text: 'Profile picture updated successfully' });
			// 		location.reload(); //< this fixed temporary CORS error (idk y)
			// 	} catch (err) {
			// 		console.error(err);
			// 		setMessage({ type: 'success', text: 'Could not upload profile picture, please try again.' });
			// 	}
			// };
			try {
				const formData = new FormData();
				formData.append("profile", file);
				await fetch(`${ API_BASE_URL }/admin/update/${ user.token }`, { method: "POST", body: formData });
				const studentData = await fetchAPI(`/admin/get/${ user.token }`, "GET");
				setProfileData(prev => ({
					...prev,
					profilePicture: studentData.data.profile
				}));
				setUser(prev => ({ ...prev, profile: studentData.data.profile }));
				setMessage({ type: 'success', text: 'Profile picture has been updated.' });
			} catch (e) {
				console.log(e);
				setMessage({ type: 'error', text: 'Could not upload profile picture, please try again.' });
			}
		}
	};

	const handleSaveProfile = async () => {
		setLoading(true);
		setMessage({ type: '', text: '' });
		if (!profileData.firstName || !profileData.lastName || !profileData.email || !profileData.suffix) {    // Validate required fields
			setMessage({ type: 'error', text: 'Please fill in all required fields' });
			setLoading(false);
			return;
		}
		const token = localStorage.getItem("token");
		if (!token) return;
		try {
			const data = {
				email: profileData.email,
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				prefix: profileData.prefix
			};
			const response = await fetchAPI(`/student/update/${token}`, "PUT", data);
			setMessage({ type: 'success', text: 'Profile updated successfully!' });
			setIsEditing(false);
			setLoading(false);
		} catch (e) {
			setLoading(false);
			alert("Unable to save profile");
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
		if (accountSettings.newPassword.length < 6) {
			setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
			setLoading(false);
			return;
		}
		if (accountSettings.newPassword !== accountSettings.confirmPassword) {
			setMessage({ type: 'error', text: 'Passwords do not match' });
			setLoading(false);
			return;
		}
		const token = localStorage.getItem("token");
		if (!token) return;
		try {
			const data = {
				currentPassword: accountSettings.currentPassword,
				password: accountSettings.newPassword,
				password_confirmation: accountSettings.confirmPassword
			};
			const res = await fetchAPI(`/student/update/${token}`, "PUT", data);
			if (!res?.response?.ok) {
				setMessage({ type: 'error', text: res?.data?.cause });
				setLoading(false);
				return;
			}
			setMessage({ type: 'success', text: 'Password changed successfully!' });
			setAccountSettings({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
				showPassword: false,
				showNewPassword: false,
			});
			setLoading(false);
		} catch (e) {
			setLoading(false);
			alert("Unable to change password");
		}
	};

	const handleSaveNotifications = async () => {
		setLoading(true);
		await new Promise(resolve => setTimeout(resolve, 500));
		setMessage({ type: 'success', text: 'Notification preferences saved!' });
		setLoading(false);
	};

	const handleSaveSecurity = async () => {
		setLoading(true);
		await new Promise(resolve => setTimeout(resolve, 500));
		setMessage({ type: 'success', text: 'Security settings updated!' });
		setLoading(false);
	};

	const togglePasswordVisibility = (field) => {
		setAccountSettings(prev => ({
			...prev,
			[field]: !prev[field]
		}));
	};

	const handleChangesVerification = async () => {
		setOpenOTPDialog(true);
		const otp = generateOTP();
		localStorage.setItem("otp", otp);
		try {
			const response = await emailSend(
				null, 
				profileData.email, 
				"OrganiZerving Verification OTP",
				`OTP for OrganiZerving Information Changes`,
				`Hi ${profileData.firstName}, this is your OTP: ${otp}`
			);
			return;
		} catch (e) {
			console.error(e);
			alert("An error occured while sending email OTP");
		}
	}

	const handleConfirmDeletion = () => {
		setOpenConfirmDeleteDialog(true);
	}

	const handleClose = (e) => {
		const target = e.target.id;
		if (target === "otp") {
			localStorage.removeItem("otp");
			setOpenOTPDialog(false);
			setOTP(null);
		} else if (target === "rqdt") {
			setOpenConfirmDeleteDialog(false);
		}
	}

	const handleConfirm = (e) =>  {
		const target = e.target.id;
		if (target === "otp") {
			const cas = localStorage.getItem("otp");
			if (otp === cas) {
				setCorrectOTP(true);
				switch (activeTab) {
					case 0:
						handleSaveProfile();
						handleClose(e);
						break;
					case 1:
						handleChangePassword();
						handleClose(e);
						break;
					default: break;
				}
			} else setCorrectOTP(false);
		} else if (target === "rqdt") {
			async function deleteAccount() {
				try {
					const token = localStorage.getItem("token");
					const response = await fetchAPI(`/student/delete/${token}`, "DELETE");
					localStorage.removeItem("token");
					navigate("/");
				} catch (e) {
					alert("Unable to delete account.");
				}
			}
			deleteAccount();
		}
	}

	const courses = [
		'Computer Engineering',
		'Architecture',
		'Civil Engineering',
		'Electrical Engineering',
		'Mechanical Engineering',
		'Information Technology',
		'Computer Science',
		'Chemical Engineering',
		'Electronics Engineering',
		'Industrial Engineering',
	];

	const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

	const renderProfileTab = () => (
		<Box>
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
				<Box sx={{ position: 'relative', mr: 3 }}>
					<Avatar
						src={profileData.profilePicture}
						sx={{ width: 120, height: 120 }}
					/>
					<input
						accept="image/*"
						style={{ display: 'none' }}
						id="profile-picture-upload"
						type="file"
						onChange={handleProfilePictureChange}
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
					<Typography variant="h6">
						{profileData.firstName} {profileData.lastName}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{profileData.course} • {profileData.yearLevel}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						Student ID: {profileData.studentId}
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
				<Grid size={{ xs: 12, sm: 4 }}>
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
				<Grid size={{ xs: 12, sm: 2 }}>
					<TextField
						fullWidth
						label="Suffix (e.g. Jr, II)"
						name="suffix"
						value={profileData.suffix}
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
						disabled
						// required
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
					<FormControl fullWidth>
						<InputLabel>Course</InputLabel>
						<Select
							name="course"
							value={profileData.course}
							label="Course"
							onChange={handleProfileChange}
							disabled={!isEditing}
						>
							{courses.map((course) => (
								<MenuItem key={course} value={course}>
									{course}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<FormControl fullWidth>
						<InputLabel>Year Level</InputLabel>
						<Select
							name="yearLevel"
							value={profileData.yearLevel}
							label="Year Level"
							onChange={handleProfileChange}
							disabled={!isEditing}
						>
							{yearLevels.map((year) => (
								<MenuItem key={year} value={year}>
									{year}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				
				{/*<Grid size={{ xs: 12 }}>
					<TextField
						fullWidth
						label="Address"
						name="address"
						value={profileData.address}
						onChange={handleProfileChange}
						disabled={!isEditing}
						multiline
						rows={2}
						placeholder="House No., Street, Barangay, City, Province"
					/>
				</Grid>*/}
				
				{/*<Grid size={{ xs: 12 }}>
					<TextField
						fullWidth
						label="Bio"
						name="bio"
						value={profileData.bio}
						onChange={handleProfileChange}
						disabled={!isEditing}
						multiline
						rows={3}
						placeholder="Tell us about yourself..."
					/>
				</Grid>*/}
			</Grid>

			<Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
				{isEditing ? (
					<>
						<Button
							variant="outlined"
							startIcon={<CancelIcon />}
							onClick={() => setIsEditing(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							id={dialogIds[0]}
							variant="contained"
							startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
							onClick={handleChangesVerification}
							disabled={loading}
						>
							Save Changes
						</Button>
					</>
				) : (
					<Button
						variant="contained"
						startIcon={<EditIcon />}
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
						helperText="At least 6 characters"
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
					onClick={handleChangesVerification}
					disabled={loading || !accountSettings.currentPassword || !accountSettings.newPassword || !accountSettings.confirmPassword}
				>
					Change Password
				</Button>
			</Box>
			
			<Divider sx={{ my: 4 }} />
			
			<Typography variant="h6" gutterBottom>
				Account Actions
			</Typography>
			
			<Grid container spacing={2}>
				{/*<Grid size={{ xs: 12, sm: 6 }}>
					<Card variant="outlined">
						<CardContent>
							<Typography variant="subtitle2" gutterBottom>
								Download Your Data
							</Typography>
							<Typography variant="body2" color="text.secondary" paragraph>
								Request a copy of all your personal data stored in our system.
							</Typography>
							<Button variant="outlined" size="small">
								Request Data Export
							</Button>
						</CardContent>
					</Card>
				</Grid>*/}
				
				<Grid size={{ xs: 12, sm: 12 }}>
					<Card variant="outlined" sx={{ borderColor: 'error.main' }}>
						<CardContent>
							<Typography variant="subtitle2" gutterBottom color="error">
								Delete Account
							</Typography>
							<Typography variant="body2" color="text.secondary" paragraph>
								Permanently delete your account and all associated data.
							</Typography>
							<Button variant="outlined" color="error" size="small" onClick={handleConfirmDeletion}>
								Delete Account
							</Button>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);

	/*
	const renderNotificationsTab = () => (
		<Box>
			<Typography variant="h6" gutterBottom>
				Email Notifications
			</Typography>
			
			<Grid container spacing={2}>
				<Grid size={{ xs: 12 }}>
					<FormControlLabel
						control={
							<Switch
								checked={notifications.emailNotifications}
								onChange={handleNotificationChange('emailNotifications')}
							/>
						}
						label="Enable all email notifications"
					/>
				</Grid>
				
				<Grid size={{ xs: 12 }}>
					<Card variant="outlined">
						<CardContent>
							<Typography variant="subtitle2" gutterBottom>
								Event Notifications
							</Typography>
							<FormControlLabel
								control={
									<Switch
										checked={notifications.eventReminders}
										onChange={handleNotificationChange('eventReminders')}
									/>
								}
								label="Event reminders and updates"
							/>
							<Typography variant="caption" color="text.secondary" display="block">
								Receive reminders for registered events
							</Typography>
						</CardContent>
					</Card>
				</Grid>
				
				<Grid size={{ xs: 12 }}>
					<Card variant="outlined">
						<CardContent>
							<Typography variant="subtitle2" gutterBottom>
								System Notifications
							</Typography>
							<FormControlLabel
								control={
									<Switch
										checked={notifications.paymentUpdates}
										onChange={handleNotificationChange('paymentUpdates')}
									/>
								}
								label="Payment status updates"
							/>
							<br />
							<FormControlLabel
								control={
									<Switch
										checked={notifications.requestStatus}
										onChange={handleNotificationChange('requestStatus')}
									/>
								}
								label="Borrow request status"
							/>
						</CardContent>
					</Card>
				</Grid>
				
				<Grid size={{ xs: 12 }}>
					<Card variant="outlined">
						<CardContent>
							<Typography variant="subtitle2" gutterBottom>
								Promotional Communications
							</Typography>
							<FormControlLabel
								control={
									<Switch
										checked={notifications.newsletter}
										onChange={handleNotificationChange('newsletter')}
									/>
								}
								label="Monthly newsletter"
							/>
							<br />
							<FormControlLabel
								control={
									<Switch
										checked={notifications.marketingEmails}
										onChange={handleNotificationChange('marketingEmails')}
									/>
								}
								label="Marketing emails"
							/>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			
			<Box sx={{ mt: 4 }}>
				<Button
					variant="contained"
					startIcon={loading ? <CircularProgress size={20} /> : <NotificationsIcon />}
					onClick={handleSaveNotifications}
					disabled={loading}
				>
					Save Notification Preferences
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
								label="Enable Two-Factor Authentication"
							/>
							<Typography variant="caption" color="text.secondary" display="block">
								Add an extra layer of security to your account
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
										checked={securitySettings.loginAlerts}
										onChange={handleSecurityChange('loginAlerts')}
									/>
								}
								label="Login Alerts"
							/>
							<Typography variant="caption" color="text.secondary" display="block">
								Get notified when someone logs into your account from a new device
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
										checked={securitySettings.showLastLogin}
										onChange={handleSecurityChange('showLastLogin')}
									/>
								}
								label="Show Last Login Information"
							/>
						</CardContent>
					</Card>
				</Grid>
				
				<Grid size={{ xs: 12 }}>
					<Card variant="outlined">
						<CardContent>
							<FormControlLabel
								control={
									<Switch
										checked={securitySettings.requirePasswordChange}
										onChange={handleSecurityChange('requirePasswordChange')}
									/>
								}
								label="Require Password Change Every 90 Days"
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
							<MenuItem value={120}>2 hours</MenuItem>
							<MenuItem value={0}>Never (not recommended)</MenuItem>
						</Select>
					</FormControl>
					<Typography variant="caption" color="text.secondary">
						Automatically log out after inactivity
					</Typography>
				</Grid>
			</Grid>
			
			<Box sx={{ mt: 4 }}>
				<Button
					variant="contained"
					startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
					onClick={handleChangesVerification}
					disabled={loading}
				>
					Save Security Settings
				</Button>
			</Box>
			
			<Divider sx={{ my: 4 }} />
			
			<Typography variant="h6" gutterBottom color="error">
				Dangerous Zone
			</Typography>
			
			<Card variant="outlined" sx={{ borderColor: 'error.main' }}>
				<CardContent>
					<Typography variant="subtitle2" gutterBottom color="error">
						Log Out All Devices
					</Typography>
					<Typography variant="body2" color="text.secondary" paragraph>
						This will log you out of all devices where you are currently signed in.
					</Typography>
					<Button variant="outlined" color="error">
						Log Out Everywhere
					</Button>
				</CardContent>
			</Card>
		</Box>
	);
	*/

	return (
		<Box>
			<Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
				Account Settings
			</Typography>
			
			{message.text && (
				<Alert 
					severity={message.type} 
					sx={{ mb: 3 }}
					onClose={() => setMessage({ type: '', text: '' })}
				>
					{message.text}
				</Alert>
			)}
			
			<Paper sx={{ p: 3 }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
					<Tabs value={activeTab} onChange={handleTabChange} variant="scrollable">
						<Tab icon={<PersonIcon />} iconPosition="start" label="Profile" />
						<Tab icon={<LockIcon />} iconPosition="start" label="Account" />
						{/*<Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" />*/}
						{/*<Tab icon={<SecurityIcon />} iconPosition="start" label="Security" />*/}
					</Tabs>
				</Box>
				
				{activeTab === 0 && renderProfileTab()}
				{activeTab === 1 && renderAccountTab()}
				{/*activeTab === 2 && renderNotificationsTab()*/}
				{/*activeTab === 3 && renderSecurityTab()*/}
			</Paper>

			<Dialog open={openOTPDialog} onClose={handleClose} maxWidth="sm" fullWidth>
				<DialogTitle>
					Confirm Changes
				</DialogTitle>
				<DialogContent>
					<Typography sx={{ mb: 2 }}>To confirm your changes, {"we've"} sent you an OTP to your email.</Typography>
					<TextField
						fullWidth
						label="Enter OTP code here"
						value={otp}
						onChange={(e)=>setOTP(e.target.value)}
						required
					/>
					{ ( correctOTP === false ) && ( <Typography color="error" sx={{ mt: 1, mb: 2 }}>Wrong OTP code</Typography> ) }
				</DialogContent>
				<DialogActions>
					<Button type="button" id={dialogIds[0]} onClick={handleClose}>Close</Button>
					<Button type="submit" id={dialogIds[0]} variant="contained" onClick={handleConfirm}>Confirm Changes</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={openConfirmDeleteDialog} onClose={handleClose} maxWidth="sm" fullWidth>
				<DialogTitle>
					Confirm account deletion
				</DialogTitle>
				<DialogContent>
					<Typography sx={{ mb: 2 }}>Are you sure you want to delete your account?</Typography>
					<Typography sx={{ mb: 2 }}>If you do, make sure that you {"don't"} have any pending transactions.</Typography>
				</DialogContent>
				<DialogActions>
					<Button id={dialogIds[1]} onClick={handleClose}>Close</Button>
					<Button id={dialogIds[1]} variant="contained" color="error" onClick={handleConfirm}>Confirm Deletion</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default ProfileSettings;
