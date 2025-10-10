import { CartItem } from "@/schemas/cartSchema";
import { getAdditionalChargeforWeight } from "@/utils/essential_functions";


export const calculatePayment = (
    cartItems: CartItem[],
    paymentMethod: string,
) => {

    const bKashCashoutRate = 0.0185; // 1.85% from Any Agent

    let cartSubTotal = 0;
    let totalWeight = 0;
    let chargeforWeight = 0;
    let bKashCharge = 0;

    if (cartItems && cartItems.length > 0) {
        cartSubTotal = cartItems.reduce((acc, item) => acc + (item.item_price * item.item_quantity), 0);
        totalWeight = cartItems.reduce((acc, item) => acc + (item.item_weight * item.item_quantity), 0);
        chargeforWeight = Math.round(getAdditionalChargeforWeight(Number(totalWeight)));
        if (paymentMethod === "bkash") {
            bKashCharge = Math.round(cartSubTotal * bKashCashoutRate);
        } else {
            bKashCharge = 0;
        }
    }

    return {
        cartSubTotal: cartSubTotal,
        totalWeight: totalWeight,
        chargeforWeight: chargeforWeight,
        bKashCharge: bKashCharge,
    };
}
