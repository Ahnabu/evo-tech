'use client';

import { useUserDashboard, useUserProfile } from '@/hooks/use-user-dashboard';
import { useCurrentUser } from '@/hooks/use-current-user';
import Link from 'next/link';

export default function UserDashboard() {
    const currentUser = useCurrentUser();
    const { dashboardData, loading, error } = useUserDashboard();
    const { profile } = useUserProfile();

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-8">
                        <div className="text-red-600 mb-4">Error loading dashboard</div>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {currentUser?.firstName || 'User'}!
                    </h1>
                    <p className="text-gray-600">
                        Manage your orders, profile, and preferences from your dashboard.
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Quick Stats */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Stats
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Orders:</span>
                                <span className="font-medium">{dashboardData?.totalOrders || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Reward Points:</span>
                                <span className="font-medium text-green-600">{dashboardData?.rewardPoints || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Spent:</span>
                                <span className="font-medium">৳{dashboardData?.totalSpent?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Recent Orders
                        </h2>
                        {dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 ? (
                            <div className="space-y-3">
                                {dashboardData.recentOrders.slice(0, 3).map((order) => (
                                    <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <div>
                                            <div className="font-medium">#{order.orderNumber}</div>
                                            <div className="text-sm text-gray-600">{order.orderStatus}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">৳{order.totalPayable.toFixed(2)}</div>
                                            <div className="text-sm text-gray-600">{new Date(order.createdAt!).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500">No recent orders</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Actions
                        </h2>
                        <div className="space-y-2">
                            <Link href="/profile" className="block w-full text-left px-3 py-2 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors">
                                View Profile
                            </Link>
                            <Link href="/order-history" className="block w-full text-left px-3 py-2 rounded-md bg-green-50 hover:bg-green-100 text-green-700 transition-colors">
                                Order History
                            </Link>
                            <Link href="/addresses" className="block w-full text-left px-3 py-2 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors">
                                Manage Addresses
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Additional Sections */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Profile Summary
                        </h2>
                        {profile ? (
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-medium">{profile.firstName} {profile.lastName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email:</span>
                                    <span className="font-medium">{profile.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="font-medium">{profile.phone || 'Not provided'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Account Type:</span>
                                    <span className="font-medium capitalize">{profile.userType}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <Link href="/profile" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        Edit Profile →
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Loading profile information...</p>
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Notifications
                        </h2>
                        <div className="text-center py-8">
                            <p className="text-gray-500">No new notifications</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}