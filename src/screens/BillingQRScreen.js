import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Sample products mapped by QR code
const productDB = {
  '12345': { id: '1', name: 'Rice 5kg', price: 350 },
  '23456': { id: '2', name: 'Sugar 1kg', price: 45 },
  '34567': { id: '3', name: 'Milk 1L', price: 60 },
  '45678': { id: '4', name: 'Soap', price: 25 },
  '56789': { id: '5', name: 'Oil 1L', price: 180 },
};

const BillingQRScreen = () => {
  const [billItems, setBillItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Simulate scanning a QR code
  const scanQR = (code) => {
    const product = productDB[code];
    if (!product) return;

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
    const newTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.qty}>× {item.quantity}</Text>
      <Text style={styles.price}>₹{item.price * item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧾 Billing QR</Text>

      <FlatList
        data={billItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₹{total}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Pay</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.simulate}>
        <Text style={{ marginBottom: 6 }}>Simulate Scan:</Text>
        {Object.keys(productDB).map((code) => (
          <TouchableOpacity
            key={code}
            style={styles.scanButton}
            onPress={() => scanQR(code)}
          >
            <Text style={styles.scanText}>{productDB[code].name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  name: { fontSize: 16, flex: 1 },
  qty: { width: 50, textAlign: 'center' },
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
  simulate: { marginTop: 10, marginBottom: 60},
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginVertical: 4,
    borderRadius: 5,
  },
  scanText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});

export default BillingQRScreen;
