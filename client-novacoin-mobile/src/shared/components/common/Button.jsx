// src/shared/components/common/Button.jsx

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    // Variant
    if (variant === 'primary') {
      baseStyle.push(styles.primary);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondary);
    } else if (variant === 'outline') {
      baseStyle.push(styles.outline);
    } else if (variant === 'ghost') {
      baseStyle.push(styles.ghost);
    }
    
    // Size
    if (size === 'small') {
      baseStyle.push(styles.small);
    } else if (size === 'medium') {
      baseStyle.push(styles.medium);
    } else if (size === 'large') {
      baseStyle.push(styles.large);
    }
    
    // Disabled
    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    if (variant === 'primary' || variant === 'secondary') {
      baseStyle.push(styles.textLight);
    } else {
      baseStyle.push(styles.textDark);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={theme.opacity.pressed}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? theme.colors.white : theme.colors.primary.main}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.primary.main,
  },
  secondary: {
    backgroundColor: theme.colors.secondary.main,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  small: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    minHeight: 52,
  },
  
  // States
  disabled: {
    opacity: theme.opacity.disabled,
  },
  
  // Text
  text: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  textLight: {
    color: theme.colors.white,
  },
  textDark: {
    color: theme.colors.primary.main,
  },
});

export default Button;
