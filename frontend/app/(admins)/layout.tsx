import type { Metadata } from "next";
import { AppSidebar } from "@/components/scn/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { AdminTopBar } from "@/components/admin/admin-top-bar";
import { auth } from "@/auth";
import { PendingOrdersProvider } from "@/contexts/PendingOrdersContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";

export const metadata: Metadata = {
    title: {
        template: "%s | Evo-TechBD - Admin",
        default: "Evo-TechBD - Admin",
    },
    description: "Evo-TechBD Admin Control Panel",
};


const AdminLayout = async ({ children }: { children: React.ReactNode; }) => {

    const session = await auth();
    const userRole = session?.user?.role?.toUpperCase();
    
    // Both ADMIN and EMPLOYEE can access /control routes
    // Employees see filtered sidebar based on their permissions
    const isStaffMode = userRole === 'EMPLOYEE';

    return (
        <PendingOrdersProvider>
            <PermissionsProvider>
                <SidebarProvider>
                    <AppSidebar variant="inset" userSession={session?.user} isStaffMode={isStaffMode} />
                    <SidebarInset>
                        <AdminTopBar />
                        <div className="min-h-[calc(100vh-64px)] w-full">
                            {children}
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </PermissionsProvider>
        </PendingOrdersProvider>
    );
}

export default AdminLayout;
