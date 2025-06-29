import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function DeviceSettingsScreen() {
  const router = useRouter();
  const { ip } = useLocalSearchParams<{ ip: string }>();
  const [busy, setBusy] = useState(false);

  const resetDevice = async () => {
    if (!ip) {
      Alert.alert('Error', 'No IP address supplied.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`http://${ip}/reset`); // GET is fine for most MCU firmwares
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      Alert.alert('Success', 'Reset command sent.');
    } catch (err) {
      console.warn(err);
      Alert.alert('Failed', 'Could not reach device.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Device Settings</Text>

      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Network Settings</Text>
        <TextInput style={GlobalStyles.input} placeholder="MQTT Server" />
        <TextInput style={GlobalStyles.input} placeholder="Turn Off Delay" keyboardType="numeric" />
      </View>

      <TouchableOpacity
        style={GlobalStyles.resetButton}
        onPress={resetDevice}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={GlobalStyles.resetText}>Reset Device</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={GlobalStyles.applyButton} onPress={() => router.back()}>
        <Text style={GlobalStyles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
});
