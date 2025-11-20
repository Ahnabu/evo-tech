import { auth } from "@/auth";
import { AdminDashboardStats } from "@/components/admin/dashboard/admin-dashboard-stats";
import { AdminRecentOrders } from "@/components/admin/dashboard/admin-recent-orders";
import { AdminSalesChart } from "@/components/admin/dashboard/admin-sales-chart";
import { AdminTopProducts } from "@/components/admin/dashboard/admin-top-products";
import { AdminQuickActions } from "@/components/admin/dashboard/admin-quick-actions";
import { AdminStockAlerts } from "@/components/admin/dashboard/admin-stock-alerts";
import { DashboardAutoRefresh } from "@/components/dashboard/dashboard-auto-refresh";

const A_DashBoardPage = async () => {
  const currentSession = await auth();

  return (
    <DashboardAutoRefresh delay={2000}>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900">
            Welcome back, {currentSession?.user?.firstName || "Admin"}!
          </h1>
          <p className="text-stone-600 mt-1">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>

        {/* Stats Cards */}
        <AdminDashboardStats />

        {/* Stock Alerts */}
        <AdminStockAlerts />

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
    </DashboardAutoRefresh>
  );
};

export default A_DashBoardPage;
