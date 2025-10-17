import axios from 'axios';

const BASE_URL = 'https://testapp-production-ad8c.up.railway.app/api/products'; // Replace with your actual API URL

const getHeaders = () => ({
  accept: '*/*',
  deviceId: 'DEVICE123', // Replace with actual device ID
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzYwNjk0NDg0LCJleHAiOjE3NjA2OTgwODR9.wXoeE0amEQWrQ6r20Xk1Y0FOEwxYjKsxRZK2VA6uFGs', // Must have ADMIN role
});

export const addProduct = async (productData, image) => {
  try {
    console.log('--- Starting upload ---');

    const formData = new FormData();
    // Send JSON as string
    formData.append('product', JSON.stringify(productData));
    console.log('Product JSON appended:', productData);

    if (image) {
      console.log('Image URI:', image);
      formData.append('image', {
        uri: image,
        name: image.split('/').pop(),
        type: 'image/jpeg',
      });
    }

    console.log('FormData entries:');
    formData._parts.forEach(([key, value]) => {
      if (value && value.uri) {
        console.log(`Key: ${key}, Name: ${value.name}, Type: ${value.type}, URI: ${value.uri}`);
      } else {
        console.log(`Key: ${key}, Value:`, value);
      }
    });

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server returned HTTP ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Upload successful. Response data:', data);
    return data;

  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  } finally {
    console.log('--- Upload attempt finished ---');
  }
};


// -----------------------------
// Update an existing product
// -----------------------------
export const updateProduct = async (productId, productData, image) => {
  try {
    const formData = new FormData();
    formData.append('product', JSON.stringify(productData));

    if (image) {
      formData.append('image', {
        uri: image,
        name: image.split('/').pop(),
        type: 'image/jpeg',
      });
    }

    const response = await fetch(`${BASE_URL}/${productId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Update product failed:', error);
    throw error;
  }
};

// -----------------------------
// Get all products
// -----------------------------
export const getAllProducts = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get all products failed:', error);
    throw error;
  }
};

// -----------------------------
// Get a product by ID
// -----------------------------
export const getProductById = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/${productId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Get product ${productId} failed:`, error);
    throw error;
  }
};

// -----------------------------
// Delete a product by ID
// -----------------------------
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Delete product ${productId} failed:`, error);
    throw error;
  }
};
