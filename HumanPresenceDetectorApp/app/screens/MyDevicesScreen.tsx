import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import * as ServiceDiscovery from '@inthepocket/react-native-service-discovery';
import { GlobalStyles } from '../styles/GlobalStyles';
import { Device } from '@/app/Device';

export default function MyDevicesScreen() {
  const router = useRouter();

  /** Keeps the list of devices that answer “ESP-ok” */
  const validDevices = useRef<{ [key: string]: Device }>({});
  /** Presence status for every device (true = person present) */
  const presenceStatus = useRef<{ [key: string]: boolean }>({});

  const [, forceUpdate] = useState<{}>({});
  const [refreshing, setRefreshing] = useState(false);

  const POLL_INTERVAL_MS = 1000; // 1 s

  /* ---------- tiny HTTP helpers ------------------------------------------ */
  /** Checks if the root endpoint answers “ESP32 OK” */
  const espOk = async (ip: string): Promise<boolean> => {
    try {
      /* Abort fetch if it takes >1.5 s */
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);

      const res = await fetch(`http://${ip}/`, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) return false;
      const body = (await res.text()).trim();
      return body === 'ESP32 OK';
    } catch {
      return false;
    }
  };

  /** Queries the /presence endpoint of an ESP and returns true/false if a person is detected. */
  const fetchPresence = async (ip: string): Promise<boolean | null> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`http://${ip}/sensor`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) return null;

      /* {is_person : true} */
      const json = await res.json();
      return json.is_person === true;
    } catch {
      return null;
    }
  };

  /** Updates the local presence status for one device */
  const updatePresence = async (device: Device) => {
    const ip = device.addresses?.[0];
    if (!ip) return;
    const present = await fetchPresence(ip);
    if (present !== null) {
      presenceStatus.current[device.hostName] = present;
      forceUpdate({});
    }
  };

  /* ---------- service‑discovery listeners -------------------------------- */
  useEffect(() => {
    const onFound = async (service: Device) => {
      const ip = service.addresses?.[0];
      if (!ip) return;

      if (!(await espOk(ip))) {
        console.log(`${service.hostName} ignored (no ESP‑ok)`);
        return;
      }

      console.log(`${service.hostName} accepted (ESP‑ok)`);
      validDevices.current[service.hostName] = service;
      await updatePresence(service); // initial presence query
      forceUpdate({});
    };

    const onLost = (service: Device) => {
      delete validDevices.current[service.hostName];
      delete presenceStatus.current[service.hostName];
      forceUpdate({});
    };

    ServiceDiscovery.addEventListener('serviceFound', onFound);
    ServiceDiscovery.addEventListener('serviceLost', onLost);
    ServiceDiscovery.startSearch('sensor');

    /* Poll every 3 s for presence updates */
    const interval = setInterval(async () => {
      const devices = Object.values(validDevices.current);
      for (const d of devices) updatePresence(d);
    }, 1000);

    return () => {
      ServiceDiscovery.stopSearch('sensor');
      clearInterval(interval);
    };
  }, []);

  /* ---------- pull‑to‑refresh -------------------------------------------- */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    validDevices.current = {};
    presenceStatus.current = {};
    forceUpdate({});
    await ServiceDiscovery.stopSearch('sensor');
    await ServiceDiscovery.startSearch('sensor');
    setRefreshing(false);
  }, []);

  /* ---------- UI --------------------------------------------------------- */
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>My Devices</Text>

      <View style={styles.deviceListContainer}>
        <FlatList
          data={Object.values(validDevices.current)}
          keyExtractor={(item) => item.hostName}
          renderItem={({ item }) => {
            const present = presenceStatus.current[item.hostName] ?? false;
            return (
              <View style={GlobalStyles.deviceCard}>
                <MaterialCommunityIcons name="monitor" size={30} color="#0f6b5c" />

                <View style={GlobalStyles.deviceInfo}>
                  <Text style={GlobalStyles.deviceTitle}>{item.name}</Text>
                  <Text style={GlobalStyles.deviceSubtitle}>{item.hostName}</Text>
                </View>

                <View style={GlobalStyles.deviceIcons}>
                  {/* Presence indicator */}
                  <MaterialCommunityIcons
                    name={present ? 'human-greeting' : 'account-off'}
                    size={24}
                    color={present ? '#0f6b5c' : '#bbb'}
                    style={{ marginRight: 4 }}
                  />

                  <MaterialCommunityIcons name="battery-charging" size={24} color="black" />

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
            );
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
    </SafeAreaView>
  );
}

/* ---------- styles (unchanged) ------------------------------------------- */
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2f1',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 5,
    color: '#0f6b5c',
    fontWeight: 'bold',
  },
  deviceListContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
