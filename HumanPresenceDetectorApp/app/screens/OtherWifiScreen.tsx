import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { GlobalStyles } from "../styles/GlobalStyles";
import { ESPDevice } from "@orbital-systems/react-native-esp-idf-provisioning";

type WizardState = "start" | "wifiOther" | "searchWifi" /* … */;

export default function WifiConnectScreen(props: {
  setState: (state: "start") => void
  device: ESPDevice;
}) {
  const { setState, device } = props;

  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleConnect = async () => {
    if (!ssid.trim()) {
      setStatusMsg("Bitte SSID eingeben.");
      return;
    }

    setLoading(true);
    setStatusMsg("Verbinde …");

    try {
      await device.provision(ssid, password);
      setStatusMsg("Verbunden!");
    } catch (err) {
      console.warn(err);
      setStatusMsg("Verbindung fehlgeschlagen.");
    } finally {
      setLoading(false);
      try {
        await device.disconnect();
      } catch (_) {
        /* ignore */
      }
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Connect to Wi-Fi</Text>

      <TextInput
        placeholder="Wi-Fi SSAAAID"
        style={GlobalStyles.input}
        value={ssid}
        onChangeText={setSsid}
        editable={!loading}
      />

      <TextInput
        placeholder="Wi-Fi Password"
        style={GlobalStyles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <TouchableOpacity
        style={GlobalStyles.button}
        onPress={handleConnect}
        disabled={loading}
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
