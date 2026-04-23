// src/components/Auth/Login.jsx
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
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => 
{
    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await login(email, password);
            if (result?.response.ok) navigate("/admin");
            else setError(result?.data.cause);
        } catch(e) {
            console.error(e);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Administrator Login
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
                        OrganiZerving Student Management System
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            disabled={loading}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            disabled={loading}
                        />
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
                        {/*<Typography variant="body2" sx={{ mb: 2 }}>
                            <Link component={RouterLink} to="/plans">
                                Apply for Administrator
                            </Link>
                        </Typography>*/}
                        {/*<Typography variant="body2">
                            <Link component={RouterLink} to="/login/admin">
                                { "For Administrators " }{' '}
                            </Link>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
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

export default LoginAdmin;
