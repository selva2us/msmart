import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Snackbar, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { registerUser } from '../api/authAPI';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState('');
  const [mobile, setMobile] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) {
      setSnackbar('Please fill all fields.');
      return;
    }
    if (password !== confirm) {
      setSnackbar('Passwords do not match.');
      return;
    }

   setLoading(true);
    try {
      const userData = { name, email, password, mobile, companyName };
      const data = await registerUser(userData);
      console.log('Registration success:', data);
      setSnackbar('Account created successfully!');
       setLoading(false);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.imgur.com/Qn4xKpL.jpg' }}
      style={styles.bg}
      blurRadius={3}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />
        <TextInput
          label="Mobile"
          value={mobile}
          onChangeText={setMobile}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
          left={<TextInput.Icon icon="phone" />}
        />
        <TextInput
          label="Company Name"
          value={companyName}
          onChangeText={setCompanyName}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="office-building" />}
        />
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
        <TextInput
          label="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          left={<TextInput.Icon icon="lock-check" />}
        />

        {loading ? (
          <ActivityIndicator animating color="#ff6f61" />
        ) : (
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            buttonColor="#ff6f61"
          >
            Register
          </Button>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
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

export default RegisterScreen;
