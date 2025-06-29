import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ESPDevice,
  ESPTransport,
  ESPSecurity,
  ESPProvisionManager,
} from "@orbital-systems/react-native-esp-idf-provisioning";

// add every wizard step you might navigate to:
type WizardState = "start" | "qr" | "code" | "searchWifi";

interface Props {
 setState: (state: "searchWifi" | "start") => void;
  setDevice: (device: ESPDevice) => void;
}

export default function QRCodeScannerScreen({ setState, setDevice }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);     // 🆕

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || isConnecting) return;                       // debounce

    try {
      const qr = JSON.parse(data);
      const ok =
        qr?.ver === "v1" &&
        qr?.transport === "ble" &&
        typeof qr?.name === "string" &&
        typeof qr?.pop === "string";

      if (!ok) throw new Error("bad format");

      setIsConnecting(true);                                   // 🆕

      const espDevices = await ESPProvisionManager.searchESPDevices(
        qr.name,
        ESPTransport.ble,
        ESPSecurity.secure2
      );

      const device = espDevices.at(0);
      if (!device) throw new Error("device not found");

      await device.connect(qr.pop);                            // may take a few seconds
      setDevice(device as ESPDevice);

      setScanned(true);
      setState("searchWifi");
    } catch (err) {
      console.warn(err);
      alert("Ungültiger QR-Code oder keine Verbindung möglich.");
    } finally {
      setIsConnecting(false);                                  // 🆕
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) return <Text>Zugriff auf Kamera verweigert</Text>;

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned || isConnecting ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />

      {/* overlay while searching / connecting */}
      {isConnecting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Verbinde&nbsp;…</Text>
        </View>
      )}

      {/* UI chrome */}
      <TouchableOpacity style={styles.backButton} onPress={() => setState("start")}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      {scanned && !isConnecting && (
        <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
          <Text style={styles.buttonText}>Erneut scannen</Text>
        </TouchableOpacity>
      )}
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
