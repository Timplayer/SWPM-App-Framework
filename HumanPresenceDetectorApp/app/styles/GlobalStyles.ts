
import { StyleSheet } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  // groundlayout
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,},
  
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  largeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  // textfelder
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  inputWithMoreSpacing: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },

  otherButton: {
    backgroundColor: '#cfd8dc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  otherText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    backgroundColor: '#0f6b5c',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  
  buttonLarge: {
    backgroundColor: '#0f6b5c',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonTextLarge: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },

  // Wi-Fi Buttons
  wifiButton: {
    backgroundColor: '#e0f2f1',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  wifiText: {
    fontSize: 18,
    color: '#000',
  },
  otherWifiButton: {
    backgroundColor: '#cfd8dc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 48, //
  },
  otherWifiText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  
  resetButton: {
    backgroundColor: '#00695c',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  resetText: {
    color: 'white',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#00695c',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: 120,
  },
  applyText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // device infos
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  deviceSubtitle: {
    fontSize: 14,
    color: '#777',
  },
  deviceIcons: {
    flexDirection: 'row',
    gap: 10,
  },
});
