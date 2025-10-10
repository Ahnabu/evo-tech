"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { BsFacebook, BsTwitterX } from "react-icons/bs";
import QuantityAdjuster from "@/components/quantity-adjuster";
import ColorSelector from "@/components/color-selector";
import { toast } from "sonner";
import { CustomToast } from "@/components/ui/customtoast";
import axios from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


const ItemInteractivePart = ({ singleitem }: {
    singleitem: any;
}) => {

    const searchParams = useSearchParams();
    const pathName = usePathname();
    const router = useRouter();
    const [itemQuantity, setItemQuantity] = useState<number | string>(1);

    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);

        return params.toString();
    }, [searchParams]);

    const itemColorfromURL = searchParams.get("color") || "";

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (/^(|[1-9]\d*)$/.test(inputValue) && inputValue.length <= 4) {
            Number(inputValue) === 0 ? setItemQuantity(inputValue) : setItemQuantity(Number(inputValue));
        }
    };

    const handleQuantityPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData("text");
        if (!/^[0-9]+$/.test(paste) || paste.length > 3) {
            e.preventDefault(); // prevent pasting non-numeric input
        }
    };

    const qtyIncrement = () => {
        (Number(itemQuantity) < 9999) && setItemQuantity(Number(itemQuantity) + 1);
    };

    const qtyDecrement = () => {
        (Number(itemQuantity) > 1) && setItemQuantity(Number(itemQuantity) - 1);
    };

    const setCartLocal = (cartLocal: any) => {
        localStorage.setItem('evoFrontCart', JSON.stringify(cartLocal));
    
        // Dispatch a custom event when updating the cart
        const event = new CustomEvent('localStorageChange', {
            detail: { key: 'evoFrontCart', newValue: cartLocal }
        });
        window.dispatchEvent(event);
    };

    const handleColorSelect = (selectedColor: string) => {
        const newQueryString = createQueryString("color", selectedColor);
        router.replace(`${pathName}?${newQueryString}`, { scroll: false });
    };

    const handleAddToCart = async () => {
        if (singleitem.i_subcategory && singleitem.i_colors && singleitem.i_subcategory === "filaments" && singleitem.i_colors.length > 0) {
            if (!itemColorfromURL) {
                toast.error("Please select a color first");
                return;
            }

            const colorExists = singleitem.i_colors.find((c: { name: string; hex: string; }) => c.name.toLowerCase() === itemColorfromURL.toLowerCase());
            if (!colorExists) {
                toast.error("Selected color not available");
                return;
            }
        }

        if (typeof itemQuantity === "string") {
            toast.error("Empty or invalid quantity");
            return;
        }

        const localevoFrontCart = localStorage.getItem('evoFrontCart');
        const parsedCart = localevoFrontCart ? JSON.parse(localevoFrontCart) : null;

        let cartreqbody = {};
        if (parsedCart && parsedCart.ctoken) {
            cartreqbody = {
                cart_t: parsedCart.ctoken,
            };
        }

        const cartResponse = await axios.post(`/api/cart/add`, {
            item_id: singleitem.itemid,
            item_price: singleitem.i_price,
            item_quantity: itemQuantity,
            item_color: itemColorfromURL.toLowerCase(),
            ...cartreqbody,
        }
        ).then((res) => res.data)
            .catch((error: any) => {
                axiosErrorLogger({ error });
                return null;
            });


        if (cartResponse && cartResponse.message && cartResponse.message === "Item added to cart") {
            const cartlocal: { items: any[]; ctoken: string } = { items: cartResponse.cartdata, ctoken: cartResponse.ctoken };
            setCartLocal(cartlocal);
            toast.success("Item added to cart");
        } else if (cartResponse && cartResponse.message && cartResponse.message === "Item already in cart, quantity updated") {
            const cartlocal: { items: any[]; ctoken: string } = { items: cartResponse.cartdata, ctoken: cartResponse.ctoken };
            setCartLocal(cartlocal);
            toast.custom((t) => (
                <CustomToast toastid={t}
                    title={<span className="text-blue-600">Item already in cart, quantity increased</span>}
                    description="visit the cart to update"
                />
            ), {
                duration: 4000,
            })
        } else if (cartResponse && cartResponse.message && cartResponse.message === "Quantity limit reached") {
            toast.error("Limit reached, cannot add more at this time");
        } else {
            toast.error("Something went wrong");
        }
    };

    const handleBuyNow = async () => {
        if (singleitem.i_subcategory && singleitem.i_colors && singleitem.i_subcategory === "filaments" && singleitem.i_colors.length > 0) {
            if (!itemColorfromURL) {
                toast.error("Please select a color first");
                return;
            }

            const colorExists = singleitem.i_colors.find((c: { name: string; hex: string; }) => c.name.toLowerCase() === itemColorfromURL.toLowerCase());
            if (!colorExists) {
                toast.error("Selected color not available");
                return;
            }
        }

        if (typeof itemQuantity === "string") {
            toast.error("Empty or invalid quantity");
            return;
        }

        const localevoFrontCart = localStorage.getItem('evoFrontCart');
        const parsedCart = localevoFrontCart ? JSON.parse(localevoFrontCart) : null;

        let cartreqbody = {};
        if (parsedCart && parsedCart.ctoken) {
            cartreqbody = {
                cart_t: parsedCart.ctoken,
            };
        }

        const cartResponse = await axios.post(`/api/cart/add`, {
            item_id: singleitem.itemid,
            item_price: singleitem.i_price,
            item_quantity: itemQuantity,
            item_color: itemColorfromURL.toLowerCase(),
            ...cartreqbody,
        }
        ).then((res) => res.data)
            .catch((error: any) => {
                axiosErrorLogger({ error });
                return null;
            });

        if (cartResponse && cartResponse.message && cartResponse.message === "Item added to cart") {
            const cartlocal: { items: any[]; ctoken: string } = { items: cartResponse.cartdata, ctoken: cartResponse.ctoken };
            setCartLocal(cartlocal);
            router.push("/cart");
        } else if (cartResponse && cartResponse.message && cartResponse.message === "Item already in cart, quantity updated") {
            const cartlocal: { items: any[]; ctoken: string } = { items: cartResponse.cartdata, ctoken: cartResponse.ctoken };
            setCartLocal(cartlocal);
            router.push("/cart");
        } else if (cartResponse && cartResponse.message && cartResponse.message === "Quantity limit reached") {
            router.push("/cart");
        } else {
            toast.error("Something went wrong");
        }
    };


    return (
        <div className="flex flex-col w-full h-fit gap-2">

            {(singleitem.i_subcategory && singleitem.i_colors && singleitem.i_subcategory === "filaments" && singleitem.i_colors.length > 0) && (
                <div className="relative flex flex-col w-full h-fit my-2 gap-3">
                    <span className="w-fit h-fit text-[13px] md:text-[14px] leading-5 tracking-tight font-[600]">{`Color:`}</span>
                    <ColorSelector
                        colors={singleitem.i_colors}
                        selectedColor={itemColorfromURL}
                        onColorSelect={handleColorSelect}
                    />
                </div>
            )}

            <div className="relative flex items-center w-fit h-fit gap-3">
                <span className="w-fit h-fit text-[14px] md:text-[16px] leading-5 tracking-tight font-[600]">Quantity</span>
                <label htmlFor="itemquantity" className="sr-only">Quantity</label>
                <QuantityAdjuster
                    itemQuantity={itemQuantity}
                    qtyIncrement={qtyIncrement}
                    qtyDecrement={qtyDecrement}
                    handleQuantityChange={handleQuantityChange}
                    handleQuantityPaste={handleQuantityPaste}
                />
            </div>


            <div className="flex w-full h-fit gap-2 max-w-[375px] mt-7 lg:mt-9">
                <button onClick={handleBuyNow} disabled={!singleitem.i_instock} type="button" aria-label="buy now button" className="w-full h-fit px-6 py-2 border border-stone-600 rounded-[4px] text-[12px] md:text-[14px] leading-5 tracking-tight font-[500] text-stone-100 bg-stone-900 disabled:bg-stone-700 disabled:hover:bg-stone-700 hover:bg-stone-800 transition-colors duration-100 ease-linear">
                    Buy Now
                </button>
                <button onClick={handleAddToCart} disabled={!singleitem.i_instock} type="button" aria-label="add to cart button" className="w-full h-fit px-6 py-2 border border-stone-600 rounded-[4px] text-[12px] md:text-[14px] leading-5 tracking-tight font-[500] text-stone-900 hover:text-stone-100 hover:bg-stone-900 disabled:hover:text-stone-900 disabled:hover:bg-transparent transition-colors duration-100 ease-linear">
                    Add To Cart
                </button>
            </div>
            {/* functionality for wishlist to be added later */}
            {/* <div className="flex w-full h-fit max-w-[375px]">
                <button type="button" aria-label="add to wishlist button" className="w-full h-fit px-6 py-2 border border-stone-600 rounded-[4px] text-[12px] md:text-[14px] leading-5 tracking-tight font-[500] text-stone-900 hover:text-stone-100 hover:bg-stone-900 transition-colors duration-100 ease-linear">
                    Add To Wishlist
                </button>
            </div> */}

            <div className="flex flex-wrap w-full h-fit items-center my-2 gap-2">
                <Link href="#" className="inline whitespace-nowrap w-fit h-fit text-[11px] md:text-[12px] leading-4 tracking-tight font-[500] text-stone-800 hover:text-stone-600 transition-colors duration-100 ease-linear">
                    Shipping & Return Policy
                </Link>
                <div className="w-[1px] h-3 bg-stone-800"></div>
                <Link href="#" className="inline whitespace-nowrap w-fit h-fit text-[11px] md:text-[12px] leading-4 tracking-tight font-[500] text-stone-800 hover:text-stone-600 transition-colors duration-100 ease-linear">
                    Warranty Policy
                </Link>
                <div className="w-[1px] h-3 bg-stone-800"></div>
                <div className="flex whitespace-nowrap w-fit h-fit items-center gap-1.5">
                    <span className="w-fit h-fit text-[11px] md:text-[12px] leading-4 tracking-tight font-[500] text-stone-800">{`Share:`}</span>
                    <button type="button" aria-label="share this item to facebook" className="flex w-fit h-fit px-0.5 hover:text-stone-500 transition duration-100 ease-linear focus:outline-none pointer-events-none">
                        <BsFacebook className="inline w-[14px] h-[14px]" />
                    </button>
                    <button type="button" aria-label="share this item to X" className="flex w-fit h-fit px-0.5 focus:outline-none pointer-events-none group">
                        <BsTwitterX className="inline w-[14px] h-[14px] p-0.5 rounded-full bg-stone-700 group-hover:bg-stone-500 text-white transition duration-100 ease-linear" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemInteractivePart;
