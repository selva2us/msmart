import React, { useState, useEffect,useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import {
  getAllProducts,
  deleteProduct,
} from '../api/productApi'; // Adjust path

const PAGE_SIZE = 5;

const ViewProduct = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products...');
      const data = await getAllProducts();
      console.log('Fetch response:', data);
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      Alert.alert('Error', 'Failed to fetch products from server.');
    } finally {
      setLoading(false);
    }
  };

 useFocusEffect(
  useCallback(() => {
    fetchProducts();
  }, [])
);
  // Delete product
  const handleDelete = (id) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Deleting product with ID:', id);
              const res = await deleteProduct(id);
              console.log('Delete response:', res);
              Alert.alert('Deleted', 'Product deleted successfully');
              fetchProducts(); // Refresh list
            } catch (error) {
              console.error('Delete failed:', error);
              Alert.alert('Error', 'Failed to delete product.');
            }
          },
        },
      ]
    );
  };

  // Filter & search products
  const filteredProducts = products
    .filter((p) =>
      filter === 'All'
        ? true
        : filter === 'Low Stock'
        ? p.stockQuantity < 10
        : p.categoryId === parseInt(filter) // match category ID
    )
    .filter((p) =>
      p.name.toLowerCase().includes(searchText.toLowerCase())
    );

  // Categories for filter dropdown (IDs only)
  const categories = ['All', 'Low Stock', ...new Set(products.map(p => p.category_id).filter(Boolean))];

  const displayedProducts = filteredProducts.slice(0, page * PAGE_SIZE);

  const loadMore = () => {
    if (displayedProducts.length < filteredProducts.length) {
      setLoadingMore(true);
      setTimeout(() => {
        setPage(prev => prev + 1);
        setLoadingMore(false);
      }, 500); // simulate loading delay
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imageUrl.replace("http://testapp-production-ad8c.up.railway.app/", "") || 'https://media.istockphoto.com/id/1157106624/photo/all-your-necessities-stored-in-one-place.webp?s=1024x1024&w=is&k=20&c=8Wpn6NRdkVmXtR5jxGmxnyqu_wY3kF6yMMXWHla0t5Y=' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name || 'N/A'}</Text>
        <Text style={styles.info}>Price: ${item.price ?? 'N/A'}</Text>
        <Text style={styles.info}>Quantity: {item.stockQuantity ?? 'N/A'}</Text>
        <Text style={styles.info}>Brand: {item.brandName ?? 'N/A'}</Text>

        <View style={styles.buttonRow}>
          <Button
            mode="contained"
            compact
            onPress={() => navigation.navigate('Add Product', { product: item })}
            style={[styles.button, { backgroundColor: '#2575fc' }]}
          >
            Edit
          </Button>
          <Button
            mode="contained"
            compact
            onPress={() => handleDelete(item.id)}
            style={[styles.button, { backgroundColor: '#ff6f61' }]}
          >
            Delete
          </Button>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6a11cb" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Products</Text>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === item && { backgroundColor: '#6a11cb' },
              ]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.filterText, filter === item && { color: '#fff' }]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {displayedProducts.length === 0 ? (
        <Text style={styles.emptyText}>No products found.</Text>
      ) : (
        <FlatList
          data={displayedProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#6a11cb" /> : null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#6a11cb' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
  searchContainer: { padding: 16, backgroundColor: '#fff' },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, fontSize: 16, color: '#333' },
  filterButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#6a11cb', marginRight: 8, marginTop: 8 },
  filterText: { color: '#6a11cb', fontWeight: '600' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
  image: { width: 100, height: 100, borderRadius: 12, marginRight: 12 },
  details: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  info: { fontSize: 14, color: '#555', marginTop: 4 },
  buttonRow: { flexDirection: 'row', marginTop: 8 },
  button: { marginRight: 8 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
});

export default ViewProduct;
