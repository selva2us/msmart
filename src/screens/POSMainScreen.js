// src/screens/POSMainScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const POSMainScreen = () => {
  const navigation = useNavigation();
  const [staff, setStaff] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const fetchStaff = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setStaff(JSON.parse(userData));
      }
    };
    fetchStaff();

    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supermarket POS</Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Staff: {staff?.name || 'Unknown'}</Text>
        <Text style={styles.label}>Shift: Morning</Text>
        <Text style={styles.label}>Time: {dateTime.toLocaleTimeString()}</Text>
        <Text style={styles.label}>Date: {dateTime.toLocaleDateString()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4caf50' }]}
          onPress={() => navigation.navigate('StaffApp', { screen: 'Billing' })}
        >
          <MaterialIcons name="point-of-sale" size={28} color="#fff" />
          <Text style={styles.buttonText}>Start New Bill</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2196f3' }]}
          onPress={() => navigation.navigate('StaffApp', { screen: 'Transaction History' })}
        >
          <MaterialIcons name="history" size={28} color="#fff" />
          <Text style={styles.buttonText}>View Past Bills</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#f44336' }]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={28} color="#fff" />
          <Text style={styles.buttonText}>End Shift / Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default POSMainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginVertical: 4,
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});
