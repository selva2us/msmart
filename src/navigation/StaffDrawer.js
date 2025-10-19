import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import BillingDashboard from '../screens/billing/BillingDashboard';
import POSMainScreen from '../screens/billing/POSMainScreen';
import BillingScreen from '../screens/billing/BillingScreen';
import TransactionHistoryScreen from '../screens/billing/TransactionHistoryScreen';
import BillingReceiptScreen from '../screens/billing/BillReceiptScreen';
import BillingPOSScreen from '../screens/billing/StaffPOSScreen';
import PaymentScreen from '../screens/billing/PaymentScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

// Custom Drawer Content
function CustomStaffDrawerContent(props) {
  const navigation = useNavigation();

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

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Staff</Text>
        <Text style={styles.email}>Staff@example.com</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        <DrawerItem
          label="Dashboard"
          icon={({ color, size }) => <Icon name="view-dashboard" color={color} size={size} />}
          onPress={() => navigation.navigate('StaffApp', {screen: 'Dashboard'} )}
        />
        <DrawerItem
          label="Add New Bill"
          icon={({ color, size }) => <Icon name="plus-box" color={color} size={size} />}
          onPress={() => navigation.navigate('StaffApp', { screen: 'Billing' })}
        /> 
        <DrawerItem
          label="Transaction History"
          icon={({ color, size }) => <Icon name="alert-circle-outline" color={color} size={size} />}
          onPress={() => navigation.navigate('StaffApp', { screen: 'Transaction History' })}
        />
      </View>

      {/* Logout at bottom */}
      <View style={styles.footer}>
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => <Icon name="logout" color={color} size={size} />}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function StaffDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomStaffDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: { backgroundColor: '#f9f9f9', width: 260 },
        drawerActiveTintColor: '#ff6f61',
        drawerInactiveTintColor: '#333',
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
    padding: 20,
    backgroundColor: '#ff6f61',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  email: { fontSize: 14, color: '#fff' },
  menu: { flex: 1, paddingTop: 10 },
  footer: { borderTopWidth: 1, borderTopColor: '#ccc', paddingBottom: 10 },
});

