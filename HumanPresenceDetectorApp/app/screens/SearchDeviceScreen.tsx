import React, {useState, useEffect} from "react";
import {
    ESPDevice,
    ESPProvisionManager,
    ESPSecurity,
    ESPTransport
} from "@orbital-systems/react-native-esp-idf-provisioning";
import {FlatList, Text, TouchableOpacity} from "react-native";
import {GlobalStyles} from "@/app/styles/GlobalStyles";

export default function SearchDeviceScreen(props: {setState: (state :"code") => void, setDevice: (device :ESPDevice) => void}) {
    const {setState, setDevice} = props;
    const [allDevices, setAllDevices] = useState<ESPDevice[] | undefined>(undefined);

    // get a list of nearby devices
    const onSearchESPDevices = React.useCallback(async () => {
        try {
            setAllDevices(undefined);
            const espDevices = await ESPProvisionManager.searchESPDevices(
                '',
                ESPTransport.ble,
                ESPSecurity.secure2
            );
            setAllDevices(espDevices);
        } catch (error) {
            setAllDevices([new ESPDevice({
                name: 'name',
                transport: ESPTransport.ble,
                security: ESPSecurity.secure2,
            })]);
            console.error(error);
        }
    }, []);

    useEffect(() => {onSearchESPDevices().then()}, [""])

    return <>
        <FlatList
            data={allDevices}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
                <TouchableOpacity style={GlobalStyles.card} onPress={() => {
                    setDevice(item);
                    setState("code");
                }}>
                    <Text style={GlobalStyles.deviceName}>{item.name}</Text>
                </TouchableOpacity>
            )}
        />
        <TouchableOpacity
            style={[GlobalStyles.button, { marginTop: 16 }]}
            onPress={onSearchESPDevices}
        >
            <Text style={GlobalStyles.buttonText}>Scan</Text>
        </TouchableOpacity>
    </>

}