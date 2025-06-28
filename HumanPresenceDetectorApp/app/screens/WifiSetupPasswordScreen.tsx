import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function WifiSetupPasswordScreen() {
  const { ssid } = useLocalSearchParams();
  const [password, setPassword] = useState('');

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Connect to {ssid}</Text>
      
      <TextInput
        placeholder="Password"
        style={GlobalStyles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={GlobalStyles.button} onPress={() => {}}>
        <Text style={GlobalStyles.buttonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
}


