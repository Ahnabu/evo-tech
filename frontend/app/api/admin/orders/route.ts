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

        console.log('📦 GET /api/admin/orders - Query params:', {
            search, order_status, payment_status, page, limit
        });

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

        console.log('📤 Calling backend: /orders' + (backendQueryString ? `?${backendQueryString}` : ''));

        // Backend API call for getting all orders
        const backendRes = await axioswithIntercept.get(
            `/orders${backendQueryString ? `?${backendQueryString}` : ""}`,
            {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            }
        );

        const data = backendRes.data;
        
        console.log('✅ Backend response:', {
            success: data.success,
            dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
            dataCount: Array.isArray(data.data) ? data.data.length : 'N/A',
            hasResult: !!data.data?.result,
            resultCount: data.data?.result?.length || 'N/A',
            hasMeta: !!data.meta,
            status: backendRes.status,
            dataKeys: data.data ? Object.keys(data.data) : 'null',
            metaKeys: data.meta ? Object.keys(data.meta) : 'null'
        });

        // Transform to match frontend expectations
        // Backend returns: { success: true, data: { result: [...], meta: {...} }, meta: {...} }
        // Frontend expects: { success: true, data: [...], meta: {...} }
        const transformedData = {
            success: data.success,
            data: data.data?.result || data.data,
            meta: data.meta || data.data?.meta,
            message: data.message
        };

        console.log('🔄 Transformed data:', {
            dataCount: Array.isArray(transformedData.data) ? transformedData.data.length : 'N/A',
            hasMeta: !!transformedData.meta
        });

        return NextResponse.json(transformedData, { status: backendRes.status });

    } catch (error: any) {
        console.error('❌ Error in /api/admin/orders:', error.response?.data || error.message);
        axiosErrorLogger({ error });
        if (isAxiosError(error) && error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status ?? 500 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
