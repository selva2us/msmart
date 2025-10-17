import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
const mockProducts = [
  { id: "1", name: "Apple", price: 50, stock: 30 },
  { id: "2", name: "Banana", price: 20, stock: 25 },
  { id: "3", name: "Milk Packet", price: 45, stock: 15 },
  { id: "4", name: "Bread", price: 30, stock: 10 },
  { id: "5", name: "Soap", price: 25, stock: 18 },
  { id: "6", name: "Rice (1kg)", price: 80, stock: 22 },
];
const cartItems = [
  { id: 1, name: 'Apple', qty: 2, price: 50 },
  { id: 2, name: 'Bread', qty: 1, price: 30 },
];

const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
const tax = subtotal * 0.05;

const BillingScreen = () => {
   const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const filteredProducts = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    const updatedCart = cart
      .map((item) =>
        item.id === product.id
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter((item) => item.qty > 0);
    setCart(updatedCart);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="cart-outline" size={26} color="#fff" />
        <Text style={styles.headerText}>Billing Counter</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={22} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search product or scan QR..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.mainArea}>
        {/* Product List */}
        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Available Products</Text>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <View>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>₹{item.price}</Text>
                </View>
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => addToCart(item)}
                >
                  <MaterialCommunityIcons
                    name="plus-circle"
                    size={26}
                    color="#2196f3"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* Cart Section */}
        <View style={styles.cartContainer}>
          <Text style={styles.sectionTitle}>Cart</Text>
          <ScrollView style={{ flex: 1 }}>
            {cart.length === 0 ? (
              <Text style={styles.emptyCartText}>No items in cart</Text>
            ) : (
              cart.map((item) => (
                <View style={styles.cartItem} key={item.id}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <View style={styles.cartActions}>
                    <TouchableOpacity onPress={() => removeFromCart(item)}>
                      <MaterialCommunityIcons
                        name="minus-circle"
                        size={24}
                        color="#f44336"
                      />
                    </TouchableOpacity>
                    <Text style={styles.cartQty}>{item.qty}</Text>
                    <TouchableOpacity onPress={() => addToCart(item)}>
                      <MaterialCommunityIcons
                        name="plus-circle"
                        size={24}
                        color="#4caf50"
                      />
                    </TouchableOpacity>
                    <Text style={styles.cartItemPrice}>
                      ₹{item.price * item.qty}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Total */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ₹{totalAmount}</Text>
            <TouchableOpacity style={styles.payBtn} 
            onPress={() => navigation.navigate('StaffApp', { screen: 'Payment' }, {
               billData: {
                  billNumber: `BILL-${Date.now()}`,
                  date: new Date().toLocaleString(),
                  cashier: 'Ramesh (Staff-02)',
                  items: cart,
                  subtotal: totalAmount,
                  tax: totalAmount * 0.05,
                  grandTotal: totalAmount + totalAmount * 0.05,
                },
              })
          } >
              <Text style={styles.payBtnText}>Proceed to Pay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BillingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fc" },
  header: {
    backgroundColor: "#1976d2",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "600", marginLeft: 10 },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 8, paddingVertical: 8 },
  mainArea: { flex: 1, flexDirection: "row" },
  productsContainer: { flex: 1, padding: 10 },
  cartContainer: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 12,
    padding: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  productCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
  },
  productName: { fontSize: 16, fontWeight: "600" },
  productPrice: { color: "#777" },
  addBtn: {},
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  cartItemName: { fontSize: 16, flex: 1 },
  cartActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartQty: { fontSize: 16, marginHorizontal: 4 },
  cartItemPrice: { fontWeight: "600", marginLeft: 8 },
  emptyCartText: { textAlign: "center", color: "#777", marginTop: 20 },
  totalContainer: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    marginTop: 10,
  },
  totalText: { fontSize: 18, fontWeight: "700", textAlign: "right" },
  payBtn: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  payBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  payButton: {
  backgroundColor: '#4caf50',
  padding: 15,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 20,
},
payButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '700',
},
});
