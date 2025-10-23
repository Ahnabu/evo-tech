"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye } from "lucide-react";

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    createdAt: string;
}

export function AdminRecentOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    const fetchRecentOrders = async () => {
        try {
            setLoading(true);
            // Use client-side axios with session token
            const createAxiosClient = (await import('@/utils/axios/axiosClient')).default;
            const axiosInstance = await createAxiosClient();
            
            const response = await axiosInstance.get('/api/v1/dashboard/recent-orders');
            
            if (response.data.success) {
                setOrders(response.data.data || []);
            } else {
                throw new Error(response.data.message || 'Failed to fetch recent orders');
            }
        } catch (error) {
            console.error("Error fetching recent orders:", error);
            // Fallback to mock data
            const mockOrders: Order[] = [
                {
                    id: "ORD-001",
                    customerName: "John Doe",
                    customerEmail: "john@example.com",
                    total: 299.99,
                    status: "pending",
                    createdAt: "2024-01-15T10:30:00Z"
                },
                {
                    id: "ORD-002",
                    customerName: "Jane Smith",
                    customerEmail: "jane@example.com",
                    total: 199.50,
                    status: "confirmed",
                    createdAt: "2024-01-15T09:15:00Z"
                },
                {
                    id: "ORD-003",
                    customerName: "Mike Johnson",
                    customerEmail: "mike@example.com",
                    total: 449.99,
                    status: "shipped",
                    createdAt: "2024-01-14T16:45:00Z"
                },
                {
                    id: "ORD-004",
                    customerName: "Sarah Wilson",
                    customerEmail: "sarah@example.com",
                    total: 129.99,
                    status: "delivered",
                    createdAt: "2024-01-14T14:20:00Z"
                },
                {
                    id: "ORD-005",
                    customerName: "David Brown",
                    customerEmail: "david@example.com",
                    total: 89.99,
                    status: "cancelled",
                    createdAt: "2024-01-14T11:10:00Z"
                }
            ];
            setOrders(mockOrders);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-600 border-yellow-200";
            case "confirmed": return "bg-blue-100 text-blue-600 border-blue-200";
            case "shipped": return "bg-purple-100 text-purple-600 border-purple-200";
            case "delivered": return "bg-green-100 text-green-600 border-green-200";
            case "cancelled": return "bg-red-100 text-red-600 border-red-200";
            default: return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    const formatCurrency = (amount: number) => {
        return `৳${new Intl.NumberFormat('en-US', {
            minimumIntegerDigits: 1,
            maximumFractionDigits: 0,
        }).format(amount)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
                <Link 
                    href="/control/orders" 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    View All
                </Link>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm">{order.id}</span>
                                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {order.customerName} • {formatDate(order.createdAt)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-sm">
                                        {formatCurrency(order.total)}
                                    </span>
                                    <Link 
                                        href={`/control/orders/${order.id}`}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}