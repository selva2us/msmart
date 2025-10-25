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
import { useDispatch } from 'react-redux';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

import { addProduct, editProduct } from '../redux/store';
import { addProduct as apiAddProduct, updateProduct as apiUpdateProduct, uploadImage } from '../api/productApi';
import { getAllBrands } from '../api/brandApi';
import { getAllCategories } from '../api/categoryAPI';
import VariantSelector from '../components/VariantSelector';

const AddProduct = ({ navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const productToEdit = route.params?.product;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [barcode, setBarcode] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [active, setActive] = useState(true);
  const [variantWeight, setVariantWeight] = useState('200');
  const [variantUnit, setVariantUnit] = useState('ML');
  const [sBrand, setSBrand] = useState([]);
  const [sCategory, setSCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const brandData = await getAllBrands();
    const categoryData = await getAllCategories();
    setSBrand(brandData);
    setSCategory(categoryData);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
      if (productToEdit) prefillProduct(productToEdit);
      else resetForm();
    }, [productToEdit])
  );

  const prefillProduct = (p) => {
    const imageUri = p.imageUrl?.replace('http://testapp-production-ad8c.up.railway.app/', '');
    setName(p.name);
    setPrice(String(p.price));
    setStockQuantity(String(p.stockQuantity));
    setCategory(p.categoryId || null);
    setBrand(p.brandId || null);
    setImageUrl(imageUri);
    setLowStockThreshold(String(p.lowStockThreshold));
    setBarcode(p.barcode);
    setActive(p.active);
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setStockQuantity('');
    setCategory(null);
    setBrand(null);
    setLowStockThreshold('10');
    setBarcode('');
    setActive(true);
    setImageUrl(null);
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') alert('We need gallery access to select images.');
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const selected = result.assets[0];
      setLoading(true);
      const cloudinaryUrl = await uploadImage(selected);
      setLoading(false);
      if (cloudinaryUrl) setImageUrl(cloudinaryUrl.imageUrl);
    }
  };

  const saveProduct = async () => {
    if (!name || !price || !stockQuantity || !category || !brand || !barcode) {
      Alert.alert('Validation', 'Please fill all required fields');
      return;
    }
    const productData = {
      active,
      barcode,
      brand: { id: brand },
      category: { id: category },
      lowStockThreshold: Number(lowStockThreshold),
      imageUrl,
      name,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      variant: {
        weightUnit: variantUnit.toLowerCase(),
        weightValue: Number(variantWeight),
        price: Number(price),
        stockQuantity: Number(stockQuantity),
      },
    };

    try {
      let response;
      if (productToEdit) {
        response = await apiUpdateProduct(productToEdit.id, productData);
        dispatch(editProduct({ ...productToEdit, ...response }));
        Alert.alert('Success', 'Product updated!');
      } else {
        response = await apiAddProduct(productData);
        dispatch(addProduct(response));
        Alert.alert('Success', `Product "${name}" added!`);
      }
      navigation.navigate('MainApp', { screen: 'View Products' });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error saving product. Try again.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Gradient Header */}
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
         </TouchableOpacity>
        <Text style={styles.headerTitle}>{productToEdit ? 'Edit Product' : 'Add Product'}</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.productImage} />
            ) : (
              <View style={styles.placeholder}>
                <MaterialIcons name="camera-alt" size={32} color="#aaa" />
                <Text style={styles.placeholderText}>Tap to select image</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput style={styles.input} placeholder="Enter name" value={name} onChangeText={setName} />
          </View>

          <VariantSelector
            variantValue={variantWeight}
            setVariantValue={setVariantWeight}
            variantUnit={variantUnit}
            setVariantUnit={setVariantUnit}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (₹)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stock Quantity</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={stockQuantity} onChangeText={setStockQuantity} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Low Stock Threshold</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={lowStockThreshold} onChangeText={setLowStockThreshold} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Barcode</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={barcode} onChangeText={setBarcode} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Brand</Text>
            <Picker selectedValue={brand} onValueChange={setBrand}>
              <Picker.Item label="Select Brand" value={null} />
              {sBrand.map((b) => (
                <Picker.Item key={b.id} label={b.name} value={b.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Category</Text>
            <Picker selectedValue={category} onValueChange={setCategory}>
              <Picker.Item label="Select Category" value={null} />
              {sCategory.map((c) => (
                <Picker.Item key={c.id} label={c.name} value={c.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox status={active ? 'checked' : 'unchecked'} onPress={() => setActive(!active)} color="#2E7DFF" />
            <Text style={styles.checkboxLabel}>Is Active</Text>
          </View>

          <Button mode="contained" onPress={saveProduct} style={styles.saveButton}>
            {productToEdit ? 'Update Product' : 'Save Product'}
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('MainApp', { screen: 'View Products' })}
            style={[styles.saveButton, styles.outlinedButton]}
            textColor="#2E7DFF"
          >
            View Products
          </Button>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f3f6ff',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 30,
  },
  imagePicker: {
    height: 180,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9ff',
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
    backgroundColor: '#fff',
  },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  checkboxLabel: { fontSize: 15, color: '#333' },
  saveButton: { marginTop: 16, borderRadius: 12, backgroundColor: '#2E7DFF' },
  outlinedButton: { backgroundColor: '#fff', borderColor: '#2E7DFF', borderWidth: 1 },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddProduct;
