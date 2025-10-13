import React from 'react';
import { ScrollView, View, Dimensions, StyleSheet, Text } from 'react-native';
import { FAB, Button, Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import MetricCard from '../components/MetricCard';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const AdminDashboard = () => {
  const navigation = useNavigation();
  const { totalSales, productsInStock, lowStock, todaysRevenue, salesData } = useSelector(state => state.admin);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: '#6a11cb' }}>
        <Appbar.Content title="Admin Dashboard" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <LinearGradient colors={['#6a11cb', '#2575fc']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
          <View style={styles.cardPanel}>
            <View style={{ flexDirection: 'row' }}>
              <MetricCard index={0} title="Total Sales" value={`$${totalSales}`} icon="cash" color="#ff6f61" />
              <MetricCard index={1} title="Products In Stock" value={productsInStock} icon="cube-outline" color="#4caf50" />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <MetricCard index={2} title="Low Stock" value={lowStock} icon="alert-circle-outline" color="#f44336" onPress={() => navigation.navigate('MainApp', { screen: 'Low Stocks' })} />
              <MetricCard index={3} title="Today's Revenue" value={`$${todaysRevenue}`} icon="calendar-today" color="#2196f3" />
            </View>

            <Text style={styles.chartHeader}>Weekly Sales</Text>
            <Text style={styles.chartSubtitle}>Revenue in USD</Text>
            <LineChart
              data={{
                labels: ['Mon','Tue','Wed','Thu','Fri','Sat'],
                datasets: [{ data: salesData }],
                legend: ['Revenue'],
              }}
              width={screenWidth - 64}
              height={240}
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(33,33,33,${opacity})`,
                labelColor: (opacity = 1) => `rgba(33,33,33,${opacity})`,
                propsForDots: { r: '6', strokeWidth: '2', stroke: '#6a11cb' },
              }}
              bezier
              style={{ borderRadius: 16, marginTop: 8 }}
            />
          </View>
        </ScrollView>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
         <Button mode="contained" icon="plus" style={[styles.bottomButton, { backgroundColor: '#ff6f61' }]} onPress={() => navigation.navigate('MainApp', { screen: 'Add Product' })}>
            Add Product
          </Button>
          <Button mode="contained" icon="barcode-scan" style={[styles.bottomButton, { backgroundColor: '#4caf50' }]} onPress={() => {}}>
            Scan Items
          </Button>
          <Button mode="contained" icon="file-chart" style={[styles.bottomButton, { backgroundColor: '#2196f3' }]} onPress={() => {}}>
            View Reports
          </Button>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardPanel: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    elevation: 6,
  },
  fab: {
    position: 'absolute',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#ffffffee',
    elevation: 10,
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
    paddingVertical: 8,
  },
  chartHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: 16 },
  chartSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 8 },
});

export default AdminDashboard;
