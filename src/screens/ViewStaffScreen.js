import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllStaffs,addStaff,updateStaff,deleteStaff } from '../api/staffAPI'; // Create this API file

const PAGE_SIZE = 5;

const ViewStaffScreen = ({ navigation }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  // Fetch staff
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await getAllStaffs();
      setStaff(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch staff from server.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStaff();
    }, [])
  );

  // Delete staff
  const handleDelete = (id) => {
    Alert.alert(
      'Delete Staff',
      'Are you sure you want to delete this staff member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStaff(id);
              Alert.alert('Deleted', 'Staff deleted successfully');
              fetchStaff();
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to delete staff.');
            }
          },
        },
      ]
    );
  };

  const filteredStaff = staff.filter((s) =>
    s.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const displayedStaff = filteredStaff.slice(0, page * PAGE_SIZE);

  const loadMore = () => {
    if (displayedStaff.length < filteredStaff.length) {
      setLoadingMore(true);
      setTimeout(() => {
        setPage(prev => prev + 1);
        setLoadingMore(false);
      }, 500);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.info}>Email: {item.email}</Text>
        <Text style={styles.info}>Mobile: {item.mobile}</Text>
        <Text style={styles.info}>Active: {item.active ? 'Yes' : 'No'}</Text>

        <View style={styles.buttonRow}>
          <Button
            mode="contained"
            compact
            onPress={() => navigation.navigate('Add Staff', { staff: item })}
            style={[styles.button, { backgroundColor: '#2575fc' }]}
          >
            Edit
          </Button>
          <Button
            mode="contained"
            compact
            onPress={() => handleDelete(item.id)}
            style={[styles.button, { backgroundColor: '#ff6f61' }]}
          >
            Delete
          </Button>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a11cb" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Staff</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search staff..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {displayedStaff.length === 0 ? (
        <Text style={styles.emptyText}>No staff found.</Text>
      ) : (
        <FlatList
          data={displayedStaff}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#6a11cb" /> : null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#6a11cb' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
  searchContainer: { padding: 16, backgroundColor: '#fff' },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, fontSize: 16, color: '#333' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
  details: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  info: { fontSize: 14, color: '#555', marginTop: 4 },
  buttonRow: { flexDirection: 'row', marginTop: 8 },
  button: { marginRight: 8 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default ViewStaffScreen;
