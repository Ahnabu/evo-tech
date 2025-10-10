import { NextResponse, NextRequest } from 'next/server';
import axiosIntercept from "@/utils/axios/axiosIntercept";
import { isAxiosError } from 'axios';
import axiosErrorLogger from '@/components/error/axios_error';


export async function POST(
    request: NextRequest,
    { params }: { params: { itemid: string } }
) {
    const axioswithIntercept = await axiosIntercept();
    const { itemid } = params;

    try {
        const formdata = await request.formData();

        const backendRes = await axioswithIntercept.post(`/api/admin/item/${itemid}/specs/add`,
            formdata,
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
