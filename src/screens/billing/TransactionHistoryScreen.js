import React, { useEffect, useState ,useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { getAllBills } from '../../api/billingAPI';

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
 useFocusEffect(
      useCallback(() => {
       const loadTransactions = async () => {
          try {
            const data = await getAllBills();
            setTransactions(data.reverse()); // latest first
          } catch (err) {
            console.error("⚠️ Error loading transactions:", err);
          } finally {
            setLoading(false);
          }
        };
        loadTransactions();
      }, [])
    ); 
  

  const renderItem = ({ item }) => {
    const date = new Date(item.date || item.billDate);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelectedBill(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.date}>{date.toLocaleString()}</Text>
          <Text style={styles.paymentMode}>{item.paymentMode}</Text>
        </View>
         <Text style={styles.billNumber}>Bill No: {item.billNumber || item.id}</Text>
        <Text style={styles.totalValue}>₹{item.finalAmount}</Text>
      </TouchableOpacity>
    );
  };

  const closeModal = () => setSelectedBill(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading transactions...</Text>
      ) : transactions.length === 0 ? (
        <Text style={styles.empty}>No transactions yet.</Text>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {/* Modal for detailed bill */}
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
              <View style={styles.divider} />

              <Text style={{fontWeight:'600', marginTop:5}}>Items:</Text>
              {selectedBill?.items.map(item => (
                <View key={item.productId} style={styles.itemRow}>
                  <Text style={{flex: 2}}>{item.productName}</Text>
                  <Text style={{flex: 1, textAlign: 'center'}}>×{item.quantity}</Text>
                  <Text style={{flex: 1.2, textAlign: 'right'}}>₹{item.totalPrice}</Text>
                </View>
              ))}

              <View style={styles.summaryRow}>
                <Text style={{fontWeight:'600'}}>Subtotal:</Text>
                <Text>₹{selectedBill?.totalAmount}</Text>
              </View>
              {selectedBill?.tax && (
                <View style={styles.summaryRow}>
                  <Text style={{fontWeight:'600'}}>Tax:</Text>
                  <Text>₹{selectedBill?.tax}</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={{fontWeight:'700'}}>Grand Total:</Text>
                <Text>₹{selectedBill?.finalAmount}</Text>
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
  container: { flex:1, backgroundColor:'#f5f6fa', padding:16 },
  title: { fontSize:24, fontWeight:'bold', marginBottom:12, textAlign:'center' },
  loadingText: { textAlign:'center', marginTop:20 },
  empty: { textAlign:'center', marginTop:20, color:'#999' },
  card: {
    backgroundColor:'#fff', padding:12, borderRadius:10, marginBottom:12,
    shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.1, shadowRadius:2, elevation:2
  },
  cardHeader: { flexDirection:'row', justifyContent:'space-between', marginBottom:6 },
  date: { color:'#7f8c8d' },
  paymentMode: { color:'#27ae60', fontWeight:'600' },
  totalValue: { fontSize:16, fontWeight:'bold', textAlign:'right', color:'#2c3e50' },
  modalBackground: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center' },
  modalContainer: { width:'90%', backgroundColor:'#fff', borderRadius:12, padding:16, maxHeight:'80%' },
  modalTitle: { fontSize:20, fontWeight:'bold', marginBottom:10, textAlign:'center' },
  divider: { height:1, backgroundColor:'#ccc', marginVertical:8 },
  itemRow: { flexDirection:'row', marginVertical:3 },
  summaryRow: { flexDirection:'row', justifyContent:'space-between', marginTop:5 },
  closeBtn: { backgroundColor:'#2196f3', padding:10, borderRadius:8, marginTop:15, alignItems:'center' },
  closeText: { color:'#fff', fontWeight:'600' },
});
