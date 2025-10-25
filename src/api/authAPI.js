const API_URL = "https://testapp-production-ad8c.up.railway.app";

export const registerUser = async (userData) => {
  try {
    console.log("[registerUser] Starting registration process with data:", userData);

    const response = await fetch(`${API_URL}/api/admins/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("[registerUser] Response status:", response.status);
    console.log("[registerUser] Response headers:", JSON.stringify([...response.headers]));

    const text = await response.text();
    console.log("[registerUser] Raw response text:", text);

    if (!response.ok) {
      throw new Error(text || "Registration failed");
    }

    const data = JSON.parse(text);
    console.log("[registerUser] Parsed response data:", data);

    return data;
  } catch (error) {
    console.error("[registerUser] Caught error:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    console.log("[loginUser] Sending login request:", credentials);

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    console.log("[loginUser] Response status:", response.status);

    const text = await response.text(); // safer than json()
    console.log("[loginUser] Raw response text:", text);

    if (!response.ok) throw new Error(text || "Login failed");

    const data = JSON.parse(text);
    console.log("[loginUser] Parsed response:", data);

    return data;
  } catch (error) {
    console.error("[loginUser] Caught error:", error);
    throw error;
  }
};
