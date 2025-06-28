import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function WifiConnectScreen() {
  const router = useRouter();
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Connect to Wi-Fi</Text>
      <TextInput
        placeholder="Wi-Fi SSID"
        style={GlobalStyles.input}
        value={ssid}
        onChangeText={setSsid}
      />
      <TextInput
        placeholder="Wi-Fi Password"
        style={GlobalStyles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={GlobalStyles.button} onPress={() => router.push('/screens/WifiSetupScreen')}>
        <Text style={GlobalStyles.buttonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
}

