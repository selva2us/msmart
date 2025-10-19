export const BASE_URL = 'https://testapp-production-ad8c.up.railway.app'; // Replace with your actual API URL

export const getHeaders = () => ({
  accept: '*/*',
 'Content-Type': 'application/json',
  deviceId: 'ABC123', // Replace with actual device ID
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzYwODY1MTMxLCJleHAiOjE3NjA4Njg3MzF9.494rQ6xV-988c8xSkhZk6xNtyRVhN4npdCJXlgWN2Kw', // Must have ADMIN role
});