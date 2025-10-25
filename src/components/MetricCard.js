import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MetricCard = ({ title, value, icon, color = '#2E7DFF', onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.wrapper}>
      <View style={styles.card}>
        <View style={[styles.iconWrapper, { backgroundColor: color + '33' }]}>
          <MaterialCommunityIcons name={icon} size={28} color={color} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textWrapper: {
    flex: 1,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default MetricCard;
