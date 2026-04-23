// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import {
	Container,
	Paper,
	TextField,
	Button,
	Typography,
	Box,
	Alert,
	Link,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { emailSend } from '../../services/api';

const AdminSetup = () =>
{
	const navigate = useNavigate();

	const { register } = useAuth();

	const formDataValues = {
		firstName: '',
		lastName: '',
		suffix: '',
		email: '',
		// studentId: '',
		// course: '',
		// yearLevel: '',
		department: '',
		organization: '',
		password: '',
		confirmPassword: ''
	}

	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState(formDataValues);

	// const courses = [
	// 	'Computer Engineering',
	// 	'Architecture',
	// 	'Civil Engineering',
	// 	'Electrical Engineering',
	// 	'Mechanical Engineering',
	// 	'Information Technology',
	// 	'Computer Science',
	// 	'Geodetic Engineering',
	// ];

	// const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const validateForm = () => {
		if (!formData.firstName || !formData.lastName) {
			setError('Please enter your full name');
			return false;
		}
		// if (!formData.suffix) {
		// 	setError('Please enter your name suffix');
		// 	return false;
		// }
		if (!formData.email.includes('@')) {
			setError('Please enter a valid email');
			return false;
		}
		if (!formData.department) {
			setError('Please enter your school department');
			return false;
		}
		if (!formData.organization) {
			setError('Please enter your school organization');
			return false;
		}
		if (formData.password.length < 6) {
			setError('Password must be at least 6 characters');
			return false;
		}
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		if (!validateForm()) return;
		setLoading(true);
		try {
			const userData = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				suffix: formData.suffix.slice(0,-1) || '',
				email: formData.email,
				// studentId: formData.studentId,
				// course: formData.course,
				// yearLevel: formData.yearLevel,
				department: formData.department,
				organization: formData.organization,
				password: formData.password,
				password_confirmation: formData.confirmPassword,
			}
			const result = await register(userData, "admin");
			setError(( result.data.cause ) ? result.data.cause : '');
			setSuccess(( result.data.cause ) ? '' : 'Registration successful');
			if ( !result.data.cause ) setTimeout(() => navigate("/login"), 3000);
			if (result?.response.ok) {
				setSuccess('Registration successful! We welcome to OrganiZerving!');
				const emailBody = `Hi ${ formData.firstName }, Your registration has completed. <br/>Thank you for using OrganiZerving.`;
				await emailSend(null, formData.email, "OZMS Registration", "OZMS Registration Completion", emailBody);
			}
		} catch (e) {
			console.error(e);
			setError('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="sm">
			<Box sx={{ mt: 4, mb: 6 }}>
				<Paper elevation={3} sx={{ p: 4 }}>
					<Typography variant="h4" component="h1" align="center">Admin Account Registration</Typography>
					<Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }} align="center" color="text.secondary">
						OrganiZerving Management System
					</Typography>
					
					{ error && ( <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> ) }
					{ success && ( <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert> ) }
					
					<form onSubmit={ handleSubmit }>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="First Name"
									name="firstName"
									value={ formData.firstName }
									onChange={ handleChange }
									required
									disabled={ loading }
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 4 }}>
								<TextField
									fullWidth
									label="Last Name"
									name="lastName"
									value={ formData.lastName }
									onChange={ handleChange }
									required
									disabled={ loading }
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 2 }}>
								<TextField
									fullWidth
									label="Suffix (Jr)"
									name="suffix"
									value={ formData.suffix }
									onChange={ handleChange }
									disabled={ loading }
								/>
							</Grid>
							
							<Grid size={{ xs: 12 }}>
								<TextField
									fullWidth
									label="Email"
									type="email"
									name="email"
									value={ formData.email }
									onChange={ handleChange }
									required
									disabled={ loading }
								/>
							</Grid>
							<Grid size={{ xs: 12 }}>
								<TextField
									fullWidth
									label="Department"
									name="department"
									value={ formData.department }
									onChange={ handleChange }
									required
									disabled={ loading }
								/>
							</Grid>

							<Grid size={{ xs: 12 }}>
								<TextField
									fullWidth
									label="Organization"
									name="organization"
									value={ formData.organization }
									onChange={ handleChange }
									required
									disabled={ loading }
								/>
							</Grid>
							
							{/*<Grid size={{ xs: 12, sm: 6 }}>
								<FormControl fullWidth required>
									<InputLabel>Course</InputLabel>
									<Select
										name="course"
										value={formData.course}
										label="Course"
										onChange={handleChange}
										disabled={loading}
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
								<FormControl fullWidth required>
									<InputLabel>Year Level</InputLabel>
									<Select
										name="yearLevel"
										value={formData.yearLevel}
										label="Year Level"
										onChange={handleChange}
										disabled={loading}
									>
										{yearLevels.map((year) => (
											<MenuItem key={year} value={year}>
												{year}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>*/}
							
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="Password"
									type="password"
									name="password"
									value={ formData.password }
									onChange={ handleChange }
									required
									disabled={ loading }
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="Confirm Password"
									type="password"
									name="confirmPassword"
									value={ formData.confirmPassword }
									onChange={ handleChange }
									required
									disabled={ loading }
								/>
							</Grid>
						</Grid>
						
						<Button
							fullWidth
							type="submit"
							variant="contained"
							size="large"
							sx={{ mt: 3, mb: 2 }}
							disabled={ loading }
							loading={ loading }
							loadingPosition="start"
						>
							{ loading ? 'Registering...' : 'Register' }
						</Button>
					</form>
					
					{/*<Box sx={{ textAlign: 'center', mt: 2 }}>
						<Typography variant="body2">
							Already have an account?{' '}
							<Link component={RouterLink} to="/login">Login here</Link>
						</Typography>
					</Box>*/}
				</Paper>
			</Box>
		</Container>
	);
};

export default AdminSetup;
