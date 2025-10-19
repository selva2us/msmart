import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, FlatList, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { handleConfirmPayment } from "../../api/billingAPI"; // Your billing API

const PaymentScreen = ({ navigation, route }) => {
  const {
    billData = {
      items: [],
      subtotal: 0,
      tax: 0,
      grandTotal: 0,
      cashier: "Unknown",
      billNumber: `BILL-${Date.now()}`,
      date: new Date().toLocaleString(),
    },
  } = route.params || {};

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paidAmount, setPaidAmount] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (paidAmount) {
      const bal = parseFloat(paidAmount) - billData.grandTotal;
      setBalance(bal);
    } else {
      setBalance(0);
    }
  }, [paidAmount]);

  const handlePayment = () => {
    navigation.navigate("StaffApp", {
      screen: "Receipt",
      params: {
        billData,
        paymentMethod,
        paidAmount: parseFloat(paidAmount),
        balanceAmount: balance,
      },
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      ) : (
        <View style={styles.itemImagePlaceholder} />
      )}
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemQty}>x{item.qty}</Text>
      <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>💳 Payment</Text>

      <View style={styles.amountBox}>
        <Text style={styles.label}>Bill Number</Text>
        <Text style={styles.amount}>{billData.billNumber}</Text>

        <Text style={styles.label}>Date</Text>
        <Text style={styles.amount}>{billData.date}</Text>

        <Text style={styles.label}>Cashier</Text>
        <Text style={styles.amount}>{billData.cashier}</Text>
      </View>

      {/* Cart Items */}
      <View style={styles.cartBox}>
        <Text style={styles.sectionTitle}>Purchased Items</Text>
        {billData.items.length === 0 ? (
          <Text style={styles.emptyText}>No items found</Text>
        ) : (
          <FlatList
            data={billData.items}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryText}>₹{billData.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Tax (5%)</Text>
          <Text style={styles.summaryText}>₹{billData.tax.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryText, { fontWeight: "bold" }]}>Grand Total</Text>
          <Text style={[styles.summaryText, { fontWeight: "bold" }]}>₹{billData.grandTotal.toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Options */}
      <Text style={styles.sectionTitle}>Select Payment Method</Text>
      <View style={styles.paymentOptions}>
        {[
          { name: "Cash", icon: "cash" },
          { name: "Card", icon: "credit-card-outline" },
          { name: "UPI", icon: "cellphone" },
          { name: "Wallet", icon: "wallet-outline" },
        ].map((method) => (
          <TouchableOpacity
            key={method.name}
            style={[
              styles.option,
              paymentMethod === method.name && styles.optionSelected,
            ]}
            onPress={() => {
              setPaymentMethod(method.name);
              setPaidAmount(billData.grandTotal.toString());
            }}
          >
            <MaterialCommunityIcons name={method.icon} size={28} color="#333" />
            <Text style={styles.optionText}>{method.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {paymentMethod && (
        <>
          <Text style={styles.sectionTitle}>Enter Payment Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Paid Amount</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter amount received"
              value={paidAmount}
              onChangeText={setPaidAmount}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              !paidAmount && { backgroundColor: "#aaa" },
            ]}
           onPress={() => 
              handleConfirmPayment(
                billData,
                paymentMethod,
                paidAmount,
                navigation
              )
            }
             disabled={!paidAmount || !paymentMethod}
          >
            <Text style={styles.confirmText}>Confirm Payment</Text>
          </TouchableOpacity>

          {balance !== 0 && (
            <Text style={styles.balanceText}>
              {balance < 0
                ? `Insufficient Payment: ₹${Math.abs(balance).toFixed(2)}`
                : `Change to Return: ₹${balance.toFixed(2)}`}
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f8f8", flexGrow: 1 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 15 },
  amountBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 20,
  },
  label: { color: "#777", fontSize: 16, marginTop: 8 },
  amount: { fontSize: 20, fontWeight: "bold", color: "#333", marginTop: 2 },
  cartBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  emptyText: { textAlign: "center", color: "#777", marginVertical: 10 },
  cartItem: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  itemImage: { width: 40, height: 40, borderRadius: 6, marginRight: 10 },
  itemImagePlaceholder: { width: 40, height: 40, borderRadius: 6, marginRight: 10, backgroundColor: "#ddd" },
  itemName: { flex: 2, fontSize: 16 },
  itemQty: { flex: 1, fontSize: 16, textAlign: "center" },
  itemPrice: { flex: 1, fontSize: 16, textAlign: "right" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  summaryText: { fontSize: 16, color: "#333" },
  paymentOptions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  option: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    flexBasis: "47%",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionSelected: { borderColor: "#2196f3", backgroundColor: "#e3f2fd" },
  optionText: { marginTop: 8, fontSize: 16, fontWeight: "500" },
  inputContainer: { marginVertical: 10 },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  confirmButton: { backgroundColor: "#2196f3", padding: 15, borderRadius: 10, marginTop: 15, alignItems: "center" },
  confirmText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  balanceText: { textAlign: "center", marginTop: 15, fontSize: 16, fontWeight: "500", color: "#333" },
});

export default PaymentScreen;
