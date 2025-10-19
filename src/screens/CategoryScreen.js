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
  getAllCategories,
  addCategory as apiAddCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
} from '../api/categoryAPI';

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
      console.log('[API] Categories fetched:', data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch categories.');
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
          categories.map(c => (c.id === editingCategory.id ? { ...c, name: categoryName } : c))
        );
        Alert.alert('Success', 'Category updated!');
      } else {
        const newCategory = await apiAddCategory({ name: categoryName });
        setCategories([...categories, newCategory]);
        Alert.alert('Success', 'Category added!');
      }
      setModalVisible(false);
      setCategoryName('');
      setEditingCategory(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save category.');
    }
  };

  const handleEdit = category => {
    setCategoryName(category.name);
    setEditingCategory(category);
    setModalVisible(true);
  };

  const handleDelete = category => {
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
              console.error(error);
              Alert.alert('Error', 'Failed to delete category.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Categories" />
        <Appbar.Action icon="plus" onPress={() => setModalVisible(true)} />
      </Appbar.Header>

      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.categoryName}>{item.name}</Text>
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

      {modalVisible && (
        <View style={styles.modal}>
          <Card style={styles.modalCard}>
            <Card.Title title={editingCategory ? 'Edit Category' : 'Add Category'} />
            <Card.Content>
              <TextInput
                label="Category Name"
                value={categoryName}
                onChangeText={setCategoryName}
              />
            </Card.Content>
            <Card.Actions style={{ justifyContent: 'flex-end' }}>
              <Button onPress={() => { setModalVisible(false); setCategoryName(''); setEditingCategory(null); }}>
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
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
  categoryName: { fontSize: 16, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10 },
  actionText: { fontWeight: '600' },
  modal: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalCard: { borderRadius: 12, padding: 10 },
});

export default CategoryScreen;
