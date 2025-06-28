
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddDeviceScreen from './screens/AddDeviceScreen';
import MyDevicesScreen from './screens/MyDevicesScreen';
import {SafeAreaView} from "react-native";


const Tab = createBottomTabNavigator();

export default function Index() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="My Devices" component={MyDevicesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Add Device" component={AddDeviceScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}


