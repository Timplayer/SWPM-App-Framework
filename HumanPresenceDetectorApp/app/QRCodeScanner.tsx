import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ESPDevice, ESPTransport, ESPSecurity } from "@orbital-systems/react-native-esp-idf-provisioning";

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    try {
      const qrData = JSON.parse(data);
      if (qrData.ver === "v1" && qrData.name && qrData.pop && qrData.transport === "ble") {
        const device: ESPDevice = {
          name: qrData.name,
          transport: ESPTransport.ble,
          security: ESPSecurity.secure2, // Assuming secure2 as default for BLE provisioning
        };
        console.log("Device from QR code:", device);
        router.push({
          pathname: '/code',
          params: { device: JSON.stringify(device), pop: qrData.pop },
        });
      } else {
        alert('Invalid QR code data format.');
      }
    } catch (error) {
      alert('Invalid QR code data.');
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    return <Text>Zugriff auf Kamera verweigert</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      {scanned && (
        <TouchableOpacity onPress={() => setScanned(false)} style={styles.button}>
          <Text style={styles.buttonText}>Erneut scannen</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    left: '20%',
    right: '20%',
    backgroundColor: '#0f6b5c',
    borderRadius: 30,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});