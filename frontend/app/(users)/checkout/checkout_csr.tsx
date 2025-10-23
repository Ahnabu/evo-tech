"use client";

import Image from "next/image";
import Link from "next/link";
import { currencyFormatBDT } from "@/lib/all_utils";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from '@/store/store';
import { setCartData } from "@/store/slices/cartslice";
import { toast } from "sonner";
import { type SubmitHandler, useForm, Controller } from "react-hook-form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/evo_popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/evo_command";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/schemas";
import { EvoFormInputError } from "@/components/error/form-input-error";
import { districtsOfBD } from "@/utils/bd_districts";
import { IoChevronDown, IoCheckmark } from "react-icons/io5";
import { useEffect, useMemo, useState } from "react";
import axios from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";
import { useRouter } from "next/navigation";
import { calculatePayment } from "./checkout_payment_calc";




type CheckoutFormValuesType = z.infer<typeof checkoutSchema>;


const CheckoutParts = () => {

    const [isCityPopoverOpen, setIsCityPopoverOpen] = useState(false);
    const [deliveryCharge, setDeliveryCharge] = useState<number | null>(null);
    const cartItems = useSelector((state: RootState) => state.shoppingcart.cartdata);
    const discountAmount = useSelector((state: RootState) => state.discount.discountAmount);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { register, control, watch, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutFormValuesType>({
        defaultValues: {
            city: "",
            country: "Bangladesh",
            terms: false,
            paymentMethod: "",
            pickupPointId: "",
            transactionId: "",
        },
        resolver: zodResolver(checkoutSchema),
    });

    const paymentMethod = watch("paymentMethod");
    const shippingType = watch("shippingType");
    const cityValue = watch("city");

    const { cartSubTotal, chargeforWeight, bKashCharge } = useMemo(() => {
        return calculatePayment(cartItems ?? [], paymentMethod);
    }, [cartItems, paymentMethod]);

    const totalPayableAmount = useMemo(() => {
        return cartSubTotal + (deliveryCharge ?? 0) + bKashCharge - (discountAmount ?? 0);
    }, [cartSubTotal, deliveryCharge, bKashCharge, discountAmount]);

    // delivery charge calculation
    useEffect(() => {
        const isPickupOrExpress = (shippingType === "pickup_point" || shippingType === "express_delivery");

        const delCharge = !cityValue
            ? null
            : (isPickupOrExpress
                ? 0
                : (shippingType === "regular_delivery"
                    ? ((cityValue === "dhaka" ? 60 : 120) + chargeforWeight)
                    : null
                )
            );

        setDeliveryCharge(delCharge);
    }, [shippingType, chargeforWeight, cityValue]);

    useEffect(() => {
        // Reset to default when shipping type changes
        if (shippingType) {
            // Reset payment method to trigger re-selection
            setValue("paymentMethod", "");

            // Reset pickup point ID
            setValue("pickupPointId", "");

            // Reset transaction ID since it's tied to payment method
            setValue("transactionId", "");
        }
    }, [shippingType, setValue]);

    const onSubmit: SubmitHandler<CheckoutFormValuesType> = async (data) => {

        const localevoFrontCart = localStorage.getItem('evoFrontCart');
        const parsedCart = localevoFrontCart ? JSON.parse(localevoFrontCart) : null;

        let cartReqBody = {};
        if (parsedCart && parsedCart.ctoken) {
            cartReqBody = {
                cart_t: parsedCart.ctoken,
            };
        }

        const checkoutDetails = {
            firstname: data.firstName,
            lastname: data.lastName,
            phone: data.phone,
            email: data.email,
            housestreet: data.housestreet,
            city: districtsOfBD.find((district) => district.key === data.city)?.itemvalue,
            subdistrict: data.subdistrict,
            postcode: data.postcode,
            country: data.country,
            notes: data.notes,
            shippingType: data.shippingType,
            pickupPointId: data.pickupPointId && data.pickupPointId !== "" ? data.pickupPointId : "",
            paymentMethod: data.paymentMethod,
            transactionId: data.transactionId && data.transactionId !== "" ? data.transactionId : "",
            terms: data.terms ? "Accepted" : "Not Accepted",
            subTotal: cartSubTotal,
            discount: discountAmount,
            deliveryCharge: deliveryCharge ?? 0,
            additionalCharge: bKashCharge ?? 0,
            totalPayable: totalPayableAmount,
            items: cartItems ? cartItems : [],
        };

        const orderResponse = await axios.post("/api/order/place", {
            ...checkoutDetails,
            ...cartReqBody,
        }
        ).then((res) => (res.data))
            .catch((error: any) => {
                axiosErrorLogger({ error });
                return null;
            });

        if (orderResponse && orderResponse.orderdata) {
            dispatch(setCartData([]));

            localStorage.setItem('evoFrontCart', JSON.stringify({ items: [], ctoken: orderResponse.ctoken }));
            // Dispatch a custom event when updating the cart
            const event = new CustomEvent('localStorageChange', {
                detail: { key: 'evoFrontCart', newValue: { items: [], ctoken: orderResponse.ctoken } }
            });
            window.dispatchEvent(event);

            // Redirect to order confirmation page
            router.push(`/order/${orderResponse.orderdata.orderid}?ordkey=${orderResponse.orderdata.order_key}`);
        } else {
            toast.error("Sorry! Order could not be placed.");
        }
    };

    const handleCitySelection = (cityKey: string) => {
        setValue("city", cityKey);
        setIsCityPopoverOpen(false); // close the popover after selection
    };

    // implement coupon code apply functionality later
    const handleCouponApply = () => {
        toast.error("Coupon code is not valid!");
    };

    if (!cartItems) {
        return (
            <div className="flex flex-col items-center md:flex-row md:justify-start md:items-start w-full h-fit gap-5 animate-pulse">
                <div className="flex flex-col w-full h-fit gap-4 pb-3 sm:pb-5">
                    <div className="flex max-[300px]:flex-col w-full h-fit gap-x-2 gap-y-4">
                        <div className="w-full h-[40px] bg-stone-300 rounded"></div>
                        <div className="w-full h-[40px] bg-stone-300 rounded"></div>
                    </div>
                    <div className="flex max-[410px]:flex-col w-full h-fit gap-x-2 gap-y-4">
                        <div className="w-full h-[40px] bg-stone-300 rounded"></div>
                        <div className="w-full h-[40px] bg-stone-300 rounded"></div>
                    </div>
                    <div className="relative w-full h-fit pt-1.5">
                        <div className="w-full h-[40px] bg-stone-300 rounded"></div>
                    </div>
                    <div className="flex max-[410px]:flex-col w-full h-fit gap-x-2 gap-y-4">
                        <div className="w-full h-[40px] bg-stone-300 rounded"></div>
                        <div className="w-full h-[40px] bg-stone-300 rounded"></div>
                    </div>
                    <div className="flex max-[410px]:flex-col w-full h-fit gap-x-2 gap-y-4">
                        <div className="w-full h-[40px] bg-stone-300 rounded"></div>
                        <div className="w-full h-[40px] bg-stone-300 rounded"></div>
                    </div>
                    <div className="relative w-full h-fit">
                        <div className="w-full h-[96px] bg-stone-300 rounded"></div>
                    </div>

                    <div className="w-[116px] h-[24px] mt-5 bg-stone-300 rounded"></div>
                    <div className="flex flex-col w-full h-fit py-2 gap-2.5 border-t border-stone-300">
                        <div className="w-[110px] h-[24px] bg-stone-300 rounded"></div>
                        <div className="w-[110px] h-[24px] bg-stone-300 rounded"></div>
                        <div className="w-[100px] h-[24px] bg-stone-300 rounded"></div>
                    </div>
                    <div className="w-[124px] h-[24px] mt-5 bg-stone-300 rounded"></div>
                    <div className="flex flex-col w-full h-fit py-2 gap-2.5 border-t border-stone-300">
                        <div className="w-[116px] h-[24px] bg-stone-300 rounded"></div>
                        <div className="w-[70px] h-[24px] bg-stone-300 rounded"></div>
                        <div className="w-[100px] h-[24px] bg-stone-300 rounded"></div>
                    </div>
                    <div className="flex flex-col w-full h-fit py-0.5 mt-5">
                        <div className="w-[170px] h-[24px] bg-stone-300 rounded"></div>
                    </div>
                </div>


                <div className="flex flex-col w-full md:max-w-[280px] min-[900px]:max-w-[350px] lg:max-w-[400px] min-[1250px]:max-w-[450px] h-fit gap-2 px-5 lg:px-8 py-1">
                    <div className="flex flex-col w-full h-[220px] py-3 bg-stone-300 rounded"></div>
                    <div className="flex w-full h-10 bg-stone-300 rounded"></div>
                    <div className="flex flex-col w-full h-fit gap-2 py-2 border-t border-stone-300">
                        <div className="flex w-full h-7 bg-stone-300 rounded"></div>
                        <div className="flex w-full h-7 bg-stone-300 rounded"></div>
                        <div className="flex w-full h-7 bg-stone-300 rounded"></div>
                    </div>
                    <div className="flex flex-col w-full h-fit gap-2 py-2 border-t border-stone-300">
                        <div className="flex w-full h-7 bg-stone-300 rounded"></div>
                    </div>
                    <div className="flex justify-center w-44 h-9 bg-stone-300 rounded-[6px] overflow-hidden"></div>
                </div>
            </div>
        );
    }
    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-[300px]">
                <p className="text-[13px] sm:text-[14px] leading-6 text-stone-800">{`Cart is empty!`}</p>
                <Link href="/products-and-accessories/all" className="w-fit h-fit mt-6 px-4 py-1 rounded-[6px] border border-stone-800 hover:border-stone-600 text-[13px] sm:text-[14px] leading-6 text-stone-100 bg-stone-800 hover:bg-stone-600 transition-colors duration-100 ease-linear">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="relative flex flex-col items-center md:flex-row md:justify-start md:items-start w-full h-fit gap-5">
                <form id="checkoutform" onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-full h-fit gap-4 pb-3 sm:pb-5">
                    <h3 className="flex items-center w-full h-fit text-center text-[14px] sm:text-[15px] leading-6 font-[600] text-stone-900"><span className="flex justify-center items-center w-5 h-5 text-[13px] leading-4 mr-1.5 text-[#0866FF] bg-[#0866FF]/15 rounded-full">1</span>Customer Information</h3>

                    <div className="flex max-[300px]:flex-col w-full h-fit gap-x-2 gap-y-4">
                        <div className="relative w-full h-fit pt-1.5">
                            <input type="text" id="firstname" {...register("firstName")} placeholder="Enter first name" autoCorrect="off" spellCheck="false"
                                className="peer w-full h-[40px] custom-input-style1"
                            />
                            <label htmlFor="firstname" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                                {`First Name*`}
                            </label>
                            {errors.firstName && <EvoFormInputError>{errors.firstName.message}</EvoFormInputError>}
                        </div>

                        <div className="relative w-full h-fit pt-1.5">
                            <input type="text" id="lastname" {...register("lastName")} placeholder="Enter last name" autoCorrect="off" spellCheck="false"
                                className="peer w-full h-[40px] custom-input-style1"
                            />
                            <label htmlFor="lastname" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                                {`Last Name`}
                            </label>
                            {errors.lastName && <EvoFormInputError>{errors.lastName.message}</EvoFormInputError>}
                        </div>
                    </div>

                    <div className="flex max-[410px]:flex-col w-full h-fit gap-x-2 gap-y-4">
                        <div className="relative w-full h-fit pt-1.5">
                            <input type="text" id="phone" {...register("phone")} placeholder="Enter Phone No" autoCorrect="off" inputMode="tel" autoComplete="tel"
                                className="peer w-full h-[40px] custom-input-style1"
                            />
                            <label htmlFor="phone" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                                {`Phone*`}
                            </label>
                            {errors.phone && <EvoFormInputError>{errors.phone.message}</EvoFormInputError>}
                        </div>

                        <div className="relative w-full h-fit pt-1.5">
                            <input type="text" id="email" {...register("email")} placeholder="Enter email" autoCorrect="off" spellCheck="false" inputMode="email" autoComplete="email"
                                className="peer w-full h-[40px] custom-input-style1"
                            />
                            <label htmlFor="email" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                                {`Email`}
                            </label>
                            {errors.email && <EvoFormInputError>{errors.email.message}</EvoFormInputError>}
                        </div>
                    </div>

                    <div className="relative w-full h-fit pt-1.5">
                        <input type="text" id="housestreet" {...register("housestreet")} placeholder="Enter house & street name/no" autoCorrect="off" spellCheck="false"
                            className="peer w-full h-[40px] custom-input-style1"
                        />
                        <label htmlFor="housestreet" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                            {`House & Street*`}
                        </label>
                        {errors.housestreet && <EvoFormInputError>{errors.housestreet.message}</EvoFormInputError>}
                    </div>

                    <div className="flex max-[410px]:flex-col w-full h-fit gap-x-2 gap-y-4">
                        <div className="relative w-full h-fit pt-1.5">
                            <Controller
                                name="city"
                                control={control}
                                render={({ field }) => (
                                    <Popover open={isCityPopoverOpen} onOpenChange={setIsCityPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <button type="button"
                                                aria-label={`city or district`}
                                                className={`peer/city relative z-[0] flex items-center w-full h-[40px] text-[12px] leading-4 font-[500] ${field.value ? `text-stone-900` : `text-stone-400`} px-2 py-1 bg-stone-100 border rounded-[4px] border-stone-400 border-t-transparent overflow-hidden focus-visible:outline-none focus-visible:border-x-evoAdminAccent focus-visible:border-t-transparent`}
                                            >
                                                <p className="w-full h-fit text-left truncate capitalize">
                                                    {field.value ?
                                                        districtsOfBD.find((district) => district.key === field.value)?.itemvalue
                                                        :
                                                        `Select city/district`
                                                    }
                                                </p>
                                                <div className="absolute z-0 inset-y-0 right-0 flex items-center w-fit px-1 py-1 bg-stone-100">
                                                    <IoChevronDown className="inline w-[14px] h-[14px] text-stone-700" />
                                                </div>
                                            </button>
                                        </PopoverTrigger>

                                        <PopoverContent sideOffset={10} className="w-[150px] sm:w-[250px] h-fit p-1 bg-stone-50 border-stone-300 shadow-md">
                                            <Command>
                                                <CommandInput placeholder="Find city..."
                                                    className="h-9"
                                                />
                                                <CommandList className="max-h-[180px] scrollbar-custom">
                                                    <CommandEmpty>{`City not found.`}</CommandEmpty>
                                                    <CommandGroup>
                                                        {
                                                            districtsOfBD.sort((a, b) => a.key.localeCompare(b.key)).map((districtItem) => (
                                                                <CommandItem key={districtItem.key}
                                                                    value={districtItem.key}
                                                                    onSelect={() => {
                                                                        field.onChange(districtItem.key);
                                                                        handleCitySelection(districtItem.key);
                                                                    }}
                                                                    className={`font-[500] tracking-tight ${districtItem.key === field.value ? 'text-[#0866FF]' : 'text-stone-600'}`}
                                                                >
                                                                    {districtItem.itemvalue}
                                                                    <IoCheckmark className={`inline w-4 h-4 ml-auto ${districtItem.key === field.value ? 'text-[#0866FF] opacity-100' : 'text-transparent opacity-0'}`} />
                                                                </CommandItem>
                                                            ))
                                                        }
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                            <p id="citylabel" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 after:border-stone-400 peer-disabled/city:before:border-stone-300 peer-disabled/city:after:border-stone-300">
                                {`City/District*`}
                            </p>
                            {errors.city && <EvoFormInputError>{errors.city.message}</EvoFormInputError>}
                        </div>

                        <div className="relative w-full h-fit pt-1.5">
                            <input type="text" id="subdistrict" {...register("subdistrict")} placeholder="Enter thana/subdistrict" autoCorrect="off"
                                className="peer w-full h-[40px] custom-input-style1"
                            />
                            <label htmlFor="subdistrict" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                                {`Thana/Subdistrict*`}
                            </label>
                            {errors.subdistrict && <EvoFormInputError>{errors.subdistrict.message}</EvoFormInputError>}
                        </div>
                    </div>

                    <div className="flex max-[410px]:flex-col w-full h-fit gap-x-2 gap-y-4">
                        <div className="relative w-full h-fit pt-1.5">
                            <input type="text" id="postcode" {...register("postcode")} placeholder="Enter post code" autoCorrect="off"
                                className="peer w-full h-[40px] custom-input-style1"
                            />
                            <label htmlFor="postcode" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                                {`Post Code`}
                            </label>
                            {errors.postcode && <EvoFormInputError>{errors.postcode.message}</EvoFormInputError>}
                        </div>

                        <div className="relative w-full h-fit pt-1.5">
                            <input type="text" id="country" {...register("country")} placeholder="Enter country" autoCorrect="off" disabled autoComplete="off"
                                className="peer w-full h-[40px] custom-input-style1 disabled:cursor-default"
                            />
                            <label htmlFor="country" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                                {`Country*`}
                            </label>
                            {errors.country && <EvoFormInputError>{errors.country.message}</EvoFormInputError>}
                        </div>
                    </div>

                    <div className="relative w-full h-fit pt-4">
                        <textarea id="notes" {...register("notes")} placeholder="Enter any notes" autoCorrect="off" spellCheck="false"
                            className="peer w-full h-[90px] custom-textarea-style1 resize-none"
                        />
                        <label htmlFor="notes" className="absolute top-0 left-2.5 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 peer-focus:text-[#0866FF] peer-disabled:text-stone-400">
                            {`Notes (optional)`}
                        </label>
                        {errors.notes && <EvoFormInputError>{errors.notes.message}</EvoFormInputError>}
                    </div>

                    <h3 className="flex items-center w-full h-fit mt-5 text-center text-[14px] sm:text-[15px] leading-6 font-[600] text-stone-900">
                        <span className="flex justify-center items-center w-5 h-5 text-[13px] leading-4 mr-1.5 text-[#0866FF] bg-[#0866FF]/15 rounded-full">2</span>{`Shipping Type*`}
                    </h3>

                    <div className="flex flex-col w-full h-fit py-2 gap-2.5 border-t border-stone-300">
                        <div className="flex items-center w-full h-fit py-0.5">
                            <input type="radio" id="regular_delivery" {...register("shippingType")} value="regular_delivery" className="mr-2 accent-stone-800" />
                            <label htmlFor="regular_delivery" className="text-[12px] sm:text-[13px] font-[600] text-stone-700">Regular Delivery</label>
                        </div>

                        <div className="flex items-center w-full h-fit py-0.5">
                            <input type="radio" id="express_delivery" {...register("shippingType")} value="express_delivery" className="mr-2 accent-stone-800" />
                            <label htmlFor="express_delivery" className="text-[12px] sm:text-[13px] font-[600] text-stone-700">Express Delivery</label>
                        </div>

                        <div className="flex items-center w-full h-fit py-0.5">
                            <input type="radio" id="pickup_point" {...register("shippingType")} value="pickup_point" className="mr-2 accent-stone-800" />
                            <label htmlFor="pickup_point" className="text-[12px] sm:text-[13px] font-[600] text-stone-700">Pickup Point</label>
                        </div>

                        {errors.shippingType && <EvoFormInputError>{errors.shippingType.message}</EvoFormInputError>}

                        {/* Pickup Point Selection */}
                        {(watch("shippingType") === "pickup_point") && (
                            <div className="flex flex-col w-full h-fit mt-2 p-2 rounded-[4px] border border-stone-300">
                                <h4 className="text-[11px] sm:text-[12px] font-[600] text-stone-700 mb-2">Select Pickup Point:</h4>

                                <div className="flex items-center w-full h-fit py-1">
                                    <input type="radio" id="pickup_101" {...register("pickupPointId")} value="101" className="mr-2 accent-stone-800" />
                                    <label htmlFor="pickup_101" className="text-[11px] sm:text-[12px] font-[500] text-stone-600">
                                        {`65/15, Shwapnokunzo, Tonartek, Vashantek, Dhaka Cantt., Dhaka-1206`}
                                    </label>
                                </div>

                                {errors.pickupPointId && <EvoFormInputError>{errors.pickupPointId.message}</EvoFormInputError>}
                            </div>
                        )}

                        {(shippingType)
                            ? (<div className="w-full h-fit border-b border-stone-300">
                                <p className="w-full h-fit text-[11px] sm:text-[12px] font-[400] text-[#687069]">
                                    {(shippingType === "pickup_point")
                                        ? "Pickup available during business hours. (10:00 AM - 6:00 PM)"
                                        : ((shippingType === "express_delivery")
                                            ? <span>
                                                {`Your order will be delivered within 06-12 hours `}<br />
                                                {`(only inside Dhaka, delivery charge may vary according to the location).`}
                                            </span>
                                            : "Usually takes 1-2 days inside Dhaka and 2-5 days outside Dhaka."
                                        )
                                    }
                                </p>
                            </div>)
                            : null
                        }
                    </div>

                    <h3 className="flex items-center w-full h-fit mt-5 text-center text-[14px] sm:text-[15px] leading-6 font-[600] text-stone-900">
                        <span className="flex justify-center items-center w-5 h-5 text-[13px] leading-4 mr-1.5 text-[#0866FF] bg-[#0866FF]/15 rounded-full">3</span>{`Payment Method*`}
                    </h3>

                    <div className="flex flex-col w-full h-fit py-2 gap-2.5 border-t border-stone-300">
                        {(shippingType !== "pickup_point" && shippingType !== "express_delivery") &&
                            (
                                <div className="flex items-center w-full h-fit py-0.5">
                                    <input type="radio" id="cod" {...register("paymentMethod")} value="cod" className="mr-2 accent-stone-800" />
                                    <label htmlFor="cod" className="text-[12px] sm:text-[13px] font-[600] text-stone-700">Cash on Delivery</label>
                                </div>
                            )
                        }

                        {(shippingType === "pickup_point") &&
                            (
                                <div className="flex items-center w-full h-fit py-0.5">
                                    <input type="radio" id="cop" {...register("paymentMethod")} value="cop" className="mr-2 accent-stone-800" />
                                    <label htmlFor="cop" className="text-[12px] sm:text-[13px] font-[600] text-stone-700">Cash on Pickup</label>
                                </div>
                            )
                        }

                        <div className="flex items-center w-full h-fit py-0.5">
                            <input type="radio" id="bkash" {...register("paymentMethod")} value="bkash" className="mr-2 accent-stone-800" />
                            <label htmlFor="bkash" className="text-[12px] sm:text-[13px] font-[600] text-stone-700">bKash</label>
                        </div>

                        <div className="flex items-center w-full h-fit py-0.5">
                            <input type="radio" id="bank_transfer" {...register("paymentMethod")} value="bank_transfer" className="mr-2 accent-stone-800" />
                            <label htmlFor="bank_transfer" className="text-[12px] sm:text-[13px] font-[600] text-stone-700">Bank Transfer</label>
                        </div>

                        {errors.paymentMethod && <EvoFormInputError>{errors.paymentMethod.message}</EvoFormInputError>}

                        {/* transaction ID for now */}
                        {(paymentMethod === "bkash" || paymentMethod === "bank_transfer") && (
                            <div className={`flex flex-col w-full h-fit mt-2 p-2 rounded-[4px] border gap-2 ${paymentMethod === "bkash" ? "border-[#E2136E]" : "border-stone-300"}`}>
                                <div className="flex flex-col w-full h-fit py-2 gap-1">
                                    <p className={`text-[11px] sm:text-[12px] font-[600] leading-4 ${paymentMethod === "bkash" ? "text-[#E2136E]" : "text-evoAdminAccent"}`}>
                                        {`Payment Instruction:`}
                                    </p>

                                    {(paymentMethod === "bkash") ?
                                        <div className="text-[11px] sm:text-[12px] font-[500] leading-4 text-stone-600">
                                            <ul className="list-disc list-inside">
                                                <li>{`Open your bKash app and select `}
                                                    <span className="text-evoAdminPrimary font-semibold">{`“Make Payment”.`}</span>
                                                </li>
                                                <li>{`Enter the following number: `}
                                                    <span className="text-evoAdminPrimary font-semibold">{`01799424854`}</span>
                                                </li>
                                                <li>{`Enter the amount- `}
                                                    <span className="text-evoAdminPrimary font-semibold">{`${currencyFormatBDT(totalPayableAmount)} BDT`}</span>
                                                    {` (all charges inclusive)`}
                                                </li>
                                                <li>{`Use your `}
                                                    <span className="text-evoAdminPrimary font-semibold">{`Name`}</span>
                                                    {` as the payment reference.`}</li>
                                                <li>{`After completing the payment, enter your `}
                                                    <span className="text-[#E2136E] font-semibold">{`Transaction ID`}</span>
                                                    {` below.`}</li>
                                                <li>{`Once your order is placed, payment status will be updated in a while.`}</li>
                                                <li>{`Orders will be processed and shipped only after the payment has been successfully received.`}</li>
                                            </ul>
                                        </div>
                                        :
                                        <div className="text-[11px] sm:text-[12px] font-[500] leading-4 text-stone-600">
                                            <ul className="list-disc list-inside">
                                                <li>{`Bank Name: `}
                                                    <span className="text-evoAdminPrimary font-semibold">{`Islami Bank Bangladesh PLC.`}</span>
                                                </li>
                                                <li>{`Branch: `}
                                                    <span className="text-evoAdminPrimary font-semibold">{`Cantonment Branch, Dhaka`}</span>
                                                </li>
                                                <li>{`Name: `}
                                                    <span className="text-evoAdminPrimary font-semibold">{`MD. MAHFUZ HASAN`}</span>
                                                </li>
                                                <li>{`Account No: `}
                                                    <span className="text-evoAdminPrimary font-semibold">{`20502036700154115`}</span>
                                                </li>
                                                <li>{`Routing No: `}
                                                    <span className="text-evoAdminPrimary font-semibold">{`125260738`}</span>
                                                </li>
                                                <li>{`Payable amount- `}
                                                    <span className="text-evoAdminPrimary font-semibold">{`${currencyFormatBDT(totalPayableAmount)} BDT`}</span>
                                                </li>
                                                <li>{`After completing the payment, enter your `}
                                                    <span className="text-evoAdminAccent font-semibold">{`Transaction ID`}</span>
                                                    {` below.`}</li>
                                                <li>{`Once your order is placed, payment status will be updated in a while.`}</li>
                                                <li>{`Orders will be processed and shipped only after the payment has been successfully received.`}</li>
                                            </ul>
                                        </div>
                                    }
                                </div>

                                <div className="relative w-full h-fit pt-1.5">
                                    <input type="text" id="tranId" {...register("transactionId")} placeholder="Enter TrxID" autoCorrect="off" spellCheck="false"
                                        className="peer w-full h-[40px] custom-input-style1"
                                    />
                                    <label htmlFor="tranId" className="custom-floating-label1 text-[11px] sm:text-[12px] font-[600] leading-3 text-stone-500 before:border-stone-400 peer-focus:before:border-[#0866FF] after:border-stone-400 peer-focus:after:border-[#0866FF] peer-focus:text-[#0866FF] peer-disabled:before:border-stone-300 peer-disabled:after:border-stone-300">
                                        {`Transaction ID`}
                                    </label>
                                    {errors.transactionId && <EvoFormInputError>{errors.transactionId.message}</EvoFormInputError>}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col w-full h-fit py-0.5 mt-1">
                        <div className="flex items-center w-full h-fit">
                            <input type="checkbox" id="terms" {...register("terms")} className="mr-2 accent-stone-800" />
                            <label htmlFor="terms" className="text-[12px] sm:text-[13px] leading-5 font-[500] text-stone-700">
                                {`I accept the `}<Link href="/about/terms-and-conditions" className="text-[#0866FF] hover:underline">{`terms and conditions`}</Link>{`*`}
                            </label>
                        </div>
                        {errors.terms && <EvoFormInputError>{errors.terms.message}</EvoFormInputError>}
                    </div>
                </form>


                <div className="md:sticky md:top-24 flex flex-col w-full md:max-w-[280px] min-[900px]:max-w-[350px] lg:max-w-[400px] min-[1250px]:max-w-[450px] h-fit gap-2 px-5 lg:px-8 py-1 text-stone-700 md:border-l-2 md:border-stone-300">

                    <div className="flex flex-col w-full h-[220px] py-3 border-y-2 max-md:border-t-stone-300 border-t-transparent border-b-stone-300 overflow-y-auto scrollbar-custom">
                        {
                            cartItems.map((eachCartItem: any, index: number) => (
                                <div key={`cartitem${index}`} className="flex w-full h-fit py-2 border-t border-[#dddbda] gap-1">
                                    <div className="flex w-fit h-fit py-1">
                                        <div className="relative w-[45px] sm:w-[50px] aspect-square flex-none border border-stone-300 rounded-[3px] overflow-hidden focus:outline-none bg-[#ffffff]" aria-label={`${eachCartItem.item_name}`}>
                                            <Image
                                                src={eachCartItem.item_imgurl}
                                                alt={`item image`}
                                                fill
                                                quality={100}
                                                draggable="false"
                                                sizes="100%"
                                                className="object-cover object-center"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full h-fit px-2 py-1 gap-1 text-left font-inter font-[500] text-[12px] sm:text-[13px] leading-5 tracking-tight text-stone-500 break-words">
                                        <Link href={`/items/${eachCartItem.item_slug}`} className="w-full h-fit hover:text-[#0866FF]">{eachCartItem.item_name}</Link>
                                        {eachCartItem.item_color && <p className="w-full h-fit text-stone-900 text-[12px]">{`Color: ${eachCartItem.item_color}`}</p>}
                                        <p className="flex justify-between w-full h-fit text-[12px] leading-4 font-[600]">
                                            <span className="w-fit h-fit text-stone-500 tracking-tight whitespace-nowrap mr-1">{`${currencyFormatBDT(eachCartItem.item_price)} x ${eachCartItem.item_quantity} =`}</span>
                                            <span className="w-fit h-fit text-right text-stone-900 tracking-tight">{`${currencyFormatBDT(eachCartItem.item_price * eachCartItem.item_quantity)} BDT`}</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div className="flex flex-col w-full h-fit py-1 gap-1">
                        <h3 className="w-full text-[12px] lg:text-[13px] leading-5 tracking-tight font-[600] text-stone-700">{`Have a coupon?`}</h3>
                        <div className="flex items-center w-full h-fit gap-1">
                            <input id="coupon" type="text" placeholder="paste it here" className="w-full h-[32px] px-2 bg-transparent text-[12px] leading-4 font-[500] text-stone-800 rounded-[4px] border border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-600 placeholder:text-stone-400 transition-colors duration-200 ease-linear" />
                            <button type="button"
                                aria-label="apply coupon code"
                                onClick={handleCouponApply}
                                className="flex items-center w-fit h-[32px] px-4 text-[12px] leading-4 font-[600] text-stone-50 bg-stone-800 rounded-[4px] border border-stone-400"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col w-full h-fit gap-1 py-2 border-t border-stone-300">
                        <div className="flex justify-between items-center w-full h-fit gap-1">
                            <h3 className="w-fit h-fit text-[13px] font-[600] text-stone-600 tracking-tight mr-1">{`Subtotal:`}</h3>
                            <div className="w-fit h-fit text-[12px] font-[600] text-stone-600 tracking-tight">
                                {`${currencyFormatBDT(cartSubTotal)} BDT`}
                            </div>
                        </div>

                        <div className="flex justify-between items-center w-full h-fit gap-1">
                            <h3 className="w-fit h-fit text-[13px] font-[600] text-stone-600 tracking-tight mr-1">{`Discount:`}</h3>
                            <div className="w-fit h-fit text-[12px] font-[600] text-stone-600 tracking-tight">
                                {`${currencyFormatBDT(discountAmount)} BDT`}
                            </div>
                        </div>

                        {(shippingType === "regular_delivery" || shippingType === "pickup_point") &&
                            (<div className="flex justify-between items-center w-full h-fit gap-1">
                                <h3 className="w-fit h-fit text-[13px] font-[600] text-stone-600 tracking-tight">{`Delivery:`}</h3>
                                <div className="w-fit h-fit text-[12px] font-[600] text-stone-600 tracking-tight">
                                    {deliveryCharge === null ?
                                        <span className="text-evoAdminAccent">{"Select a city"}</span>
                                        : `${currencyFormatBDT(deliveryCharge)} BDT`}
                                </div>
                            </div>)
                        }

                        <div className="flex justify-between items-center w-full h-fit gap-1">
                            <h3 className="w-fit h-fit text-[13px] font-[600] text-stone-600 tracking-tight">{`Additional Charge:`}</h3>
                            <div className="w-fit h-fit text-[12px] font-[600] text-stone-600 tracking-tight">
                                {`${currencyFormatBDT(bKashCharge)} BDT`}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center w-full h-fit gap-1 py-px border-t border-stone-300">
                        <h3 className="w-fit h-fit text-[13px] sm:text-[14px] leading-5 font-[600] text-stone-800 tracking-tight">{`Total Payable:`}</h3>
                        <p className="w-fit h-fit text-[13px] sm:text-[14px] leading-5 font-[600] text-stone-800 tracking-tight">
                            {`${currencyFormatBDT(totalPayableAmount)} BDT`}
                        </p>
                    </div>

                    <div className="flex flex-col w-full h-fit gap-2 mt-5">
                        <button type="submit"
                            form="checkoutform"
                            disabled={isSubmitting}
                            aria-label="proceed to payment"
                            className={`relative flex justify-center w-[175px] h-fit bg-stone-800 text-[12px] sm:text-[13px] leading-5 font-[500] text-white py-2 rounded-[6px] overflow-hidden focus:outline-none hover:bg-stone-900 transition-colors duration-100 ease-linear`}
                        >
                            Place Order
                            {isSubmitting && (
                                <div className="absolute inset-0 flex items-center justify-center bg-stone-700/70">
                                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CheckoutParts;
