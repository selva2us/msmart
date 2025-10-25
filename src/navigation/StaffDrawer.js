import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Import your screens
import POSMainScreen from '../screens/billing/POSMainScreen';
import BillingScreen from '../screens/billing/BillingScreen';
import TransactionHistoryScreen from '../screens/billing/TransactionHistoryScreen';
import BillingReceiptScreen from '../screens/billing/BillReceiptScreen';
import BillingPOSScreen from '../screens/billing/StaffPOSScreen';
import PaymentScreen from '../screens/billing/PaymentScreen';

const Drawer = createDrawerNavigator();

function CustomStaffDrawerContent() {
  const navigation = useNavigation();
  const [activeScreen, setActiveScreen] = useState('Dashboard');
  const [user, setUser] = useState({ name: '', email: '' });

useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) setUser(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    };
    fetchUser();
  }, []);

  const menuItems = [
    { label: 'Dashboard', icon: 'view-dashboard-outline', screen: 'Dashboard' },
    { label: 'Add New Bill', icon: 'plus-box-outline', screen: 'Billing' },
    { label: 'Transaction History', icon: 'history', screen: 'Transaction History', badge: 3 },
   
  ];

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const handleNavigate = (screen) => {
    setActiveScreen(screen);
    navigation.navigate('StaffApp', { screen });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <LinearGradient colors={['#2E7DFF', '#1B4FFF']} style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </LinearGradient>

      {/* Menu Items */}
      <View style={styles.menu}>
        {menuItems.map((item, index) => {
          const isActive = activeScreen === item.screen;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handleNavigate(item.screen)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: isActive ? '#2E7DFF' : '#E3EEFF' },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={isActive ? '#fff' : '#2E7DFF'}
                />
              </View>
              <Text
                style={[
                  styles.menuLabel,
                  isActive && { color: '#2E7DFF', fontWeight: '700' },
                ]}
              >
                {item.label}
              </Text>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer / Logout */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="logout" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function StaffDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={() => <CustomStaffDrawerContent />}
      screenOptions={{
        headerShown: true,
        drawerStyle: { backgroundColor: '#F9FAFB', width: 280 },
        headerStyle: { backgroundColor: '#2E7DFF' },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen name="Dashboard" component={POSMainScreen} />
      <Drawer.Screen name="Billing" component={BillingScreen} />
      <Drawer.Screen name="Receipt" component={BillingReceiptScreen} />
      <Drawer.Screen name="POS Billing" component={BillingPOSScreen} />
      <Drawer.Screen name="Payment" component={PaymentScreen} />
      <Drawer.Screen name="Transaction History" component={TransactionHistoryScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 30,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#fff' },
  name: { fontSize: 20, fontWeight: '700', color: '#fff' },
  email: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  menu: { flex: 1, marginTop: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: '#F1F5FF',
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: 'rgba(46,125,255,0.1)',
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: { fontSize: 16, fontWeight: '600', color: '#1E1E1E' },
  badge: {
    position: 'absolute',
    right: 20,
    top: 14,
    backgroundColor: '#FF6F61',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#E5E5E5' },
  logoutBtn: {
    backgroundColor: '#FF6F61',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
