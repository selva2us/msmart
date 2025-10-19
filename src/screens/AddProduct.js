import React, { useState, useEffect, act,useCallback } from 'react';
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
import { Button,Checkbox } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { addProduct, editProduct } from '../redux/store'; // adjust path if needed
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute,useFocusEffect } from '@react-navigation/native';
import { addProduct as apiAddProduct, updateProduct as apiUpdateProduct ,uploadImage} from '../api/productApi'; // Import API functions
import VariantSelector from '../components/VariantSelector';
import { getAllBrands } from '../api/brandApi';
import { getAllCategories} from '../api/categoryAPI';
import { Picker } from '@react-native-picker/picker';

const AddProduct = ({ navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const productToEdit = route.params?.product; // undefined if adding new
  console.log('Product to edit:', productToEdit);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [category, setCategory] = useState('1');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [barcode, setBarcode] = useState('');
  const [brand, setBrand] = useState('1');
  const [imageUrl, setImageUrl] = useState(null);
  const [image, setImage] = useState(null);
  const [active, setActive] = useState(true);
  const [variantWeight, setVariantWeight] = useState('200'); // default
  const [variantUnit, setVariantUnit] = useState('ML'); // default
  const [variants, setVariants] = useState([
    { id: 0, weightUnit: 'ML', weightValue: '', price: '', stockQuantity: '' },
  ]);
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
      if (productToEdit) {
        prefillProduct(productToEdit);
      } else {
        // Reset form for new product
        resetForm();
      }
    }, [productToEdit])
  );

  // Pre-fill form if editing
  const prefillProduct = (productToEdit) => { 
    if (productToEdit) {
      const imageUri = productToEdit.imageUrl.replace("http://testapp-production-ad8c.up.railway.app/", "")
      setName(productToEdit.name);
      setPrice(String(productToEdit.price));
      setStockQuantity(String(productToEdit.stockQuantity));
      setCategory(productToEdit?.categoryId || null);
      setImageUrl(imageUri);
      setLowStockThreshold(String(productToEdit.lowStockThreshold));
      setBarcode(productToEdit.barcode);
      setBrand(productToEdit?.brandId || null);
      setActive(productToEdit.active);
      if (productToEdit.variants && productToEdit.variants.length > 0) {
        setVariants(productToEdit.variants.map(v => ({          
          weightUnit: v.weightUnit || 'ML',
          weightValue: String(v.weightValue),
          price: String(productToEdit.price),
          stockQuantity: String(productToEdit.stockQuantity),
        })));
      }
    
    }
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
    setImageUrl('');
    setVariants([]);
  };

  // Request image picker permission
useEffect(() => {
  (async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status); // Log the permission status
      if (status !== 'granted') {
        alert('Permission denied. We need access to your gallery.');
      }
    } catch (error) {
      console.error('Error requesting media library permissions:', error);
      alert('An error occurred while requesting permission.');
    }
  })();
}, []);

  const pickImage = async () => {
    try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const selected = result.assets[0];
      setLoading(true);
      const cloudinaryUrl = await uploadImage(selected);

    if (cloudinaryUrl) {
       setImageUrl(cloudinaryUrl.imageUrl); 
       setImage(selected.uri)// assign returned URL to state
      console.log('Uploaded image URL:', cloudinaryUrl.imageUrl);
    }
  }
  } finally {
    setLoading(false);  
  };
};

  const addVariant = () => {
    setVariants([...variants, { id: Date.now(), weightUnit: 'ML', weightValue: '', price: '', stockQuantity: '' }]);
  };

  const removeVariant = (id) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const updateVariant = (id, key, value) => {
    setVariants(variants.map(v => (v.id === id ? { ...v, [key]: value } : v)));
  };

  const saveProduct = async ()=> {
    if (!name || !price || !stockQuantity || !category || !brand || !lowStockThreshold || !barcode) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }
    const productData = {
      active: active,
      barcode: barcode,
      brand: { id: brand },
      category: { id: category },       
      lowStockThreshold: Number(lowStockThreshold),
      imageUrl,
      name: name,
      price: Number(price),
      stockQuantity: Number(stockQuantity),    
      variant: {
        weightUnit: variantUnit.toLowerCase(),
        weightValue: Number(variantWeight),
        price: Number(price),
        stockQuantity: Number(stockQuantity),
      }
    };   

    try {
      let response;
      if (productToEdit) {
        // If editing product, use update API
        response = await apiUpdateProduct(productToEdit.id, productData);
        dispatch(editProduct({ ...productToEdit, ...response }));
        Alert.alert('Success', 'Product updated!');
      } else {
        // If adding a new product, use add API
        response = await apiAddProduct(productData);
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
        {loading && (
          <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
          }}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      {/* Form Container */}
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Image Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl}} style={styles.productImage} />
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
          <VariantSelector
                    variantValue={variantWeight}
                    setVariantValue={setVariantWeight}
                    variantUnit={variantUnit}
                    setVariantUnit={setVariantUnit}
                  />     
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
            <Text style={styles.label}>Product Brand</Text>
         <Picker
          selectedValue={brand}
          onValueChange={(value) => setBrand(value)}
           >
          <Picker.Item label="Select Brand" value={null} />
          {sBrand.map((brands) => (
            <Picker.Item key={brands.id} label={brands.name} value={brands.id} />
          ))}
        </Picker>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Category</Text>
           <Picker
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
           >
          <Picker.Item label="Select Category" value={null} />
          {sCategory.map((categorys) => (
            <Picker.Item key={categorys.id} label={categorys.name} value={categorys.id} />
          ))}
        </Picker>
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
