import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const savedData = await AsyncStorage.getItem('transactions');
        const parsed = savedData ? JSON.parse(savedData) : [];
        setTransactions(parsed.reverse()); // show latest first
      } catch (error) {
        console.error('Failed to load transactions', error);
      }
    };

    const unsubscribe = loadTransactions();
    return () => unsubscribe;
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
      <FlatList
        data={item.items}
        keyExtractor={(p) => p.id.toString()}
        renderItem={({ item: product }) => (
          <Text style={styles.itemText}>
            • {product.name} × {product.quantity} = ₹{product.price * product.quantity}
          </Text>
        )}
      />
      <Text style={styles.total}>Total: ₹{item.total}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {transactions.length === 0 ? (
        <Text style={styles.empty}>No transactions yet.</Text>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  date: { fontWeight: '600', marginBottom: 4 },
  itemText: { fontSize: 15, marginVertical: 2 },
  total: { fontWeight: 'bold', color: '#4CAF50', marginTop: 8, textAlign: 'right' },
  empty: { textAlign: 'center', marginTop: 20, color: '#999' },
});

export default TransactionHistoryScreen;
