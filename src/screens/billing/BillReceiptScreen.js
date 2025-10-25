import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BillReceiptScreen = ({ route,navigation }) => {
     const bill = route.params?.billData;
  const mockBill = {
    billNumber: "BILL-2025-1014",
    date: "14 Oct 2025, 10:45 AM",
    cashier: "Ramesh (Staff-02)",
    items: [
      { id: 1, name: "Apple", qty: 2, price: 50 },
      { id: 2, name: "Bread", qty: 1, price: 30 },
      { id: 3, name: "Milk Packet", qty: 2, price: 45 },
      { id: 4, name: "Soap", qty: 3, price: 25 },
    ],
    paymentMethod: "Cash",
    totalAmount: 295,
    tax: 15,
    grandTotal: 310,
  };

  return (
    <ScrollView style={styles.container}>
  
      {/* Shop Details */}
      <View style={styles.shopInfo}>
        <Text style={styles.shopName}>MSD SuperMarket</Text>
        <Text style={styles.shopAddress}>12, Main Road, Chennai, India</Text>
        <Text style={styles.shopContact}>Ph: +91 98765 43210</Text>
      </View>

      {/* Bill Details */}
      <View style={styles.billInfo}>
        <Text style={styles.billText}>Bill No: {bill.billNumber}</Text>
        <Text style={styles.billText}>Date: {bill.billDate}</Text>
        <Text style={styles.billText}>Cashier: {bill.staffId}</Text>
      </View>

      {/* Line Divider */}
      <View style={styles.divider} />

      {/* Items */}
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, { flex: 3, fontWeight: "bold" }]}>Item</Text>
        <Text style={[styles.cell, { flex: 1, textAlign: "center", fontWeight: "bold" }]}>Qty</Text>
        <Text style={[styles.cell, { flex: 1.5, textAlign: "right", fontWeight: "bold" }]}>Price</Text>
        <Text style={[styles.cell, { flex: 1.5, textAlign: "right", fontWeight: "bold" }]}>Price</Text>
      </View>

      {bill.items.map((item) => (
        <View style={styles.tableRow} key={item.id}>
          <Text style={[styles.cell, { flex: 3 }]}>{item.productName}</Text>
          <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{item.quantity}</Text>
          <Text style={[styles.cell, { flex: 1.5, textAlign: "right" }]}>
            ₹{item.price}
          </Text>
          <Text style={[styles.cell, { flex: 1.5, textAlign: "right" }]}>
            ₹{item.totalPrice}
          </Text>
        </View>
      ))}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Summary */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal:</Text>
        <Text style={styles.summaryValue}>₹{bill.totalAmount.toFixed(2)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>DiscountAmount:</Text>
        <Text style={styles.summaryValue}>₹{bill.discountAmount.toFixed(2)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Grand Total:</Text>
        <Text style={styles.summaryValueBold}>₹{bill.finalAmount.toFixed(2)}</Text>
      </View>

      {/* Payment Info */}
      <View style={styles.paymentContainer}>
        <Text style={styles.paymentText}>Payment Method: {bill.paymentMode}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.thankYou}>Thank you for shopping with us!</Text>
        <Text style={styles.visitAgain}>Visit Again 😊</Text>
      </View>

      {/* Print Button */}
      <TouchableOpacity
        style={styles.printBtn}
        onPress={() => alert("Printing feature coming soon...")}
      >
        <MaterialCommunityIcons name="printer" size={22} color="#fff" />
        <Text style={styles.printBtnText}>Print / Share Receipt</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BillReceiptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    paddingHorizontal: 15,
  },
  header: {
    backgroundColor: "#1976d2",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },
  shopInfo: {
    alignItems: "center",
    marginTop: 10,
  },
  shopName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  shopAddress: {
    color: "#666",
    marginTop: 3,
  },
  shopContact: {
    color: "#666",
    marginTop: 2,
  },
  billInfo: {
    marginTop: 15,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  billText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  cell: {
    fontSize: 15,
    color: "#333",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#444",
  },
  summaryValue: {
    fontSize: 16,
    color: "#333",
  },
  summaryValueBold: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
  },
  paymentContainer: {
    backgroundColor: "#e3f2fd",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  paymentText: {
    color: "#1976d2",
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginVertical: 20,
  },
  thankYou: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  visitAgain: {
    fontSize: 14,
    color: "#777",
    marginTop: 3,
  },
  printBtn: {
    backgroundColor: "#4caf50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 30,
  },
  printBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
