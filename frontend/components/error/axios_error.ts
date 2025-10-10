
interface AnyAxiosError {
    response?: {
        status: number;
        statusText: string;
        data: any;
    };
    message?: string;
    code: string;
}


const getSafeErrorDetails = (error: AnyAxiosError) => ({
    message: error.message || error.code || 'No Message',
    status: error.response?.status || 'Unknown Status',
    statusText: error.response?.statusText || 'No Status Text',
    data: error.response?.data || 'No additional data available, check for network/server issues',
});

const axiosErrorLogger = ({ error }: { error: any; }) => {

    console.error('Error Occurred:', getSafeErrorDetails(error));

}

export default axiosErrorLogger;
