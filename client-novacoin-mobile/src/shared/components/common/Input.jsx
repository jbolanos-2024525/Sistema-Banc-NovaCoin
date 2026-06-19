// src/shared/components/common/Input.jsx

import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  disabled = false,
  multiline = false,
  numberOfLines,
  icon,
  iconPosition = 'left',
  onIconPress,
  style,
  inputStyle,
}) => {
  const getInputStyle = () => {
    const baseStyle = [styles.input];
    
    if (error) {
      baseStyle.push(styles.inputError);
    }
    
    if (disabled) {
      baseStyle.push(styles.inputDisabled);
    }
    
    if (multiline) {
      baseStyle.push(styles.inputMultiline);
    }
    
    return baseStyle;
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputContainerError]}>
        {icon && iconPosition === 'left' && (
          <MaterialIcons
            name={icon}
            size={20}
            color={error ? theme.colors.error : theme.colors.gray[400]}
            style={styles.iconLeft}
          />
        )}
        <TextInput
          style={[getInputStyle(), inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray[400]}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
        {(icon || onIconPress) && iconPosition === 'right' && (
          <MaterialIcons
            name={icon}
            size={20}
            color={error ? theme.colors.error : theme.colors.gray[400]}
            style={styles.iconRight}
            onPress={onIconPress}
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
  },
  inputContainerError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 48,
  },
  inputError: {
    color: theme.colors.error,
  },
  inputDisabled: {
    backgroundColor: theme.colors.gray[100],
    color: theme.colors.gray[500],
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  iconLeft: {
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  iconRight: {
    marginRight: theme.spacing.md,
    marginLeft: theme.spacing.sm,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

export default Input;
