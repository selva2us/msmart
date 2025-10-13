import React, { useMemo } from "react";
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, Card, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

const LowStockScreen = ({ navigation }) => {
  const products = useSelector((state) => state.products.products || []);

  // Filter products that are low in stock (less than 10)
//const lowStockProducts = useMemo(
   // () => products.filter((item) => item.stock < 10),
   // [products]
  //);
  const lowStockProducts = [
    { id: 1, name: 'Milk', stock: 3 },
    { id: 2, name: 'Eggs', stock: 5 },
    { id: 3, name: 'Bread', stock: 2 },
    { id: 4, name: 'Butter', stock: 1 },
  ];
  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#ff6f61' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Low Stock Products" />
      </Appbar.Header>

      {lowStockProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
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
              <Card.Title title={item.name} subtitle={`Stock: ${item.stock}`} />
              <Card.Content>
                <Text variant="bodyMedium" style={{ color: '#ff6f61' }}>
                  ⚠️ Low Stock Alert
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  card: {
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#555',
  },
});

export default LowStockScreen;
