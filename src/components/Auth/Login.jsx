import React, { useState, useEffect } from 'react';
import {
	Container,
	Paper,
	TextField,
	Button,
	Typography,
	Box,
	Alert,
	Link,
	Checkbox,
	FormGroup,
	FormControlLabel
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => 
{
	const navigate = useNavigate();

	const { login } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [remember, setRemember] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		setEmail(localStorage.getItem("email") || '');
		setPassword(localStorage.getItem("password") || '');
		setRemember(( localStorage.getItem("rememberMe") === "true" ) ? true : false);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			if (remember) {
				localStorage.setItem("email", email);
				localStorage.setItem("password", password);
				localStorage.setItem("rememberMe", true);
			} else {
				localStorage.removeItem("email");
				localStorage.removeItem("password");
				localStorage.removeItem("rememberMe");
			}
			const result = await login(email, password, ( isAdmin ) ? "admin" : "student");
			if (result?.response.ok) navigate(( isAdmin ) ? "/admin" : "/student");
			else setError(result?.data.cause);
		} catch(e) {
			setError('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="sm">
			<Box sx={{ mt: 8, mb: 4 }}>
				<Paper elevation={3} sx={{ p: 4 }}>
					<Typography variant="h4" component="h1" gutterBottom align="center">OrganiZerving { ( isAdmin ) && "Admin" } Login</Typography>
					<Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">Student Management System</Typography>
					
					{ error && <Alert severity="error" sx={{ mb: 2 }}>{ error }</Alert> }
					
					<form onSubmit={ handleSubmit } >
						<TextField
							fullWidth
							label="Email"
							type="email"
							value={ email }
							onChange={(e) => setEmail(e.target.value)}
							margin="normal"
							required
							disabled={ loading }
						/>
						<TextField
							fullWidth
							label="Password"
							type="password"
							value={ password }
							onChange={(e) => setPassword(e.target.value)}
							margin="normal"
							required
							disabled={ loading }
						/>
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
							<FormGroup>
								<FormControlLabel
									control={
										<Checkbox
											checked={ remember }
											onChange={ (e) => setRemember(e.target.checked) }
										/>
									}
									label="Remember Me"
								/>
							</FormGroup>
							<Link component={ RouterLink } to="/login/forgot">Forgot password?</Link>
						</Box>
						<Button
							fullWidth
							type="submit"
							variant="contained"
							size="large"
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}
						>
							{loading ? 'Logging in...' : 'Login'}
						</Button>
					</form>
					
					<Box sx={{ textAlign: 'center', mt: 2 }}>
						{
							( !isAdmin ) && (
								<>
									<Typography variant="body2" sx={{ mb: 2 }}>
										{ "Don't have an account?" }{' '}
										<Link component={ RouterLink } to="/register">Register here</Link>
									</Typography>
									<Typography variant="body2">
										{/*<Link component={ RouterLink } to="/login/admin" sx={{ textDecoration: "none" }} >For Administrators</Link>*/}
										<Button onClick={ () => setIsAdmin(true) } >For Administrator</Button>
									</Typography>
								</>
							)
						}
						{/*<Typography variant="body2" sx={{ mt: 1 }}>
							Demo Accounts:
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Admin: admin@ozms.com / admin123
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Student: student@ozms.com / student123
						</Typography>*/}
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

export default Login;
