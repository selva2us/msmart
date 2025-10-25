import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { getLowStockProduct } from "../api/productApi"; // Adjust path if needed
import { MaterialIcons } from '@expo/vector-icons';

const LowStockScreen = ({ navigation }) => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} subtitle={`Stock: ${item.stockQuantity}`} />
      <Card.Content>
        <Text style={styles.warningText}>⚠️ Low Stock Alert — reorder soon!</Text>
      </Card.Content>
      <Card.Actions style={{ justifyContent: 'flex-end' }}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Add Product', { product: item })}
          style={{ backgroundColor: '#2E7DFF' }}
        >
          Edit
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
       <TouchableOpacity onPress={() => navigation.goBack()}>
             <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
           </TouchableOpacity>
        <Text style={styles.headerTitle}>Low Stock Products</Text>
        <Button mode="contained" onPress={fetchLowStockProducts} style={styles.refreshButton}>
          Refresh
        </Button>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2E7DFF" />
          <Text style={styles.loadingText}>Loading low stock items...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : lowStockProducts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>🎉 All products have sufficient stock!</Text>
        </View>
      ) : (
        <FlatList
          data={lowStockProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
};

export default LowStockScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#2E7DFF',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  refreshButton: { backgroundColor: '#4caf50' },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 10, color: '#555', fontSize: 14 },
  errorText: { color: '#f44336', fontWeight: '600', textAlign: 'center', marginHorizontal: 20 },
  emptyText: { color: '#555', fontSize: 16, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  warningText: { color: '#ff6f61', fontWeight: '600', marginTop: 4 },
});
