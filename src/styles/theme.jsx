// src/styles/theme.js
export const lightTheme = {
	palette: {
		mode: 'light',
		primary: {
			main: '#1976d2',
		},
		secondary: {
			main: '#dc004e',
		},
		background: {
			default: '#f5f5f5',
			paper: '#ffffff',
		},
	},
};

export const darkTheme = {
	palette: {
		mode: 'dark',
		primary: {
			main: '#90caf9',
		},
		secondary: {
			main: '#f48fb1',
		},
		background: {
			default: '#1F1F29',
			paper: '#010101',
		},
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					border: '1px solid #39393A',
				},
			},
		},
	},
	customColors: {
		bgMain: '#1F1F29',
		bgDark: '#010101',
		cardBorder: '#39393A',
		textPrimary: '#FCFDFD',
		textMuted: '#626E66',
		accentGreen: '#83E384',
	},
};
