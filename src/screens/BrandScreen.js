import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Appbar, TextInput, Button, Card } from 'react-native-paper';
import {
  getAllBrands,
  addBrand as apiAddBrand,
  updateBrand as apiUpdateBrand,
  deleteBrand as apiDeleteBrand,
} from '../api/brandApi'; // create API calls for brand

const BrandScreen = ({ navigation }) => {
  const [brands, setBrands] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [editingBrand, setEditingBrand] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await getAllBrands();
      setBrands(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch brands.');
    }
  };

  const handleSave = async () => {
    if (!brandName.trim()) {
      Alert.alert('Validation', 'Brand name cannot be empty');
      return;
    }

    try {
      if (editingBrand) {
        // Update brand
        await apiUpdateBrand(editingBrand.id, { name: brandName });
        setBrands(
          brands.map(b => (b.id === editingBrand.id ? { ...b, name: brandName } : b))
        );
        Alert.alert('Success', 'Brand updated!');
      } else {
        // Add new brand
        const newBrand = await apiAddBrand({ name: brandName });
        setBrands([...brands, newBrand]);
        Alert.alert('Success', 'Brand added!');
      }
      setModalVisible(false);
      setBrandName('');
      setEditingBrand(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save brand.');
    }
  };

  const handleEdit = brand => {
    setBrandName(brand.name);
    setEditingBrand(brand);
    setModalVisible(true);
  };

  const handleDelete = brand => {
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
              setBrands(brands.filter(b => b.id !== brand.id));
              Alert.alert('Deleted', 'Brand removed successfully!');
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to delete brand.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Brands" />
        <Appbar.Action icon="plus" onPress={() => setModalVisible(true)} />
      </Appbar.Header>

      {/* Brand List */}
      <FlatList
        data={brands}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.brandName}>{item.name}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Text style={[styles.actionText, { color: '#1976d2' }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Text style={[styles.actionText, { color: '#f44336' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
      />

      {/* Add/Edit Modal */}
      {modalVisible && (
        <View style={styles.modal}>
          <Card style={styles.modalCard}>
            <Card.Title title={editingBrand ? 'Edit Brand' : 'Add Brand'} />
            <Card.Content>
              <TextInput
                label="Brand Name"
                value={brandName}
                onChangeText={setBrandName}
              />
            </Card.Content>
            <Card.Actions style={{ justifyContent: 'flex-end' }}>
              <Button onPress={() => { setModalVisible(false); setBrandName(''); setEditingBrand(null); }}>
                Cancel
              </Button>
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
  card: { marginBottom: 10 },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  brandName: { fontSize: 16, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10 },
  actionText: { fontWeight: '600' },
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
});

export default BrandScreen;
