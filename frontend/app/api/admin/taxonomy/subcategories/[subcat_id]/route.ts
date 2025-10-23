import { NextResponse, NextRequest } from 'next/server';
import axiosIntercept from "@/utils/axios/axiosIntercept";
import { isAxiosError } from 'axios';
import axiosErrorLogger from '@/components/error/axios_error';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ subcat_id: string }> }
) {
    const axioswithIntercept = await axiosIntercept();

    try {
        // backend API call for getting subcategory details
        const backendRes = await axioswithIntercept.get(`/api/admin/subcategory/view/${params.subcat_id}`);

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

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ subcat_id: string }> }
) {
    const axioswithIntercept = await axiosIntercept();

    try {
        const reqBody = await request.json();
        
        // backend API call for updating subcategory
        const backendRes = await axioswithIntercept.put(`/api/admin/subcategory/update/${params.subcat_id}`, reqBody);

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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ subcat_id: string }> }
) {
    const axioswithIntercept = await axiosIntercept();

    try {
        // backend API call for deleting subcategory
        const backendRes = await axioswithIntercept.delete(`/api/admin/subcategory/delete/${params.subcat_id}`);

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
