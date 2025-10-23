"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { currencyFormatBDT } from "@/lib/all_utils";

interface Supply {
  id: string;
  productId: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  supplierName: string;
  supplierContact?: string;
  batchNumber?: string;
  receivedDate: string;
  status: "received" | "pending" | "cancelled";
  notes?: string;
}

const mockSupplies: Supply[] = [
  {
    id: "1",
    productId: "prod-1",
    quantity: 100,
    costPrice: 1200,
    sellingPrice: 1500,
    supplierName: "Tech Supplies Ltd",
    supplierContact: "+8801712345678",
    batchNumber: "BATCH001",
    receivedDate: "2024-10-20",
    status: "received",
    notes: "Quality checked and stored"
  },
  {
    id: "2",
    productId: "prod-2",
    quantity: 50,
    costPrice: 800,
    sellingPrice: 1000,
    supplierName: "Electronics Hub",
    supplierContact: "+8801798765432",
    batchNumber: "BATCH002",
    receivedDate: "2024-10-22",
    status: "pending",
    notes: "Awaiting quality check"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "received":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const SuppliesDataTable = () => {
  const [supplies, setSupplies] = useState<Supply[]>(mockSupplies);
  const [loading, setLoading] = useState(false);

  // Stats calculation
  const totalSupplies = supplies.length;
  const receivedSupplies = supplies.filter(s => s.status === "received").length;
  const pendingSupplies = supplies.filter(s => s.status === "pending").length;
  const totalValue = supplies.reduce((sum, supply) => sum + (supply.quantity * supply.costPrice), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Supplies</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSupplies}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{receivedSupplies}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingSupplies}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{currencyFormatBDT(totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Supplies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-stone-600">Batch</th>
                  <th className="text-left p-4 font-medium text-stone-600">Supplier</th>
                  <th className="text-left p-4 font-medium text-stone-600">Quantity</th>
                  <th className="text-left p-4 font-medium text-stone-600">Cost Price</th>
                  <th className="text-left p-4 font-medium text-stone-600">Selling Price</th>
                  <th className="text-left p-4 font-medium text-stone-600">Status</th>
                  <th className="text-left p-4 font-medium text-stone-600">Date</th>
                  <th className="text-left p-4 font-medium text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supplies.map((supply) => (
                  <tr key={supply.id} className="border-b hover:bg-stone-50">
                    <td className="p-4">
                      <div className="font-medium">{supply.batchNumber || "N/A"}</div>
                      <div className="text-sm text-stone-500">{supply.productId}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{supply.supplierName}</div>
                      <div className="text-sm text-stone-500">{supply.supplierContact}</div>
                    </td>
                    <td className="p-4 font-medium">{supply.quantity}</td>
                    <td className="p-4">৳{currencyFormatBDT(supply.costPrice)}</td>
                    <td className="p-4">৳{currencyFormatBDT(supply.sellingPrice)}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(supply.status)}>
                        {supply.status.charAt(0).toUpperCase() + supply.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-stone-600">
                      {new Date(supply.receivedDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
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