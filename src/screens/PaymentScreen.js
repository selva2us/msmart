import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PaymentScreen = ({ navigation, route }) => {
  const { totalAmount = 1250 } = route.params || {}; // mock amount
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paidAmount, setPaidAmount] = useState("");
  const [balance, setBalance] = useState(0);

  const handlePayment = () => {
    const balanceAmount = parseFloat(paidAmount || 0) - totalAmount;
    setBalance(balanceAmount);
    navigation.navigate('StaffApp', { screen: 'Receipt' }, {
      totalAmount,
      paidAmount,
      balanceAmount,
      paymentMethod,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>💳 Payment</Text>

      <View style={styles.amountBox}>
        <Text style={styles.label}>Total Payable</Text>
        <Text style={styles.amount}>₹{totalAmount.toFixed(2)}</Text>
      </View>

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
            onPress={() => setPaymentMethod(method.name)}
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
            style={styles.confirmButton}
            onPress={handlePayment}
            disabled={!paidAmount}
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
  container: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
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
  label: {
    color: "#777",
    fontSize: 16,
  },
  amount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  paymentOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
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
  optionSelected: {
    borderColor: "#2196f3",
    backgroundColor: "#e3f2fd",
  },
  optionText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  confirmButton: {
    backgroundColor: "#2196f3",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  balanceText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});

export default PaymentScreen;
