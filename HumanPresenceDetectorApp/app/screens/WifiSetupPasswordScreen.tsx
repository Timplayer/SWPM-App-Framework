import {useLocalSearchParams} from 'expo-router';
import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View, ActivityIndicator} from 'react-native';
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
    const [connectionStatus, setConnectionStatus] = useState(''); // New state for connection status
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        setConnectionStatus("Connecting...");
        try {
            const status = await device.provision(wifi.ssid, password);
            console.log(status);
            setConnectionStatus("Connected successfully!");
            // device.disconnect(); // Disconnect after successful provisioning if needed
        } catch (error) {
            console.error(error);
            setConnectionStatus("Connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.header}>Connect to {ssid}</Text>

            <TextInput
                placeholder="Password"
                style={GlobalStyles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0f6b5c" />
            ) : (
                <TouchableOpacity style={GlobalStyles.button} onPress={handleConnect}>
                    <Text style={GlobalStyles.buttonText}>Connect</Text>
                </TouchableOpacity>
            )}

            {connectionStatus.length > 0 && (
                <Text style={{ marginTop: 20, textAlign: 'center', color: connectionStatus.includes("successfully") ? 'green' : 'red' }}>
                    {connectionStatus}
                </Text>
            )}

            {!loading && connectionStatus.length > 0 && (
                <TouchableOpacity style={[GlobalStyles.button, { marginTop: 20 }]} onPress={() => setState("start")}>
                    <Text style={GlobalStyles.buttonText}>Done</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}


