import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { ESPDevice, ESPWifiList } from "@orbital-systems/react-native-esp-idf-provisioning";
import { GlobalStyles } from "../styles/GlobalStyles";

type WizardState = "start" | "searchWifi" | "wifiPassword" /* … */;

export default function WifiSetupPasswordScreen(props: {
  setState: (state: "start") => void
  device: ESPDevice;
  wifi: ESPWifiList;
}) {
  const { setState, device, wifi } = props;
  const [password, setPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    setStatusMsg("Verbinde …");

    try {
      await device.provision(wifi.ssid, password);
      setStatusMsg("Verbunden!");
    } catch (err) {
      console.warn(err);
      setStatusMsg("Verbindung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      {/* main content */}
      <Text style={GlobalStyles.header}>Connect to {wifi.ssid}</Text>

      <TextInput
        placeholder="Password"
        style={GlobalStyles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <TouchableOpacity
        style={GlobalStyles.button}
        onPress={handleConnect}
        disabled={loading}          // block double taps
      >
        <Text style={GlobalStyles.buttonText}>Connect</Text>
      </TouchableOpacity>

      {statusMsg.length > 0 && (
        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
            color: statusMsg.includes("Verbunden") ? "green" : "red",
          }}
        >
          {statusMsg}
        </Text>
      )}

      {!loading && statusMsg.length > 0 && (
        <TouchableOpacity
          style={[GlobalStyles.button, { marginTop: 20 }]}
          onPress={() => setState("start")}
        >
          <Text style={GlobalStyles.buttonText}>Done</Text>
        </TouchableOpacity>
      )}

      {/* full-screen loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>{statusMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
