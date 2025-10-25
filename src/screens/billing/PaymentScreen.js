import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { handleConfirmPayment } from "../../api/billingAPI";

const screenWidth = Dimensions.get("window").width;

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

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState(billData.grandTotal.toFixed(2));
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  const paymentMethods = [
    { name: "Cash", icon: "cash" },
    { name: "Card", icon: "credit-card-outline" },
    { name: "UPI", icon: "cellphone" },
    { name: "Wallet", icon: "wallet-outline" },
  ];

  // Calculate balance whenever paidAmount changes
  useEffect(() => {
    if (paidAmount) {
      const bal = parseFloat(paidAmount) - billData.grandTotal;
      setBalance(bal);
    } else setBalance(0);
  }, [paidAmount]);

  const confirmPayment = async () => {
    setLoading(true);
    await handleConfirmPayment(
      billData,
      paymentMethod,
      parseFloat(paidAmount),
      navigation
    );
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* --- Compact Bill Info --- */}
        <View style={styles.amountBoxCompact}>
          <View style={styles.infoColumn}>
            <Text style={styles.labelSmall}>Bill:</Text>
            <Text style={styles.amountSmall}>{billData.billNumber}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.labelSmall}>Date:</Text>
            <Text style={styles.amountSmall}>{billData.date}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.labelSmall}>Cashier:</Text>
            <Text style={styles.amountSmall}>{billData.cashier}</Text>
          </View>
        </View>

        {/* --- Purchased Items Card --- */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Purchased Items</Text>
          {billData.items.length === 0 ? (
            <Text style={styles.emptyText}>No items found</Text>
          ) : (
            <>
              {(showAllItems ? billData.items : billData.items.slice(0, 3)).map((item, index) => (
                <View key={index} style={styles.cartItem}>
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                  ) : (
                    <View style={styles.itemImagePlaceholder} />
                  )}
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>x{item.qty}</Text>
                  <Text style={styles.itemPrice}>₹{(item.price * item.qty).toFixed(2)}</Text>
                </View>
              ))}
              {billData.items.length > 3 && !showAllItems && (
                <TouchableOpacity onPress={() => setShowAllItems(true)}>
                  <Text style={styles.showMore}>+{billData.items.length - 3} more items</Text>
                </TouchableOpacity>
              )}
              {showAllItems && (
                <TouchableOpacity onPress={() => setShowAllItems(false)}>
                  <Text style={styles.showMore}>Show Less</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* --- Summary Card --- */}
        <View style={styles.card}>
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
            <Text style={[styles.summaryText, { fontWeight: "bold" }]}>
              ₹{billData.grandTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* --- Payment Method Dropdown --- */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => setShowPaymentOptions(true)}
        >
          <Text style={{ fontSize: 16 }}>
            {paymentMethod || "Select Payment Method"}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={24} color="#333" />
        </TouchableOpacity>

        <Modal visible={showPaymentOptions} transparent animationType="slide">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowPaymentOptions(false)}
          />
          <View style={styles.modalBox}>
            {paymentMethods.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={styles.modalItem}
                onPress={() => {
                  setPaymentMethod(item.name);
                  setShowPaymentOptions(false);
                }}
              >
                <MaterialCommunityIcons name={item.icon} size={24} color="#333" />
                <Text style={{ marginLeft: 10, fontSize: 16 }}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

        {/* --- Received Amount + Inline Balance --- */}
        <View style={styles.inputRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelSmall}>Received Amount</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={paidAmount}
              onChangeText={setPaidAmount}
            />
          </View>
          {balance !== 0 && (
            <Text
              style={[
                styles.balanceInline,
                balance < 0 && { color: "red" },
              ]}
            >
              {balance < 0
                ? `₹${Math.abs(balance).toFixed(2)} needed`
                : `₹${balance.toFixed(2)} change`}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* --- Sticky Confirm Button --- */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!paidAmount || balance < 0 || !paymentMethod) && { backgroundColor: "#aaa" },
          ]}
          onPress={confirmPayment}
          disabled={!paidAmount || balance < 0 || !paymentMethod || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Confirm Payment</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f8f8", flexGrow: 1 },

  amountBoxCompact: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  infoColumn: { flex: 1, marginHorizontal: 5 },
  labelSmall: { fontSize: 12, color: "#777" },
  amountSmall: { fontSize: 14, fontWeight: "bold", color: "#333", marginTop: 2 },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 10 },
  emptyText: { textAlign: "center", color: "#777", marginVertical: 10 },
  cartItem: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  itemImage: { width: 40, height: 40, borderRadius: 6, marginRight: 10 },
  itemImagePlaceholder: { width: 40, height: 40, borderRadius: 6, marginRight: 10, backgroundColor: "#ddd" },
  itemName: { flex: 2, fontSize: 16 },
  itemQty: { flex: 1, fontSize: 16, textAlign: "center" },
  itemPrice: { flex: 1, fontSize: 16, textAlign: "right" },
  showMore: { textAlign: "center", color: "#2196f3", fontWeight: "500", marginVertical: 5 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  summaryText: { fontSize: 16, color: "#333" },

  selectBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  modalBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 10,
    maxHeight: 250,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  inputRow: { flexDirection: "row", alignItems: "center", marginVertical: 10, gap: 10 },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  balanceInline: { fontSize: 14, fontWeight: "500", color: "#333", marginTop: 22 },

  confirmButton: { backgroundColor: "#2196f3", padding: 15, borderRadius: 10, alignItems: "center" },
  confirmText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  stickyFooter: { padding: 10, backgroundColor: "#f8f8f8" },
});

export default PaymentScreen;
