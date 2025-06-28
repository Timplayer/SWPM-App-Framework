import { useRouter } from 'expo-router';
import React, {useState} from 'react';
import {Button, FlatList, Text, TouchableOpacity, View} from 'react-native';
import { Device } from '../Device';
import { GlobalStyles } from '../styles/GlobalStyles';
import {
    ESPDevice,
    ESPProvisionManager,
    ESPSecurity,
    ESPTransport
} from "@orbital-systems/react-native-esp-idf-provisioning";

// const allDevices: Device[] = [
//   { id: '1', name: 'Sensor 1', subtitle: 'Online', battery: 80 },
//   { id: '2', name: 'Sensor 2', subtitle: 'Offline', battery: 60 },
//   { id: '3', name: 'Sensor 3', subtitle: 'Online', battery: 95 },
// ];


export default function AddDeviceScreen() {
  const router = useRouter();
    const [allDevices, setAllDevices] = useState<ESPDevice[] | undefined>(undefined);

// get a list of nearby devices
    const onSearchESPDevices = React.useCallback(async () => {
        try {
            setAllDevices(undefined);
            const espDevices = await ESPProvisionManager.searchESPDevices(
                '',
                ESPTransport.ble,
                ESPSecurity.secure2
            );
            setAllDevices(espDevices);
        } catch (error) {
            setAllDevices(undefined);
            console.error(error);
        }
    }, []);

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Available Devices</Text>

        <TouchableOpacity
            style={GlobalStyles.button}
            onPress={onSearchESPDevices}
        >
            <Text style={GlobalStyles.buttonText}>Scan Ble</Text>
        </TouchableOpacity>

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

