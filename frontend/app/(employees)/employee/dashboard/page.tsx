import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Employee Dashboard | EvoTech',
    description: 'Employee dashboard for managing tasks, orders, and customer support',
};

export default function EmployeeDashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Employee Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Welcome to your employee dashboard. Manage orders, customer support, and daily tasks.
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Today's Tasks */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Today&apos;s Tasks
                        </h2>
                        <div className="text-center py-4">
                            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
                            <p className="text-gray-500 text-sm">Pending tasks</p>
                        </div>
                    </div>

                    {/* Orders to Process */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Orders
                        </h2>
                        <div className="text-center py-4">
                            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                            <p className="text-gray-500 text-sm">To process</p>
                        </div>
                    </div>

                    {/* Support Tickets */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Support
                        </h2>
                        <div className="text-center py-4">
                            <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
                            <p className="text-gray-500 text-sm">Open tickets</p>
                        </div>
                    </div>

                    {/* Performance */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Performance
                        </h2>
                        <div className="text-center py-4">
                            <div className="text-3xl font-bold text-purple-600 mb-2">-</div>
                            <p className="text-gray-500 text-sm">This month</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Recent Orders
                        </h2>
                        <div className="text-center py-8">
                            <p className="text-gray-500">No recent orders to display</p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors">
                                <div className="text-sm font-medium">Process Orders</div>
                            </button>
                            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 transition-colors">
                                <div className="text-sm font-medium">Support Tickets</div>
                            </button>
                            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 transition-colors">
                                <div className="text-sm font-medium">Inventory</div>
                            </button>
                            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 transition-colors">
                                <div className="text-sm font-medium">Reports</div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <div className="mt-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Task List
                        </h2>
                        <div className="text-center py-8">
                            <p className="text-gray-500">No tasks assigned yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}