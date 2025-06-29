import * as ServiceDiscovery from '@inthepocket/react-native-service-discovery';
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { GlobalStyles } from '../styles/GlobalStyles';

export default function DeviceSettingsScreen() {
  const router = useRouter();

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Settings</Text>

      <TextInput style={GlobalStyles.input} placeholder="mqtt server" />
      <TextInput style={GlobalStyles.input} placeholder="turn off delay" />

      <TouchableOpacity style={GlobalStyles.resetButton}>
        <Text style={GlobalStyles.resetText}>Reset Device</Text>
      </TouchableOpacity>

      <TouchableOpacity style={GlobalStyles.applyButton}>
        <Text style={GlobalStyles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

