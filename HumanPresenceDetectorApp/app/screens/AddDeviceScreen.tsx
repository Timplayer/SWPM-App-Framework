import {useRouter} from 'expo-router';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View, SafeAreaView} from 'react-native';
import {GlobalStyles} from '../styles/GlobalStyles';
import SearchDeviceScreen from "@/app/screens/SearchDeviceScreen";
import {ESPDevice, ESPWifiList} from "@orbital-systems/react-native-esp-idf-provisioning";
import AddDeviceCodeScreen from "@/app/screens/AddDeviceCodeScreen";
import WifiSetupScreen from "@/app/screens/WifiSetupScreen";
import WifiSetupPasswordScreen from "@/app/screens/WifiSetupPasswordScreen";
import WifiConnectScreen from "@/app/screens/OtherWifiScreen";
import { Ionicons } from '@expo/vector-icons';

export default function AddDeviceScreen() {
    const router = useRouter();
    const [state, setState] = useState<"start" | "search" | "code" | "searchWifi" | "wifiPassword" | "wifiOther">("start")
    const [device, setDevice] = useState<ESPDevice | undefined>(undefined);
    const [wifi, setWifi] = useState<ESPWifiList | undefined>(undefined);

    return (
        <SafeAreaView style={GlobalStyles.container}>
            {state === "start" && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={GlobalStyles.largeTitle}>Add a New Device</Text>

                    <TouchableOpacity
                        style={GlobalStyles.selectionCard}
                        onPress={() => setState("search")}
                    >
                        <Ionicons name="bluetooth" size={50} color="#0f6b5c" />
                        <Text style={GlobalStyles.selectionCardText}>Scan for Bluetooth Devices</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={GlobalStyles.selectionCard}
                        onPress={() => router.push('/QRCodeScanner')}
                    >
                        <Ionicons name="qr-code" size={50} color="#0f6b5c" />
                        <Text style={GlobalStyles.selectionCardText}>Scan QR Code</Text>
                    </TouchableOpacity>
                </View>
            )}
            {state === "search" && (
                <SearchDeviceScreen setState={setState} setDevice={setDevice}/>
            )}
            {state === "code" && device && (
               <AddDeviceCodeScreen setState={setState} device={device}/>
            )}
            {state === "searchWifi" && device && (
                <WifiSetupScreen setState={setState} device={device} setWifi={setWifi} />
            )}
            {state === "wifiPassword" && device && wifi && (
                <WifiSetupPasswordScreen setState={setState} device={device} wifi={wifi} />
            )}
            {state === "wifiOther" && device && (
                <WifiConnectScreen setState={setState} device={device} />
            )}


        </SafeAreaView>

    );
}

