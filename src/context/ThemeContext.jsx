// src/context/ThemeContext.jsx
import React, {
	createContext, 
	useState, 
	useContext, 
	useMemo, 
	useEffect
} from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '../styles/theme';

const ThemeContext = createContext();

export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useThemeContext must be used within ThemeProvider');
	}
	return context;
};

export const ThemeContextProvider = ({ children }) => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const theme = localStorage.getItem('context');
		setIsDarkMode((theme === 'theme.dark') ? true : false);
	},[]);

	const toggleTheme = () => {
		setIsDarkMode((prev) => !prev);
		localStorage.setItem('context', (isDarkMode) ? 'theme.light' : 'theme.dark');
	};

	const theme = useMemo(() => {
		return createTheme(isDarkMode ? darkTheme : lightTheme);
	}, [isDarkMode]);

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeContext.Provider>
	);
};
