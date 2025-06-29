import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, {useEffect, useRef} from 'react';
import {FlatList, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import * as ServiceDiscovery from "@inthepocket/react-native-service-discovery";
import {Device} from "@/app/Device";



export default function MyDevicesScreen() {
  const router = useRouter();
  const allDevices = useRef<Device[]>([])

  useEffect(() => {
      ServiceDiscovery.addEventListener('serviceFound', (service) => {
          console.log('Service found', service);
          allDevices.current = [...allDevices.current, service];
      });
      ServiceDiscovery.addEventListener("serviceLost", (service) => {
          console.log('Service lost', service);
          allDevices.current=allDevices.current.filter((dev) => dev.hostName !== service.hostName);
      })
      ServiceDiscovery.startSearch('sensor').then();
  })

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>My Devices</Text>

      <FlatList
        data={allDevices.current}
        keyExtractor={(item) => item.hostName}
        renderItem={({ item }) => (
          <View style={GlobalStyles.card}>
            <MaterialCommunityIcons name="card" size={24} color="black" />

            <View style={GlobalStyles.deviceInfo}>
              <Text style={GlobalStyles.deviceTitle}>{item.name}</Text>
              <Text style={GlobalStyles.deviceSubtitle}>{item.hostName}</Text>
            </View>

            <View style={GlobalStyles.deviceIcons}>
              <MaterialCommunityIcons name="battery" size={24} color="black" />

             
              <TouchableOpacity onPress={() => router.push('/screens/DeviceSettingsScreen')}>
                <Ionicons name="settings-sharp" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

