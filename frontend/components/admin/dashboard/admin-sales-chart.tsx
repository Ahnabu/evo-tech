"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SalesData {
    date: string;
    sales: number;
    orders: number;
}

export function AdminSalesChart() {
    const [salesData, setSalesData] = useState<SalesData[]>([]);
    const [chartType, setChartType] = useState<"line" | "bar">("line");
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
    const [loading, setLoading] = useState(true);

    const fetchSalesData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/v1/dashboard/sales-data?period=${timeRange}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setSalesData(data.data || []);
            } else {
                throw new Error('Failed to fetch sales data');
            }
        } catch (error) {
            console.error("Error fetching sales data:", error);
            // Fallback to mock data
            const mockData: SalesData[] = [
                { date: "Jan 1", sales: 4000, orders: 24 },
                { date: "Jan 2", sales: 3000, orders: 18 },
                { date: "Jan 3", sales: 5000, orders: 32 },
                { date: "Jan 4", sales: 2780, orders: 16 },
                { date: "Jan 5", sales: 1890, orders: 12 },
                { date: "Jan 6", sales: 2390, orders: 15 },
                { date: "Jan 7", sales: 3490, orders: 22 },
                { date: "Jan 8", sales: 4200, orders: 28 },
                { date: "Jan 9", sales: 3800, orders: 25 },
                { date: "Jan 10", sales: 4100, orders: 27 },
                { date: "Jan 11", sales: 3600, orders: 23 },
                { date: "Jan 12", sales: 4500, orders: 30 },
                { date: "Jan 13", sales: 3900, orders: 26 },
                { date: "Jan 14", sales: 4300, orders: 29 },
                { date: "Jan 15", sales: 3700, orders: 24 },
            ];
            setSalesData(mockData);
        } finally {
            setLoading(false);
        }
    }, [timeRange]);

    useEffect(() => {
        fetchSalesData();
    }, [fetchSalesData]);

    const totalSales = salesData.reduce((sum: number, data: SalesData) => sum + data.sales, 0);
    const totalOrders = salesData.reduce((sum: number, data: SalesData) => sum + data.orders, 0);

    const renderChart = () => {
        if (chartType === "line") {
            return (
                <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="sales" orientation="left" />
                    <YAxis yAxisId="orders" orientation="right" />
                    <Tooltip 
                        formatter={(value: number, name: string) => [
                            name === 'sales' ? `$${value.toLocaleString()}` : value,
                            name === 'sales' ? 'Sales' : 'Orders'
                        ]}
                    />
                    <Line 
                        yAxisId="sales"
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                    <Line 
                        yAxisId="orders"
                        type="monotone" 
                        dataKey="orders" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            );
        } else {
            return (
                <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="sales" orientation="left" />
                    <YAxis yAxisId="orders" orientation="right" />
                    <Tooltip 
                        formatter={(value: number, name: string) => [
                            name === 'sales' ? `$${value.toLocaleString()}` : value,
                            name === 'sales' ? 'Sales' : 'Orders'
                        ]}
                    />
                    <Bar yAxisId="sales" dataKey="sales" fill="#8884d8" />
                    <Bar yAxisId="orders" dataKey="orders" fill="#82ca9d" />
                </BarChart>
            );
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Sales Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-80">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Sales Analytics</CardTitle>
                    <div className="flex gap-2">
                        <Select value={chartType} onValueChange={(value: "line" | "bar") => setChartType(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="line">Line Chart</SelectItem>
                                <SelectItem value="bar">Bar Chart</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={timeRange} onValueChange={(value: "7d" | "30d" | "90d") => setTimeRange(value)}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">Last 7 days</SelectItem>
                                <SelectItem value="30d">Last 30 days</SelectItem>
                                <SelectItem value="90d">Last 90 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex gap-6 mt-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Sales</p>
                        <p className="text-2xl font-bold">${totalSales.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    {renderChart()}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}