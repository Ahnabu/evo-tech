import axios from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";
import { currentRouteProps } from "@/utils/types_interfaces/shared_types";
import { currencyFormatBDT } from "@/lib/all_utils";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Order Info",
};

const pickupPoints: { [key: string]: string } = {
    '101': '65/15, Shwapnokunzo, Tonartek, Vashantek, Dhaka Cantt., Dhaka-1206',
};

const shippingTypes: { [key: string]: string } = {
    'regular_delivery': 'Regular Delivery',
    'express_delivery': 'Express Delivery',
    'pickup_point': 'Pickup Point',
};

const paymentMethods: { [key: string]: string } = {
    'cop': 'Cash on Pickup',
    'cod': 'Cash on Delivery',
    'bkash': 'bKash',
    'bank_transfer': 'Bank Transfer',
};



const OrderConfirmationPage = async ({ params, searchParams }: { params: Promise<{ orderid: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {

    const { orderid } = await params;
    const resolvedSearchParams = await searchParams;
    const ordkey = resolvedSearchParams.ordkey ? (resolvedSearchParams.ordkey as string) : null;

    const getOrderDetails = await axios.get(`/api/order/${orderid}${ordkey ? `?orderkey=${ordkey}` : ''}`)
        .then((res) => (res.data))
        .catch((error: any) => {
            axiosErrorLogger({ error });

            if (error.response?.status === 404) {
                return {
                    errstatus: 404,
                    errmessage: 'Order not found',
                };
            } else if (error.response?.status === 401) {
                return {
                    errstatus: 401,
                    errmessage: 'You are not authorized to view the information',
                };
            } else {
                return null;
            }
        });

    const getOrderStatusText = (status: string) => {
        switch (status) {
            case "placed":
                return <span className="text-emerald-600">{"Your order has been placed. Sit back and wait for confirmation!"}</span>;
            case "confirmed":
                return <span className="text-emerald-600">{"Your order has been confirmed and is being processed."}</span>;
            case "picked_up":
                return <span className="text-emerald-600">{"Your order has been picked up, will be delivered soon."}</span>;
            case "on_the_way":
                return <span className="text-emerald-600">{"Your order is on its way to you. Be patient."}</span>;
            case "delivered":
                return <span className="text-emerald-600">{"Your order has been delivered. Thank you for your purchase!"}</span>;
            case "cancelled":
                return <span className="text-rose-500">{"Oh! Your order has been cancelled. Please contact us if you have any questions."}</span>;
            default:
                return <span className="text-amber-600">{"Current status of your order is unknown. Please contact us if you have any questions."}</span>;
        }
    };

    const getPaymentStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return <span className="text-rose-500">{"Pending"}</span>;
            case "paid":
                return <span>{"Paid"}</span>;
            case "refunded":
                return <span>{"Refunded"}</span>;
            case "partial":
                return <span className="text-amber-600">{"Partially Paid"}</span>;
            default:
                return <span className="text-rose-500">{"Unknown"}</span>;
        }
    };

    if (getOrderDetails === null) {
        return (
            <>
                <div className="w-full min-h-[60px] sm:min-h-[68px] bg-gradient-to-br from-stone-950 via-stone-600 via-60% to-stone-900 translate-y-[-60px] sm:translate-y-[-68px] mb-[-60px] sm:mb-[-68px]">
                </div>

                <div className="w-full max-w-[1440px] h-fit pb-12 flex flex-col items-center font-inter">
                    <div className="flex flex-col w-full h-fit px-4 sm:px-8 md:px-12 pt-3 pb-8 sm:pb-12">
                        <div className="flex justify-center items-center w-full h-[300px] text-[12px] sm:text-[13px] leading-5 font-[500] text-stone-700">
                            Order Not Found
                        </div>
                    </div>
                </div>
            </>

        );
    }

    if (getOrderDetails.errstatus && (getOrderDetails.errstatus === 404 || getOrderDetails.errstatus === 401)) {
        return (
            <>
                <div className="w-full min-h-[60px] sm:min-h-[68px] bg-gradient-to-br from-stone-950 via-stone-600 via-60% to-stone-900 translate-y-[-60px] sm:translate-y-[-68px] mb-[-60px] sm:mb-[-68px]">
                </div>

                <div className="w-full max-w-[1440px] h-fit pb-12 flex flex-col items-center font-inter">
                    <div className="flex flex-col w-full h-fit px-4 sm:px-8 md:px-12 pt-3 pb-8 sm:pb-12">
                        <div className="flex justify-center items-center w-full h-[300px] text-[12px] sm:text-[13px] leading-5 font-[500] text-stone-800">
                            {getOrderDetails.errmessage}
                        </div>
                    </div>
                </div>
            </>

        );
    }


    return (
        <>
            <div className="w-full min-h-[60px] sm:min-h-[68px] bg-gradient-to-br from-stone-950 via-stone-600 via-60% to-stone-900 translate-y-[-60px] sm:translate-y-[-68px] mb-[-60px] sm:mb-[-68px]">
            </div>

            <div className="w-full max-w-[1440px] h-fit pb-12 flex flex-col items-center font-inter">
                <div className="flex flex-col w-full h-fit px-4 sm:px-8 md:px-12 pt-3 pb-8 sm:pb-12 gap-4">
                    <div className="flex flex-col lg:flex-row w-full h-fit gap-3">
                        <div className="flex flex-col w-full h-fit px-4 py-6 gap-1 text-[12px] sm:text-[13px] leading-5 font-[500] text-stone-500 bg-stone-100 rounded-md">
                            {/* Order Related Info */}
                            <p className="w-full h-fit mb-4 font-medium">
                                {getOrderStatusText(getOrderDetails.orderdata.order_status)}
                            </p>

                            <p className="w-full h-fit">
                                <span className="text-evoAdminPrimary font-semibold">{`Order ID: `}</span>
                                <span className="text-evoAdminAccent font-semibold">{`${getOrderDetails.orderdata.orderid}`}</span>
                                {` (you can use this ID to track your order later)`}
                            </p>
                            <p className="w-full h-fit">
                                <span className="text-evoAdminPrimary font-semibold">{`Order Date: `}</span>
                                {`${getOrderDetails.orderdata.order_date}`}
                            </p>
                            <p className="w-full h-fit">
                                <span className="text-evoAdminPrimary font-semibold">{`Shipping Type: `}</span>
                                {`${shippingTypes[getOrderDetails.orderdata.shipping_type]}`}
                            </p>
                            <p className="w-full h-fit">
                                <span className="text-evoAdminPrimary font-semibold">{`Payment Method: `}</span>
                                {`${paymentMethods[getOrderDetails.orderdata.payment_method]}`}
                            </p>
                            <p className="w-full h-fit">
                                <span className="text-evoAdminPrimary font-semibold">{`Payment Status: `}</span>
                                {getPaymentStatusText(getOrderDetails.orderdata.payment_status)}
                            </p>
                            <p className="w-full h-fit">
                                <span className="text-evoAdminPrimary font-semibold">{`Total: `}</span>
                                {`${currencyFormatBDT(getOrderDetails.orderdata.total_payable)} BDT`}
                            </p>

                            {getOrderDetails.orderdata.pickup_point_id && <p className="w-full h-fit">
                                <span className="text-evoAdminPrimary font-semibold">{`Pickup Point: `}</span>
                                {`${pickupPoints[getOrderDetails.orderdata.pickup_point_id.toString()]}`}
                            </p>}

                            {getOrderDetails.orderdata.notes && <div className="w-full h-fit flex flex-col gap-1 mt-2">
                                <span className="text-evoAdminPrimary font-semibold">{`Notes:`}</span>
                                <p className="text-stone-600 text-xs">{`${getOrderDetails.orderdata.notes}`}</p>
                            </div>}

                            {/* Customer Info */}
                            <Card className="my-4 bg-stone-50">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base text-stone-800 underline underline-offset-2">Customer Info</CardTitle>
                                </CardHeader>
                                <CardContent className="max-sm:text-xs text-stone-500">
                                    <p className="w-full h-fit">
                                        <span className="text-evoAdminPrimary font-semibold">{`Name: `}</span>
                                        {`${getOrderDetails.orderdata.firstname}${getOrderDetails.orderdata.lastname ? ` ${getOrderDetails.orderdata.lastname}` : ''}`}
                                    </p>
                                    {getOrderDetails.orderdata.email && <p className="w-full h-fit">
                                        <span className="text-evoAdminPrimary font-semibold">{`Email: `}</span>
                                        {`${getOrderDetails.orderdata.email}`}
                                    </p>}
                                    <p className="w-full h-fit">
                                        <span className="text-evoAdminPrimary font-semibold">{`Phone: `}</span>
                                        {`${getOrderDetails.orderdata.phone}`}
                                    </p>
                                    <p className="w-full h-fit">
                                        <span className="text-evoAdminPrimary font-semibold">{`House & Street: `}</span>
                                        {`${getOrderDetails.orderdata.housestreet}`}
                                    </p>
                                    <p className="w-full h-fit">
                                        <span className="text-evoAdminPrimary font-semibold">{`District: `}</span>
                                        {`${getOrderDetails.orderdata.city}`}
                                    </p>
                                    <p className="w-full h-fit">
                                        <span className="text-evoAdminPrimary font-semibold">{`Thana: `}</span>
                                        {`${getOrderDetails.orderdata.subdistrict}`}
                                    </p>
                                    {getOrderDetails.orderdata.postcode && <p className="w-full h-fit">
                                        <span className="text-evoAdminPrimary font-semibold">{`Postcode: `}</span>
                                        {`${getOrderDetails.orderdata.postcode}`}
                                    </p>}
                                    <p className="w-full h-fit">
                                        <span className="text-evoAdminPrimary font-semibold">{`Country: `}</span>
                                        {`${getOrderDetails.orderdata.country}`}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex flex-col w-full h-fit px-4 py-3 gap-2 text-[12px] sm:text-[13px] leading-5 font-[500] text-stone-600">
                            <h3 className="flex items-center w-full h-fit text-center text-[14px] sm:text-[15px] leading-6 font-[600] text-stone-800">
                                {`Ordered Item(s)`}
                            </h3>


                            {(getOrderDetails.orderdata.order_items && getOrderDetails.orderdata.order_items.length > 0) &&
                                <div className="flex flex-col w-full h-fit max-h-[300px] py-3 border-y-2 border-t-transparent border-b-stone-300 overflow-y-auto scrollbar-custom">
                                    {getOrderDetails.orderdata.order_items.map((eachItem: any, index: number) =>
                                    (<div key={`ordered_item${index}`} className="flex w-full h-fit py-2 border-t border-[#dddbda] gap-1">
                                        <div className="flex flex-col w-full h-fit py-1 gap-1 text-left font-inter font-[500] text-[12px] sm:text-[13px] leading-5 tracking-tight text-stone-500 break-words">
                                            <p className="w-full h-fit">{`${eachItem.item_name}`}</p>
                                            {eachItem.item_color && <p className="w-full h-fit text-stone-900 text-[12px]">{`Color: ${eachItem.item_color}`}</p>}
                                            <p className="flex justify-between w-full h-fit text-[12px] leading-4 font-[600]">
                                                <span className="w-fit h-fit text-stone-500 tracking-tight whitespace-nowrap mr-1">{`${currencyFormatBDT(eachItem.item_price)} x ${eachItem.item_quantity} =`}</span>
                                                <span className="w-fit h-fit text-right text-stone-600 tracking-tight">{`${currencyFormatBDT(eachItem.item_price * eachItem.item_quantity)} BDT`}</span>
                                            </p>
                                        </div>
                                    </div>))
                                    }
                                </div>
                            }

                            <div className="flex flex-col w-full h-fit gap-1 py-2 border-t border-stone-300">
                                <div className="flex justify-between items-center w-full h-fit gap-1">
                                    <h3 className="w-fit h-fit text-[12px] font-[600] text-stone-600 tracking-tight mr-1">{`Subtotal:`}</h3>
                                    <div className="w-fit h-fit text-[12px] font-[600] text-stone-600 tracking-tight">
                                        {`${currencyFormatBDT(getOrderDetails.orderdata.subtotal)} BDT`}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center w-full h-fit gap-1">
                                    <h3 className="w-fit h-fit text-[12px] font-[600] text-stone-600 tracking-tight mr-1">{`Discount:`}</h3>
                                    <div className="w-fit h-fit text-[12px] font-[600] text-stone-600 tracking-tight">
                                        {`${currencyFormatBDT(getOrderDetails.orderdata.discount)} BDT`}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center w-full h-fit gap-1">
                                    <h3 className="w-fit h-fit text-[12px] font-[600] text-stone-600 tracking-tight mr-1">{`Delivery:`}</h3>
                                    <div className="w-fit h-fit text-[12px] font-[600] text-stone-600 tracking-tight">
                                        {`${currencyFormatBDT(getOrderDetails.orderdata.delivery_charge)} BDT`}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center w-full h-fit gap-1">
                                    <h3 className="w-fit h-fit text-[12px] font-[600] text-stone-600 tracking-tight mr-1">{`Additional:`}</h3>
                                    <div className="w-fit h-fit text-[12px] font-[600] text-stone-600 tracking-tight">
                                        {`${currencyFormatBDT(getOrderDetails.orderdata.additional_charge)} BDT`}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center w-full h-fit gap-1 py-0.5 border-t border-stone-300">
                                <h3 className="w-fit h-fit text-[13px] sm:text-[14px] leading-5 font-[600] text-stone-800 tracking-tight">{`Total:`}</h3>
                                <p className="w-fit h-fit text-[13px] sm:text-[14px] leading-5 font-[600] text-stone-800 tracking-tight">
                                    {`${currencyFormatBDT(getOrderDetails.orderdata.total_payable)} BDT`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full h-fit px-4 py-4 mt-4 gap-2 text-[12px] sm:text-[13px] leading-5 font-[500] text-stone-600 bg-stone-100 rounded-md">
                        <p className="w-full h-fit text-center">
                            {`Thanks for being with `}
                            <span className="text-stone-800 font-bold">{`Evo-Tech Bangladesh`}</span>
                        </p>
                        <Link href="/products-and-accessories/all" className="w-fit h-fit text-center font-medium underline underline-offset-2 hover:text-evoAdminAccent transition-colors duration-200">
                            {`Continue Shopping?`}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderConfirmationPage;
