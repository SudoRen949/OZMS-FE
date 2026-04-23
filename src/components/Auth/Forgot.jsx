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
import { emailSend } from '../../services/api';
import { generateOTP } from '../../services/helpers';
import { fetchAPI } from '../../services/api';

const Forgot = () => 
{
	const navigate = useNavigate();

	// const { login } = useAuth();

	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState(0); // process step
	const [inputOTP, setInputOTP] = useState('');
	const [password, setPassword] = useState({
		newPassword: '',
		confirmNewPassword: ''
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		if ( step === 0 ) {
			setLoading(true);
			const otp = generateOTP();
			try {
				const emailBody = `Hi, Here is you One Time Password to recover your OrganiZerving account: ${ otp }`;
				await emailSend(null, email, "OZMS Account Recovery", "OZMS Account Recovery", emailBody);
				alert("OTP has been sent to your email address.");
				setLoading(false);
				setStep(1);
				localStorage.setItem(btoa("otp"), btoa(otp));
			} catch (e) {
				console.error(e);
				setError("Unable to send OTP to your email address. Please try again.");
				setLoading(false);
			}
		} else if ( step === 1 ) { // otp checking
			setLoading(true);
			const myOtp = localStorage.getItem(btoa("otp"));
			if ( inputOTP === atob(myOtp) ) {
				setError('');
				setInputOTP('');
				setStep(2);
				setLoading(false);
			} else {
				setError("OTP does not match. Please try again.");
				setInputOTP('');
				setLoading(false);
			}
		} else if ( step === 2 ) {
			setLoading(true);
			try {
				const response = await fetchAPI(`/student/password/reset`, "PUT", {
					email: email,
					password: password.newPassword,
					password_confirmation: password.confirmNewPassword
				});
				if ( response.data.cause ) {
					setError(response.data.cause);
				} else {
					alert("Password has been reset");
					setLoading(false);
					localStorage.removeItem(btoa("otp"));
					navigate("/login");
				}
			} catch (e) {
				console.error(e);
				setLoading(false);
			}
		}
	};

	return (
		<Container maxWidth="sm">
			<Box sx={{ mt: 8, mb: 4 }}>
				<Paper elevation={3} sx={{ p: 4 }}>
					<Typography variant="h4" component="h1" gutterBottom align="center">OrganiZerving <br />Account Recovery</Typography>

					{ error && <Alert severity="error" sx={{ mb: 2 }}>{ error }</Alert> }
					
					<form onSubmit={ handleSubmit } >
						{
							( step === 0 ) && (
								<TextField
									fullWidth
									label="Enter email here"
									type="email"
									value={ email }
									onChange={ (e) => setEmail(e.target.value) }
									margin="normal"
									required
									disabled={ loading }
								/>
							)
						}
						{
							( step === 1 ) && ( // otp step
								<TextField
									fullWidth
									label="Enter 6 digit OTP here"
									value={ inputOTP }
									onChange={ (e) => setInputOTP(e.target.value) }
									margin="normal"
									required
									disabled={ loading }
								/>
							)
						}
						{
							( step === 2 ) && ( // password step
								<>
									<TextField
										fullWidth
										type="password"
										label="Enter New Password"
										value={ password.newPassword }
										onChange={ (e) => setPassword(prev => ({ ...prev, newPassword: e.target.value })) }
										margin="normal"
										required
										disabled={ loading }
									/>
									<TextField
										fullWidth
										type="password"
										label="Confirm New Password"
										value={ password.confirmNewPassword }
										onChange={ (e) => setPassword(prev => ({ ...prev, confirmNewPassword: e.target.value })) }
										margin="normal"
										required
										disabled={ loading }
									/>
								</>
							)
						}
						<Button
							fullWidth
							type="submit"
							variant="contained"
							size="large"
							sx={{ mt: 3, mb: 2 }}
							disabled={ loading }
						>
							{ ( step === 0 ) && "Submit" }
							{ ( step === 1 ) && "Continue" }
							{ ( step === 2 ) && "Reset password" }
						</Button>
					</form>
				</Paper>
			</Box>
		</Container>
	);
};

export default Forgot;
