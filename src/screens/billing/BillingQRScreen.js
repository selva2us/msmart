import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';

// Sample products database
const productDB = [
  { id: '1', name: 'Rice 5kg', price: 350 },
  { id: '2', name: 'Sugar 1kg', price: 45 },
  { id: '3', name: 'Milk 1L', price: 60 },
  { id: '4', name: 'Soap', price: 25 },
  { id: '5', name: 'Oil 1L', price: 180 },
];

const BillingQRScreen = () => {
  const [billItems, setBillItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const updateTotal = (items) => {
    const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const scanQR = (product) => {
    const existing = billItems.find((item) => item.id === product.id);
    let updatedItems;
    if (existing) {
      updatedItems = billItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedItems = [...billItems, { ...product, quantity: 1 }];
    }
    setBillItems(updatedItems);
    updateTotal(updatedItems);
  };

  const reduceItem = (id) => {
    let updatedItems = billItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity - 1 } : item
    );
    updatedItems = updatedItems.filter((item) => item.quantity > 0);
    setBillItems(updatedItems);
    updateTotal(updatedItems);
  };

  // Filter products based on search
  const filteredProducts = productDB.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBillItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.qtyContainer}>
        <TouchableOpacity style={styles.reduceButton} onPress={() => reduceItem(item.id)}>
          <Text style={styles.reduceText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qty}>{item.quantity}</Text>
      </View>
      <Text style={styles.price}>₹{item.price * item.quantity}</Text>
    </View>
  );

  const renderSearchItem = ({ item }) => (
    <View style={styles.searchRow}>
      <Text>{item.name} - ₹{item.price}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => scanQR(item)}>
        <Text style={styles.addText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🧾 Billing QR</Text>

      {/* Search */}
      <TextInput
        placeholder="Search product..."
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Search results */}
      {searchQuery.length > 0 && (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderSearchItem}
          style={{ maxHeight: 150, marginBottom: 16 }}
        />
      )}

      {/* Bill items */}
      <FlatList
        data={billItems}
        keyExtractor={(item) => item.id}
        renderItem={renderBillItem}
        contentContainerStyle={{ paddingBottom: 150 }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₹{total}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  name: { fontSize: 16, flex: 1 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center' },
  reduceButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reduceText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  qty: { width: 30, textAlign: 'center', fontSize: 16 },
  price: { width: 80, textAlign: 'right' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addText: { color: '#fff', fontWeight: 'bold' },
});

export default BillingQRScreen;
