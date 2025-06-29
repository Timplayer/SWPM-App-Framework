import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { allDevices } from '../screens/Devices';
import { GlobalStyles } from '../styles/GlobalStyles';



export default function MyDevicesScreen() {
  const router = useRouter(); 

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Text style={GlobalStyles.header}>My Devices</Text>

      <FlatList
        data={allDevices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={GlobalStyles.card}>
            <MaterialCommunityIcons name="card" size={24} color="black" />

            <View style={GlobalStyles.deviceInfo}>
              <Text style={GlobalStyles.deviceTitle}>{item.name}</Text>
              <Text style={GlobalStyles.deviceSubtitle}>{item.subtitle}</Text>
            </View>

            <View style={GlobalStyles.deviceIcons}>
              <MaterialCommunityIcons name="battery" size={24} color="black" />

             
              <TouchableOpacity onPress={() => router.push('/screens/DeviceSettingsScreen')}>
                <Ionicons name="settings-sharp" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

