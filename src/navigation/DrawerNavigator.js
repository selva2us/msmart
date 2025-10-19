import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import AdminDashboard from '../screens/AdminDashboard';
import AddProduct from '../screens/AddProduct';
import ViewProduct from '../screens/ViewProduct';
import LowStockScreen from '../screens/LowStockScreen';
import BrandScreen from '../screens/BrandScreen';
import CategoryScreen from '../screens/CategoryScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

// Custom Drawer Content
function CustomDrawerContent(props) {
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
        <Text style={styles.name}>Admin Name</Text>
        <Text style={styles.email}>admin@example.com</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        <DrawerItem
          label="Dashboard"
          icon={({ color, size }) => <Icon name="view-dashboard" color={color} size={size} />}
          onPress={() => navigation.navigate('MainApp', {screen: 'Dashboard'} )}
        />
        <DrawerItem
          label="Add Product"
          icon={({ color, size }) => <Icon name="plus-box" color={color} size={size} />}
          onPress={() => navigation.navigate('MainApp', { screen: 'Add Product' })}
        />
        <DrawerItem
          label="View Products"
          icon={({ color, size }) => <Icon name="cart" color={color} size={size} />}
          onPress={() => navigation.navigate('MainApp', { screen: 'View Products' })}
        />
        <DrawerItem
          label="Manage Brand"
          icon={({ color, size }) => <Icon name="cart" color={color} size={size} />}
          onPress={() => navigation.navigate('MainApp', { screen: 'Add Brand' })}
        />

        <DrawerItem
          label="Manage Category"
          icon={({ color, size }) => <Icon name="cart" color={color} size={size} />}
          onPress={() => navigation.navigate('MainApp', { screen: 'Add Category' })}
        />

        <DrawerItem
          label="Low Stocks"
          icon={({ color, size }) => <Icon name="alert-circle-outline" color={color} size={size} />}
          onPress={() => navigation.navigate('MainApp', { screen: 'Low Stocks' })}
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

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: { backgroundColor: '#f9f9f9', width: 260 },
        drawerActiveTintColor: '#ff6f61',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen name="Dashboard" component={AdminDashboard} />
      <Drawer.Screen name="Add Product" component={AddProduct} />
      <Drawer.Screen name="View Products" component={ViewProduct} />
       <Drawer.Screen name="Add Brand" component={BrandScreen} />
       <Drawer.Screen name="Add Category" component={CategoryScreen} />
      <Drawer.Screen name="Low Stocks" component={LowStockScreen} />
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
