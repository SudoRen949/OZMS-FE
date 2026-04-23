// Update in src/components/Common/Navbar.jsx
import React from 'react';
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	Avatar,
	Menu,
	MenuItem,
	useTheme,
	useMediaQuery,
} from '@mui/material';
import {
	Link as RouterLink,
	useNavigate
} from 'react-router-dom';
import {
	Settings as SettingsIcon,
	Person as PersonIcon,
	ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ userHandle, logoutHandle }) => 
{
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const navigate = useNavigate();

	// const { userHandle, logout } = useAuth();

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleProfileClick = () => {
		handleClose();
		navigate(userHandle?.role === 'admin' ? '/admin/profile' : '/student/profile');
	};

	const handleDashboardClick = () => {
		handleClose();
		navigate(userHandle?.role === 'admin' ? '/admin' : '/student');
	};

	const handleLogout = () => {
		logoutHandle();
		handleClose();
		navigate('/');
	};

	if (!userHandle) return null;

	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					<RouterLink to={ ( userHandle?.role === 'admin' ) ? '/admin' : 'student' } style={{ color: 'inherit', textDecoration: 'none' }}>
						{ (isMobile) ? "OZMS" : "OrganiZerving Management System" }
					</RouterLink>
				</Typography>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<ThemeToggle />
					
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Avatar
							src={ userHandle?.profile }
							sx={{ width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' }}
						>
							{ ( userHandle?.profile?.includes("http") || !userHandle?.profile ) && userHandle?.first_name?.charAt(0) || 'U' }
						</Avatar>
						
						<Button
							color="inherit"
							onClick={ handleMenu }
							sx={{ textTransform: 'none' }}
						>
							{ userHandle.first_name || userHandle.email }
						</Button>
						
						<Menu
							anchorEl={ anchorEl }
							open={ Boolean(anchorEl) }
							onClose={ handleClose }
						>
							<MenuItem onClick={handleDashboardClick}>
								<PersonIcon fontSize="small" sx={{ mr: 1 }} />
								Dashboard
							</MenuItem>
							<MenuItem onClick={handleProfileClick}>
								<SettingsIcon fontSize="small" sx={{ mr: 1 }} />
								Profile Settings
							</MenuItem>
							<MenuItem onClick={handleLogout}>
								<ExitToAppIcon fontSize="small" sx={{ mr: 1 }} />
								Logout
							</MenuItem>
						</Menu>
					</Box>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
