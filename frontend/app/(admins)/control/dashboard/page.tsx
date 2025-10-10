import { auth } from "@/auth";
import axios from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";


const A_DashBoardPage = async () => {

    // const dashboardApiRes = await axios.get(`/api/admin/lp/sections`)
    //     .then((res) => res.data)
    //     .catch((error: any) => {
    //         axiosErrorLogger({ error });
    //         return null;
    //     });

    const currentSession = await auth();

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center font-inter text-[13px] sm:text-[14px] leading-6 font-[600] text-stone-700">
            Development is ongoing, will be available soon.
            <br />
            Dashboard contents...
            <br />
        </div>
    );
}

export default A_DashBoardPage;
