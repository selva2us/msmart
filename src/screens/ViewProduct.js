import React, { useState, useCallback } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { deleteProduct } from '../redux/store'; // adjust path if needed

const PAGE_SIZE = 5; // number of products per page

const ViewProduct = ({ navigation }) => {
  const products = useSelector(state => state.products.list);
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteProduct(id)) },
      ]
    );
  };

  // Filter and search products
  const filteredProducts = products
    .filter(p => 
      (filter === 'All' || (filter === 'Low Stock' && p.quantity < 10) || p.category === filter)
    )
    .filter(p => 
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.category.toLowerCase().includes(searchText.toLowerCase())
    );

  const categories = ['All', 'Low Stock', ...new Set(products.map(p => p.category))];

  // Pagination logic
  const displayedProducts = filteredProducts.slice(0, page * PAGE_SIZE);

  const loadMore = () => {
    if (displayedProducts.length < filteredProducts.length) {
      setLoadingMore(true);
      setTimeout(() => {
        setPage(prev => prev + 1);
        setLoadingMore(false);
      }, 500); // simulate network/loading delay
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.info}>Price: ${item.price}</Text>
        <Text style={styles.info}>Quantity: {item.quantity}</Text>
        <Text style={styles.info}>Category: {item.category}</Text>

        <View style={styles.buttonRow}>
          <Button
            mode="contained"
            compact 
            onPress={() => navigation.navigate('MainApp', 
              {  screen: 'Add Product',  params: { product: item },})}
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
          keyExtractor={(item) => item}
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6a11cb',
    marginRight: 8,
    marginTop: 8,
  },
  filterText: { color: '#6a11cb', fontWeight: '600' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  details: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  info: { fontSize: 14, color: '#555', marginTop: 4 },
  buttonRow: { flexDirection: 'row', marginTop: 8 },
  button: { marginRight: 8 },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});

export default ViewProduct;
