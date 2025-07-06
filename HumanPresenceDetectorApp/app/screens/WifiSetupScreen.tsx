import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import {
  ESPDevice,
  ESPWifiAuthMode,
  ESPWifiList,
} from '@orbital-systems/react-native-esp-idf-provisioning';
import { Ionicons } from "@expo/vector-icons";

interface WifiSetupScreenProps {
  setState: (state: 'wifiPassword' | 'wifiOther' | 'start') => void;
  device: ESPDevice;
  setWifi: (wifi: ESPWifiList) => void;
}

export default function WifiSetupScreen({
  setState,
  device,
  setWifi,
}: WifiSetupScreenProps) {
  const router = useRouter();

  const [foundWifis, setFoundWifis] = useState<ESPWifiList[]>();
  const [loading, setLoading] = useState<boolean>(false);

  /** Scan for nearby Wi-Fi networks */
  const onSearchESPWifis = useCallback(async () => {
    try {
      setLoading(true);
      setFoundWifis(undefined);
      const espWifiLists = await device.scanWifiList();
      setFoundWifis(espWifiLists);
    } catch (error) {
      setFoundWifis([
        {
          ssid: 'test',
          rssi: 3,
          auth: ESPWifiAuthMode.wpa2Psk,
        },
      ]);
      console.error('Wi-Fi scan error:', error);
    } finally {
      setLoading(false);
    }
  }, [device]);

  useEffect(() => {
    onSearchESPWifis();
  }, [onSearchESPWifis]);

  return (
    <View style={GlobalStyles.container}>
      {/* ---------- Return button ---------- */}
<TouchableOpacity
  style={[styles.backButton, { zIndex: 10, elevation: 10 }]}
  onPress={() => setState('start')}>
  <Ionicons name="arrow-back" size={24} color="white" />
</TouchableOpacity>

      <Text style={GlobalStyles.header}>Available Networks</Text>

      {/* ---------- Loading / results ---------- */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 24 }} />
      ) : (
        foundWifis?.map((wifi, index) => (
          <TouchableOpacity
            key={index}
            style={GlobalStyles.wifiButton}
            onPress={() => {
              setWifi(wifi);
              setState('wifiPassword');
            }}
          >
            <Text style={GlobalStyles.wifiText}>{wifi.ssid}</Text>
          </TouchableOpacity>
        ))
      )}

      <View style={{ height: 60 }} />

      {/* Other network */}
      <TouchableOpacity
        style={GlobalStyles.otherButton}
        onPress={() => setState('wifiOther')}
        disabled={loading}
      >
        <Text style={GlobalStyles.otherText}>Other Wi-Fi</Text>
      </TouchableOpacity>

      {/* Refresh / scan button */}
      <TouchableOpacity
        style={[
          GlobalStyles.button,
          { marginTop: 16, opacity: loading ? 0.6 : 1 },
        ]}
        onPress={onSearchESPWifis}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Scanning…' : 'Scan'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  button: {
    position: "absolute",
    bottom: 40,
    left: "20%",
    right: "20%",
    backgroundColor: "#0f6b5c",
    borderRadius: 30,
    padding: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },

  /* loading overlay */
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});