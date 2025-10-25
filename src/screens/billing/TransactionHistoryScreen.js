import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { getAllBills } from '../../api/billingAPI';

// Helper functions
const getDateCategory = (date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const d = new Date(date);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return 'Earlier';
};

const groupTransactionsByDate = (transactions) => {
  const grouped = {};
  transactions.forEach(item => {
    const category = getDateCategory(item.date || item.billDate);
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(item);
  });

  // Sort each group by bill number descending
  Object.keys(grouped).forEach(key => {
    grouped[key].sort((a, b) => (b.billNumber || b.id) - (a.billNumber || a.id));
  });

  // Convert to SectionList format
  return Object.keys(grouped).map(key => ({ title: key, data: grouped[key] }));
};

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [displayedTransactions, setDisplayedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const loadTransactions = async () => {
    try {
      const data = await getAllBills();
      const sortedData = data.sort((a, b) => (b.billNumber || b.id) - (a.billNumber || a.id));
      setTransactions(sortedData);
      setDisplayedTransactions(groupTransactionsByDate(sortedData));
    } catch (err) {
      console.error("⚠️ Error loading transactions:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);

    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      if (!text.trim()) {
        setDisplayedTransactions(groupTransactionsByDate(transactions));
        return;
      }

      const filtered = transactions.filter((item) => {
        const billNumber = (item.billNumber || item.id || '').toString().toLowerCase();
        const paymentMode = (item.paymentMode || '').toLowerCase();
        const dateStr = new Date(item.date || item.billDate).toLocaleDateString();
        const query = text.toLowerCase();
        return (
          billNumber.includes(query) ||
          paymentMode.includes(query) ||
          dateStr.includes(query)
        );
      });

      setDisplayedTransactions(groupTransactionsByDate(filtered));
    }, 300);

    setDebounceTimer(timer);
  };

  const renderItem = ({ item }) => {
    const date = new Date(item.date || item.billDate);
    const paymentColor = item.paymentMode === 'Cash' ? '#27ae60' : '#e67e22';
    const isToday = getDateCategory(item.date || item.billDate) === 'Today';

    // **TouchableOpacity outside Animatable.View** for proper press handling
    return (
      <TouchableOpacity onPress={() => setSelectedBill(item)} activeOpacity={0.8}>
        <Animatable.View
          animation="fadeInUp"
          duration={500}
          style={[
            styles.card,
            isToday && { backgroundColor: '#e0f7fa', borderColor: '#00bcd4', borderWidth: 1 }
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.date}>{date.toLocaleString()}</Text>
            <Text style={[styles.paymentMode, { color: paymentColor }]}>{item.paymentMode || "N/A"}</Text>
          </View>
          <Text style={styles.billNumber}>Bill No: {item.billNumber || item.id}</Text>
          <Text style={styles.totalValue}>₹{Number(item.finalAmount || 0).toFixed(2)}</Text>
        </Animatable.View>
      </TouchableOpacity>
    );
  };

  const closeModal = () => setSelectedBill(null);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="receipt-long" size={60} color="#ccc" />
      <Text style={styles.empty}>No transactions found.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by bill number, date, or payment mode"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {loading ? (
        <Text style={styles.loadingText}>Loading transactions...</Text>
      ) : displayedTransactions.length === 0 ? (
        renderEmpty()
      ) : (
        <SectionList
          sections={displayedTransactions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Animatable.Text animation="fadeIn" duration={600} style={styles.sectionHeader}>
              {title}
            </Animatable.Text>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {/* Modal */}
      <Modal
        visible={!!selectedBill}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Bill Details</Text>
              <Text>Bill Number: {selectedBill?.billNumber || selectedBill?.id}</Text>
              <Text>Cashier: {selectedBill?.staffId || "N/A"}</Text>
              <Text>Date: {new Date(selectedBill?.date || selectedBill?.billDate).toLocaleString()}</Text>
              <Text>Total Items: {selectedBill?.items?.length || 0}</Text>
              <View style={styles.divider} />

              <Text style={{ fontWeight: '600', marginTop: 5 }}>Items:</Text>
              {selectedBill?.items?.length > 0 ? (
                selectedBill.items.map(item => (
                  <View key={item.productId} style={styles.itemRow}>
                    <Text style={{ flex: 2 }}>{item.productName || "N/A"}</Text>
                    <Text style={{ flex: 1, textAlign: 'center' }}>×{item.quantity || 0}</Text>
                    <Text style={{ flex: 1.2, textAlign: 'right' }}>₹{item.totalPrice || 0}</Text>
                  </View>
                ))
              ) : (
                <Text>No items found.</Text>
              )}

              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={{ fontWeight: '600' }}>Subtotal:</Text>
                <Text>₹{Number(selectedBill?.totalAmount || 0).toFixed(2)}</Text>
              </View>
              {selectedBill?.tax && (
                <View style={styles.summaryRow}>
                  <Text style={{ fontWeight: '600' }}>Tax:</Text>
                  <Text>₹{selectedBill?.tax}</Text>
                </View>
              )}
              <View style={[styles.summaryRow, { marginBottom: 10 }]}>
                <Text style={{ fontWeight: '700' }}>Grand Total:</Text>
                <Text>₹{Number(selectedBill?.finalAmount || 0).toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={closeModal}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TransactionHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', padding: 16 },
  card: {
    backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  date: { color: '#7f8c8d' },
  paymentMode: { fontWeight: '600' },
  billNumber: { fontSize: 14, color: '#2c3e50' },
  totalValue: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', color: '#2c3e50' },
  searchInput: { 
    backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 12,
    borderWidth: 1, borderColor: '#ccc'
  },
  sectionHeader: { fontSize: 18, fontWeight: '700', color: '#2c3e50', marginVertical: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  empty: { textAlign: 'center', marginTop: 10, color: '#999' },
  loadingText: { textAlign: 'center', marginTop: 20 },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 16, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 8 },
  itemRow: { flexDirection: 'row', marginVertical: 3 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  closeBtn: { backgroundColor: '#2196f3', padding: 10, borderRadius: 8, marginTop: 15, alignItems: 'center' },
  closeText: { color: '#fff', fontWeight: '600' },
});
