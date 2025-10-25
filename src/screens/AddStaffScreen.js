import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { addStaff as apiAddStaff, updateStaff as apiUpdateStaff, uploadImage } from '../api/staffAPI';
import { Picker } from '@react-native-picker/picker';

const AddStaffScreen = ({ navigation }) => {
  const route = useRoute();
  const staffToEdit = route.params?.staff;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('Staff');
  const [active, setActive] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // Request permission for image picker
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission denied. We need access to your gallery.');
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (staffToEdit) prefillStaff(staffToEdit);
      else resetForm();
    }, [staffToEdit])
  );

  const prefillStaff = (staff) => {
    setName(staff.name);
    setEmail(staff.email);
    setPassword(staff.password || '');
    setMobile(staff.mobile);
    setRole(staff.role);
    setActive(staff.active);
    setImageUrl(staff.imageUrl || null);
    setAddress(staff.address || '');
    setAadhar(staff.aadhar || '');
    setAccountNumber(staff.accountNumber || '');
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setMobile('');
    setRole('Staff');
    setActive(true);
    setImageUrl(null);
    setAddress('');
    setAadhar('');
    setAccountNumber('');
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled) {
        const selected = result.assets[0];
        setLoading(true);
        const uploaded = await uploadImage(selected); 
        if (uploaded) {
          setImageUrl(uploaded.imageUrl);
          setImage(selected.uri);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const saveStaff = async () => {
    if (!name || !email || !password || !mobile || !role) {
      Alert.alert('Validation', 'Please fill all required fields.');
      return;
    }

    const staffData = {
      name,
      email,
      password,
      mobile,
      role,
      active,
      imageUrl,
      address,
      aadhar,
      accountNumber,
    };

    try {
      if (staffToEdit) {
        await apiUpdateStaff(staffToEdit.id, staffData);
        Alert.alert('Success', 'Staff updated successfully!');
      } else {
        await apiAddStaff(staffData);
        Alert.alert('Success', 'Staff added successfully!');
      }
      navigation.navigate('ViewStaff');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save staff. Try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
         </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {staffToEdit ? 'Edit Staff' : 'Add Staff'}
        </Text>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Form Card */}
      <View style={styles.card}>
        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.staffImage} />
          ) : (
            <View style={styles.placeholder}>
              <MaterialIcons name="camera-alt" size={32} color="#aaa" />
              <Text style={styles.placeholderText}>Tap to select image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Input Fields */}
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Mobile" value={mobile} onChangeText={setMobile} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
        <TextInput style={styles.input} placeholder="Aadhar Card Number" value={aadhar} onChangeText={setAadhar} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Account Number" value={accountNumber} onChangeText={setAccountNumber} keyboardType="numeric" />

        {/* Role Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Role</Text>
          <Picker selectedValue={role} onValueChange={setRole}>
            <Picker.Item label="Staff" value="CASHIER" />
          </Picker>
        </View>

        {/* Active Checkbox */}
        <View style={styles.checkboxContainer}>
          <Checkbox status={active ? 'checked' : 'unchecked'} onPress={() => setActive(!active)} color="#6a11cb" />
          <Text style={styles.checkboxLabel}>Is Active</Text>
        </View>

        {/* Save Button */}
        <Button mode="contained" style={styles.saveButton} onPress={saveStaff}>
          {staffToEdit ? 'Update Staff' : 'Save Staff'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: {
    backgroundColor: '#2E7DFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  card: { 
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  imagePicker: { 
    height: 180, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 16, 
    marginBottom: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden', 
    backgroundColor: '#f2f2f2' 
  },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#aaa', marginTop: 8 },
  staffImage: { width: '100%', height: '100%', borderRadius: 16 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 12, 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    fontSize: 16, 
    color: '#333', 
    marginBottom: 16 
  },
  pickerContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkboxLabel: { marginLeft: 8, fontSize: 14, color: '#333' },
  saveButton: { backgroundColor: '#2E7DFF', borderRadius: 12, paddingVertical: 10 },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
});

export default AddStaffScreen;
