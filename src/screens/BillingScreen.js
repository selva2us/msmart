import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateProductStock } from '../redux/productSlice';

const BillingScreen = () => {
  const products = useSelector((state) => state.products.products || []);
  const dispatch = useDispatch();

  const [cart, setCart] = useState([]);
  const [paid, setPaid] = useState('');

  const addToCart = (item) => {
    const existing = cart.find((p) => p.id === item.id);
    if (existing) {
      setCart(cart.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p)));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const balance = paid ? paid - total : 0;

  const handleCheckout = () => {
    if (paid < total) {
      Alert.alert('Payment Error', 'Insufficient amount!');
      return;
    }

    cart.forEach((item) => {
      const newStock = item.stock - item.qty;
      dispatch(updateProductStock({ id: item.id, quantity: newStock }));
    });

    Alert.alert('Success', `Payment complete! Return ₹${balance}`);
    setCart([]);
    setPaid('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧾 Billing</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price} | Stock: {item.stock}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.cart}>
        <Text style={styles.cartHeader}>🛒 Cart</Text>
        {cart.map((item) => (
          <Text key={item.id}>{item.name} x {item.qty} = ₹{item.price * item.qty}</Text>
        ))}
        <Text style={styles.total}>Total: ₹{total}</Text>
        <TextInput
          style={styles.input}
          placeholder="Amount received"
          keyboardType="numeric"
          value={paid}
          onChangeText={setPaid}
        />
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>💰 Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  item: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '600' },
  price: { color: '#555' },
  cart: { marginTop: 15, backgroundColor: '#eee', padding: 10, borderRadius: 8 },
  cartHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  total: { fontWeight: 'bold', marginTop: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginTop: 10,
  },
  checkoutButton: {
    backgroundColor: '#4CAF50', padding: 12, marginTop: 10, borderRadius: 8, alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default BillingScreen;
