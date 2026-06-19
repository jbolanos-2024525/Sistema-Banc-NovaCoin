// src/shared/constants/theme.js

export const theme = {
  colors: {
    // Colores primarios - NovaCoin Blue
    primary: {
      main: '#1a365d',
      dark: '#0f2444',
      light: '#2c5282',
    },
    
    // Colores secundarios - Gold/Success
    secondary: {
      main: '#d69e2e',
      dark: '#b7791f',
      light: '#ecc94b',
    },
    
    // Colores de estado
    success: '#48bb78',
    error: '#f56565',
    warning: '#ed8936',
    info: '#4299e1',
    
    // Colores neutros
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
    
    // Colores de fondo
    background: {
      primary: '#ffffff',
      secondary: '#f7fafc',
      tertiary: '#edf2f7',
    },
    
    // Colores de texto
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
      tertiary: '#718096',
      inverse: '#ffffff',
    },
    
    // Colores de borde
    border: {
      light: '#e2e8f0',
      medium: '#cbd5e0',
      dark: '#a0aec0',
    },
    
    // Colores de superficie
    surface: {
      elevated: '#ffffff',
      pressed: '#edf2f7',
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
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      display: 48,
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
    sm: 4,
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
