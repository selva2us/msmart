import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Snackbar, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState('');

 useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('userToken');

      if (storedUser && token) {
        const user = JSON.parse(storedUser);
        dispatch(setUser(user));

        // Navigate to respective dashboard
        if (user.role === 'admin') {
          navigation.replace('AdminDrawer');
        } else if (user.role === 'staff') {
          navigation.replace('StaffDrawer');
        } else {
          navigation.replace('MainApp'); // fallback
        }
      }
    };
    checkUser();
  }, []);

  // 🔐 Login handler
  const handleLogin = async () => {
    if (!email || !password) {
      setSnackbar('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // Fake login (can be replaced by backend API later)
      let user = null;

      if (email === 'admin@shop.com' && password === 'admin123') {
        user = { name: 'Admin User', email, role: 'admin' };
      } else if (email === 'staff@shop.com' && password === 'staff123') {
        user = { name: 'Staff Member', email, role: 'staff' };
      } else {
        setSnackbar('Invalid credentials.');
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.setItem('userToken', 'demoToken');
      dispatch(setUser(user));

      if (user.role === 'admin') {
        navigation.replace('AdminDrawer');
      } else {
        navigation.replace('StaffDrawer');
      }

    } catch (error) {
      console.error(error);
      setSnackbar('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <ImageBackground
      source={{ uri: 'https://i.imgur.com/hg4sYBt.jpg' }}
      style={styles.bg}
      blurRadius={4}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          style={styles.input}
          left={<TextInput.Icon icon="email" />}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
        />

        {loading ? (
          <ActivityIndicator animating color="#ff6f61" />
        ) : (
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            buttonColor="#ff6f61"
          >
            Login
          </Button>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don’t have an account? Register</Text>
        </TouchableOpacity>

        <Snackbar
          visible={!!snackbar}
          onDismiss={() => setSnackbar('')}
          duration={2000}
        >
          {snackbar}
        </Snackbar>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff6f61',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 5,
  },
  link: {
    textAlign: 'center',
    color: '#333',
    marginTop: 12,
  },
});

export default LoginScreen;
