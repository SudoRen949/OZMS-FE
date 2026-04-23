export const API_BASE_URL = import.meta.env.VITE_API_URL; 	// Laravel backend URL
export const WEB_URL = "organizerving.wasmer.app";			// Default Web URL

// Generic fetch function with error handling
export const fetchAPI = async (endpoint, method, payload, options = {}) => 
{
	var response = null, data = null;
	const token = localStorage.getItem('token');
	const config = {
		...options,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	};
	try {
		if (method === "get" || method === "GET") {
			response = await fetch(`${API_BASE_URL}${endpoint}`, { ...config, method: "GET" });
			data = await response.json();
		} else if (method === "put" || method === "PUT") {
			response = await fetch(`${API_BASE_URL}${endpoint}`, { ...config, method: "PUT" });
			data = await response.json();
		} else if (method === "post" || method === "POST") {
			response = await fetch(`${API_BASE_URL}${endpoint}`, { ...config, method: "POST" });
			data = await response.json();
		} else if (method === "delete" || method === "DELETE") {
			response = await fetch(`${API_BASE_URL}${endpoint}`, { ...config, method: "DELETE" });
			data = await response.json();
		}
		return { response, data };
	} catch (e) {
		throw e;
	}
	// const defaultHeaders = { 'Content-Type': 'application/json' };
	// const config = {
	//     ...options,
	//     headers: {
	//         ...defaultHeaders,
	//         ...options.headers,
	//     },
	//     credentials: 'include', // Important for cookies/sessions
	// };
	// try {
	//     const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
	//     // Handle 401 Unauthorized (token expired)
	//     // if (response.status === 401) {
	//     //     localStorage.removeItem('token');
	//     //     localStorage.removeItem('user');
	//     //     window.location.href = '/login';
	//     //     throw new Error('Session expired. Please login again.');
	//     // }
	//     const data = await response.json();
	//     if (!response.ok) {
	//         throw new Error(data.cause || 'API request failed');
	//     }
	//     return data;
	// } catch (error) {
	//     console.error('API Error:', error);
	//     throw error;
	// }
};

export const emailSend = async (source, destination, title, subject, body) => {
	if (source === null) source = "catucod.renatojr@gmail.com";
	if (destination === null) destination = "catucod.renatojr@gmail.com";
	try {
		const emailContent = {
			service_id: 'service_0m6u75s',
			template_id: 'template_yblv37e',
			user_id: 'N-AY3eWQlOhtidR9h',
			template_params: {
				"companyName1": "OrganiZerving",
				"companyName2": "OrganiZerving",
				"companyName3": "OrganiZerving",
				"emailTitle": title,
				"email": destination,
				"fromEmail": source,
				"subject": subject,
				"body": body
			}
		};
		const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
			method: "POST",
			body: JSON.stringify(emailContent),
			headers: { "Content-Type": "application/json" },
		});
		// const data = await response.json();
		return { response };
	} catch (e) {
		throw e;
	}
};

/*

// Auth APIs
export const authAPI = {
	login: async (email, password) => {
		return fetchAPI('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		});
	},
	
	register: async (userData) => {
		return fetchAPI('/auth/register', {
			method: 'POST',
			body: JSON.stringify(userData),
		});
	},
	
	logout: async () => {
		return fetchAPI('/auth/logout', {
			method: 'POST',
		});
	},
	
	getCurrentUser: async () => {
		return fetchAPI('/auth/user');
	},
};

// Mock API for development (fallback)
export const mockAPI = {
	login: async (email, password) => {
		await new Promise(resolve => setTimeout(resolve, 500));
		
		if (email === 'admin@ozms.com' && password === 'admin123') {
			return {
				success: true,
				token: 'mock-token-admin-' + Date.now(),
				user: {
					id: 1,
					email: 'admin@ozms.com',
					role: 'admin',
					name: 'System Admin',
					studentId: 'ADMIN001',
					course: 'Administration',
					yearLevel: 'N/A',
					profile_picture: 'https://ui-avatars.com/api/?name=System+Admin&background=random&color=fff',
				}
			};
		} else if (email === 'student@ozms.com' && password === 'student123') {
			return {
				success: true,
				token: 'mock-token-student-' + Date.now(),
				user: {
					id: 2,
					email: 'student@ozms.com',
					role: 'student',
					name: 'John Student',
					studentId: '2023-00123',
					course: 'Computer Engineering',
					yearLevel: '3rd Year',
					profile_picture: 'https://ui-avatars.com/api/?name=John+Student&background=random&color=fff',
				}
			};
		}
		return {
			success: false,
			message: 'Invalid credentials'
		};
	},
	
	register: async (userData) => {
		await new Promise(resolve => setTimeout(resolve, 500));
		return {
			success: true,
			message: 'Registration successful'
		};
	},
};

*/

export default {
	API_BASE_URL,
	WEB_URL,
	fetchAPI,
	emailSend
	// authAPI,
	// mockAPI,
};
