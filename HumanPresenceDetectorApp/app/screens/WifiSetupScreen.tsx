import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function WifiSetupScreen() {
    const router = useRouter();

    const foundWifis = ['Wifi 1', 'Wifi 2'];

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Available Networks</Text>

      {foundWifis.map((wifi, index) => (
        <TouchableOpacity
          key={index}
          style={GlobalStyles.wifiButton}
          onPress={() => router.push({ pathname: '/screens/WifiSetupPasswordScreen', params: { ssid: wifi } })}
        >
          <Text style={GlobalStyles.wifiText}>{wifi}</Text>
        </TouchableOpacity>
      ))}

      <View style={{ height: 60 }} /> {}

      <TouchableOpacity
        style={GlobalStyles.otherButton}
        onPress={() => router.push('/screens/OtherWifiScreen')}
      >
        <Text style={GlobalStyles.otherText}>Other Wifi</Text>
      </TouchableOpacity>
       <TouchableOpacity
            style={[GlobalStyles.button, { marginTop: 16 }]}
            onPress={() => {}}
          >
            <Text style={GlobalStyles.buttonText}>Scan</Text>
          </TouchableOpacity>
    </View>
  );
}

