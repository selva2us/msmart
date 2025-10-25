import React, { useState, useCallback,useRef } from "react";
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
  Animated,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable, GestureHandlerRootView } from "react-native-gesture-handler";
import { getAllProducts } from "../../api/productApi";

const { width } = Dimensions.get("window");
const CARD_WIDTH = 130;
const SPACING = 10;

const BillingScreen = () => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSavedBillsModal, setShowSavedBillsModal] = useState(false);
  const [savedBills, setSavedBills] = useState([]);
  const [message, setMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        await fetchProducts();
        await loadSavedBills();
      };
      loadData();
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
const saveCurrentBill = async () => {
  if (!cart.length) return; // already handled in handleAddNewBill

  try {
    const billId = `BILL-${Date.now()}`;
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const newBill = {
      id: billId,
      cart,
      total,
      createdAt: new Date().toLocaleString(),
    };

    const storedBills = await AsyncStorage.getItem("savedBills");
    const bills = storedBills ? JSON.parse(storedBills) : [];
    bills.push(newBill);
    await AsyncStorage.setItem("savedBills", JSON.stringify(bills));

    setSavedBills(bills);
    setMessage("Bill saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  } catch (error) {
    console.error("Failed to save bill:", error);
    setMessage("Failed to save the bill. Try again.");
    setTimeout(() => setMessage(""), 3000);
  }
};

const handleAddNewBill = async () => {
  if (!cart.length && savedBills.length === 0) {
    setMessage("Cart is empty. Nothing to save.");
    setTimeout(() => setMessage(""), 3000);
    return;
  }
  if (savedBills.length > 0) {
      setShowSavedBillsModal(true);
    }

  const lastSaved = savedBills[savedBills.length - 1];
  const isCartChanged = !lastSaved || JSON.stringify(lastSaved.cart) !== JSON.stringify(cart);

  if (isCartChanged) {
    // Save new bill
    const newBill = {
      id: `BILL-${Date.now()}`,
      cart,
      total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      createdAt: new Date().toLocaleString(),
    };
    const updatedBills = [...savedBills, newBill];
    saveCurrentBill(updatedBills);
    await AsyncStorage.setItem("savedBills", JSON.stringify(updatedBills));
    setMessage("Bill saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  }

  // Open Saved Bills modal
  setShowSavedBillsModal(true);
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
      } else {
        Alert.alert("Stock Limit", "Maximum stock reached for this product.");
      }
    } else if (product.stock > 0) {
      setCart([{ ...product, qty: 1 }, ...cart]);
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

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="cart-outline" size={26} color="#fff" />
          <Text style={styles.headerText}>Billing Counter</Text>
          <TouchableOpacity style={{ marginLeft: "auto" }} onPress={handleAddNewBill}>
            <MaterialCommunityIcons name="file-plus" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {message ? (
          <View style={styles.messageBanner}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

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

        {/* Animated Product Carousel */}
        <View style={{ paddingVertical: 10 }}>
          <Animated.FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: SPACING }}
            snapToInterval={CARD_WIDTH + SPACING}
            decelerationRate="fast"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => {
              const inputRange = [
                (index - 1) * (CARD_WIDTH + SPACING),
                index * (CARD_WIDTH + SPACING),
                (index + 1) * (CARD_WIDTH + SPACING),
              ];
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.9, 1.1, 0.9],
                extrapolate: "clamp",
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.7, 1, 0.7],
                extrapolate: "clamp",
              });

              const inCart = cart.find(p => p.id === item.id)?.qty || 0;

              return (
                <Animated.View
                  style={[
                    styles.productCard,
                    { transform: [{ scale }], opacity },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => addToCart(item)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  {/* Low Stock Badge */}
                  {item.stock <= 5 && item.stock > 0 && (
                    <View style={styles.lowStockBadge}>
                      <Text style={styles.lowStockText}>Low Stock</Text>
                    </View>
                  )}
                    {inCart > 0 && (
                      <View style={styles.inCartBadge}>
                        <Text style={styles.inCartText}>{inCart}</Text>
                      </View>
                    )}
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productPrice}>
                      ₹{item.price.toFixed(2)}
                    </Text>
                    <Text style={styles.productStock}>Stock: {item.stock}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            }}
          />
        </View>

        {/* Cart Section */}
        <View style={[styles.cartSection, { opacity: cart.length === 0 ? 0.7 : 1 }]}>
          <Text style={styles.sectionTitle}>Cart</Text>
          <ScrollView style={{ flex: 1 }}>
            {cart.length === 0 ? (
              <Text style={styles.emptyCartText}>No items in cart</Text>
            ) : (
              cart.map((item) => (
                <View
                  style={[
                    styles.cartItem,
                    item.qty >= item.stock && { backgroundColor: "#fff3e0", borderRadius: 8 },
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
                      <MaterialCommunityIcons name="minus-circle" size={24} color="#f44336" />
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
                      ₹{(item.price * item.qty).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.cartButtons}>
            {cart.length > 0 && (
              <>
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
                          tax: totalAmount * 0.0,
                          grandTotal: totalAmount,
                        },
                      },
                    })
                  }
                >
                  <Text style={styles.saveBtnText}>Proceed to Pay</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: "#f44336" }]}
                  onPress={() => setCart([])}
                >
                  <Text style={styles.saveBtnText}>Clear Cart</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text style={[styles.totalText, { color: cart.length === 0 ? "#aaa" : "#000" }]}>
            Total: ₹{totalAmount.toFixed(2)}
          </Text>
        </View>

        {/* Saved Bills Modal */}
        <Modal visible={showSavedBillsModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentLarge}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <Text style={styles.modalTitle}>Saved Bills</Text>
                <TouchableOpacity onPress={() => setShowSavedBillsModal(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              {savedBills.length === 0 ? (
                <Text style={styles.emptyCartText}>No saved bills available.</Text>
              ) : (
                <FlatList
                  data={savedBills}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item: bill }) => (
                    <View style={styles.savedBillCard}>
                      <View>
                        <Text style={styles.billId}>{bill.id}</Text>
                        <Text style={styles.billDate}>{bill.createdAt}</Text>
                      </View>
                      <View style={{ flexDirection: "row", gap: 10 }}>
                        <TouchableOpacity
                          style={[styles.smallBtn, { backgroundColor: "#4caf50" }]}
                          onPress={() => {
                            setCart(bill.cart);
                            setShowSavedBillsModal(false);
                          }}
                        >
                          <Text style={styles.smallBtnText}>Resume</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.smallBtn, { backgroundColor: "#f44336" }]}
                          onPress={async () => {
                            const updatedBills = savedBills.filter((b) => b.id !== bill.id);
                            setSavedBills(updatedBills);
                            await AsyncStorage.setItem("savedBills", JSON.stringify(updatedBills));
                          }}
                        >
                          <Text style={styles.smallBtnText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />
              )}

              <TouchableOpacity
                style={[styles.smallBtnText, { backgroundColor: "#fff", marginTop: 10 }]}
                onPress={() => {
                  setCart([]);
                  setShowSavedBillsModal(false);
                }}
              >
                <Text style={[styles.saveBtnText, { fontSize: 16 }]}>Start New Bill</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

export default BillingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fc" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { backgroundColor: "#2E7DFF", flexDirection: "row", alignItems: "center", padding: 15 },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "600", marginLeft: 10 },
  searchContainer: { flexDirection: "row", backgroundColor: "#fff", margin: 10, borderRadius: 12, paddingHorizontal: 10, alignItems: "center", elevation: 2 },
  searchInput: { flex: 1, marginLeft: 8, paddingVertical: 8 },
  productCard: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginRight: SPACING, width: CARD_WIDTH, elevation: 2, alignItems: "center" },
  productImage: { width: 60, height: 60, borderRadius: 8, marginBottom: 6 },
  inCartBadge: { position: "absolute", top: 4, right: 4, backgroundColor: "#4caf50", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  inCartText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  productName: { fontWeight: "600", textAlign: "center" },
  productPrice: { color: "#2E7DFF", marginTop: 4 },
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
  smallBtn: { padding: 6, borderRadius: 6, minWidth: 70, alignItems: "center" },
  smallBtnText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  messageBanner: { backgroundColor: "#4caf50", padding: 8, marginHorizontal: 10, marginTop: 10, borderRadius: 8, alignItems: "center" },
  messageText: { color: "#fff", fontWeight: "600" },
});
