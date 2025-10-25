
import { getHeaders,BASE_URL } from "./configApi";
const Staff_URL = BASE_URL + '/api/admins';


export const getAllStaffs = async () => {
  try {
    console.log('[API] Fetching all Staffs...');
     const headers = await getHeaders();
    const response = await fetch(`${Staff_URL}/my-staff`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    console.log('[API] Staffs fetched:', data);
    return data;
  } catch (error) {
    console.error('[API] getAllStaffs error:', error);
    throw error;
  }
};

export const addStaff = async (Staff) => {
  try {
    console.log('[API] Adding Staff:', Staff);
    const headers = await getHeaders();
    const response = await fetch(`${Staff_URL}/add`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Staff),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('[API] Staff added:', data);
    return data;
  } catch (error) {
    console.error('[API] addStaff error:', error);
    throw error;
  }
};

export const updateStaff = async (id, Staff) => {
  try {
    console.log(`[API] Updating Staff ${id}:`, Staff);
    const headers = await getHeaders();
    const response = await fetch(`${Staff_URL}/${id}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(Staff),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('[API] Staff updated:', data);
    return data;
  } catch (error) {
    console.error('[API] updateStaff error:', error);
    throw error;
  }
};

export const deleteStaff = async (id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${Staff_URL}/${id}`, {
      method: 'DELETE',
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    console.log('[API] Staff deleted:', id);
    return await response.json();
  } catch (error) {
    console.error('[API] deleteStaff error:', error);
    throw error;
  }
};

export const uploadImage = async () => {
    try {} catch (error) {
        
    }
};

// Get today's sales amount for this staff
export const getTodaysSales = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/sales/today`);
    return response.data.total || 0; // assuming response: { total: 1234 }
  } catch (error) {
    console.error('getTodaysSales error:', error);
    return 0;
  }
};

// Get count of pending bills for this staff
export const getPendingBills = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/bills/pending`);
    return response.data.count || 0; // assuming response: { count: 5 }
  } catch (error) {
    console.error('getPendingBills error:', error);
    return 0;
  }
};

// Get low stock count
export const getLowStockCount = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products/low-stock-count`);
    return response.data.count || 0; // assuming response: { count: 3 }
  } catch (error) {
    console.error('getLowStockCount error:', error);
    return 0;
  }
};

// Get recent transactions (limit = number of last transactions)
export const getRecentTransactions = async (limit = 5) => {
  try {
    const response = await axios.get(`${BASE_URL}/transactions/recent?limit=${limit}`);
    return response.data.transactions || []; 
    // assuming response: { transactions: [ {id, customerName, amount, status, date}, ... ] }
  } catch (error) {
    console.error('getRecentTransactions error:', error);
    return [];
  }
};

