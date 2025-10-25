import React, { useEffect } from 'react';
import { ScrollView, View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, ActivityIndicator, Text, Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MetricCard from '../components/MetricCard';
import { useNavigation } from '@react-navigation/native';
import { fetchAdminStats } from '../redux/store';

const screenWidth = Dimensions.get('window').width;

const AdminDashboard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    totalSales,
    productsInStock,
    lowStock,
    todaysRevenue,
    salesData,
    loading,
    error,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7DFF" />
        <Text style={{ color: '#666', marginTop: 8 }}>Loading dashboard data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red' }}>⚠️ Failed to load dashboard: {error}</Text>
        <Button mode="contained" onPress={() => dispatch(fetchAdminStats())} style={{ marginTop: 10 }}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: '#2E7DFF' }}>
        <Appbar.Content title="Dashboard Overview" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      {/* Background */}
      <LinearGradient colors={['#E8EEFF', '#F9FAFF']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
          
          {/* Metric Cards - One per column */}
          <MetricCard
            title="Total Sales"
            value={`₹${totalSales.toFixed(2)}`}
            icon="cash"
            color="#ff6f61"
          />
          <MetricCard
            title="Products In Stock"
            value={productsInStock}
            icon="cube-outline"
            color="#4caf50"
          />
          <MetricCard
            title="Low Stock"
            value={lowStock}
            icon="alert-circle-outline"
            color="#f44336"
            onPress={() => navigation.navigate('MainApp', { screen: 'Low Stocks' })}
          />
          <MetricCard
            title="Today's Revenue"
            value={`₹${todaysRevenue.toFixed(2)}`}
            icon="calendar-today"
            color="#2196f3"
          />

          {/* Chart Card */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Weekly Sales</Text>
            <Text style={styles.chartSubtitle}>Revenue (₹)</Text>
            <LineChart
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    data: salesData.length ? salesData : [0, 0, 0, 0, 0, 0, 0],
                    color: (opacity = 1) => `rgba(46,125,255,${opacity})`,
                    strokeWidth: 3,
                  },
                ],
              }}
              width={screenWidth - 48}
              height={230}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(46,125,255,${opacity})`,
                labelColor: (opacity = 1) => `rgba(80,80,80,${opacity})`,
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#2E7DFF',
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  strokeWidth: 0.5,
                  stroke: '#ddd',
                },
                decimalPlaces: 0,
              }}
              bezier
              style={styles.chartStyle}
            />
          </View>
        </ScrollView>

        {/* Floating Bottom Actions */}
        <View style={styles.bottomFloatingBar}>
          <TouchableOpacity
            style={[styles.fabButton, { backgroundColor: '#ff6f61' }]}
            onPress={() => navigation.navigate('MainApp', { screen: 'Add Product' })}
          >
            <MaterialCommunityIcons name="plus" size={22} color="#fff" />
            <Text style={styles.fabLabel}>Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.fabButton, { backgroundColor: '#4caf50' }]}
            onPress={() => navigation.navigate('MainApp', { screen: 'Scan Bill' })}
          >
            <MaterialCommunityIcons name="barcode-scan" size={22} color="#fff" />
            <Text style={styles.fabLabel}>Scan Items</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.fabButton, { backgroundColor: '#2196f3' }]}
            onPress={() => navigation.navigate('MainApp', { screen: 'Reports' })}
          >
            <MaterialCommunityIcons name="file-chart" size={22} color="#fff" />
            <Text style={styles.fabLabel}>Reports</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginTop: 16,
    marginHorizontal: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 8,
  },
  chartStyle: {
    borderRadius: 12,
    alignSelf: 'center',
  },
  bottomFloatingBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderTopWidth: 0.5,
    borderColor: '#ddd',
    elevation: 10,
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flex: 1,
    marginHorizontal: 6,
    elevation: 3,
  },
  fabLabel: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminDashboard;
