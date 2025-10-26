"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Calendar, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { createAxiosClientWithSession } from "@/utils/axios/axiosClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

interface EarningsData {
    total: {
        earnings: number;
        orders: number;
    };
    yearly: {
        earnings: number;
        orders: number;
        growth: number;
        breakdown: Array<{
            year: number;
            earnings: number;
            orders: number;
        }>;
    };
    monthly: {
        earnings: number;
        orders: number;
        growth: number;
        breakdown: Array<{
            month: number;
            earnings: number;
            orders: number;
        }>;
    };
    avgOrderValue: number;
}

const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function EarningsReportPage() {
    const { data: session } = useSession();
    const [earnings, setEarnings] = useState<EarningsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchEarnings = useCallback(async () => {
        if (!session) return;

        try {
            const axiosInstance = createAxiosClientWithSession(session);
            const response = await axiosInstance.get("/api/v1/dashboard/earnings-report");

            if (response.data.success) {
                setEarnings(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching earnings report:", error);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        fetchEarnings();
    }, [fetchEarnings]);

    const formatCurrency = (amount: number) => {
        return `৳${new Intl.NumberFormat('en-BD', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)}`;
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const monthlyChartData = earnings?.monthly.breakdown.map(item => ({
        name: MONTH_NAMES[item.month - 1],
        earnings: item.earnings,
        orders: item.orders
    })) || [];

    const yearlyChartData = earnings?.yearly.breakdown.map(item => ({
        name: item.year.toString(),
        earnings: item.earnings,
        orders: item.orders
    })) || [];

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/control/reports">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900">Earnings Report</h1>
                        <p className="text-stone-600 mt-1">
                            Detailed revenue analysis and earning trends
                        </p>
                    </div>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-600">
                            Total Earnings
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-stone-900">
                            {formatCurrency(earnings?.total.earnings || 0)}
                        </div>
                        <p className="text-xs text-stone-600 mt-1">
                            All time revenue
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-600">
                            Monthly Earnings
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-stone-900">
                            {formatCurrency(earnings?.monthly.earnings || 0)}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-stone-600 mt-1">
                            {(earnings?.monthly.growth || 0) >= 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={(earnings?.monthly.growth || 0) >= 0 ? "text-green-600" : "text-red-600"}>
                                {Math.abs(earnings?.monthly.growth || 0).toFixed(1)}%
                            </span>
                            <span>from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-600">
                            Yearly Earnings
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-stone-900">
                            {formatCurrency(earnings?.yearly.earnings || 0)}
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-stone-600 mt-1">
                            {(earnings?.yearly.growth || 0) >= 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={(earnings?.yearly.growth || 0) >= 0 ? "text-green-600" : "text-red-600"}>
                                {Math.abs(earnings?.yearly.growth || 0).toFixed(1)}%
                            </span>
                            <span>from last year</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-600">
                            Avg. Order Value
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-stone-900">
                            {formatCurrency(earnings?.avgOrderValue || 0)}
                        </div>
                        <p className="text-xs text-stone-600 mt-1">
                            Per order
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Monthly Earnings Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Earnings (Current Year)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Legend />
                                <Bar dataKey="earnings" fill="#10b981" name="Earnings" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Yearly Earnings Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Yearly Earnings Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={yearlyChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="earnings"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    name="Earnings"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Tables */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Monthly Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                            Month
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                            Orders
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                            Earnings
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {earnings?.monthly.breakdown.map((item) => (
                                        <tr key={item.month} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {MONTH_NAMES[item.month - 1]}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-600">
                                                {formatNumber(item.orders)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                                                {formatCurrency(item.earnings)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Yearly Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Yearly Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                            Year
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                            Orders
                                        </th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                            Earnings
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {earnings?.yearly.breakdown.map((item) => (
                                        <tr key={item.year} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {item.year}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right text-gray-600">
                                                {formatNumber(item.orders)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-semibold text-purple-600">
                                                {formatCurrency(item.earnings)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
