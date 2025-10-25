import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { getTodaysSales, getPendingBills, getLowStockCount, getRecentTransactions } from '../api/staffAPI'; // create these APIs

const DashboardCard = ({ title, value, icon, color, onPress }) => (
  <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
    <View style={styles.cardContent}>
      <View style={styles.iconContainer}>{icon}</View>
      <View>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const TransactionCard = ({ transaction }) => (
  <View style={styles.transactionCard}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={styles.transactionName}>{transaction.customerName || 'Customer'}</Text>
      <Text style={styles.transactionAmount}>${transaction.amount}</Text>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
      <Text style={styles.transactionDate}>{new Date(transaction.date).toLocaleDateString()}</Text>
      <Text style={[styles.transactionStatus, { color: transaction.status === 'PAID' ? '#4CAF50' : '#FF9800' }]}>
        {transaction.status}
      </Text>
    </View>
  </View>
);

const BillingDashboard = ({ navigation, route }) => {
  const staffName = route.params?.staffName || 'Staff';
  const [stats, setStats] = useState({ sales: 0, pending: 0, lowStock: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const sales = await getTodaysSales();
      const pending = await getPendingBills();
      const lowStock = await getLowStockCount();
      const recentTransactions = await getRecentTransactions(5); // last 5 transactions
      setStats({ sales, pending, lowStock });
      setTransactions(recentTransactions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a11cb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <Text style={styles.greeting}>👋 Good Day, {staffName}!</Text>

      {/* Quick Stats */}
      <FlatList
        data={[
          { id: '1', title: 'Today\'s Sales', value: `$${stats.sales}`, icon: <FontAwesome5 name="money-bill-wave" size={28} color="#fff" />, color: '#4CAF50', onPress: () => {} },
          { id: '2', title: 'Pending Bills', value: stats.pending, icon: <Ionicons name="document-text-outline" size={28} color="#fff" />, color: '#FF9800', onPress: () => navigation.navigate('StaffApp', { screen: 'Transaction History' }) },
          { id: '3', title: 'Low Stock', value: stats.lowStock, icon: <MaterialIcons name="warning" size={28} color="#fff" />, color: '#f44336', onPress: () => navigation.navigate('LowStock') },
        ]}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 10 }}
        renderItem={({ item }) => <DashboardCard {...item} />}
      />

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#2575fc' }]}
          onPress={() => navigation.navigate('StaffApp', { screen: 'Scan Bill' })}
        >
          <Ionicons name="scan-outline" size={28} color="#fff" />
          <Text style={styles.actionText}>🧾 Create Bill</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#6a11cb' }]}
          onPress={() => navigation.navigate('StaffApp', { screen: 'Transaction History' })}
        >
          <FontAwesome5 name="history" size={24} color="#fff" />
          <Text style={styles.actionText}>📜 History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
          onPress={() => navigation.navigate('LowStock')}
        >
          <MaterialIcons name="warning" size={28} color="#fff" />
          <Text style={styles.actionText}>⚠️ Low Stock</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>No recent transactions</Text>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <TransactionCard transaction={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        )}
      </View>
    </View>
  );
};

export default BillingDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', paddingTop: 30 },
  greeting: { fontSize: 22, fontWeight: 'bold', marginLeft: 16, marginBottom: 10, color: '#333' },
  card: { width: 180, borderRadius: 16, marginRight: 12, padding: 16, elevation: 4 },
  cardContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  cardTitle: { fontSize: 14, color: '#fff', marginTop: 4 },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, paddingHorizontal: 10 },
  actionButton: { flex: 1, marginHorizontal: 5, borderRadius: 16, paddingVertical: 20, justifyContent: 'center', alignItems: 'center', gap: 8 },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  transactionsSection: { marginTop: 25, paddingLeft: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  transactionCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginRight: 12, width: 220, elevation: 3 },
  transactionName: { fontSize: 16, fontWeight: '600', color: '#333' },
  transactionAmount: { fontSize: 16, fontWeight: 'bold', color: '#6a11cb' },
  transactionDate: { fontSize: 12, color: '#888' },
  transactionStatus: { fontSize: 12, fontWeight: '600' },
  emptyText: { color: '#888', fontStyle: 'italic' },
});
