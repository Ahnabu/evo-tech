import LoginFormAdmin from "@/components/auth/login-form-admin";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Admin | Sign-in",
};


const AdminLoginPage = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-fit font-inter">
            <p className="w-fit h-fit text-stone-700 text-[12px] sm:text-[13px] leading-6 font-[600] mb-3">{`Got something to do with your site?`}</p>
            <LoginFormAdmin />
        </div>
    );
}

export default AdminLoginPage;
