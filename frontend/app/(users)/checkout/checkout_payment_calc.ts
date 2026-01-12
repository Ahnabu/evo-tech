import { CartItem } from "@/schemas/cartSchema";
import { calculateCartBreakdown } from "@/utils/cart-totals";
import { getAdditionalChargeforWeight } from "@/utils/essential_functions";

export const calculatePayment = (
  cartItems: CartItem[],
  paymentMethod: string
) => {
  const bKashCashoutRate = 0.0185; // 1.85% from Any Agent

  let totalWeight = 0;
  let chargeforWeight = 0;
  let bKashCharge = 0;
  const breakdown = calculateCartBreakdown(cartItems);

  if (cartItems && cartItems.length > 0) {
    // console.log("🛒 Cart items for calculation:", cartItems);

    totalWeight = cartItems.reduce((acc, item) => {
      const weight = Number(item.item_weight) || 0;
      const quantity = Number(item.item_quantity) || 0;
      return acc + weight * quantity;
    }, 0);

    chargeforWeight = Math.round(
      getAdditionalChargeforWeight(Number(totalWeight))
    );

    if (paymentMethod === "bkash") {
      bKashCharge = Math.round(breakdown.dueNowSubtotal * bKashCashoutRate);
    } else {
      bKashCharge = 0;
    }

    // console.log("💳 Payment calculation result:", {
    //   cartSubTotal: breakdown.cartSubTotal,
    //   totalWeight,
    //   chargeforWeight,
    //   bKashCharge,
    //   preOrderSubtotal: breakdown.preOrderSubtotal,
    //   preOrderDepositDue: breakdown.preOrderDepositDue,
    //   preOrderBalanceDue: breakdown.preOrderBalanceDue,
    // });
  } else {
    // console.log("⚠️ No cart items found for calculation");
  }

  return {
    ...breakdown,
    totalWeight,
    chargeforWeight,
    bKashCharge,
  };
};
