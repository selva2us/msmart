import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StaffPOSScreen = () => {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  // Static product data
  const products = [
    { id: "1", name: "Milk 1L", price: 50 },
    { id: "2", name: "Bread", price: 40 },
    { id: "3", name: "Rice 5Kg", price: 320 },
    { id: "4", name: "Sugar 1Kg", price: 45 },
    { id: "5", name: "Tea Powder 500g", price: 150 },
  ];

  const addToCart = (item) => {
    const exists = cart.find((p) => p.id === item.id);
    if (exists) {
      setCart(
        cart.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p))
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <View style={styles.container}>
      {/* Left Panel */}
      <View style={styles.leftPanel}>
        <Text style={styles.title}>Product Catalog</Text>
        <TextInput
          style={styles.search}
          placeholder="Search or scan product..."
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={products.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          )}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => addToCart(item)}
            >
              <MaterialCommunityIcons name="basket" size={30} color="#007bff" />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Right Panel - Cart */}
      <View style={styles.rightPanel}>
        <Text style={styles.title}>Billing Cart</Text>
        <ScrollView style={{ flex: 1 }}>
          {cart.length === 0 ? (
            <Text style={styles.emptyCart}>No items added</Text>
          ) : (
            cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Text style={{ flex: 1 }}>{item.name}</Text>
                <Text>₹{item.price}</Text>
                <View style={styles.qtyControl}>
                  <TouchableOpacity onPress={() => updateQty(item.id, -1)}>
                    <MaterialCommunityIcons name="minus-circle" size={20} color="#f44336" />
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.qty}</Text>
                  <TouchableOpacity onPress={() => updateQty(item.id, 1)}>
                    <MaterialCommunityIcons name="plus-circle" size={20} color="#4caf50" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.summary}>
          <Text style={styles.totalText}>Total: ₹{total}</Text>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payText}>Pay & Print</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StaffPOSScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
  },
  leftPanel: {
    flex: 2,
    padding: 10,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderLeftWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productName: {
    fontSize: 14,
    marginTop: 5,
  },
  productPrice: {
    fontWeight: "bold",
    color: "#333",
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 5,
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  qty: {
    marginHorizontal: 5,
    fontWeight: "600",
  },
  emptyCart: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
  },
  summary: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  payText: {
    color: "#fff",
    fontWeight: "700",
  },
});
