import { Alert } from "react-native";

import { getHeaders,BASE_URL } from "./configApi";

const ADMIN_URL = BASE_URL + '/api/admin/dashboard';


export const getAdminDashboardStats = async () => {
    console.log("💳 Starting getAdminDashboardStats...");
  try {
    const response = await fetch(`${ADMIN_URL}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json(); // should return something like:
    // { totalSales: 5000, productsInStock: 120, lowStock: 8, todaysRevenue: 1200, salesData: [100,200,150...] }
  } catch (error) {
    console.error("Get Admin Dashboard stats failed:", error);
    throw error;
  }
};