// src/components/LandingPage/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import {
	Box,
	Container,
	Typography,
	Button,
	Grid,
	Card,
	CardContent,
	CardActions,
	Paper,
	Avatar,
	Stack,
	Chip,
	IconButton,
	TextField,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Link,
	Menu,
	MenuItem,
	useTheme,
	useMediaQuery,
} from '@mui/material';
import {
	ArrowForward as ArrowForwardIcon,
	CalendarToday as CalendarIcon,
	School as SchoolIcon,
	Groups as GroupsIcon,
	Inventory as InventoryIcon,
	Security as SecurityIcon,
	Speed as SpeedIcon,
	Devices as DevicesIcon,
	Notifications as NotificationsIcon,
	Analytics as AnalyticsIcon,
	CheckCircle as CheckCircleIcon,
	Facebook as FacebookIcon,
	Twitter as TwitterIcon,
	Instagram as InstagramIcon,
	LinkedIn as LinkedInIcon,
	Email as EmailIcon,
	Phone as PhoneIcon,
	LocationOn as LocationIcon,
	Login as LoginIcon,
	PersonAdd as PersonAddIcon,
	ChevronRight as ChevronRightIcon,
	PlayCircle as PlayCircleIcon,
	Menu as MenuIcon,
} from '@mui/icons-material';
import {
	Link as RouterLink,
	useNavigate
} from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => 
{
	const theme = useTheme();
	const isDarkMode = theme.palette.mode === 'dark';
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const navigate = useNavigate();
	
	const [email, setEmail] = useState('');
	const [anchorEl, setAnchorEl] = useState(null);
	
	const features = [
		{
			icon: <CalendarIcon />,
			title: 'Event Management',
			description: 'Streamline campus event planning, registration, and management with real-time updates and notifications.',
			color: '#4CAF50',
		},
		{
			icon: <InventoryIcon />,
			title: 'Resource Borrowing',
			description: 'Easily request and track campus resources like projectors, chairs, and equipment with automated approvals.',
			color: '#2196F3',
		},
		{
			icon: <SpeedIcon />,
			title: 'Quick Registration',
			description: 'Register for events with integrated payment options including GCash and on-site payments.',
			color: '#FF9800',
		},
		{
			icon: <SecurityIcon />,
			title: 'Role-Based Access',
			description: 'Secure system with different access levels for students, organization officers, and administrators.',
			color: '#9C27B0',
		},
		{
			icon: <AnalyticsIcon />,
			title: 'Real-time Analytics',
			description: 'Comprehensive dashboards with charts and reports for administrators.',
			color: '#00BCD4',
		},
		{
			icon: <DevicesIcon />,
			title: 'Mobile Responsive',
			description: 'Access the system from any device with a fully responsive design that works on all screen sizes.',
			color: '#F44336',
		},
	];

	const testimonials = [
		{
			name: 'John Reyes',
			role: 'Student Council President',
			text: 'OrganiZerving has revolutionized how we manage campus events. It saved us hours of administrative work!',
			avatar: 'JR',
		},
		{
			name: 'Maria Santos',
			role: 'Event Coordinator',
			text: 'The resource borrowing system is so efficient. No more lost equipment or scheduling conflicts!',
			avatar: 'MS',
		},
		{
			name: 'Prof. David Lim',
			role: 'University Administrator',
			text: 'As an admin, the analytics dashboard gives me valuable insights into student participation and resource usage.',
			avatar: 'DL',
		},
	];

	const stats = [
		{ value: '50+', label: 'Events Managed' },
		{ value: '2,000+', label: 'Active Students' },
		{ value: '98%', label: 'Satisfaction Rate' },
		{ value: '500+', label: 'Resources Tracked' },
	];

	const steps = [
		{ number: '01', title: 'Register Account', description: 'Create your student or organization account' },
		{ number: '02', title: 'Browse Events', description: 'Explore upcoming campus events and activities' },
		{ number: '03', title: 'Register & Pay', description: 'Register for events with secure payment options' },
		{ number: '04', title: 'Request Resources', description: 'Borrow campus equipment for your activities' },
		{ number: '05', title: 'Track Progress', description: 'Monitor your requests and event registrations' },
		{ number: '06', title: 'Get Involved', description: 'Participate and enhance your campus experience' },
	];

	const products = [
		{ name: 'Features', link: '#' },
		{ name: 'Pricing', link: '/subscription' },
		{ name: 'API', link: '#' },
		{ name: 'Documentation', link: '#' },
	];

	const company = [
		{ name: 'About', link: '#' },
		{ name: 'Blog', link: '#' },
		{ name: 'Careers', link: '#' },
		{ name: 'Press', link: '#' },
	];

	const handleSubscribe = (e) => {
		e.preventDefault();
		if (email) {
			alert(`Thank you for subscribing with ${email}! You'll receive updates about OrganiZerving.`);
			setEmail('');
		}
	};

	const MotionBox = motion.create(Box);
	const MotionCard = motion.create(Card);
	const MotionTypography = motion.create(Typography);

	return (
		<Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
			{/* Navigation Bar */}
			<AppBar position="sticky" sx={{ bgcolor: 'background.paper', boxShadow: 1 }} isDarkMode={isDarkMode}>
				<Container maxWidth="xl">
					<Stack direction="row" justifyContent="space-between" alignItems="center" py={2}>
						<Stack direction="row" alignItems="center" spacing={1}>
							<Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
								<SchoolIcon />
							</Avatar>
							<Typography variant="h6" color="primary" fontWeight="bold">
								OrganiZerving
							</Typography>
							<Chip label="MS" size="small" color="primary" />
						</Stack>
						
						<Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: 'none', md: 'block' } }}>
							<Button
								color="primary"
								size={ (isMobile) ? "small" : "" }
								onClick={ ()=>navigate('/plan') }
							>
								Plans
							</Button>
							<Button
								color="primary"
								size={ (isMobile) ? "small" : "" }
								onClick={()=>navigate('/login')}
								startIcon={<LoginIcon />}
							>
								Login
							</Button>
							<Button
								variant="contained"
								color="primary"
								size={ (isMobile) ? "small" : "" }
								onClick={()=>navigate('/register')}
								endIcon={<ArrowForwardIcon />}
							>
								Sign up
							</Button>
						</Stack>

						<IconButton sx={{ display: { xs: 'block', md: 'none' } }} onClick={(e)=>setAnchorEl(e.currentTarget)}>
							<MenuIcon />
						</IconButton>
					</Stack>
				</Container>
			</AppBar>

			{/* Hero Section */}
			<Container maxWidth="xl">
				<Grid container spacing={4} alignItems="center" py={5}>
					<Grid size={{ xs: 12, md: 6 }}>
						<MotionBox
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							{/*<Chip
								label="University Approved"
								color="primary"
								sx={{ mb: 2 }}
							/>*/}
							<Typography
								variant="h1"
								fontWeight="bold"
								gutterBottom
								sx={{
									fontSize: { xs: '2.5rem', md: '3.5rem' },
									lineHeight: 1.2,
									color: isDarkMode ? 'white' : 'text.primary'
								}}
							>
								Streamline Your
								<Box component="span" color="primary.main"> Campus</Box>
								{' '}Experience
							</Typography>
							<Typography
								variant="h5"
								color="text.secondary"
								paragraph
								sx={{ mb: 4 }}
							>
								The all-in-one platform for managing student events, resource borrowing, 
								and campus services at University of Science and Technology of the Philippines.
							</Typography>
							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
								<Button
									variant="contained"
									size="large"
									onClick={()=>navigate("/register")}
									endIcon={<ArrowForwardIcon />}
									sx={{ px: 4, py: 1.5 }}
								>
									Get Started Free
								</Button>
								<Button
									variant="outlined"
									size="large"
									startIcon={<PlayCircleIcon />}
									sx={{ px: 4, py: 1.5 }}
								>
									Watch Demo
								</Button>
							</Stack>
							{/*<Grid container spacing={3} mt={4}>
								{stats.map((stat, index) => (
									<Grid size={{ xs: 6, md: 3 }} key={index}>
										<Typography variant="h4" fontWeight="bold" color="primary">
											{stat.value}
										</Typography>
										<Typography variant="body2" color={isDarkMode ? 'grey.400' : 'text.secondary'}>
											{stat.label}
										</Typography>
									</Grid>
								))}
							</Grid>*/}
						</MotionBox>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }} hidden={(isMobile) ? true : false}>
						<MotionBox
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<Paper
								elevation={6}
								sx={{
									p: 3,
									borderRadius: 4,
									bgcolor: 'background.paper',
									overflow: 'hidden',
								}}
							>
								<Box sx={{ position: 'relative' }}>
									{/* Mock Dashboard Image */}
									<Box
										sx={{
											height: 400,
											bgcolor: isDarkMode ? 'grey.900' : 'grey.100',
											borderRadius: 2,
											display: 'flex',
											flexDirection: 'column',
											overflow: 'auto',
										}}
									>
										{/* Mock Dashboard Header */}
										<Box
											sx={{
												bgcolor: isDarkMode ? 'primary.dark' : 'primary.main',
												color: 'white',
												p: 2,
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<Typography variant="subtitle1" fontWeight="bold">
												Student Dashboard
											</Typography>
											<Chip label="Live" size="small" sx={{ bgcolor: 'white', color: 'primary.main' }} />
										</Box>
										
										{/* Mock Dashboard Content */}
										<Grid container spacing={2} p={2}>
											<Grid size={{ xs: 12, md: 4 }}>
												<Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: isDarkMode ? 'grey.800' : 'background.paper', color: isDarkMode ? 'white' : 'text.primary' }}>
													<Typography variant="h6">3</Typography>
													<Typography variant="caption">Active Events</Typography>
												</Paper>
											</Grid>
											<Grid size={{ xs: 12, md: 4 }}>
												<Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: isDarkMode ? 'grey.800' : 'background.paper', color: isDarkMode ? 'white' : 'text.primary' }}>
													<Typography variant="h6">8</Typography>
													<Typography variant="caption">Joined</Typography>
												</Paper>
											</Grid>
											<Grid size={{ xs: 12, md: 4 }}>
												<Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: isDarkMode ? 'grey.800' : 'background.paper', color: isDarkMode ? 'white' : 'text.primary' }}>
													<Typography variant="h6">2</Typography>
													<Typography variant="caption">Requests</Typography>
												</Paper>
											</Grid>
										</Grid>
										
										{/* Mock Event List */}
										<Box sx={{ p: 2 }}>
											{['National Architecture Week', 'Software Tutorial', 'Sports Fest'].map((event, idx) => (
												<Paper
													key={idx}
													sx={{
														p: 1.5,
														mb: 1,
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
														bgcolor: isDarkMode ? 'grey.800' : 'background.paper',
														color: isDarkMode ? 'white' : 'text.primary',
													}}
												>
													<Typography variant="body2">{event}</Typography>
													<Chip
														label={idx === 0 ? 'Active' : 'Upcoming'}
														size="small"
														color={idx === 0 ? 'success' : 'warning'}
													/>
												</Paper>
											))}
										</Box>
									</Box>
								</Box>
							</Paper>
						</MotionBox>
					</Grid>
				</Grid>
			</Container>

			{/* Features Section */}
			<Box sx={{ bgcolor: isDarkMode ? 'background.default' : 'grey.50', py: 10 }}>
				<Container maxWidth="lg">
					<MotionTypography
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						variant={ (isMobile) ? "h3" : "h2" }
						textAlign="center"
						fontWeight="bold"
						gutterBottom
					>
						Everything You Need in One Platform
					</MotionTypography>
					<Typography
						variant="h6"
						color="text.secondary"
						textAlign="center"
						paragraph
						sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
					>
						OrganiZerving provides comprehensive tools to enhance campus life and streamline administrative processes.
					</Typography>
					
					<Grid container spacing={4}>
						{features.map((feature, index) => (
							<Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
								<MotionCard
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
									sx={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										transition: 'transform 0.3s, box-shadow 0.3s',
										bgcolor: isDarkMode ? 'background.paper' : 'background.paper',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: isDarkMode ? 3 : 6,
										},
									}}
								>
									<CardContent sx={{ flexGrow: 1, p: 3 }}>
										<Avatar
											sx={{
												bgcolor: `${feature.color}15`,
												color: feature.color,
												width: 60,
												height: 60,
												mb: 2,
											}}
										>
											{feature.icon}
										</Avatar>
										<Typography variant="h5" gutterBottom fontWeight="bold">
											{feature.title}
										</Typography>
										<Typography color="text.secondary">
											{feature.description}
										</Typography>
									</CardContent>
								</MotionCard>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>

			{/* How It Works Section */}
			<Container maxWidth="lg" sx={{ py: 10 }}>
				<Grid container spacing={6} alignItems="center">
					<Grid size={{ xs: 12, md: 6 }}>
						<MotionBox
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
						>
							<Typography variant={ (isMobile) ? "h3" : "h2" } fontWeight="bold" gutterBottom>
								Simple Steps to Get Started
							</Typography>
							<Typography variant="h6" color="text.secondary" paragraph>
								Getting started with OrganiZerving is quick and easy. Follow these simple steps to enhance your campus experience.
							</Typography>
							
							<List>
								{steps.map((step, index) => (
									<ListItem key={index} sx={{ px: 0 }}>
										<ListItemIcon>
											<Avatar
												sx={{
													bgcolor: 'primary.main',
													color: 'white',
													width: 40,
													height: 40,
												}}
											>
												{step.number}
											</Avatar>
										</ListItemIcon>
										<ListItemText
											primary={
												<Typography variant="h6" fontWeight="bold">
													{step.title}
												</Typography>
											}
											secondary={step.description}
										/>
									</ListItem>
								))}
							</List>
						</MotionBox>
					</Grid>
					<Grid size={{ xs: 12, md: 6 }}>
						<MotionBox
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
						>
							<Paper
								elevation={6}
								sx={{
									p: 4,
									borderRadius: 4,
									bgcolor: isDarkMode ? 'primary.dark' : 'primary.main',
									color: 'white',
									position: 'relative',
									overflow: 'hidden',
								}}
							>
								<Box
									sx={{
										position: 'absolute',
										top: -50,
										right: -50,
										width: 200,
										height: 200,
										borderRadius: '50%',
										bgcolor: 'rgba(255,255,255,0.1)',
									}}
								/>
								<Box sx={{ position: 'relative', zIndex: 1 }}>
									<Typography variant="h3" fontWeight="bold" gutterBottom>
										Ready to Transform Your Campus Experience?
									</Typography>
									<Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
										Join thousands of students and organizations already using OrganiZerving.
									</Typography>
									<Button
										variant="contained"
										size="large"
										onClick={()=>navigate("/register")}
										endIcon={<ArrowForwardIcon />}
										sx={{
											bgcolor: 'white',
											color: 'primary.main',
											'&:hover': {
												bgcolor: 'grey.100',
											},
											px: 4,
											py: 1.5,
										}}
									>
										Start For Free
									</Button>
								</Box>
							</Paper>
						</MotionBox>
					</Grid>
				</Grid>
			</Container>

			{/* Testimonials Section */}
			{/*<Box sx={{ bgcolor: isDarkMode ? 'background.default' : 'grey.50', py: 10 }}>
				<Container maxWidth="lg">
					<MotionTypography
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						variant={ (isMobile) ? "h3" : "h2" }
						textAlign="center"
						fontWeight="bold"
						gutterBottom
					>
						What Our Users Say
					</MotionTypography>
					<Typography
						variant="h6"
						color="text.secondary"
						textAlign="center"
						paragraph
						sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
					>
						{ "Don't just take our word for it. Here's what students and administrators are saying about OrganiZerving." }
					</Typography>
					
					<Grid container spacing={4} sx={{ overflow: 'auto', height: { xs: '500px', md: '225px' }, p: 1 }}>
						{testimonials.map((testimonial, index) => (
							<Grid size={{ xs: 12, md: 4 }} key={index}>
								<MotionCard
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
									sx={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<CardContent sx={{ flexGrow: 1, p: 3 }}>
										<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
											<Avatar sx={{ mr: 2 }}>
												{testimonial.avatar}
											</Avatar>
											<Box>
												<Typography variant="h6" fontWeight="bold">
													{testimonial.name}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													{testimonial.role}
												</Typography>
											</Box>
										</Box>
										<Typography color="text.secondary">
											"{testimonial.text}"
										</Typography>
									</CardContent>
								</MotionCard>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>*/}

			{/* CTA Section */}
			<Container maxWidth="md" sx={{ py: 10 }}>
				<MotionBox
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
				>
					<Paper
						elevation={6}
						sx={{
							p: { xs: 3, md: 6 },
							borderRadius: 4,
							textAlign: 'center',
							bgcolor: isDarkMode ? 'background.paper' : 'background.paper'
						}}
					>
						<Typography variant={ (isMobile) ? "h3" : "h2" } fontWeight="bold" gutterBottom>
							Ready to Get Started?
						</Typography>
						<Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
							Join thousands of students and organizations streamlining their campus experience with OrganiZerving.
						</Typography>
						
						<Stack
							direction={{ xs: 'column', sm: 'row' }}
							spacing={2}
							justifyContent="center"
							sx={{ mb: 2 }}
						>
							<Button
								variant="contained"
								size="large"
								onClick={()=>navigate("/register")}
								endIcon={<ArrowForwardIcon />}
								sx={{ px: 4, py: 1.5 }}
							>
								Create Free Account
							</Button>
							<Button
								variant="outlined"
								size="large"
								onClick={()=>navigate("/register")}
								startIcon={<LoginIcon />}
								sx={{ px: 4, py: 1.5 }}
							>
								Login to Account
							</Button>
						</Stack>

						{/*<Stack
							direction={{ xs: 'column', sm: 'row' }}
							spacing={2}
							justifyContent="center"
							sx={{ mb: 4 }}
						>
							<Button onClick={()=>{navigate("/subscription")}}>For Administrators</Button>
						</Stack>*/}
						
						<Typography variant="body2" color="text.secondary">
							No credit card required • Free for USTP students
						</Typography>
					</Paper>
				</MotionBox>
			</Container>

			{/* Footer */}
			<Box sx={{ bgcolor: isDarkMode ? 'grey.900' : 'grey.900', color: 'white', py: 8 }}>
				<Container maxWidth="lg">
					<Grid container spacing={4}>
						<Grid size={{ xs: 12, md: 4 }}>
							<Stack spacing={2}>
								<Stack direction="row" alignItems="center" spacing={1}>
									<Avatar sx={{ bgcolor: 'primary.main' }}>
										<SchoolIcon />
									</Avatar>
									<Typography variant="h6" fontWeight="bold">
										OrganiZerving MS
									</Typography>
								</Stack>
								<Typography variant="body2" sx={{ opacity: 0.8 }}>
									The all-in-one platform for managing campus events, resource borrowing, 
									and student services at USTP.
								</Typography>
								<Stack direction="row" spacing={1}>
									{[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
										<IconButton key={index} sx={{ color: 'white' }}>
											<Icon />
										</IconButton>
									))}
								</Stack>
							</Stack>
						</Grid>
						
						{/*<Grid size={{ xs: 6, md: 2 }}>
							<Typography variant="h6" fontWeight="bold" gutterBottom>
								Product
							</Typography>
							<List dense disablePadding>
								{products.map((item,i) => (
									<ListItem key={i} disablePadding sx={{ mb: 1 }}>
										<Link href={item.link} color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
											{item.name}
										</Link>
									</ListItem>
								))}
							</List>
						</Grid>
						
						<Grid size={{ xs: 6, md: 2 }}>
							<Typography variant="h6" fontWeight="bold" gutterBottom>
								Company
							</Typography>
							<List dense disablePadding>
								{company.map((item,i) => (
									<ListItem key={i} disablePadding sx={{ mb: 1 }}>
										<Link href={item.link} color="inherit" sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}>
											{item.name}
										</Link>
									</ListItem>
								))}
							</List>
						</Grid>
						
						<Grid size={{ xs: 12, md: 4 }}>
							<Typography variant="h6" fontWeight="bold" gutterBottom>
								Stay Updated
							</Typography>
							<Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
								Subscribe to our newsletter for the latest updates and features.
							</Typography>
							<form onSubmit={handleSubscribe}>
								<Stack direction="row" spacing={1}>
									<TextField
										placeholder="Your email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										size="small"
										sx={{
											flexGrow: 1,
											bgcolor: isDarkMode ? 'grey.800' : 'grey.800',
											borderRadius: 1,
											'& .MuiOutlinedInput-root': {
												color: 'white',
												'& fieldset': {
													borderColor: 'grey.700',
												},
											},
										}}
									/>
									<Button
										type="submit"
										variant="contained"
										color="primary"
									>
										Subscribe
									</Button>
								</Stack>
							</form>
						</Grid>*/}
					</Grid>
					
					<Divider sx={{ my: 4, bgcolor: 'grey.700' }} />
					
					<Grid container spacing={2} alignItems="center">
						<Grid size={{ xs: 12, md: 6 }}>
							<Stack direction={(isMobile) ? "column" : "row"} spacing={3}>
								<Stack direction="row" alignItems="center" spacing={1}>
									<EmailIcon fontSize="small" />
									<Typography variant="body2" sx={{ opacity: 0.8 }}>
										support@organizerving.ustp.edu.ph
									</Typography>
								</Stack>
								<Stack direction="row" alignItems="center" spacing={1}>
									<PhoneIcon fontSize="small" />
									<Typography variant="body2" sx={{ opacity: 0.8 }}>
										(+63) 991-890-1532
									</Typography>
								</Stack>
							</Stack>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<Typography variant="body2" textAlign={{ md: 'right' }} sx={{ opacity: 0.8 }}>
								© { new Date().getFullYear() } OrganiZerving Management System. All rights reserved.
								USTP - University of Science and Technology of the Philippines.
							</Typography>
						</Grid>
					</Grid>
				</Container>
			</Box>

			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={()=>setAnchorEl(null)}>
				<MenuItem onClick={()=>navigate("/login")}><LoginIcon />&nbsp;Log in</MenuItem>
				<MenuItem onClick={()=>navigate("/register")}><ArrowForwardIcon />&nbsp;Sign up</MenuItem>
				<MenuItem onClick={()=>navigate("/plan")}>Plan</MenuItem>
				{/*<MenuItem onClick={()=>navigate("/subscription")}>Pricing</MenuItem>*/}
			</Menu>
		</Box>
	);
};

// AppBar component for Landing Page
const AppBar = ({ children, isDarkMode, ...props }) => (
	<Box
		component="header"
		sx={{
			position: 'sticky',
			top: 0,
			zIndex: 1100,
			bgcolor: isDarkMode ? 'background.paper' : 'background.paper',
			boxShadow: isDarkMode ? 1 : 1,
			borderBottom: isDarkMode ? '1px solid' : 'none',
			borderColor: isDarkMode ? 'divider' : 'transparent',
		}}
		{...props}
	>
		{children}
	</Box>
);

export default LandingPage;
