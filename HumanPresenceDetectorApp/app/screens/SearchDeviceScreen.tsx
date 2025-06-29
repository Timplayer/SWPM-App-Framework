import React, { useState, useEffect } from "react";
import {
    ESPDevice,
    ESPProvisionManager,
    ESPSecurity,
    ESPTransport
} from "@orbital-systems/react-native-esp-idf-provisioning";
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator, TextInput } from "react-native";
import { GlobalStyles } from "@/app/styles/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";

export default function SearchDeviceScreen(props: { setState: (state: "start" | "code") => void, setDevice: (device: ESPDevice) => void }) {
    const { setState, setDevice } = props;
    const [allDevices, setAllDevices] = useState<ESPDevice[] | undefined>(undefined);
    const [isScanning, setIsScanning] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredDevices = React.useMemo(() => {
        if (!allDevices) return [];
        return allDevices.filter(device =>
            device.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allDevices, searchQuery]);

    const renderContent = () => {
        if (isScanning) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                    <Text style={{ marginTop: 10 }}>Scanning for devices...</Text>
                </View>
            );
        }

        if (filteredDevices.length === 0) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>No devices found matching your search.</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={filteredDevices}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <TouchableOpacity style={GlobalStyles.card} onPress={() => {
                        console.log("Selected device from search:", item);
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
        <View style={[GlobalStyles.container, {paddingBottom: 80, paddingTop: 60}]}>
            <TouchableOpacity style={{
                position: 'absolute',
                top: 40,
                left: 20,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 20,
                padding: 8,
            }} onPress={() => setState("start")}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={[GlobalStyles.header, {textAlign: 'center', marginBottom: 16}]}>Search for Devices</Text>

            <View style={GlobalStyles.searchInput}>
                <TextInput
                    style={{ flex: 1, paddingRight: 10 }}
                    placeholder="Search devices..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close-circle" size={20} color="gray" />
                    </TouchableOpacity>
                )}
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