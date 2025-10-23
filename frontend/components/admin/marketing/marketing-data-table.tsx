"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Edit, Delete, Zap, Gift, Mail, Users, TrendingUp, Clock, DollarSign } from "lucide-react";

interface FlashDeal {
  id: string;
  title: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "expired";
  productsCount: number;
  totalSales: number;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  status: "active" | "inactive" | "expired";
}

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
  source: "website" | "checkout" | "manual";
}

const mockFlashDeals: FlashDeal[] = [
  {
    id: "1",
    title: "Weekend Mega Sale",
    discount: 30,
    startDate: "2024-10-19T00:00:00Z",
    endDate: "2024-10-21T23:59:59Z",
    status: "active",
    productsCount: 25,
    totalSales: 150000
  },
  {
    id: "2",
    title: "Electronics Flash Deal",
    discount: 20,
    startDate: "2024-10-15T00:00:00Z",
    endDate: "2024-10-18T23:59:59Z",
    status: "expired",
    productsCount: 15,
    totalSales: 85000
  }
];

const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "WELCOME20",
    discount: 20,
    discountType: "percentage",
    usageLimit: 100,
    usedCount: 45,
    expiryDate: "2024-12-31T23:59:59Z",
    status: "active"
  },
  {
    id: "2",
    code: "SAVE500",
    discount: 500,
    discountType: "fixed",
    usageLimit: 50,
    usedCount: 12,
    expiryDate: "2024-11-30T23:59:59Z",
    status: "active"
  }
];

const mockSubscribers: Subscriber[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    subscribedAt: "2024-10-15T10:30:00Z",
    status: "active",
    source: "website"
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    subscribedAt: "2024-10-10T14:20:00Z",
    status: "active",
    source: "checkout"
  }
];

export const MarketingDataTable = () => {
  const [flashDeals] = useState<FlashDeal[]>(mockFlashDeals);
  const [coupons] = useState<Coupon[]>(mockCoupons);
  const [subscribers] = useState<Subscriber[]>(mockSubscribers);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      case "unsubscribed": return "bg-stone-100 text-stone-800";
      default: return "bg-stone-100 text-stone-800";
    }
  };

  // Stats calculations
  const totalFlashDeals = flashDeals.length;
  const activeFlashDeals = flashDeals.filter(d => d.status === "active").length;
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status === "active").length;
  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Flash Deals</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{activeFlashDeals}</div>
            <p className="text-xs text-muted-foreground">of {totalFlashDeals} total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            <Gift className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCoupons}</div>
            <p className="text-xs text-muted-foreground">of {totalCoupons} total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">active subscribers</p>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="flash-deals" className="space-y-4">
            <TabsList>
              <TabsTrigger value="flash-deals">Flash Deals</TabsTrigger>
              <TabsTrigger value="coupons">Coupons</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            </TabsList>

            {/* Flash Deals Tab */}
            <TabsContent value="flash-deals">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-stone-600">Deal</th>
                      <th className="text-left p-4 font-medium text-stone-600">Discount</th>
                      <th className="text-left p-4 font-medium text-stone-600">Duration</th>
                      <th className="text-left p-4 font-medium text-stone-600">Products</th>
                      <th className="text-left p-4 font-medium text-stone-600">Sales</th>
                      <th className="text-left p-4 font-medium text-stone-600">Status</th>
                      <th className="text-left p-4 font-medium text-stone-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flashDeals.map((deal) => (
                      <tr key={deal.id} className="border-b hover:bg-stone-50">
                        <td className="p-4 font-medium">{deal.title}</td>
                        <td className="p-4">
                          <Badge className="bg-red-100 text-red-800">{deal.discount}% OFF</Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div>{new Date(deal.startDate).toLocaleDateString()}</div>
                            <div className="text-stone-500">to {new Date(deal.endDate).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="p-4">{deal.productsCount} items</td>
                        <td className="p-4 font-medium">৳{deal.totalSales.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(deal.status)}>
                            {deal.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Delete className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Coupons Tab */}
            <TabsContent value="coupons">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-stone-600">Code</th>
                      <th className="text-left p-4 font-medium text-stone-600">Discount</th>
                      <th className="text-left p-4 font-medium text-stone-600">Usage</th>
                      <th className="text-left p-4 font-medium text-stone-600">Expiry</th>
                      <th className="text-left p-4 font-medium text-stone-600">Status</th>
                      <th className="text-left p-4 font-medium text-stone-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon) => (
                      <tr key={coupon.id} className="border-b hover:bg-stone-50">
                        <td className="p-4">
                          <code className="bg-stone-100 px-2 py-1 rounded font-mono text-sm">
                            {coupon.code}
                          </code>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-green-100 text-green-800">
                            {coupon.discountType === "percentage" 
                              ? `${coupon.discount}%` 
                              : `৳${coupon.discount}`
                            }
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="font-medium">{coupon.usedCount} / {coupon.usageLimit}</div>
                            <div className="text-stone-500">
                              {Math.round((coupon.usedCount / coupon.usageLimit) * 100)}% used
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm">
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(coupon.status)}>
                            {coupon.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Delete className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Subscribers Tab */}
            <TabsContent value="subscribers">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-stone-600">Email</th>
                      <th className="text-left p-4 font-medium text-stone-600">Source</th>
                      <th className="text-left p-4 font-medium text-stone-600">Subscribed</th>
                      <th className="text-left p-4 font-medium text-stone-600">Status</th>
                      <th className="text-left p-4 font-medium text-stone-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b hover:bg-stone-50">
                        <td className="p-4 font-medium">{subscriber.email}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="capitalize">
                            {subscriber.source}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-stone-600">
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(subscriber.status)}>
                            {subscriber.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Delete className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};