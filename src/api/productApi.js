import { Platform } from 'react-native';

import { getHeaders,BASE_URL } from "./configApi";
const PRODUCT_URL = BASE_URL + '/api/products';


export const addProduct = async (productData) => {
  try {
    console.log('--- Starting upload ---');

    const formData = new FormData();
    // Send JSON as string
    formData.append('product', JSON.stringify(productData));
    console.log('Product JSON appended:', productData); 

    const response = await fetch(PRODUCT_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });

   if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server returned HTTP ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Product created successfully:', data);
    return data;

  } catch (error) {
    console.error('Product creation failed:', error);
    throw error;
  } finally {
    console.log('--- Upload attempt finished ---');
  }
};



// -----------------------------
// Update an existing product
// -----------------------------
export const updateProduct = async (productId, productData) => {
  try {
    const response = await fetch(`${PRODUCT_URL}/${productId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData),
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
    const response = await fetch(PRODUCT_URL, {
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
    const response = await fetch(`${PRODUCT_URL}/${productId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    console.log(`Get product ${productId}:`, response.text());
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
    const response = await fetch(`${PRODUCT_URL}/${productId}`, {
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

export const getLowStockProduct = async () => {
  try {
    const response = await fetch(`${PRODUCT_URL}/low-stock`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get LowStock products failed:', error);
    throw error;
  }
};

export const uploadImage = async (image) => {
  try {
    console.log('--- Upload Started ---');
    console.log('Original image object:', image);

    const uri = Platform.OS === 'android' ? image.uri : image.uri.replace('file://', '');
    const fileName = image.fileName || `photo.${uri.split('.').pop()}`;
    const fileType = image.mimeType || 'image/jpeg'; // FIXED: use correct MIME type

    console.log('Using URI:', uri);
    console.log('File name:', fileName);
    console.log('File type:', fileType);

    const formData = new FormData();
    formData.append('file', { uri, name: fileName, type: fileType });

    console.log('--- FormData contents ---');
    formData._parts.forEach(([key, value]) => {
      console.log(`Key: ${key}`);
      console.log(`  Name: ${value.name}`);
      console.log(`  Type: ${value.type}`);
      console.log(`  URI: ${value.uri}`);
    });

    const headers = getHeaders();
    delete headers['Content-Type'];
    console.log('--- Headers ---', headers);

    const response = await fetch(`${PRODUCT_URL}/upload-image`, {
      method: 'POST',
      headers,
      body: formData,
    });

    console.log('Fetch request sent...');

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server returned HTTP ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Upload successful! Response data:', data);
    return data;

  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  } finally {
    console.log('--- Upload attempt finished ---');
  }
};


