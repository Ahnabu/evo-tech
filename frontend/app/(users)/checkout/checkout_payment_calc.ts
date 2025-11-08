import { CartItem } from "@/schemas/cartSchema";
import { getAdditionalChargeforWeight } from "@/utils/essential_functions";

export const calculatePayment = (
  cartItems: CartItem[],
  paymentMethod: string
) => {
  const bKashCashoutRate = 0.0185; // 1.85% from Any Agent

  let cartSubTotal = 0;
  let totalWeight = 0;
  let chargeforWeight = 0;
  let bKashCharge = 0;

  if (cartItems && cartItems.length > 0) {
    console.log("🛒 Cart items for calculation:", cartItems);

    cartSubTotal = cartItems.reduce((acc, item) => {
      const price = Number(item.item_price) || 0;
      const quantity = Number(item.item_quantity) || 0;
      const subtotal = price * quantity;
      console.log(
        `  Item: ${item.item_name}, Price: ${price}, Qty: ${quantity}, Subtotal: ${subtotal}`
      );
      return acc + subtotal;
    }, 0);

    totalWeight = cartItems.reduce((acc, item) => {
      const weight = Number(item.item_weight) || 0;
      const quantity = Number(item.item_quantity) || 0;
      return acc + weight * quantity;
    }, 0);

    chargeforWeight = Math.round(
      getAdditionalChargeforWeight(Number(totalWeight))
    );

    if (paymentMethod === "bkash") {
      bKashCharge = Math.round(cartSubTotal * bKashCashoutRate);
    } else {
      bKashCharge = 0;
    }

    console.log("💳 Payment calculation result:", {
      cartSubTotal,
      totalWeight,
      chargeforWeight,
      bKashCharge,
    });
  } else {
    console.log("⚠️ No cart items found for calculation");
  }

  return {
    cartSubTotal: cartSubTotal,
    totalWeight: totalWeight,
    chargeforWeight: chargeforWeight,
    bKashCharge: bKashCharge,
  };
};
