import { CartItem } from "@/schemas/cartSchema";
import { calculateCartBreakdown } from "@/utils/cart-totals";
import { getAdditionalChargeforWeight, getCODCharge } from "@/utils/essential_functions";

export const calculatePayment = (
  cartItems: CartItem[],
  paymentMethod: string,
  cityKey?: string
) => {
  const bKashCashoutRate = 0.0149; // 1.49% charge for Bkash
  const isInsideDhaka = cityKey === "dhaka";

  let totalWeight = 0;
  let chargeforWeight = 0;
  let bKashCharge = 0;
  let codCharge = 0;
  const breakdown = calculateCartBreakdown(cartItems);

  if (cartItems && cartItems.length > 0) {
    // console.log("🛒 Cart items for calculation:", cartItems);

    totalWeight = cartItems.reduce((acc, item) => {
      const weight = Number(item.item_weight) || 0;
      const quantity = Number(item.item_quantity) || 0;
      return acc + weight * quantity;
    }, 0);

    // Calculate weight-based shipping charge (only for COD)
    if (paymentMethod === "cod" && cityKey) {
      chargeforWeight = Math.round(
        getAdditionalChargeforWeight(Number(totalWeight), isInsideDhaka)
      );
    } else {
      chargeforWeight = 0;
    }

    // Calculate COD charge (1% of total product price)
    if (paymentMethod === "cod") {
      codCharge = getCODCharge(breakdown.dueNowSubtotal);
    } else {
      codCharge = 0;
    }

    // Calculate Bkash charge (1.49%)
    if (paymentMethod === "bkash") {
      bKashCharge = Math.round(breakdown.dueNowSubtotal * bKashCashoutRate);
    } else {
      bKashCharge = 0;
    }

    // console.log("💳 Payment calculation result:", {
    //   cartSubTotal: breakdown.cartSubTotal,
    //   totalWeight,
    //   chargeforWeight,
    //   codCharge,
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
    codCharge,
    bKashCharge,
  };
};
