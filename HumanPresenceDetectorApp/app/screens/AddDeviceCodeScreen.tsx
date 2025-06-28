import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function AddDeviceCodeScreen() {
  const router = useRouter();

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Enter Device Code</Text>
      <TextInput placeholder="Enter code" style={GlobalStyles.input} />
      <TouchableOpacity style={GlobalStyles.button} onPress={() => router.push('/screens/WifiSetupScreen')}>
        <Text style={GlobalStyles.buttonText}>OK</Text>
      </TouchableOpacity>
    </View>
  );
}

