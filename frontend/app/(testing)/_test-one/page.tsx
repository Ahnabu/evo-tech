import { auth } from "@/auth";
import { TbLogout } from "react-icons/tb";
import { logout } from "@/actions/logout";
import axiosIntercept from "@/utils/axios/axiosIntercept";
import axiosErrorLogger from "@/components/error/axios_error";


const TestOnePage = async () => {
    const currentSession = await auth();
    const axioswithIntercept = await axiosIntercept();

    const dashboardApiRes = await axioswithIntercept.get(`/api/admin/lp/sections`)
        .then((res) => res.data)
        .catch((error: any) => {
            axiosErrorLogger({ error });
            return null;
        });

    return (
        <div className="w-full px-4 min-h-screen flex flex-col items-center justify-center font-inter text-[13px] sm:text-[14px] leading-6 font-[600] text-stone-700">
            Development is ongoing, will be available soon.
            <br />
            {`session: ${JSON.stringify(currentSession)}`}
            <br />
            <p className="flex flex-col items-center w-full max-w-[400px] my-8 break-words text-wrap">
                {`api Response: ${JSON.stringify(dashboardApiRes)}`}
                {/* {`api Response: ${dashboardApiRes.authCookie}`} */}
            </p>
            <form action={logout} className="w-full max-w-[140px] h-fit bg-stone-300">
                <button type="submit" className="w-full h-fit px-4 py-[10px] flex items-center bg-[#ffffff] bg-opacity-0 hover:bg-opacity-100 font-[600] text-[12px] leading-4 tracking-tight transition duration-150">
                    <span className="flex items-center w-fit"><TbLogout className="inline mr-2 w-[14px] h-[14px]" />Logout</span>
                </button>
            </form>
        </div>
    );
}

export default TestOnePage;
