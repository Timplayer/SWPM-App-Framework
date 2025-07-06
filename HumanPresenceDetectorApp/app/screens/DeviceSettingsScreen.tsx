import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';

export default function DeviceSettingsScreen() {
  const router = useRouter();
  const { ip } = useLocalSearchParams<{ ip: string }>();

  /** Shared busy state so the UI shows a spinner while *any* request is running */
  const [busy, setBusy] = useState(false);

  /** ---- NEW STATE VALUES FOR THE NETWORK SETTINGS FORM ---- */
  const [mqttServer, setMqttServer] = useState('');
  const [mqttPort, setMqttPort] = useState('1883');
  const [mqttTopic, setMqttTopic] = useState('');
  const [turnOffDelay, setTurnOffDelay] = useState(''); // kept for future use on its own endpoint

  /** Send a GET to /reset to reboot the MCU */
  const resetDevice = async () => {
    if (!ip) {
      Alert.alert('Error', 'No IP address supplied.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`http://${ip}/reset`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      Alert.alert('Success', 'Reset command sent.');
    } catch (err) {
      console.warn(err);
      Alert.alert('Failed', 'Could not reach device.');
    } finally {
      setBusy(false);
    }
  };

  /**
   * POST the MQTT configuration that the ESP32 handler expects:
   *   - mqttServer
   *   - mqttPort
   *   - mqttTopic
   *
   * The firmware’s handler is registered like this:
   *     server_.on("/mqtt", HTTP_POST, ...)
   * so we mirror that signature here.
   */
  const applySettings = async () => {
    if (!ip) {
      Alert.alert('Error', 'No IP address supplied.');
      return;
    }

    if (!mqttServer || !mqttPort || !mqttTopic) {
      Alert.alert('Error', 'Please fill out MQTT server, port and topic.');
      return;
    }

    setBusy(true);
    try {
      // Build x‑www‑form‑urlencoded payload the AsyncWebServer wrapper parses easily
      const formBody = `mqttServer=${encodeURIComponent(mqttServer)}&mqttPort=${encodeURIComponent(
        mqttPort,
      )}&mqttTopic=${encodeURIComponent(mqttTopic)}`;

      const res = await fetch(`http://${ip}/mqtt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      Alert.alert('Success', 'MQTT configuration updated!');
      router.back();
    } catch (err) {
      console.warn(err);
      Alert.alert('Failed', 'Could not update configuration.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={GlobalStyles.container}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={GlobalStyles.header}>Device Settings</Text>

        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Network Settings</Text>

          <TextInput
            style={GlobalStyles.input}
            placeholder="MQTT Server"
            placeholderTextColor="#888"
            value={mqttServer}
            onChangeText={setMqttServer}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={GlobalStyles.input}
            placeholder="MQTT Port"
            placeholderTextColor="#888"
            value={mqttPort}
            onChangeText={setMqttPort}
            keyboardType="numeric"
          />
          <TextInput
            style={GlobalStyles.input}
            placeholder="MQTT Topic"
            placeholderTextColor="#888"
            value={mqttTopic}
            onChangeText={setMqttTopic}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={GlobalStyles.input}
            placeholder="Turn‑Off Delay (s)"
            placeholderTextColor="#888"
            value={turnOffDelay}
            onChangeText={setTurnOffDelay}
            keyboardType="numeric"
          />
        </View>

        {/* Reset button */}
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

        {/* Apply / Save button */}
        <TouchableOpacity
          style={GlobalStyles.applyButton}
          onPress={applySettings}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={GlobalStyles.applyText}>Apply</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
