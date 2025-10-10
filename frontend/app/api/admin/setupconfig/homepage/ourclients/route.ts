import { NextResponse, NextRequest } from 'next/server';
import axiosIntercept from "@/utils/axios/axiosIntercept";
import { isAxiosError } from 'axios';
import axiosErrorLogger from '@/components/error/axios_error';


export async function GET() {
    const axioswithIntercept = await axiosIntercept();

    try {
        const backendRes = await axioswithIntercept.get(`/api/admin/lp/ourclients`);

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


export async function POST(request: NextRequest) {
    const axioswithIntercept = await axiosIntercept();

    try {
        const formData = await request.formData();

        const backendRes = await axioswithIntercept.post(`/api/admin/lp/ourclients/add`,
            formData,
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
