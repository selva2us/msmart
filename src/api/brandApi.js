
import { getHeaders,BASE_URL } from "./configApi";
const BRAND_URL = BASE_URL + '/api/brands';


export const getAllBrands = async () => {
  try {
    console.log('[API] Fetching all brands...');
    const response = await fetch(`${BRAND_URL}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    console.log('[API] Brands fetched:', data);
    return data;
  } catch (error) {
    console.error('[API] getAllBrands error:', error);
    throw error;
  }
};

export const addBrand = async (brand) => {
  try {
    console.log('[API] Adding brand:', brand);
    const response = await fetch(BRAND_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(brand),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('[API] Brand added:', data);
    return data;
  } catch (error) {
    console.error('[API] addBrand error:', error);
    throw error;
  }
};

export const updateBrand = async (id, brand) => {
  try {
    console.log(`[API] Updating brand ${id}:`, brand);
    const response = await fetch(`${BRAND_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(brand),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('[API] Brand updated:', data);
    return data;
  } catch (error) {
    console.error('[API] updateBrand error:', error);
    throw error;
  }
};

export const deleteBrand = async (id) => {
  try {
    const response = await fetch(`${BRAND_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    console.log('[API] Brand deleted:', id);
    return await response.json();
  } catch (error) {
    console.error('[API] deleteBrand error:', error);
    throw error;
  }
};
