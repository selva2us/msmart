import React, { useState } from 'react';
import { View, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const VariantSelector = ({ variantUnit, setVariantUnit, variantValue, setVariantValue }) => {
  const units = ['ML',  'G', ,'KG', 'Packet', 'Piece'];
  const mlValues = ['10','25', '50', '75','100', '200', '250', '300', '350', '500','750', '1000'];

  return (
    <View style={styles.container}>
      {/* Unit Picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Product Unit</Text>
        <Picker
          selectedValue={variantUnit}
          onValueChange={(itemValue) => {
            setVariantUnit(itemValue);
            setVariantValue(''); // reset value when unit changes
          }}
          style={styles.picker}
        >
          {units.map((unit) => (
            <Picker.Item key={unit} label={unit} value={unit} />
          ))}
        </Picker>
      </View>

      {/* Weight / Value */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Weight / Value</Text>
        {variantUnit === 'ML'  || variantUnit === 'G' || variantUnit === 'KG' ? (
          <Picker
            selectedValue={variantValue}
            onValueChange={(val) => setVariantValue(val)}
            style={styles.picker}
          >
            {mlValues.map((val) => (
              <Picker.Item key={val} label={val} value={val} />
            ))}
          </Picker>
        ) : (
          <RNTextInput
            placeholder="Enter value"
            value={variantValue}
            onChangeText={setVariantValue}
            style={styles.input}
            keyboardType="numeric"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', marginBottom: 16 },
  pickerContainer: { marginBottom: 12 },
  picker: { height: 50, width: '100%', borderWidth: 2, borderColor: '#ccc', borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  label: { fontSize: 14, fontWeight: '800', color: '#333', marginBottom: 6 },
});

export default VariantSelector;
