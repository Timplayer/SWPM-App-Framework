import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Device } from '../Device';
import { GlobalStyles } from '../styles/GlobalStyles';

export const allDevices: Device[] = [
  { id: '1', name: 'Sensor 1', subtitle: 'Online', battery: 80 },
  { id: '2', name: 'Sensor 2', subtitle: 'Offline', battery: 60 },
  { id: '3', name: 'Sensor 3', subtitle: 'Online', battery: 95 },
];


export default function AddDeviceScreen() {
  const router = useRouter();

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Available Devices</Text>

      <FlatList
        data={allDevices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={GlobalStyles.card} onPress={() => router.push({ pathname: '/screens/AddDeviceCodeScreen', params: { deviceId: item.id } })}>
            <Text style={GlobalStyles.deviceName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
       <TouchableOpacity
      style={GlobalStyles.button}
      onPress={() => router.push('/screens/WifiSetupScreen')}
    >
      <Text style={GlobalStyles.buttonText}>Scan QR Code</Text>
    </TouchableOpacity>
  </View>
   
  );
}

