import { NextResponse, NextRequest } from 'next/server';
import axiosIntercept from "@/utils/axios/axiosIntercept";
import { isAxiosError } from 'axios';
import axiosErrorLogger from '@/components/error/axios_error';

export async function GET(request: NextRequest) {
    const axioswithIntercept = await axiosIntercept();

    try {
        const { searchParams } = new URL(request.url);

        // Extract query parameters
        const search = searchParams.get('search');
        const order_status = searchParams.get('order_status');
        const payment_status = searchParams.get('payment_status');
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');

        // Build query string for Laravel backend
        const backendParams = new URLSearchParams();

        if (search) {
            backendParams.set('search', search);
        }

        if (order_status) {
            backendParams.set('order_status', order_status);
        }

        if (payment_status) {
            backendParams.set('payment_status', payment_status);
        }

        if (page) {
            backendParams.set('page', page);
        }

        if (limit) {
            backendParams.set('limit', limit);
        }

        const backendQueryString = backendParams.toString();

        // Backend API call for getting all orders
        const backendRes = await axioswithIntercept.get(
            `/api/admin/order/allorders${backendQueryString ? `?${backendQueryString}` : ""}`,
            {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            }
        );

        const data = backendRes.data;
        return NextResponse.json(data, { status: backendRes.status });

    } catch (error: any) {
        axiosErrorLogger({ error });
        if (isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status ?? 500 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
