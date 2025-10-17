import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button,Checkbox } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { addProduct, editProduct } from '../redux/store'; // adjust path if needed
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { addProduct as apiAddProduct, updateProduct as apiUpdateProduct } from '../api/productApi'; // Import API functions

const AddProduct = ({ navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const productToEdit = route.params?.product; // undefined if adding new

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [category, setCategory] = useState('1');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [barcode, setBarcode] = useState('');
  const [brand, setBrand] = useState('1');
  const [image, setImage] = useState(null);
  const [active, setActive] = useState(true);

  // Pre-fill form if editing
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(String(productToEdit.price));
      setStockQuantity(String(productToEdit.setStockQuantity));
      setCategory(productToEdit.category);
      setImage(productToEdit.image);
      setLowStockThreshold(String(productToEdit.lowStockThreshold));
      setBarcode(productToEdit.barcode);
      setBrand(productToEdit.brand);
      setActive(productToEdit.active);
    }
  }, [productToEdit]);

  // Request image picker permission
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission denied. We need access to your gallery.');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const saveProduct = async ()=> {
    if (!name || !price || !stockQuantity || !category || !brand || !lowStockThreshold || !barcode) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }
    const productData = {
      barcode,
      stockQuantity,
      active,
      brand: { id: brand, name: 'Brand Name' }, // Adjust brand data if needed
      price,
      lowStockThreshold,
      name,
      category: { id: category, name: 'Category Name' }, // Adjust category if needed
    };
    try {
      let response;
      if (productToEdit) {
        // If editing product, use update API
        response = await apiUpdateProduct(productToEdit.id, productData, image);
        dispatch(editProduct({ ...productToEdit, ...response }));
        Alert.alert('Success', 'Product updated!');
      } else {
        // If adding a new product, use add API
        response = await apiAddProduct(productData, image);
        dispatch(addProduct(response));
        Alert.alert('Success', `Product "${name}" added!`);
      }

      navigation.navigate('MainApp', { screen: 'View Products' });
    ``} catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'There was an error saving the product. Please try again.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {productToEdit ? 'Edit Product' : 'Add Product'}
        </Text>
      </View>

      {/* Form Container */}
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Image Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.productImage} />
            ) : (
              <View style={styles.placeholder}>
                <MaterialIcons name="camera-alt" size={32} color="#aaa" />
                <Text style={styles.placeholderText}>Tap to select image</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Input Fields */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter price"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter quantity"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={stockQuantity}
              onChangeText={setStockQuantity}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>LowStockThreshold</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter threshold"
              placeholderTextColor="#999"
              value={lowStockThreshold}
              onChangeText={setLowStockThreshold}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Barcode</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter barcode"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={barcode}
              onChangeText={setBarcode}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter brand"
              placeholderTextColor="#999"
              value={brand}
              onChangeText={setBrand}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category"
              placeholderTextColor="#999"
              value={category}
              onChangeText={setCategory}
            />
          </View>
            {/* Checkbox from react-native-paper */}
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={active ? 'checked' : 'unchecked'}
                onPress={() => setActive(!active)}
                color="#6200ee" // You can change the color to match your app theme
              />
              <Text style={styles.checkboxLabel}>Is Active</Text>
            </View>


          {/* Buttons */}
          <Button
            mode="contained"
            onPress={saveProduct}
            style={styles.saveButton}
            contentStyle={{ paddingVertical: 10 }}
          >
            {productToEdit ? 'Update Product' : 'Save Product'}
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('MainApp', { screen: 'View Products' })}
            style={[styles.saveButton, { backgroundColor: '#fff', borderColor: '#6a11cb', marginTop: 10 }]}
            contentStyle={{ paddingVertical: 10 }}
            textColor="#6a11cb"
          >
            View Products
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#6a11cb',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  container: {
    padding: 16,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
    backgroundColor: '#f2f2f2',
  },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#aaa', marginTop: 8 },
  productImage: { width: '100%', height: '100%', borderRadius: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#6a11cb',
  },
});

export default AddProduct;
