import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
      <Text style={GlobalStyles.title}>Settings</Text>

      <TextInput style={GlobalStyles.input} placeholder="mqtt server" />
      <TextInput style={GlobalStyles.input} placeholder="turn off delay" />

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
