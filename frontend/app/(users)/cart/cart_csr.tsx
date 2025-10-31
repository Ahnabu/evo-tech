"use client";

import CartItemRow from "./cartitem_row";
import { currencyFormatBDT } from "@/lib/all_utils";
import { PiSmileySadLight } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addPendingUpdate,
  clearPendingUpdates,
  setIsUpdating,
  updateCartItemQuantities,
  removeCartItem
} from "@/store/slices/cartslice";
import Link from "next/link";
import { useCallback, useRef, useEffect } from "react";
import axiosLocal from "@/utils/axios/axiosLocal";
import { toast } from "sonner";


const CartListing = () => {

  const cartItems = useSelector((state: RootState) => state.shoppingcart.cartdata);
  const pendingUpdates = useSelector((state: RootState) => state.shoppingcart.pendingUpdates);
  const isUpdating = useSelector((state: RootState) => state.shoppingcart.isUpdating);
  const dispatch = useDispatch<AppDispatch>();

  const batchUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setCartLocal = (cartLocal: any) => {
    localStorage.setItem('evoFrontCart', JSON.stringify(cartLocal));

    // Dispatch a custom event when updating the cart
    const event = new CustomEvent('localStorageChange', {
      detail: { key: 'evoFrontCart', newValue: cartLocal }
    });
    window.dispatchEvent(event);
  };

  const handleBatchUpdate = useCallback(async () => {
    if (pendingUpdates.length === 0 || isUpdating) return;

    dispatch(setIsUpdating(true));

    // Store pendingUpdates locally before clearing them
    const updatesToProcess = [...pendingUpdates];

    const localevoFrontCart = localStorage.getItem('evoFrontCart');
    const parsedCart = localevoFrontCart ? JSON.parse(localevoFrontCart) : null;

    let cartreqbody = {};
    if (parsedCart && parsedCart.ctoken) {
      cartreqbody = {
        cart_t: parsedCart.ctoken,
      };
    }

    const payload = {
      items: updatesToProcess.map(update => ({
        item_id: update.item_id,
        item_color: update.item_color,
        item_quantity: update.new_quantity
      })),
      ...cartreqbody,
    };

    try {
  const response = await axiosLocal.put('/api/cart/updatebatch', payload);

      if (response.data && response.data.message === "Cart items updated") {
        // Update the Redux store with the successful updates
        dispatch(updateCartItemQuantities(updatesToProcess));
        dispatch(clearPendingUpdates());

        toast.success("Cart updated");

        // Update local storage using the stored updates
        if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {
          const updatedCartItems = parsedCart.items.map((item: any) => {
            const update = updatesToProcess.find(u => u.item_id === item.item_id && u.item_color === item.item_color);
            return update ? { ...item, item_quantity: update.new_quantity } : item;
          });
          const updatedCart = { items: updatedCartItems, ctoken: response.data.ctoken };
          setCartLocal(updatedCart);
        }
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to update cart");
      } else {
        toast.error("Failed to update cart");
      }
      // Clear pending updates on error to prevent infinite retry
      dispatch(clearPendingUpdates());
    } finally {
      dispatch(setIsUpdating(false));
    }
  }, [pendingUpdates, isUpdating, dispatch]);

  // Effect to handle batch updates with debouncing
  useEffect(() => {
    if (pendingUpdates.length === 0) return;

    // Clear existing timeout
    if (batchUpdateTimeoutRef.current) {
      clearTimeout(batchUpdateTimeoutRef.current);
    }

    // Set new timeout for batch update
    batchUpdateTimeoutRef.current = setTimeout(() => {
      handleBatchUpdate();
    }, 1200);

    return () => {
      if (batchUpdateTimeoutRef.current) {
        clearTimeout(batchUpdateTimeoutRef.current);
      }
    };
  }, [pendingUpdates, handleBatchUpdate]);

  const handleCartItemQuantityChange = useCallback((itemId: string, itemColor: string | null, newQuantity: number) => {
    dispatch(addPendingUpdate({
      item_id: itemId,
      item_color: itemColor,
      new_quantity: newQuantity
    }));
  }, [dispatch]);

  const handleCartItemRemove = useCallback(async (itemId: string, itemColor: string | null) => {
    dispatch(setIsUpdating(true));

    const localevoFrontCart = localStorage.getItem('evoFrontCart');
    const parsedCart = localevoFrontCart ? JSON.parse(localevoFrontCart) : null;

    let cartreqbody = {};
    if (parsedCart && parsedCart.ctoken) {
      cartreqbody = {
        cart_t: parsedCart.ctoken,
      };
    }

    try {
  const response = await axiosLocal.delete('/api/cart/remove', {
        data: {
          item_id: itemId,
          item_color: itemColor,
          ...cartreqbody,
        }
      });

      if (response.data && response.data.message === "Cart item removed") {
        dispatch(removeCartItem({ item_id: itemId, item_color: itemColor }));
        toast.success("Item removed from cart");

        if (parsedCart && parsedCart.items && Array.isArray(parsedCart.items)) {
          const updatedCartItems = parsedCart.items.filter((item: any) =>
            !(item.item_id === itemId && item.item_color === itemColor)
          );
          const updatedCart = { items: updatedCartItems, ctoken: response.data.ctoken };
          setCartLocal(updatedCart);
        }
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to remove item");
      }
    } finally {
      dispatch(setIsUpdating(false));
    }
  }, [dispatch]);

  const getEffectiveQuantity = (item: any) => {
    const pendingUpdate = pendingUpdates.find(
      update => update.item_id === item.item_id && update.item_color === item.item_color
    );
    return pendingUpdate ? pendingUpdate.new_quantity : item.item_quantity;
  };

  const calculateSubtotal = () => {
    if (!cartItems) return 0;

    return cartItems.reduce((acc, item) => {
      const effectiveQuantity = getEffectiveQuantity(item);
      return acc + (item.item_price * effectiveQuantity);
    }, 0);
  };

  return (
    <>
      {cartItems ?
        cartItems.length > 0 ?
          (<div className="flex flex-col w-full h-fit gap-7">
            <div className="flex flex-col w-full h-fit gap-2 overflow-x-auto scrollbar-custom">
              <div className="flex w-full h-fit gap-1">
                <div className="flex-initial min-w-[65px] w-[80px] px-2 py-1 text-center text-stone-600 tracking-tight bg-stone-50">
                  Image
                </div>
                <div className="flex-auto min-w-[80px] w-[500px] px-2 py-1 text-center text-stone-600 tracking-tight bg-stone-50">
                  Product
                </div>
                <div className="hidden lg:block flex-initial w-[220px] px-2 py-1 text-center text-stone-600 tracking-tight bg-stone-50">
                  Unit Price
                </div>
                <div className="flex-initial min-w-[120px] w-[250px] px-2 py-1 text-center text-stone-600 tracking-tight bg-stone-50">
                  Quantity
                </div>
                <div className="hidden md:block flex-initial min-w-[50px] w-[300px] px-2 py-1 text-center text-stone-600 tracking-tight bg-stone-50">
                  Total
                </div>
              </div>
              {cartItems.map((eachCartItem: any, index: number) => (
                <CartItemRow
                  key={`${eachCartItem.item_id}_${eachCartItem.item_color || 'nocolor'}`}
                  cartitem={eachCartItem}
                  effectiveQuantity={getEffectiveQuantity(eachCartItem)}
                  isUpdating={isUpdating}
                  handleCartItemQuantityChange={handleCartItemQuantityChange}
                  handleCartItemRemove={handleCartItemRemove}
                />
              ))}
            </div>

            <div className="flex flex-col items-end w-full h-fit gap-2">
              <div className="flex w-fit h-fit gap-1">
                <div className="w-fit px-2 py-1 text-[13px] sm:text-[15px] text-stone-600 tracking-tight">
                  {`Subtotal:`}
                </div>
                <div className="w-fit px-2 py-1 text-[13px] sm:text-[15px] text-stone-700 tracking-tight">
                  {`BDT ${currencyFormatBDT(calculateSubtotal())}`}
                </div>
              </div>

              <Link href="/checkout"
                className="flex w-fit h-fit px-7 sm:px-9 py-2 text-[13px] sm:text-[14px] font-[500] text-white bg-stone-800 rounded-md focus:outline-none hover:bg-stone-700 transition-colors duration-100"
              >
                Checkout
              </Link>
            </div>
          </div>
          )
          :
          <div className="w-full min-h-[300px] flex flex-col items-center justify-center gap-2">
            <PiSmileySadLight className="inline w-8 h-8 sm:w-10 sm:h-10 text-stone-400" />
            <p className="text-[13px] sm:text-[14px] leading-6 text-stone-800">{`Cart is empty!`}</p>
            <Link href="/products-and-accessories/all" className="w-fit h-fit mt-6 px-4 py-1 rounded-[6px] border border-stone-800 hover:border-stone-600 text-[13px] sm:text-[14px] leading-6 text-stone-100 bg-stone-800 hover:bg-stone-600 transition-colors duration-100 ease-linear">
              Continue Shopping
            </Link>
          </div>

        :
        <div className="w-full min-h-[300px] flex items-center justify-center">
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 sm:border-3 border-stone-400 border-t-stone-800 rounded-full animate-[spin_2s_linear_infinite]"></div>
        </div>
      }
    </>
  );
}

export default CartListing;
