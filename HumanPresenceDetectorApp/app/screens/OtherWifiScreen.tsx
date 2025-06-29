import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import {ESPDevice} from "@orbital-systems/react-native-esp-idf-provisioning";

export default function WifiConnectScreen(props: { setState: (state: "start") => void; device: ESPDevice;}) {
  const {setState, device} = props;
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Connect to Wi-Fi</Text>
      <TextInput
        placeholder="Wi-Fi SSID"
        style={GlobalStyles.input}
        value={ssid}
        onChangeText={setSsid}
      />
      <TextInput
        placeholder="Wi-Fi Password"
        style={GlobalStyles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={GlobalStyles.button} onPress={async () => {
          try {
              await device.provision(ssid, password);
              setState("start");
          } catch (e) {
              console.error(e);
              // TODO
              setState("start");
          }
      }}>
        <Text style={GlobalStyles.buttonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
}

