import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Products = () => {
  // Danh sách sản phẩm và giá
  const products = [
    { name: 'Product 1', price: '$10' },
    { name: 'Product 2', price: '$20' },
    { name: 'Product 3', price: '$15' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      {products.map((product, index) => (
        <View key={index} style={styles.productItem}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{product.price}</Text>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  productItem: {
    marginBottom: 20,
    alignItems: 'center',
  },
  productName: {
    fontSize: 18,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  buyButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Products;
