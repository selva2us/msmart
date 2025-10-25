import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AdminDashboard from '../screens/AdminDashboard';
import AddProduct from '../screens/AddProduct';
import ViewProduct from '../screens/ViewProduct';
import LowStockScreen from '../screens/LowStockScreen';
import BrandScreen from '../screens/BrandScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ViewStaffScreen from '../screens/ViewStaffScreen';
import AddStaffScreen from '../screens/AddStaffScreen';
import TransactionHistoryScreen from '../screens/billing/TransactionHistoryScreen';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const Drawer = createDrawerNavigator();

function CustomDrawerContent() {
  const navigation = useNavigation();
  const [user, setUser] = useState({ name: 'Admin', email: '' });
  const [activeScreen, setActiveScreen] = useState('Dashboard');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) setUser(JSON.parse(stored));
      } catch (e) {}
    };
    fetchUser();
  }, []);

  const menuItems = [
    { label: 'Dashboard', icon: 'view-dashboard-outline', screen: 'Dashboard' },
    { label: 'Manage Brand', icon: 'tag-outline', screen: 'Add Brand' },
    { label: 'Manage Category', icon: 'shape-outline', screen: 'Add Category' },
    { label: 'Add Product', icon: 'plus-box-outline', screen: 'Add Product' },
    { label: 'View Products', icon: 'cart-outline', screen: 'View Products' },
    { label: 'Add Staffs', icon: 'account-plus-outline', screen: 'Add Staffs' },
    { label: 'View Staffs', icon: 'account-group-outline', screen: 'View Staffs' },
    { label: 'Transaction History', icon: 'history', screen: 'Transaction History', badge: 3 },
    { label: 'Low Stocks', icon: 'alert-circle-outline', screen: 'Low Stocks', badge: 4 },
    
  ];

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userData');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const handleNavigate = (screen) => {
    setActiveScreen(screen);
    navigation.navigate('MainApp', { screen });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <LinearGradient colors={['#2E7DFF', '#1B4FFF']} style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name || 'Admin'}</Text>
          <Text style={styles.email}>{user.email || 'admin@example.com'}</Text>
        </View>
      </LinearGradient>

      {/* Menu */}
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
              <Text style={[styles.menuLabel, isActive && { color: '#2E7DFF', fontWeight: '700' }]}>
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

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={() => <CustomDrawerContent />}
      screenOptions={{
        headerShown: true,
        drawerStyle: { backgroundColor: '#FFFFFF', width: 280 },
        drawerActiveTintColor: '#2E7DFF',
        drawerInactiveTintColor: '#374151',
        sceneContainerStyle: { backgroundColor: '#F6F8FB' },
      }}
    >
      <Drawer.Screen name="Dashboard" component={AdminDashboard} />
      <Drawer.Screen name="Add Product" component={AddProduct} />
      <Drawer.Screen name="View Products" component={ViewProduct} />
      <Drawer.Screen name="Add Brand" component={BrandScreen} />
      <Drawer.Screen name="Add Category" component={CategoryScreen} />
      <Drawer.Screen name="Low Stocks" component={LowStockScreen} />
      <Drawer.Screen name="Add Staffs" component={AddStaffScreen} />
      <Drawer.Screen name="View Staffs" component={ViewStaffScreen} />
      <Drawer.Screen name="Transaction History" component={TransactionHistoryScreen} />

    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 18,
    paddingTop: 42,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: 8,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  userInfo: { marginLeft: 12 },
  name: { color: '#fff', fontWeight: '700', fontSize: 18 },
  email: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4 },
  menu: { flex: 1, paddingTop: 6 },
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
  menuItemActive: { backgroundColor: 'rgba(46,125,255,0.1)' },
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
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#F1F3F5' },
  logoutBtn: {
    backgroundColor: '#FF6F61',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
});
