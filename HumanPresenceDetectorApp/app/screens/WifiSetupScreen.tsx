import {useRouter} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {GlobalStyles} from '../styles/GlobalStyles';
import {ESPDevice, ESPWifiAuthMode, ESPWifiList} from "@orbital-systems/react-native-esp-idf-provisioning";

export default function WifiSetupScreen(props: {setState:(state: "wifiPassword" | "wifiOther") => void, device: ESPDevice, setWifi: (wifi: ESPWifiList) => void}) {
    const {setState, device, setWifi} = props;
    const router = useRouter();

    const [foundWifis, setfoundWifis] = useState<ESPWifiList[]>();
    // get a list of nearby devices
    const onSearchESPWifis = React.useCallback(async () => {
        try {
            setfoundWifis(undefined);
            const espWifiLists = await device.scanWifiList();
            setfoundWifis(espWifiLists);
        } catch (error) {
            setfoundWifis([{
                ssid: "test",
                rssi: 3,
                auth: ESPWifiAuthMode.wpa2Psk
            }]);
            console.error(error);
        }
    }, []);

    useEffect(() => {onSearchESPWifis().then()}, [""])

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>Available Networks</Text>

      {foundWifis?.map((wifi, index) => (
        <TouchableOpacity
          key={index}
          style={GlobalStyles.wifiButton}
          onPress={() => {setWifi(wifi); setState("wifiPassword")}}
        >
          <Text style={GlobalStyles.wifiText}>{wifi.ssid}</Text>
        </TouchableOpacity>
      ))}

      <View style={{ height: 60 }} /> {}

      <TouchableOpacity
        style={GlobalStyles.otherButton}
        onPress={() => {setState("wifiOther")}}
      >
        <Text style={GlobalStyles.otherText}>Other Wifi</Text>
      </TouchableOpacity>
       <TouchableOpacity
            style={[GlobalStyles.button, { marginTop: 16 }]}
            onPress={onSearchESPWifis}
          >
            <Text style={GlobalStyles.buttonText}>Scan</Text>
          </TouchableOpacity>
    </View>
  );
}

