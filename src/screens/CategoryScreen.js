import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import {
  getAllCategories,
  addCategory as apiAddCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
} from '../api/categoryAPI';

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Validation', 'Category name cannot be empty');
      return;
    }

    try {
      if (editingCategory) {
        await apiUpdateCategory(editingCategory.id, { name: categoryName });
        setCategories(
          categories.map(c =>
            c.id === editingCategory.id ? { ...c, name: categoryName } : c
          )
        );
        Alert.alert('Success', 'Category updated!');
      } else {
        const newCategory = await apiAddCategory({ name: categoryName });
        setCategories([...categories, newCategory]);
        Alert.alert('Success', 'Category added!');
      }
      closeModal();
    } catch (error) {
      Alert.alert('Error', 'Failed to save category.');
    }
  };

  const handleEdit = (category) => {
    setCategoryName(category.name);
    setEditingCategory(category);
    setModalVisible(true);
  };

  const handleDelete = (category) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete category "${category.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiDeleteCategory(category.id);
              setCategories(categories.filter(c => c.id !== category.id));
              Alert.alert('Deleted', 'Category removed successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete category.');
            }
          },
        },
      ]
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setCategoryName('');
    setEditingCategory(null);
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
        <Text style={styles.headerTitle}>Categories</Text>
        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          Add Category
        </Button>
      </View>

      {/* Category List */}
      {categories.length === 0 ? (
        <Text style={styles.emptyText}>No categories found.</Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.categoryName}>{item.name}</Text>
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
              title={editingCategory ? 'Edit Category' : 'Add Category'}
              titleStyle={{ fontWeight: '700', fontSize: 18 }}
            />
            <Card.Content>
              <TextInput
                label="Category Name"
                value={categoryName}
                onChangeText={setCategoryName}
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
  categoryName: { fontSize: 16, fontWeight: '600', color: '#333' },
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

export default CategoryScreen;
