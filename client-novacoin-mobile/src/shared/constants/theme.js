// src/shared/constants/theme.js

export const theme = {
  colors: {
    // Colores basados en la web (index.css)
    primary: {
      main: '#c084fc',
      dark: '#a855f7',
      light: '#d8b4fe',
      cyan: '#00f2fe',
    },
    
    secondary: {
      main: '#b8860b',
      dark: '#8B6914',
      light: '#d4a817',
    },
    
    // Colores de fondo oscuro (basado en web dark mode)
    background: {
      primary: '#16171d',
      secondary: '#1f2028',
      tertiary: '#0d1117',
      light: '#f4f3ec',
      card: '#111827',
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
      50: '#f4f3ec',
      100: '#e5e4e7',
      200: '#d4d4d8',
      300: '#a1a1aa',
      400: '#71717a',
      500: '#52525b',
      600: '#3f3f46',
      700: '#27272a',
      800: '#18181b',
      900: '#09090b',
    },
    
    // Colores de texto (basado en web dark mode)
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
      tertiary: '#6b7280',
      inverse: '#08060d',
      light: '#d1d5db',
    },
    
    // Colores de borde (basado en web dark mode)
    border: {
      light: '#2e303a',
      medium: '#374151',
      dark: '#1f2937',
    },
    
    // Colores de superficie
    surface: {
      elevated: '#111827',
      pressed: '#1f2937',
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
