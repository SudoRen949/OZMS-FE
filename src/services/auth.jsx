// src/services/auth.js
const API_BASE_URL = 'http://localhost:5173/api'; // Replace with your API URL

export const authAPI = {
	login: async (email, password) => {
		try {
			const response = await fetch(`${API_BASE_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});
			
			if (!response.ok) {
				throw new Error('Login failed');
			}
			
			const data = await response.json();
			
			if (data.success && data.token) {
				localStorage.setItem('token', data.token);
				localStorage.setItem('user', JSON.stringify(data.user));
				return {
					success: true,
					user: data.user,
				};
			}
			
			return {
				success: false,
				message: data.message || 'Login failed',
			};
		} catch (error) {
			console.error('Login error:', error);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	},
	
	register: async (userData) => {
		try {
			const response = await fetch(`${API_BASE_URL}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			});
			
			if (!response.ok) {
				throw new Error('Registration failed');
			}
			
			const data = await response.json();
			
			return {
				success: data.success || false,
				message: data.message || 'Registration completed',
			};
		} catch (error) {
			console.error('Registration error:', error);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	},
	
	logout: () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	},
	
	getCurrentUser: () => {
		const userStr = localStorage.getItem('user');
		if (userStr) {
			try {
				return JSON.parse(userStr);
			} catch (error) {
				return null;
			}
		}
		return null;
	},
	
	isAuthenticated: () => {
		return !!localStorage.getItem('token');
	},
	
	updateProfile: async (userId, profileData) => {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify(profileData),
			});
			
			if (!response.ok) {
				throw new Error('Update failed');
			}
			
			const data = await response.json();
			
			if (data.success && data.user) {
				localStorage.setItem('user', JSON.stringify(data.user));
				return {
					success: true,
					user: data.user,
				};
			}
			
			return {
				success: false,
				message: data.message || 'Update failed',
			};
		} catch (error) {
			console.error('Update error:', error);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	},
	
	changePassword: async (userId, currentPassword, newPassword) => {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({
					userId,
					currentPassword,
					newPassword,
				}),
			});
			
			if (!response.ok) {
				throw new Error('Password change failed');
			}
			
			const data = await response.json();
			
			return {
				success: data.success || false,
				message: data.message || 'Password changed successfully',
			};
		} catch (error) {
			console.error('Password change error:', error);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	},
	
	resetPassword: async (email) => {
		try {
			const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});
			
			if (!response.ok) {
				throw new Error('Reset password failed');
			}
			
			const data = await response.json();
			
			return {
				success: data.success || false,
				message: data.message || 'Reset instructions sent to email',
			};
		} catch (error) {
			console.error('Reset password error:', error);
			return {
				success: false,
				message: 'Network error. Please try again.',
			};
		}
	},
	
	// Mock auth for development
	mockLogin: async (email, password) => {
		await new Promise(resolve => setTimeout(resolve, 500));
		
		if (email === 'admin@ozms.com' && password === 'admin123') {
			const user = {
				id: 1,
				email: 'admin@ozms.com',
				role: 'admin',
				name: 'System Admin',
				studentId: 'ADMIN001',
				course: 'Administration',
				yearLevel: 'N/A',
			};
			
			localStorage.setItem('token', 'mock.jwt.token.admin');
			localStorage.setItem('user', JSON.stringify(user));
			
			return {
				success: true,
				user,
			};
		} else if (email === 'student@ozms.com' && password === 'student123') {
			const user = {
				id: 2,
				email: 'student@ozms.com',
				role: 'student',
				name: 'John Student',
				studentId: '2023-00123',
				course: 'Computer Engineering',
				yearLevel: '3rd Year',
			};
			
			localStorage.setItem('token', 'mock.jwt.token.student');
			localStorage.setItem('user', JSON.stringify(user));
			
			return {
				success: true,
				user,
			};
		}
		
		return {
			success: false,
			message: 'Invalid credentials',
		};
	},
	
	mockRegister: async (userData) => {
		await new Promise(resolve => setTimeout(resolve, 500));
		return {
			success: true,
			message: 'Registration successful. You can now login.',
		};
	},
};

// Auth middleware for protected routes
export const requireAuth = (to, from, next) => {
	if (!authAPI.isAuthenticated()) {
		next('/login');
	} else {
		next();
	}
};

// Role-based access control
export const requireRole = (roles) => {
	return (to, from, next) => {
		if (!authAPI.isAuthenticated()) {
			next('/login');
			return;
		}
		
		const user = authAPI.getCurrentUser();
		if (!user || !roles.includes(user.role)) {
			next('/unauthorized');
			return;
		}
		
		next();
	};
};

export default authAPI;
