"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Package, 
  Eye,
  Download
} from "lucide-react";

interface SalesData {
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  growth: number;
}

interface ProductPerformance {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  views: number;
  conversionRate: number;
}

interface CustomerInsight {
  metric: string;
  value: number;
  change: number;
  period: string;
}

const mockSalesData: SalesData[] = [
  { period: "Oct 2024", revenue: 450000, orders: 1250, customers: 890, growth: 15.5 },
  { period: "Sep 2024", revenue: 390000, orders: 1100, customers: 750, growth: 8.2 },
  { period: "Aug 2024", revenue: 360000, orders: 980, customers: 680, growth: -2.1 },
  { period: "Jul 2024", revenue: 368000, orders: 1050, customers: 720, growth: 12.3 }
];

const mockProductPerformance: ProductPerformance[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    sales: 245,
    revenue: 245000,
    views: 5420,
    conversionRate: 4.5
  },
  {
    id: "2", 
    name: "Samsung Galaxy S24 Ultra",
    sales: 180,
    revenue: 180000,
    views: 4200,
    conversionRate: 4.3
  },
  {
    id: "3",
    name: "MacBook Pro M3",
    sales: 95,
    revenue: 190000,
    views: 2800,
    conversionRate: 3.4
  }
];

const mockCustomerInsights: CustomerInsight[] = [
  { metric: "New Customers", value: 245, change: 12.5, period: "This Month" },
  { metric: "Returning Customers", value: 640, change: 8.3, period: "This Month" },
  { metric: "Customer Lifetime Value", value: 2850, change: 15.2, period: "Average" },
  { metric: "Churn Rate", value: 5.2, change: -2.1, period: "This Month" }
];

export const ReportsDataTable = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">৳450,000</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +15.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1,250</div>
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">890</div>
            <p className="text-xs text-purple-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">2,840</div>
            <p className="text-xs text-orange-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +6.8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Business Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sales" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sales">Sales Reports</TabsTrigger>
              <TabsTrigger value="products">Product Performance</TabsTrigger>
              <TabsTrigger value="customers">Customer Insights</TabsTrigger>
            </TabsList>

            {/* Sales Reports Tab */}
            <TabsContent value="sales">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Sales Performance</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-stone-600">Period</th>
                        <th className="text-left p-4 font-medium text-stone-600">Revenue</th>
                        <th className="text-left p-4 font-medium text-stone-600">Orders</th>
                        <th className="text-left p-4 font-medium text-stone-600">Customers</th>
                        <th className="text-left p-4 font-medium text-stone-600">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockSalesData.map((data, index) => (
                        <tr key={index} className="border-b hover:bg-stone-50">
                          <td className="p-4 font-medium">{data.period}</td>
                          <td className="p-4 font-medium text-green-600">
                            {formatCurrency(data.revenue)}
                          </td>
                          <td className="p-4">{data.orders.toLocaleString()}</td>
                          <td className="p-4">{data.customers.toLocaleString()}</td>
                          <td className="p-4">
                            <div className={`flex items-center gap-1 ${
                              data.growth >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {data.growth >= 0 ? 
                                <TrendingUp className="w-4 h-4" /> : 
                                <TrendingDown className="w-4 h-4" />
                              }
                              {formatPercentage(data.growth)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Product Performance Tab */}
            <TabsContent value="products">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Top Performing Products</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-stone-600">Product</th>
                        <th className="text-left p-4 font-medium text-stone-600">Sales</th>
                        <th className="text-left p-4 font-medium text-stone-600">Revenue</th>
                        <th className="text-left p-4 font-medium text-stone-600">Views</th>
                        <th className="text-left p-4 font-medium text-stone-600">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockProductPerformance.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-stone-50">
                          <td className="p-4 font-medium">{product.name}</td>
                          <td className="p-4">{product.sales} units</td>
                          <td className="p-4 font-medium text-green-600">
                            {formatCurrency(product.revenue)}
                          </td>
                          <td className="p-4 flex items-center gap-1">
                            <Eye className="w-4 h-4 text-stone-500" />
                            {product.views.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <Badge className="bg-blue-100 text-blue-800">
                              {product.conversionRate}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Customer Insights Tab */}
            <TabsContent value="customers">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Customer Analytics</h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockCustomerInsights.map((insight, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-stone-600">{insight.metric}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-2xl font-bold">
                                {insight.metric === "Customer Lifetime Value" 
                                  ? formatCurrency(insight.value)
                                  : insight.metric === "Churn Rate"
                                  ? `${insight.value}%`
                                  : insight.value.toLocaleString()
                                }
                              </p>
                              <div className={`flex items-center gap-1 text-sm ${
                                insight.change >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {insight.change >= 0 ? 
                                  <TrendingUp className="w-4 h-4" /> : 
                                  <TrendingDown className="w-4 h-4" />
                                }
                                {formatPercentage(insight.change)}
                              </div>
                            </div>
                            <p className="text-xs text-stone-500">{insight.period}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};