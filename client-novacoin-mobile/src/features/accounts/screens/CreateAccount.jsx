// src/features/accounts/screens/CreateAccount.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Card } from '../../../shared/components/common/Common';

const CreateAccount = () => {
  return (
    <Container padding="md">
      <Card elevation="md">
        <Text style={styles.placeholderText}>Crear Cuenta</Text>
        <Text style={styles.subtext}>Se implementará en fase posterior</Text>
      </Card>
    </Container>
  );
};

const styles = StyleSheet.create({
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CreateAccount;
