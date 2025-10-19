import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Appbar, Card, Text } from "react-native-paper";
import { getLowStockProduct } from "../api/productApi"; // ✅ Adjust the path if needed

const LowStockScreen = ({ navigation }) => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch low stock products on mount
  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLowStockProduct();
      setLowStockProducts(data || []);
    } catch (err) {
      console.error("Failed to load low stock products:", err);
      setError("Unable to fetch low stock products.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: "#ff6f61" }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Low Stock Products" />
        <Appbar.Action icon="refresh" onPress={fetchLowStockProducts} />
      </Appbar.Header>

      {/* Loading state */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#ff6f61" />
          <Text style={styles.loadingText}>Loading low stock items...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : lowStockProducts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text variant="titleMedium" style={styles.emptyText}>
            🎉 All products have sufficient stock!
          </Text>
        </View>
      ) : (
        <FlatList
          data={lowStockProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title title={item.name} subtitle={`Stock: ${item.stockQuantity}`} />
              <Card.Content>
                <Text variant="bodyMedium" style={styles.warningText}>
                  ⚠️ Low Stock Alert — reorder soon!
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

export default LowStockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  card: {
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#555",
    fontSize: 14,
  },
  errorText: {
    color: "#f44336",
    fontWeight: "600",
    textAlign: "center",
    marginHorizontal: 20,
  },
  emptyText: {
    color: "#555",
    fontSize: 16,
    textAlign: "center",
  },
  warningText: {
    color: "#ff6f61",
    fontWeight: "600",
    marginTop: 4,
  },
});
