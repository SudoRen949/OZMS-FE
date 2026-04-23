import React, {
	createContext,
	useState,
	useContext,
	useEffect
} from 'react';
import { API_BASE_URL } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => 
{
	const [user, setUser] = useState(null);
	
	const header = { "Content-Type": "application/json" };
	
	useEffect(() => {
		async function fetchData() { // loads student informations
			try {
				const token = localStorage.getItem("token");
				if (!token) return; // don't get data if no token
				const [, type] = token.split("0");
				const date = new Date();
				const currentDate = parseInt( date.getTime() / 1000 );
				if (type === "student")
				{
					const response = await fetch(`${ API_BASE_URL }/student/get/own/${ token }`, { method: "GET", headers: header });
					const data = await response.json();
					if (response?.ok && data) 
					{
						const expireDate = Math.floor( new Date( data.expires_at.replace(" ", "T") ).getTime() / 1000 );
						if (expireDate > currentDate) 
						{
							setUser({ ...data, role: type });
						} 
						else 
						{
							alert("Your session has expired");
							localStorage.removeItem("token");
						}
					}
				}
				else
				{
					const response = await fetch(`${ API_BASE_URL }/admin/get/${ token }`, { method: "GET", headers: header });
					const data = await response.json();
					if (response?.ok && data) 
					{
						const expireDate = Math.floor( new Date( data.expires_at.replace(" ", "T") ).getTime() / 1000 );
						if (expireDate > currentDate)
						{
							setUser({ ...data, role: type });
							// console.log("Hello World 2");
						} 
						else 
						{
							alert("Your session has expired");
							localStorage.removeItem("token");
						}
					}
				}
			} catch (e) {
				console.error(e);
				alert("Unable to redirect to dashboard, please login again.");
			}
		}
		fetchData();
	},[]);

	const login = async (email, password, type) => 
	{
		try {
			if (type === "student") 
			{
				const response = await fetch(`${ API_BASE_URL }/student/login`, {
					method: 'POST',
					headers: header,
					body: JSON.stringify({ email, password })
				});
				const data = await response.json();
				if (response?.ok && data) {
					setUser({ ...data, role: type });
					localStorage.setItem("token", data.token);
				}
				return { response, data }
			} 
			else
			{
				const response = await fetch(`${ API_BASE_URL }/admin/login`, {
					method: 'POST',
					headers: header,
					body: JSON.stringify({ email, password })
				});
				const data = await response.json();
				if (response?.ok && data) {
					setUser({ ...data, role: type});
					localStorage.setItem("token", data.token);
				}
				return { response, data }
			}
		} catch (e) {
			throw e;
		}
	}

	const register = async (userData, type) => 
	{
		try {
			if (type === "student")
			{
				const response = await fetch(`${ API_BASE_URL }/student/register`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(userData)
				});
				const data = await response.json();
				return { response, data };
			}
			else
			{
				const response = await fetch(`${ API_BASE_URL }/admin/register`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(userData)
				});
				const data = await response.json();
				return { response, data };
			}
		} catch (e) {
			throw e;
		}
	}

	const logout = () => {
		setUser(null);
		localStorage.removeItem("token");
	}
	
	const value = {
		user,
		login,
		register,
		logout,
		
		setUser
	}
	
	return (
		<AuthContext.Provider value={ value } >{ children }</AuthContext.Provider>
	);
}

// export const AuthProvider = ({ children }) => {
//     const API_HOST = "http://127.0.0.1:8000/api";
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const decodeToken = (token) => {
//         try {
//             // For mock tokens, create a proper JWT-like structure
//             if (token.startsWith('ozms.token.')) {
//                 // Extract user type from mock token
//                 const userType = token.replace('mock.jwt.token.', '');
//                 const mockPayload = {
//                     id: userType === 'admin' ? 1 : 2,
//                     email: userType === 'admin' ? 'admin@ozms.com' : 'student@ozms.com',
//                     role: userType,
//                     name: userType === 'admin' ? 'System Admin' : 'John Student',
//                     studentId: userType === 'admin' ? 'ADMIN001' : '2023-00123',
//                     course: userType === 'admin' ? 'Administration' : 'Computer Engineering',
//                     yearLevel: userType === 'admin' ? 'N/A' : '3rd Year',
//                     exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours from now
//                 };
//                 return mockPayload;
//             }
//             // For real JWT tokens
//             return jwtDecode(token);
//         } catch (error) {
//             console.error('Token decode error:', error);
//             throw error;
//         }
//     };
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             try {
//                 const decoded = decodeToken(token);
//                 setUser({
//                     id: decoded.id,
//                     email: decoded.email,
//                     role: decoded.role,
//                     name: decoded.name,
//                     studentId: decoded.studentId,
//                     course: decoded.course,
//                     yearLevel: decoded.yearLevel,
//                 });
//             } catch (error) {
//                 console.error('Token validation error:', error);
//                 localStorage.removeItem('token');
//             }
//         }
//         setLoading(false);
//     }, []);
//     const login = async (email, password) => {
//         // Mock API call
//         const response = await mockLoginAPI(email, password);
//         if (response.success) {
//             localStorage.setItem('token', response.token);
//             const decoded = decodeToken(response.token);
//             setUser({
//                 id: decoded.id,
//                 email: decoded.email,
//                 role: decoded.role,
//                 name: decoded.name,
//                 studentId: decoded.studentId,
//                 course: decoded.course,
//                 yearLevel: decoded.yearLevel,
//             });
//             return { success: true };
//         }
//         return { success: false, message: response.message };
//     };
//     const register = async (userData) => {
//         // Mock API call
//         const response = await mockRegisterAPI(userData);
//         if (response.success) {
//             return { success: true };
//         }
//         return { success: false, message: response.message };
//     };
//     const logout = () => {
//         localStorage.removeItem('token');
//         setUser(null);
//     };
//     const value = {
//         user,
//         login,
//         register,
//         logout
//     };
//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // Mock API functions - FIXED VERSION
// const mockLoginAPI = async (email, password) => {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 500));
//     // Mock validation
//     if (email === 'admin@ozms.com' && password === 'admin123') {
//         return {
//             success: true,
//             token: 'mock.jwt.token.admin',
//             user: {
//                 id: 1,
//                 email: 'admin@ozms.com',
//                 role: 'admin',
//                 name: 'System Admin',
//                 studentId: 'ADMIN001',
//                 course: 'Administration',
//                 yearLevel: 'N/A'
//             }
//         };
//     } else if (email === 'student@ozms.com' && password === 'student123') {
//         return {
//             success: true,
//             token: 'mock.jwt.token.student',
//             user: {
//                 id: 2,
//                 email: 'student@ozms.com',
//                 role: 'student',
//                 name: 'John Student',
//                 studentId: '2023-00123',
//                 course: 'Computer Engineering',
//                 yearLevel: '3rd Year'
//             }
//         };
//     }
//     return {
//         success: false,
//         message: 'Invalid credentials'
//     };
// };

// const mockRegisterAPI = async (userData) => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return {
//         success: true,
//         message: 'Registration successful'
//     };
// };
