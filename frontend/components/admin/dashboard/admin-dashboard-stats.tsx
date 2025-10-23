"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    DollarSign, 
    ShoppingCart, 
    Users, 
    Package,
    TrendingUp,
    TrendingDown
} from "lucide-react";
import { useSession } from "next-auth/react";
import { createAxiosClientWithSession } from "@/utils/axios/axiosClient";

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    revenueGrowth: number;
    ordersGrowth: number;
    customersGrowth: number;
    productsGrowth: number;
}

export function AdminDashboardStats() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        customersGrowth: 0,
        productsGrowth: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        if (!session) return;
        
        try {
            const axiosInstance = createAxiosClientWithSession(session);
            
            const response = await axiosInstance.get("/api/v1/dashboard/stats");
            
            if (response.data.success) {
                setStats(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to load dashboard stats');
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            // Fallback to mock data
            setStats({
                totalRevenue: 45231.50,
                totalOrders: 1234,
                totalCustomers: 5678,
                totalProducts: 234,
                revenueGrowth: 12.5,
                ordersGrowth: 8.2,
                customersGrowth: 15.3,
                productsGrowth: 5.1,
            });
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const formatCurrency = (amount: number) => {
        return `৳${new Intl.NumberFormat('en-US', {
            minimumIntegerDigits: 1,
            maximumFractionDigits: 0,
        }).format(amount)}`;
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const StatCard = ({ 
        title, 
        value, 
        icon: Icon, 
        growth, 
        format = "number" 
    }: {
        title: string;
        value: number;
        icon: any;
        growth: number;
        format?: "number" | "currency";
    }) => {
        const formattedValue = format === "currency" ? formatCurrency(value) : formatNumber(value);
        const isPositive = growth >= 0;

        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-stone-600">
                        {title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-stone-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-stone-900">
                        {loading ? "..." : formattedValue}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-stone-600 mt-1">
                        {isPositive ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span className={isPositive ? "text-green-600" : "text-red-600"}>
                            {Math.abs(growth)}%
                        </span>
                        <span>from last month</span>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Revenue"
                value={stats.totalRevenue}
                icon={DollarSign}
                growth={stats.revenueGrowth}
                format="currency"
            />
            <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                icon={ShoppingCart}
                growth={stats.ordersGrowth}
            />
            <StatCard
                title="Total Customers"
                value={stats.totalCustomers}
                icon={Users}
                growth={stats.customersGrowth}
            />
            <StatCard
                title="Total Products"
                value={stats.totalProducts}
                icon={Package}
                growth={stats.productsGrowth}
            />
        </div>
    );
}