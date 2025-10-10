import type { Metadata } from "next";
import { AppSidebar } from "@/components/scn/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AdminTopBar } from "@/components/admin/admin-top-bar";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: {
        template: "%s | Evo-TechBD - Admin",
        default: "Evo-TechBD - Admin",
    },
    description: "Evo-TechBD Admin Control Panel",
};


const AdminLayout = async ({ children }: { children: React.ReactNode; }) => {

    const session = await auth();

    return (
        <SidebarProvider>
            <AppSidebar variant="inset" userSession={session?.user} />
            <SidebarInset>
                <AdminTopBar />
                <div className="min-h-[calc(100vh-64px)] w-full">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default AdminLayout;
