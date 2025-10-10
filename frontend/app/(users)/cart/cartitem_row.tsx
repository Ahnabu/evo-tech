"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import QuantityAdjusterBttnless from "@/components/quantity-adjuster-bttnless";
import { currencyFormatBDT } from "@/lib/all_utils";
import { BsFillTrashFill } from "react-icons/bs";
import { toast } from "sonner";


const CartItemRow = memo(({
  cartitem,
  effectiveQuantity,
  isUpdating,
  handleCartItemQuantityChange,
  handleCartItemRemove
}: {
  cartitem: any;
  effectiveQuantity: number;
  isUpdating: boolean;
  handleCartItemQuantityChange: (itemId: string, itemColor: string | null, newQuantity: number) => void;
  handleCartItemRemove: (itemId: string, itemColor: string | null) => Promise<void>;
}) => {

  const [itemQuantity, setItemQuantity] = useState<number | string>(effectiveQuantity);

  useEffect(() => {
    setItemQuantity(effectiveQuantity);
  }, [effectiveQuantity]);

  // Handle quantity changes and notify parent for batch processing
  useEffect(() => {
    if (typeof itemQuantity === "string" || itemQuantity === effectiveQuantity) {
      return;
    }

    handleCartItemQuantityChange(cartitem.item_id, cartitem.item_color, itemQuantity);
  }, [itemQuantity, effectiveQuantity, cartitem.item_id, cartitem.item_color, handleCartItemQuantityChange]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (/^(|[1-9]\d*)$/.test(inputValue) && inputValue.length <= 4) {
      const numValue = Number(inputValue);
      if (numValue === 0) {
        setItemQuantity(inputValue);
      } else {
        setItemQuantity(numValue);
      }
    }
  };

  const handleQuantityPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text");
    if (!/^[0-9]+$/.test(paste) || paste.length > 3) {
      e.preventDefault(); // prevent pasting non-numeric input
    }
  };

  const qtyIncrement = () => {
    if (Number(itemQuantity) < 9999) {
      setItemQuantity(Number(itemQuantity) + 1);
    }
  };

  const qtyDecrement = () => {
    if (Number(itemQuantity) > 1) {
      setItemQuantity(Number(itemQuantity) - 1);
    }
  };

  const handleRemoveItem = async () => {
    if (typeof itemQuantity === "string") {
      toast.error("Please enter a valid quantity before removing");
      return;
    }
    await handleCartItemRemove(cartitem.item_id, cartitem.item_color);
  };

  return (
    <>
      <div className="flex w-full h-fit py-1 gap-1 border-b border-[#dddbda]">
        <div className="flex justify-center items-center flex-initial min-w-[65px] w-[80px] border-r border-[#dddbda]">
          <div className="relative w-[50px] aspect-square border border-stone-300 rounded-[3px] overflow-hidden focus:outline-none bg-[#ffffff]" aria-label={`${cartitem.item_name}`}>
            <Image
              src={cartitem.item_imgurl}
              alt={`item image`}
              fill
              quality={100}
              draggable="false"
              sizes="100%"
              className="object-cover object-center"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center flex-auto min-w-[80px] w-[500px] px-2 py-1 gap-1 text-left text-stone-600 tracking-tight break-words border-x border-[#dddbda]">
          <Link href={`/items/${cartitem.item_slug}`} className="w-full h-fit text-[12px] sm:text-[13px] leading-4 sm:leading-5 tracking-tight hover:text-[#0866FF]">{cartitem.item_name}</Link>
          {cartitem.item_color && <p className="w-full h-fit text-stone-900 text-[12px] leading-5">{`Color: ${cartitem.item_color}`}</p>}
          <p className="lg:hidden w-full h-fit text-stone-500 text-[12px] leading-4 tracking-tight">{`BDT ${currencyFormatBDT(cartitem.item_price)} x ${effectiveQuantity}`}</p>
        </div>
        <div className="hidden lg:flex justify-center items-center flex-initial w-[220px] px-2 py-1 text-right text-stone-600 tracking-tight border-x border-[#dddbda]">
          {`BDT ${currencyFormatBDT(cartitem.item_price)}`}
        </div>
        <div className="relative flex justify-center items-center flex-initial min-w-[120px] w-[250px] gap-1 border-x border-[#dddbda]">
          {/* Show loading indicator when updating */}
          {isUpdating && (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
            </div>
          )}
          <QuantityAdjusterBttnless
            className={`${isUpdating ? 'pointer-events-none opacity-40' : ''}`}
            itemQuantity={itemQuantity}
            qtyIncrement={qtyIncrement}
            qtyDecrement={qtyDecrement}
            handleQuantityChange={handleQuantityChange}
            handleQuantityPaste={handleQuantityPaste}
          />
          <button
            type="button"
            aria-label="remove item"
            className={`w-fit h-fit focus:outline-none ${isUpdating ? 'opacity-40' : 'opacity-100'}`}
            onClick={handleRemoveItem}
            disabled={isUpdating}
          >
            <BsFillTrashFill className="inline w-4 h-4 text-red-600" />
          </button>
        </div>
        <div className="hidden md:flex justify-end items-center flex-initial min-w-[50px] w-[300px] px-2 py-1 text-stone-600 tracking-tight border-l border-[#dddbda]">
          {`BDT ${currencyFormatBDT(cartitem.item_price * effectiveQuantity)}`}
        </div>
      </div>
    </>
  );
});

CartItemRow.displayName = "CartItemRow";

export default CartItemRow;
