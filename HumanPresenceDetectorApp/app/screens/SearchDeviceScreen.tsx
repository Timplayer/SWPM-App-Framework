import React, { useState, useEffect } from "react";
import {
    ESPDevice,
    ESPProvisionManager,
    ESPSecurity,
    ESPTransport
} from "@orbital-systems/react-native-esp-idf-provisioning";
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { GlobalStyles } from "@/app/styles/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";

export default function SearchDeviceScreen(props: { setState: (state: "start" | "code") => void, setDevice: (device: ESPDevice) => void }) {
    const { setState, setDevice } = props;
    const [allDevices, setAllDevices] = useState<ESPDevice[] | undefined>(undefined);
    const [isScanning, setIsScanning] = useState(false);

    const onSearchESPDevices = React.useCallback(async () => {
        setIsScanning(true);
        setAllDevices(undefined);
        try {
            const espDevices = await ESPProvisionManager.searchESPDevices(
                '',
                ESPTransport.ble,
                ESPSecurity.secure2
            );
            setAllDevices(espDevices);
        } catch (error) {
            console.error(error);
            setAllDevices([]); // Set to empty array on error
        } finally {
            setIsScanning(false);
        }
    }, []);

    useEffect(() => {
        onSearchESPDevices();
    }, [onSearchESPDevices]);

    const renderContent = () => {
        if (isScanning) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                    <Text style={{ marginTop: 10 }}>Scanning for devices...</Text>
                </View>
            );
        }

        if (allDevices && allDevices.length === 0) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>No devices found.</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={allDevices}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <TouchableOpacity style={GlobalStyles.card} onPress={() => {
                        setDevice(item);
                        setState("code");
                    }}>
                        <Ionicons name="hardware-chip-outline" size={24} color="black" />
                        <Text style={GlobalStyles.deviceName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        );
    }

    return (
        <View style={GlobalStyles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <TouchableOpacity onPress={() => setState("start")} style={{ padding: 8 }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={GlobalStyles.header}>Search for Devices</Text>
            </View>

            {renderContent()}

            <TouchableOpacity
                style={[GlobalStyles.button, { marginTop: 16 }]}
                onPress={onSearchESPDevices}
                disabled={isScanning}
            >
                <Text style={GlobalStyles.buttonText}>Scan Again</Text>
            </TouchableOpacity>
        </View>
    );
}