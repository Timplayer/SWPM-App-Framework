
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddDeviceScreen from './screens/AddDeviceScreen';
import MyDevicesScreen from './screens/MyDevicesScreen';


const Tab = createBottomTabNavigator();

export default function Index() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="My Devices" component={MyDevicesScreen} />
      <Tab.Screen name="Add Device" component={AddDeviceScreen} />
    </Tab.Navigator>
  );
}


