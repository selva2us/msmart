import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import {
  getAllBrands,
  addBrand as apiAddBrand,
  updateBrand as apiUpdateBrand,
  deleteBrand as apiDeleteBrand,
} from '../api/brandApi';

const BrandScreen = ({ navigation }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [editingBrand, setEditingBrand] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await getAllBrands();
      setBrands(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch brands.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!brandName.trim()) {
      Alert.alert('Validation', 'Brand name cannot be empty');
      return;
    }

    try {
      if (editingBrand) {
        await apiUpdateBrand(editingBrand.id, { name: brandName });
        setBrands(
          brands.map((b) =>
            b.id === editingBrand.id ? { ...b, name: brandName } : b
          )
        );
        Alert.alert('Success', 'Brand updated!');
      } else {
        const newBrand = await apiAddBrand({ name: brandName });
        setBrands([...brands, newBrand]);
        Alert.alert('Success', 'Brand added!');
      }
      closeModal();
    } catch (error) {
      Alert.alert('Error', 'Failed to save brand.');
    }
  };

  const handleEdit = (brand) => {
    setBrandName(brand.name);
    setEditingBrand(brand);
    setModalVisible(true);
  };

  const handleDelete = (brand) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete brand "${brand.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiDeleteBrand(brand.id);
              setBrands(brands.filter((b) => b.id !== brand.id));
              Alert.alert('Deleted', 'Brand removed successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete brand.');
            }
          },
        },
      ]
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setBrandName('');
    setEditingBrand(null);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2E7DFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Brands</Text>
        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          Add Brand
        </Button>
      </View>

      {/* Brand List */}
      {brands.length === 0 ? (
        <Text style={styles.emptyText}>No brands found.</Text>
      ) : (
        <FlatList
          data={brands}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.brandName}>{item.name}</Text>
                <View style={styles.actions}>
                  <Button
                    mode="contained"
                    compact
                    onPress={() => handleEdit(item)}
                    style={[styles.button, { backgroundColor: '#2E7DFF' }]}
                  >
                    Edit
                  </Button>
                  <Button
                    mode="contained"
                    compact
                    onPress={() => handleDelete(item)}
                    style={[styles.button, { backgroundColor: '#FF5252' }]}
                  >
                    Delete
                  </Button>
                </View>
              </View>
            </Card>
          )}
        />
      )}

      {/* Add/Edit Modal */}
      {modalVisible && (
        <View style={styles.modal}>
          <Card style={styles.modalCard}>
            <Card.Title
              title={editingBrand ? 'Edit Brand' : 'Add Brand'}
              titleStyle={{ fontWeight: '700', fontSize: 18 }}
            />
            <Card.Content>
              <TextInput
                label="Brand Name"
                value={brandName}
                onChangeText={setBrandName}
                style={styles.input}
              />
            </Card.Content>
            <Card.Actions style={{ justifyContent: 'flex-end' }}>
              <Button onPress={closeModal}>Cancel</Button>
              <Button mode="contained" onPress={handleSave}>
                Save
              </Button>
            </Card.Actions>
          </Card>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#2E7DFF',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  addButton: { backgroundColor: '#4caf50' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandName: { fontSize: 16, fontWeight: '600', color: '#333' },
  actions: { flexDirection: 'row' },
  button: { marginLeft: 8 },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    borderRadius: 12,
    padding: 10,
  },
  input: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
});

export default BrandScreen;
