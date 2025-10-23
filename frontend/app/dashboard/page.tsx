import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

// Admin dashboard components
import { AdminDashboardStats } from "@/components/admin/dashboard/admin-dashboard-stats";
import { AdminRecentOrders } from "@/components/admin/dashboard/admin-recent-orders";
import { AdminSalesChart } from "@/components/admin/dashboard/admin-sales-chart";
import { AdminTopProducts } from "@/components/admin/dashboard/admin-top-products";
import { AdminQuickActions } from "@/components/admin/dashboard/admin-quick-actions";

// User dashboard components
import { useUserDashboard, useUserProfile } from '@/hooks/use-user-dashboard';
import { useCurrentUser } from '@/hooks/use-current-user';
import { currencyFormatBDT } from '@/lib/all_utils';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Dashboard",
    description: "User dashboard overview",
};

// Admin Dashboard Component
const AdminDashboardContent = async ({ session }: { session: any }) => {
    return (
        <div className="p-6 space-y-6">
            {/* Welcome Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-stone-900">
                    Welcome back, {session?.user?.firstName || 'Admin'}!
                </h1>
                <p className="text-stone-600 mt-1">
                    Here&apos;s what&apos;s happening with your store today.
                </p>
            </div>

            {/* Stats Cards */}
            <AdminDashboardStats />

            {/* Charts and Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2">
                    <AdminSalesChart />
                </div>
                
                {/* Recent Orders */}
                <AdminRecentOrders />
                
                {/* Top Products */}
                <AdminTopProducts />
            </div>

            {/* Quick Actions */}
            <AdminQuickActions />
        </div>
    );
};

// User Dashboard Component (Server Component version)
const UserDashboardContent = ({ session }: { session: any }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {session?.user?.firstName || 'User'}!
                    </h1>
                    <p className="text-gray-600">
                        Manage your orders, profile, and preferences from your dashboard.
                    </p>
                </div>

                {/* Note: This is a simplified version - the full user dashboard with hooks needs to be client-side */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <p className="text-gray-600">Loading your personalized dashboard...</p>
                    <p className="text-sm text-gray-500 mt-2">
                        For the full interactive dashboard, please visit{' '}
                        <Link href="/profile" className="text-blue-600 hover:underline">
                            your profile page
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const DashboardPage = async () => {
    const session = await auth();
    
    if (!session?.user) {
        redirect('/login');
    }

    const userRole = session.user.role;

    if (userRole === 'ADMIN') {
        return <AdminDashboardContent session={session} />;
    } else if (userRole === 'EMPLOYEE') {
        // Employees get redirected to their specific dashboard
        redirect('/employee/dashboard');
    } else {
        // For regular users, redirect to the user dashboard in the (users) route group
        redirect('/user-dashboard');
    }
}

export default DashboardPage;