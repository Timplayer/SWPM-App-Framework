import {Button, Text} from "react-native";
import React, {useState} from "react";
import {
    ESPDevice,
    ESPProvisionManager,
    ESPSecurity,
    ESPTransport
} from "@orbital-systems/react-native-esp-idf-provisioning";

export default function Setup() {
    const [loading, setLoading] = useState(false);
    const [devices, setDevices] = useState<ESPDevice[] | undefined>([]);

    // get a list of nearby devices
    const onSearchESPDevices = React.useCallback(async () => {
        try {
            setLoading(true);
            setDevices(undefined);
            const espDevices = await ESPProvisionManager.searchESPDevices(
                '',
                ESPTransport.ble,
                ESPSecurity.secure2
            );
            setLoading(false);
            setDevices(espDevices);
        } catch (error) {
            setDevices([]);
            setLoading(false);
            console.error(error);
        }
    }, []);




    return (
        <>
            {loading ? <Text>Loading ... </Text> :
            devices?.flatMap(device => (<Text>{device.name}</Text>))}
            <Button title={"load" } onPress={onSearchESPDevices}></Button>
        </>
    )
}