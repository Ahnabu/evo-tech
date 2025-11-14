import { TOrder, TOrderItem } from "./order.interface";
export declare const normalizeOrderObject: (orderDoc: any) => any;
export declare const OrderServices: {
    placeOrderIntoDB: (payload: TOrder & {
        items: any[];
    }, userUuid: string) => Promise<{
        order: any;
        items: (import("mongoose").Document<unknown, {}, TOrderItem, {}, {}> & TOrderItem & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
    }>;
    placeGuestOrderIntoDB: (payload: TOrder & {
        items: any[];
    }) => Promise<{
        order: any;
        items: (import("mongoose").Document<unknown, {}, TOrderItem, {}, {}> & TOrderItem & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
    }>;
    linkGuestOrdersToUserIntoDB: (email: string, userUuid: string) => Promise<{
        linked: number;
        orders: string[];
    }>;
    getUserOrdersFromDB: (userUuid: string, query: Record<string, unknown>) => Promise<{
        result: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAllOrdersFromDB: (query: Record<string, unknown>) => Promise<{
        result: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getSingleOrderFromDB: (orderId: string, userUuid?: string) => Promise<{
        order: any;
        items: (import("mongoose").Document<unknown, {}, TOrderItem, {}, {}> & TOrderItem & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
    }>;
    updateOrderStatusIntoDB: (orderId: string, payload: Partial<TOrder>) => Promise<(import("mongoose").Document<unknown, {}, TOrder, {}, {}> & TOrder & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    deleteOrderFromDB: (orderId: string) => Promise<(import("mongoose").Document<unknown, {}, TOrder, {}, {}> & TOrder & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=order.service.d.ts.map