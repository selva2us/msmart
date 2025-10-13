import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BillingDashboard = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>💼 Staff Billing Dashboard</Text>

    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BillingQRScreen')}
    >
      <Text style={styles.cardText}>🧾 Create New Bill</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TransactionHistory')}
    >
      <Text style={styles.cardText}>📜 Transaction History</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    width: '80%',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  cardText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default BillingDashboard;
