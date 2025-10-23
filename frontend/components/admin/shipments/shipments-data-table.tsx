"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Truck, Package, MapPin, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { currencyFormatBDT } from "@/lib/all_utils";

interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  shippingMethod: "regular_delivery" | "express_delivery" | "pickup_point";
  status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "failed" | "returned";
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  shippingCost: number;
  createdAt: string;
}

const mockShipments: Shipment[] = [
  {
    id: "1",
    orderId: "ORD-001",
    trackingNumber: "EVT123456ABCD",
    carrier: "Pathao Courier",
    shippingMethod: "express_delivery",
    status: "in_transit",
    shippingAddress: {
      fullName: "John Doe",
      phone: "+8801712345678",
      address: "123 Main Street, Dhanmondi",
      city: "Dhaka"
    },
    estimatedDeliveryDate: "2024-10-25",
    shippingCost: 120,
    createdAt: "2024-10-22"
  },
  {
    id: "2",
    orderId: "ORD-002",
    trackingNumber: "EVT789012EFGH",
    carrier: "Steadfast Courier",
    shippingMethod: "regular_delivery",
    status: "delivered",
    shippingAddress: {
      fullName: "Jane Smith",
      phone: "+8801798765432",
      address: "456 Park Avenue, Gulshan",
      city: "Dhaka"
    },
    estimatedDeliveryDate: "2024-10-24",
    actualDeliveryDate: "2024-10-23",
    shippingCost: 80,
    createdAt: "2024-10-20"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "in_transit":
    case "out_for_delivery":
      return "bg-blue-100 text-blue-800";
    case "picked_up":
      return "bg-purple-100 text-purple-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "failed":
    case "returned":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="w-4 h-4" />;
    case "in_transit":
    case "out_for_delivery":
      return <Truck className="w-4 h-4" />;
    case "picked_up":
      return <Package className="w-4 h-4" />;
    case "pending":
      return <AlertCircle className="w-4 h-4" />;
    case "failed":
    case "returned":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

export const ShipmentsDataTable = () => {
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [loading, setLoading] = useState(false);

  // Stats calculation
  const totalShipments = shipments.length;
  const deliveredShipments = shipments.filter(s => s.status === "delivered").length;
  const inTransitShipments = shipments.filter(s => s.status === "in_transit" || s.status === "out_for_delivery").length;
  const pendingShipments = shipments.filter(s => s.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShipments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveredShipments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inTransitShipments}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingShipments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-stone-600">Tracking</th>
                  <th className="text-left p-4 font-medium text-stone-600">Order</th>
                  <th className="text-left p-4 font-medium text-stone-600">Customer</th>
                  <th className="text-left p-4 font-medium text-stone-600">Carrier</th>
                  <th className="text-left p-4 font-medium text-stone-600">Status</th>
                  <th className="text-left p-4 font-medium text-stone-600">Delivery Date</th>
                  <th className="text-left p-4 font-medium text-stone-600">Cost</th>
                  <th className="text-left p-4 font-medium text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b hover:bg-stone-50">
                    <td className="p-4">
                      <div className="font-medium">{shipment.trackingNumber}</div>
                      <div className="text-sm text-stone-500 capitalize">
                        {shipment.shippingMethod.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{shipment.orderId}</div>
                      <div className="text-sm text-stone-500">
                        {new Date(shipment.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{shipment.shippingAddress.fullName}</div>
                      <div className="text-sm text-stone-500">{shipment.shippingAddress.city}</div>
                    </td>
                    <td className="p-4">{shipment.carrier}</td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(shipment.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(shipment.status)}
                        {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-stone-600">
                      {shipment.actualDeliveryDate 
                        ? new Date(shipment.actualDeliveryDate).toLocaleDateString()
                        : shipment.estimatedDeliveryDate 
                          ? `Est: ${new Date(shipment.estimatedDeliveryDate).toLocaleDateString()}`
                          : "N/A"
                      }
                    </td>
                    <td className="p-4">৳{currencyFormatBDT(shipment.shippingCost)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};