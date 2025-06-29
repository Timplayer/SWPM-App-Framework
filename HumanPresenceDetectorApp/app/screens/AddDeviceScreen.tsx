import {useRouter} from 'expo-router';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {GlobalStyles} from '../styles/GlobalStyles';
import SearchDeviceScreen from "@/app/screens/SearchDeviceScreen";
import {ESPDevice, ESPWifiList} from "@orbital-systems/react-native-esp-idf-provisioning";
import AddDeviceCodeScreen from "@/app/screens/AddDeviceCodeScreen";
import WifiSetupScreen from "@/app/screens/WifiSetupScreen";
import WifiSetupPasswordScreen from "@/app/screens/WifiSetupPasswordScreen";
import WifiConnectScreen from "@/app/screens/OtherWifiScreen";

export default function AddDeviceScreen() {
    const router = useRouter();
    const [state, setState] = useState<"start" | "search" | "code" | "searchWifi" | "wifiPassword" | "wifiOther">("start")
    const [device, setDevice] = useState<ESPDevice | undefined>(undefined);
    const [wifi, setWifi] = useState<ESPWifiList | undefined>(undefined);

    return (
        <View style={GlobalStyles.container}>
            {state === "start" && (
                <>
                    <Text style={GlobalStyles.header}>Available Devices</Text>

                    <TouchableOpacity
                        style={GlobalStyles.button}
                        onPress={() => setState("search")}
                    >
                        <Text style={GlobalStyles.buttonText}>Scan Ble</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={GlobalStyles.button}
                        onPress={() => router.push('/screens/WifiSetupScreen')}
                    >
                        <Text style={GlobalStyles.buttonText}>Scan QR Code</Text>
                    </TouchableOpacity>
                </>
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


        </View>

    );
}

