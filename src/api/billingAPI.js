import { Alert } from "react-native";
import { getHeaders,BASE_URL } from "./configApi";

const BILLING_URL = BASE_URL + '/api/bills';

export const handleConfirmPayment = async (
  billData,
  paymentMethod,
  paidAmount,
  navigation
) => {
  try {
    console.log("💳 Starting payment process...");
    console.log("📄 Bill Data:", JSON.stringify(billData, null, 2));
    console.log("💰 Payment Method:", paymentMethod, "Paid Amount:", paidAmount);
    
    const total = billData.grandTotal;
    const paid = parseFloat(paidAmount);

    // 1️⃣ Validate Cash payment
    if (paymentMethod === "Cash" && paid < total) {
      Alert.alert(
        "Insufficient Payment",
        `Received amount is less than total payable ₹${total.toFixed(2)}`
      );
      return;
    }


    // // 3️⃣ Update product stock in backend
    // for (const item of billData.items) {
    //   const newStock = item.stock - item.qty;
    //   await updateProductStock(item.id, newStock);
    // }

    // 2️⃣ Simulate Online payment for Card/UPI/Wallet
     if (paymentMethod !== "Cash") {
      console.log(`🌐 Processing online payment via ${paymentMethod}...`);
      const paymentResult = await processOnlinePayment(total, paymentMethod);
      if (!paymentResult.success) {
        Alert.alert("Payment Failed", paymentResult.message);
        return;
      }
      console.log("✅ Online payment successful");
    }


    // 3️⃣ Prepare clean payload for backend
  console.log("📦 Preparing transaction payload...");
    const transactionPayload = {
      staffId: 2, // dynamically get logged-in staff ID
      customerName: "Walk-in",
      customerPhone: "0000000000",
      totalAmount: billData.subtotal,
      discountAmount: 0,
      finalAmount: billData.grandTotal,
      paymentMode: paymentMethod.toUpperCase(),
      items: billData.items.map(item => ({
        productId: Number(item.id),        // only primitive fields
        productName: item.name,
        quantity: item.qty,
        price: item.price,
        totalPrice: item.price * item.qty,
      })),
      billNumber: billData.billNumber,
      transactionId: paymentMethod === "Cash" ? null : generateTransactionId(),
    };
    console.log("📤 Payload ready:", JSON.stringify(transactionPayload, null, 2));

    // 4️⃣ Save transaction
   console.log("💾 Saving transaction to backend...");
    const savedTransaction = await saveTransaction(transactionPayload);
    console.log("✅ Transaction saved:", JSON.stringify(savedTransaction, null, 2));

    // 5️⃣ Navigate to Receipt page on success
    navigation.navigate("Receipt", {
      billData: savedTransaction,
      paymentMethod,
      paidAmount: paid,
      balanceAmount: paid - total,
    });
    console.log("📄 Navigated to Receipt page successfully");

  } catch (error) {
    console.error("❌ Payment processing failed:", error);
    Alert.alert("Error", "Failed to complete payment. Please try again.");
  }
};

// ------------------- API Calls ------------------- //

// Simulate Online payment gateway
const processOnlinePayment = async (amount, method) => {
  return new Promise(resolve =>
    setTimeout(() => resolve({ success: true }), 1000)
  );
};

// // Update product stock
// const updateProductStock = async (productId, newStock) => {
//   try {
//     const response = await fetch(`${BASE_URL}/products/${productId}/stock`, {
//       method: "PUT",
//       headers: getHeaders(),
//       body: JSON.stringify({ stockQuantity: newStock }),
//     });
//     if (!response.ok) throw new Error("Failed to update stock");
//   } catch (error) {
//     console.error(`Stock update failed for product ${productId}:`, error);
//   }
// };


const saveTransaction = async (payload) => {
  try {
    console.log("🌐 Sending transaction to backend...", payload);
    const headers = await getHeaders();
    const response = await fetch(`${BILLING_URL}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload), // ✅ safe JSON
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save transaction: ${errorText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("❌ Save transaction failed:", error);
    throw error;
  }
};

export const getAllBills = async () => {
  console.log("🚀 getAllBills() called"); // log when function starts
  try {
    console.log("🌐 Sending GET request to backend:", `${BASE_URL}/bills`);
        const headers = await getHeaders();
    const response = await fetch(`${BILLING_URL}`, {
      method: 'GET',
      headers: headers,
    });
    console.log("📡 Response received:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend returned error:", errorText);
      throw new Error(`Failed to fetch bills: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Bills fetched successfully:", data);

    // Optional: sort latest first
    return data.reverse();
  } catch (error) {
    console.error("💥 Failed to fetch transactions:", error);
    throw error; // let caller handle alert or error display
  }
};


// ------------------- Utility ------------------- //
const generateTransactionId = () => {
  return "TXN-" + Date.now(); // simple unique ID for online payments
};