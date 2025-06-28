/*import { BarCodeScanner } from 'expo-barcode-scanner';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  
    const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    alert(`QR Code erkannt: ${data}`);
    router.push('/screens/WifiSetupScreen');
  };

  if (hasPermission === null) {
    return <Text>Frage Kamera-Erlaubnis an...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Zugriff auf Kamera verweigert</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
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
*/