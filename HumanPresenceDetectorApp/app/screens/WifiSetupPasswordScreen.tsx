import {useLocalSearchParams} from 'expo-router';
import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {GlobalStyles} from '../styles/GlobalStyles';
import {ESPDevice, ESPWifiList} from "@orbital-systems/react-native-esp-idf-provisioning";

export default function WifiSetupPasswordScreen(props: {
    setState: (state: "start") => void;
    device: ESPDevice;
    wifi: ESPWifiList;
}) {
    const {setState, device, wifi} = props;
    const ssid = wifi.ssid;
    const [password, setPassword] = useState('');

    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.header}>Connect to {ssid}</Text>

            <TextInput
                placeholder="Password"
                style={GlobalStyles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={GlobalStyles.button} onPress={async () => {
                console.log(password);
                try {
                    const status = await device.provision(wifi.ssid, password);
                    console.log(status);
                    device.disconnect();
                } catch (error) {
                    console.error(error);
                }
                setState("start")
            }}>
                <Text style={GlobalStyles.buttonText}>Connect</Text>
            </TouchableOpacity>
        </View>
    );
}


