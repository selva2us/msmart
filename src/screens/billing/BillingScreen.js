import React, { useState, useEffect,useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation ,useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllProducts } from "../../api/productApi";

const BillingScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSavedBillsModal, setShowSavedBillsModal] = useState(false);
  const [savedBills, setSavedBills] = useState([]);

 useFocusEffect(
      useCallback(() => {        
      const loadData = async () => {
          await fetchProducts();
          await loadSavedBills();
      }; loadData();
      }, [])
    ); 

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      const formattedData = data.map((p) => ({
        id: p.id.toString(),
        name: p.name,
        imageUrl: p.imageUrl,
        price: p.price,
        stock: p.stockQuantity || 0,
      }));
      setProducts(formattedData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedBills = async () => {
    try {
      const bills = await AsyncStorage.getItem("savedBills");
      setSavedBills(bills ? JSON.parse(bills) : []);
    } catch (error) {
      console.error("Failed to load saved bills", error);
    }
  };

  const saveCartTemporarily = async () => {
    try {
      if (cart.length === 0) {
        Alert.alert("Cart is empty", "Nothing to save");
        return;
      }
      await AsyncStorage.setItem("currentCart", JSON.stringify(cart));
      Alert.alert("Saved!", "Cart saved temporarily.");
    } catch (error) {
      console.error("Failed to save cart", error);
    }
  };

  const saveCurrentBill = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    const newBill = {
      id: `BILL-${Date.now()}`,
      cart,
      total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      createdAt: new Date().toLocaleString(),
    };
    const updatedBills = [...savedBills, newBill];
    setSavedBills(updatedBills);
    await AsyncStorage.setItem("savedBills", JSON.stringify(updatedBills));
    alert("Bill saved successfully!");
  };

  const handleAddNewBill = async () => {
    await saveCurrentBill();
    await loadSavedBills();
    setShowSavedBillsModal(true);
  };

  const handleSavedBillPress = (bill) => {
  Alert.alert(
    `Bill ${bill.id}`,
    "Do you want to resume or delete this saved bill?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updatedBills = savedBills.filter((b) => b.id !== bill.id);
          setSavedBills(updatedBills);
          await AsyncStorage.setItem("savedBills", JSON.stringify(updatedBills));
        },
      },
      {
        text: "Resume",
        onPress: () => {
          setCart(bill.cart);
          setShowSavedBillsModal(false);
        },
      },
    ]
  );
};
  const resumeBill = (bill) => {
    setCart(bill.cart);
    setShowSavedBillsModal(false);
  };

  const startFreshBill = () => {
    setCart([]);
    setShowSavedBillsModal(false);
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.qty < product.stock) {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          )
        );
      }
    } else if (product.stock > 0) {
      setCart([...cart, { ...product, qty: 1, image: product.imageUrl }]);
    }
  };

  const removeFromCart = (product) => {
    setCart(
      cart
        .map((item) =>
          item.id === product.id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="cart-outline" size={26} color="#fff" />
        <Text style={styles.headerText}>Billing Counter</Text>
        <TouchableOpacity
          style={{ marginLeft: "auto" }}
          onPress={handleAddNewBill}
        >
          <MaterialCommunityIcons name="file-plus" size={28} color="#fff" />
        </TouchableOpacity>
      
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={22} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search product..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Horizontal Product List */}
      <View style={styles.productListContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => addToCart(item)}
            >
              <Image
                source={{ uri: item.imageUrl.replace("http://testapp-production-ad8c.up.railway.app/", "")  }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>₹{item.price}</Text>
              <Text style={styles.productStock}>Stock: {item.stock}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Modal for Saved Bills */}
      <Modal visible={showSavedBillsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentLarge}>
            <Text style={styles.modalTitle}>Saved Bills</Text>
            {savedBills.length === 0 ? (
              <Text style={styles.emptyCartText}>No saved bills available.</Text>
            ) : (
              <FlatList
                data={savedBills}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.savedBillCard}
                    onPress={() => handleSavedBillPress(item)}
                  >
                    <View>
                      <Text style={styles.billId}>{item.id}</Text>
                      <Text style={styles.billDate}>{item.createdAt}</Text>
                    </View>
                    <Text style={styles.billTotal}>₹{item.total}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: "#f44336", marginTop: 10 }]}
              onPress={startFreshBill}
            >
              <Text style={styles.saveBtnText}>Start New Bill</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cart Section */}
      <View style={styles.cartSection}>
        <Text style={styles.sectionTitle}>Cart</Text>
        <ScrollView style={{ flex: 1 }}>
          {cart.length === 0 ? (
            <Text style={styles.emptyCartText}>No items in cart</Text>
          ) : (
            cart.map((item) => {
              const lowStock = item.qty >= item.stock;
              return (
                <View
                  style={[
                    styles.cartItem,
                    lowStock && { backgroundColor: "#fff3e0", borderRadius: 8 },
                  ]}
                  key={item.id}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.remainingStockText}>
                      Stock left: {item.stock - item.qty}
                    </Text>
                  </View>
                  <View style={styles.cartActions}>
                    <TouchableOpacity onPress={() => removeFromCart(item)}>
                      <MaterialCommunityIcons
                        name="minus-circle"
                        size={24}
                        color="#f44336"
                      />
                    </TouchableOpacity>
                    <Text style={styles.cartQty}>{item.qty}</Text>
                    <TouchableOpacity
                      onPress={() => addToCart(item)}
                      disabled={item.qty >= item.stock}
                    >
                      <MaterialCommunityIcons
                        name="plus-circle"
                        size={24}
                        color={item.qty >= item.stock ? "#ccc" : "#4caf50"}
                      />
                    </TouchableOpacity>
                    <Text style={styles.cartItemPrice}>
                      ₹{item.price * item.qty}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Cart Actions */}
        <View style={styles.cartButtons}>       

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: "#4caf50" }]}
            onPress={() =>
              navigation.navigate("StaffApp", {
                screen: "Payment",
                params: {
                  billData: {
                    billNumber: `BILL-${Date.now()}`,
                    date: new Date().toLocaleString(),
                    cashier: "Ramesh (Staff-02)",
                    items: cart,
                    subtotal: totalAmount,
                    tax: totalAmount * 0.00, 
                    grandTotal: totalAmount,
                  },
                },
              })
            }
          >
            <Text style={styles.saveBtnText}>Proceed to Pay</Text>
          </TouchableOpacity>
        </View>

        {/* Total */}
        <Text style={styles.totalText}>Total: ₹{totalAmount}</Text>
      </View>
    </View>
  );
};

export default BillingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fc" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: "#1976d2", flexDirection: "row", alignItems: "center", padding: 15 },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "600", marginLeft: 10 },
  searchContainer: { flexDirection: "row", backgroundColor: "#fff", margin: 10, borderRadius: 12, paddingHorizontal: 10, alignItems: "center", elevation: 2 },
  searchInput: { flex: 1, marginLeft: 8, paddingVertical: 8 },
  productListContainer: { paddingHorizontal: 10, paddingVertical: 5 },
  productCard: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginRight: 10, width: 120, elevation: 2, alignItems: "center" },
  productImage: { width: 60, height: 60, borderRadius: 8, marginBottom: 6 },
  productName: { fontWeight: "600", textAlign: "center" },
  productPrice: { color: "#1976d2", marginTop: 4 },
  productStock: { fontSize: 12, color: "#888", marginTop: 2 },
  cartSection: { flex: 1, backgroundColor: "#fff", margin: 10, borderRadius: 12, padding: 10, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  emptyCartText: { textAlign: "center", color: "#777", marginTop: 20 },
  cartItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6, borderBottomWidth: 0.5, borderColor: "#ddd", marginBottom: 6 },
  cartItemName: { fontSize: 16, flex: 1 },
  remainingStockText: { fontSize: 12, color: "#ff9800", marginTop: 2 },
  cartActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  cartQty: { fontSize: 16, marginHorizontal: 4 },
  cartItemPrice: { fontWeight: "600", marginLeft: 8 },
  cartButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  saveBtn: { padding: 12, borderRadius: 10, flex: 0.48, alignItems: "center" },
  saveBtnText: { color: "#fff", textAlign: "center", fontWeight: "700", fontSize: 14 },
  totalText: { fontSize: 18, fontWeight: "700", textAlign: "right", marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContentLarge: { width: "90%", maxHeight: "70%", backgroundColor: "#fff", borderRadius: 12, padding: 15 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  savedBillCard: { flexDirection: "row", justifyContent: "space-between", padding: 12, borderBottomWidth: 0.5, borderColor: "#ccc" },
  billId: { fontWeight: "600" },
  billDate: { fontSize: 12, color: "#666" },
  billTotal: { fontWeight: "700", color: "#4caf50" },
});
