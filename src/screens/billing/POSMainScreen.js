// src/screens/POSMainScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const POSMainScreen = () => {
  const navigation = useNavigation();
  const [staff, setStaff] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  const glowAnim = new Animated.Value(0);

  const todaysSales = '₹1,250';
  const pendingBills = 3;
  const lowStockCount = 5; // 🔴 Will glow if > 0

  useEffect(() => {
    const fetchStaff = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) setStaff(JSON.parse(userData));
    };
    fetchStaff();

    const interval = setInterval(() => {
      const now = new Date();
      setDateTime(now);
      const hour = now.getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const glowShadow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 12],
  });

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.title}>🧾 POS Dashboard</Text>

      {/* Greeting + Clock */}
      <View style={styles.greetingRow}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            {greeting}, {staff?.name || 'Staff'} 👋
          </Text>
          <Text style={styles.subGreetingText}>Here’s today’s quick summary</Text>
        </View>

        <Animated.View style={[styles.digitalClock, { shadowRadius: glowShadow }]}>
          <Text style={styles.digitalTime}>
            {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </Text>
          <Text style={styles.digitalDate}>
            {dateTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </Text>
        </Animated.View>
      </View>

      {/* Staff Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>👤 Staff: {staff?.name || 'Unknown'}</Text>
        <Text style={styles.infoText}>🕒 Shift: Morning</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Animated.View style={[styles.statCard, { shadowRadius: glowShadow, shadowColor: '#4CAF50' }]}>
          <FontAwesome5 name="rupee-sign" size={20} color="#333" />
          <Text style={styles.statTitle}>Today's Sales</Text>
          <Text style={styles.statValue}>{todaysSales}</Text>
        </Animated.View>

        <Animated.View style={[styles.statCard, { shadowRadius: glowShadow, shadowColor: '#FF9800' }]}>
          <MaterialIcons name="receipt-long" size={22} color="#333" />
          <Text style={styles.statTitle}>Pending Bills</Text>
          <Text style={styles.statValue}>{pendingBills}</Text>
        </Animated.View>
      </View>

      {/* Low Stock */}
      <Animated.View
        style={[
          styles.statCard,
          styles.fullWidthCard,
          lowStockCount > 0
            ? { shadowColor: '#f44336', shadowRadius: glowShadow, elevation: 4 }
            : { elevation: 1 },
        ]}
      >
        <Ionicons name="cube-outline" size={24} color="#333" />
        <Text style={styles.statTitle}>Low Stock Items</Text>
        <Text
          style={[
            styles.statValue,
            { color: lowStockCount > 0 ? '#d32f2f' : '#111' },
          ]}
        >
          {lowStockCount}
        </Text>
      </Animated.View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('StaffApp', { screen: 'Billing' })}
        >
          <MaterialIcons name="point-of-sale" size={22} color="#fff" />
          <Text style={styles.buttonText}>Start New Bill</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('StaffApp', { screen: 'Transaction History' })}
        >
          <MaterialIcons name="history" size={22} color="#fff" />
          <Text style={styles.buttonText}>View Past Bills</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ff6f61' }]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={22} color="#fff" />
          <Text style={styles.buttonText}>End Shift / Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default POSMainScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fb', padding: 16 },
  title: { fontSize: 26, fontWeight: '700', color: '#222', textAlign: 'center', marginBottom: 20 },

  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greetingContainer: { flex: 1, marginRight: 10 },
  greetingText: { fontSize: 20, fontWeight: '600', color: '#333' },
  subGreetingText: { fontSize: 14, color: '#666', marginTop: 4 },

  digitalClock: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#00ff00',
  },
  digitalTime: {
    color: '#39ff14',
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: '700',
    textShadowColor: '#00ff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  digitalDate: {
    color: '#39ff14',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'monospace',
    textShadowColor: '#00ff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },

  infoCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 20, elevation: 2 },
  infoText: { fontSize: 15, color: '#444', marginVertical: 2 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
  },
  fullWidthCard: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  statTitle: { fontSize: 14, fontWeight: '600', color: '#555', marginTop: 6 },
  statValue: { fontSize: 20, fontWeight: '700', color: '#111', marginTop: 4 },

  buttonContainer: { marginTop: 25 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
