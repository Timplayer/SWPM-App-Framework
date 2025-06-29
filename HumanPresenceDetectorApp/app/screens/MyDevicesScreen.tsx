import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,      // 👈 ➊ new import
} from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import * as ServiceDiscovery from '@inthepocket/react-native-service-discovery';
import { Device } from '@/app/Device';

export default function MyDevicesScreen() {
  const router = useRouter();

  // state that forces a re-render when we mutate the ref
  const [, forceUpdate] = useState({});
  const allDevices = useRef<{ [key: string]: Device }>({});

  // 👈 ➋ pull-to-refresh state
  const [refreshing, setRefreshing] = useState(false);

  // discovery listeners (keep the [] dependency array so we don’t add duplicates)
  useEffect(() => {
    const onFound = (service: Device) => {
      allDevices.current[service.hostName] = service;
      forceUpdate({});
    };
    const onLost = (service: Device) => {
      delete allDevices.current[service.hostName];
      forceUpdate({});
    };

    ServiceDiscovery.addEventListener('serviceFound', onFound);
    ServiceDiscovery.addEventListener('serviceLost', onLost);
    ServiceDiscovery.startSearch('sensor');

  }, []);

  // 👈 ➌ refresh handler the list will call
  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    // clear existing list
    allDevices.current = {};
    forceUpdate({});
    console.log(allDevices);

    // restart discovery
    await ServiceDiscovery.stopSearch('sensor');
    await ServiceDiscovery.startSearch('sensor');

    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>My Devices</Text>

      <FlatList
        data={Object.values(allDevices.current)}
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
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/screens/DeviceSettingsScreen',
                    params: { ip: item.addresses?.[0] ?? '' },
                  })
                }
              >
                <Ionicons name="settings-sharp" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        // 👇 ➍ wire up pull-to-refresh
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
