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

const Register = () =>
{
	const navigate = useNavigate();

	const { register } = useAuth();

	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		suffix: '',
		email: '',
		studentId: '',
		course: '',
		yearLevel: '',
		password: '',
		confirmPassword: '',
	});

	const courses = [
		'Computer Engineering',
		'Architecture',
		'Civil Engineering',
		'Electrical Engineering',
		'Mechanical Engineering',
		'Information Technology',
		'Computer Science',
		'Geodetic Engineering',
	];

	const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
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
		if (!formData.studentId) {
			setError('Please enter your student ID');
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
				studentId: formData.studentId,
				course: formData.course,
				yearLevel: formData.yearLevel,
				password: formData.password,
				password_confirmation: formData.confirmPassword
			}
			const result = await register(userData, "student");
			setError(( result.data.cause ) ? result.data.cause : '');
			setSuccess(( result.data.cause ) ? '' : 'Registration successful');
			if ( !result.data.cause ) setTimeout(() => navigate("/login"), 1000);
			// if (result?.response.ok) {
			// 	setSuccess('Registration successful! We have sent you an email verification.');
			// 	const emailBody = `Hi ${ formData.firstName }, Click <a href="organizerving.vercel.app/verify">here</a> to verify your account`;
			// 	const verify = await emailSend(null, formData.email, "OZMS Verification", "OZMS Verification", emailBody);
			// } else {
			// 	setError(result?.data.cause);
			// }
		} catch (e) {
			console.error(e);
			setError('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 4, mb: 6 }}>
				<Paper elevation={3} sx={{ p: 4 }}>
					<Typography variant="h4" component="h1" align="center">
						Student Registration
					</Typography>
					<Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }} align="center" color="text.secondary">
						OrganiZerving Management System
					</Typography>
					
					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}
					
					{success && (
						<Alert severity="success" sx={{ mb: 2 }}>
							{success}
						</Alert>
					)}
					
					<form onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="First Name"
									name="firstName"
									value={formData.firstName}
									onChange={handleChange}
									required
									disabled={loading}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 4 }}>
								<TextField
									fullWidth
									label="Last Name"
									name="lastName"
									value={formData.lastName}
									onChange={handleChange}
									required
									disabled={loading}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 2 }}>
								<TextField
									fullWidth
									label="Suffix (Jr)"
									name="suffix"
									value={formData.suffix}
									onChange={handleChange}
									// required
									disabled={loading}
								/>
							</Grid>
							
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="Email"
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									disabled={loading}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="Student ID"
									name="studentId"
									value={formData.studentId}
									onChange={handleChange}
									required
									disabled={loading}
								/>
							</Grid>
							
							<Grid size={{ xs: 12, sm: 6 }}>
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
							</Grid>
							
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="Password"
									type="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									required
									disabled={loading}
								/>
							</Grid>
							<Grid size={{ xs: 12, sm: 6 }}>
								<TextField
									fullWidth
									label="Confirm Password"
									type="password"
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									required
									disabled={loading}
								/>
							</Grid>
						</Grid>
						
						<Button
							fullWidth
							type="submit"
							variant="contained"
							size="large"
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}
						>
							{loading ? 'Registering...' : 'Register'}
						</Button>
					</form>
					
					<Box sx={{ textAlign: 'center', mt: 2 }}>
						<Typography variant="body2">
							Already have an account?{' '}
							<Link component={RouterLink} to="/login">
								Login here
							</Link>
						</Typography>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
};

export default Register;
