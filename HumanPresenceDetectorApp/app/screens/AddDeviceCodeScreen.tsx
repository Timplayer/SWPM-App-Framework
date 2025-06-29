import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import {ESPDevice} from "@orbital-systems/react-native-esp-idf-provisioning";

export default function AddDeviceCodeScreen(props: {setState: (state: "searchWifi") => void, device?: ESPDevice}) {
  const {setState} = props;
  const params = useLocalSearchParams();
  const device: ESPDevice | undefined = params.device ? JSON.parse(params.device as string) : props.device;
  const pop: string | undefined = params.pop as string;

  const [code, onChangeCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onCheckCode = React.useCallback(async () => {
      if (!device) {
          console.log("Device is undefined.");
          return;
      }
      console.log("Attempting to connect device:", device);
      console.log("POP:", pop);
      console.log("Code (if POP is not present):", code);
      try {
          setLoading(true);
          await device.connect(pop || code);
          setState("searchWifi");
      } catch (error) {
          console.error("Device connection error:", error);
          setLoading(false);
      }
  }, [code, device, pop])


  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Enter Device Code</Text>
        {loading ? (<Text>loading</Text>) : <>
            <TextInput placeholder="Enter code" style={GlobalStyles.input} onChangeText={onChangeCode}
            value={code}  />
            <TouchableOpacity style={GlobalStyles.button} onPress={() => onCheckCode()}>
                <Text style={GlobalStyles.buttonText}>OK</Text>
            </TouchableOpacity>
        </>
        }
    </View>
  );
}

