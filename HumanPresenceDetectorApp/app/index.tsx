
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddDeviceScreen from './screens/AddDeviceScreen';
import MyDevicesScreen from './screens/MyDevicesScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function Index() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'My Devices') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Add Device') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 15,
          height: 60,
          backgroundColor: 'white',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        tabBarActiveTintColor: '#0f6b5c',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="My Devices" component={MyDevicesScreen} />
      <Tab.Screen name="Add Device" component={AddDeviceScreen} />
    </Tab.Navigator>
  );
}


