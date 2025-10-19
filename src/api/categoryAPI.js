
import { getHeaders,BASE_URL } from "./configApi";
const CATEGORY_URL = BASE_URL + '/api/categories';

export const getAllCategories = async () => {
  try {
    console.log('[API] Fetching all categories...');
    const response = await fetch(`${CATEGORY_URL}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    console.log('[API] Category fetched:', data);
    return data;
  } catch (error) {
    console.error('[API] getAllCategories error:', error);
    throw error;
  }
};

export const addCategory = async (category) => {
 try {
    console.log('[API] Adding category:', category);
    const response = await fetch(CATEGORY_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('[API] Category added:', data);
    return data;
  } catch (error) {
    console.error('[API] addCategory error:', error);
    throw error;
  }
};

export const updateCategory = async (id, category) => {
  try {
    console.log(`[API] Updating category ${id}:`, brand);
    const response = await fetch(`${CATEGORY_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(brand),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('[API] Category updated:', data);
    return data;
  } catch (error) {
    console.error('[API] updateCategory error:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${CATEGORY_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    console.log('[API] Category deleted:', id);
    return await response.json();
  } catch (error) {
    console.error('[API] deleteCategory error:', error);
    throw error;
  }
};
