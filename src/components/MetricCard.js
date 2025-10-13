import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MetricCard = ({ title, value, icon, color }) => {
  return (
    <Card style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.content}>
        <MaterialCommunityIcons name={icon} size={32} color="#fff" />
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    padding: 20,
    elevation: 6,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
    fontWeight: '600',
  },
  value: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default MetricCard;
