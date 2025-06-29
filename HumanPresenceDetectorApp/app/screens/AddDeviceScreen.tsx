import {useLocalSearchParams, useRouter} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, SafeAreaView} from 'react-native';
import {GlobalStyles} from '../styles/GlobalStyles';
import SearchDeviceScreen from "@/app/screens/SearchDeviceScreen";
import {ESPDevice, ESPWifiList} from "@orbital-systems/react-native-esp-idf-provisioning";
import AddDeviceCodeScreen from "@/app/screens/AddDeviceCodeScreen";
import WifiSetupScreen from "@/app/screens/WifiSetupScreen";
import WifiSetupPasswordScreen from "@/app/screens/WifiSetupPasswordScreen";
import WifiConnectScreen from "@/app/screens/OtherWifiScreen";
import QRCodeScannerScreen from "@/app/screens/QRCodeScannerScreen";

import { Ionicons } from '@expo/vector-icons';

export default function AddDeviceScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [state, setState] = useState<"start" | "search" | "code" | "searchWifi" | "qr" | "wifiPassword" | "wifiOther">("start")
    const [device, setDevice] = useState<ESPDevice | undefined>(undefined);
    const [wifi, setWifi] = useState<ESPWifiList | undefined>(undefined);

    useEffect(() => {
        if (params.state === "code" && params.device) {
            setDevice(JSON.parse(params.device as string));
            setState("code");
        }
    }, [params]);

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
                        onPress={() => setState("qr")}
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
            {state === "qr" && (
                <QRCodeScannerScreen setState={setState} setDevice={setDevice}  />
            )}


        </SafeAreaView>

    );
}

