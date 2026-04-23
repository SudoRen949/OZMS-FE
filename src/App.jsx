// src/App.jsx
import React from 'react';
import {
	HashRouter as Router,
	Routes,
	Route,
	Navigate
} from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ThemeContextProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import LoginAdmin from './components/Auth/LoginAdmin';
import Register from './components/Auth/Register';
import Forgot from './components/Auth/Forgot';
import StudentDashboard from './components/Student/Dashboard';
import AdminDashboard from './components/Admin/Dashboard';
import Navbar from './components/Common/Navbar';
import ProfileSettings from './components/Common/ProfileSettings';
import AdminProfileSettings from './components/Admin/AdminProfileSettings';
import LandingPage from './components/LandingPage/LandingPage';
import Plans from './components/Admin/Plans';
import AdminSetup from './components/Admin/AdminSetup';

const PrivateRoute = ({ children, allowedRoles, userHandle }) => 
{
	if (!userHandle || (allowedRoles && !allowedRoles.includes(userHandle.role))) return <Navigate to="/" />;	
	return children;
};

const SecuredRoute = ({ children }) =>
{
	const key = localStorage.getItem(btoa("plan_applied"));
	if ( atob(key) !== "true" || !key ) return <Navigate to="/" />;
	return children;
}

function AppContent() 
{
	const { user, logout } = useAuth();

	return (
		<Router>
			<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
				<Navbar userHandle={ user } logoutHandle={ logout } />
				<Box component="main" sx={{ flexGrow: 1, p: (!user) ? 0 : 3 }}>
					<Routes>
						<Route path="*" element={ <Navigate to="/" /> } />

						{/* Public Routes */}
						
						<Route path="/" element={ user ? ( <Navigate to={ ( user?.role === 'admin' ) ? '/admin' : '/student' } /> ) : ( <LandingPage /> ) } />
						<Route path="/plan" element={ <Plans /> } />
						<Route path="/login" element={ user ? <Navigate to={ ( user?.role === 'admin' ) ? '/admin' : '/student' } /> : <Login /> } />
						<Route path="/login/forgot" element={ <Forgot /> } />
						<Route path="/register" element={ <Register /> } />

						{/* Private Routes */}
						
						<Route path="/student/*" element={
							<PrivateRoute allowedRoles={['student']} userHandle={ user } >
								<StudentDashboard />
							</PrivateRoute>
						} />
						<Route path="/student/profile" element={
							<PrivateRoute allowedRoles={['student']} userHandle={ user } >
								<ProfileSettings />
							</PrivateRoute>
						} />
						<Route path="/admin/*" element={
							<PrivateRoute allowedRoles={['admin']} userHandle={ user } >
								<AdminDashboard />
							</PrivateRoute>
						} />
						<Route path="/admin/profile" element={
							<PrivateRoute allowedRoles={['admin']} userHandle={ user } >
								<AdminProfileSettings />
							</PrivateRoute>
						} />
						<Route path="/admin/setup" element={
							<SecuredRoute>
								<AdminSetup />
							</SecuredRoute>
						} />
					</Routes>
				</Box>
			</Box>
		</Router>
	);
}

function App() {
	return (
		<ThemeContextProvider>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</ThemeContextProvider>
	);
}

export default App;
