import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GlobalStyles } from '../styles/GlobalStyles';
import {ESPDevice} from "@orbital-systems/react-native-esp-idf-provisioning";

export default function AddDeviceCodeScreen(props: {setState: (state: "searchWifi") => void, device: ESPDevice}) {
  const {setState, device} = props;
  const [code, onChangeCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onCheckCode = React.useCallback(async () => {
      try {
          setLoading(true);
          await device.connect(code);
          setState("searchWifi");
      } catch (error) {
          console.error(error);
          setLoading(false);
          // TODO remove
          setState("searchWifi");
      }
  }, [code])


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

