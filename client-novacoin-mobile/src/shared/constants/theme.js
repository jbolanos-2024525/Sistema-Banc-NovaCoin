// src/shared/constants/theme.js

export const theme = {
  colors: {
    // Colores basados en la web (auth.css)
    primary: {
      main: '#001847',
      dark: '#020817',
      light: '#001847',
      cyan: '#52ffd8',
    },
    
    secondary: {
      main: '#3b82f6',
      dark: '#2563eb',
      light: '#60a5fa',
    },
    
    // Colores de fondo (basado en web)
    background: {
      primary: '#020817',
      secondary: '#001847',
      tertiary: '#020b1f',
      light: '#f8fbff',
      card: '#ffffff',
    },
    
    // Colores de estado
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f97316',
    info: '#3b82f6',
    
    // Colores neutros
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#f8fbff',
      100: '#eef4ff',
      200: '#dbe3ee',
      300: '#94a3b8',
      400: '#64748b',
      500: '#475569',
      600: '#334155',
      700: '#1e293b',
      800: '#0f172a',
      900: '#020617',
    },
    
    // Colores de texto (basado en web)
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      tertiary: '#94a3b8',
      inverse: '#ffffff',
      light: '#d7e2f0',
    },
    
    // Colores de borde (basado en web)
    border: {
      light: '#dbe3ee',
      medium: '#e2e8f0',
      dark: '#cbd5e1',
    },
    
    // Colores de superficie
    surface: {
      elevated: '#ffffff',
      pressed: '#f1f5f9',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  typography: {
    // Tamaños de fuente
    fontSize: {
      xs: 12,
      sm: 13,
      base: 14,
      lg: 16,
      xl: 18,
      xxl: 20,
      xxxl: 24,
      display: 32,
    },
    
    // Pesos de fuente
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    // Familias de fuente
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
  },
  
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  opacity: {
    disabled: 0.5,
    pressed: 0.8,
    hover: 0.9,
  },
};

export default theme;
