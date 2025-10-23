"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Ban, CheckCircle, Users, UserPlus, Activity, TrendingUp } from "lucide-react";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isDeleted: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  joinedDate: string;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+8801712345678",
    isDeleted: false,
    totalOrders: 15,
    totalSpent: 25000,
    lastOrderDate: "2024-10-20",
    joinedDate: "2024-01-15"
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+8801798765432",
    isDeleted: false,
    totalOrders: 8,
    totalSpent: 12000,
    lastOrderDate: "2024-10-18",
    joinedDate: "2024-03-10"
  },
  {
    id: "3",
    firstName: "Bob",
    lastName: "Wilson",
    email: "bob.wilson@example.com",
    phone: "+8801612345678",
    isDeleted: true,
    totalOrders: 3,
    totalSpent: 3500,
    lastOrderDate: "2024-08-15",
    joinedDate: "2024-07-01"
  }
];

export const CustomersDataTable = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [loading, setLoading] = useState(false);

  // Stats calculation
  const totalCustomers = customers.filter(c => !c.isDeleted).length;
  const activeCustomers = customers.filter(c => 
    !c.isDeleted && c.lastOrderDate && 
    new Date(c.lastOrderDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  const newCustomersThisMonth = customers.filter(c => 
    !c.isDeleted && 
    new Date(c.joinedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;
  const totalRevenue = customers.filter(c => !c.isDeleted).reduce((sum, customer) => sum + customer.totalSpent, 0);

  const handleStatusToggle = (customerId: string) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { ...customer, isDeleted: !customer.isDeleted }
        : customer
    ));
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{newCustomersThisMonth}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-stone-600">Customer</th>
                  <th className="text-left p-4 font-medium text-stone-600">Contact</th>
                  <th className="text-left p-4 font-medium text-stone-600">Orders</th>
                  <th className="text-left p-4 font-medium text-stone-600">Total Spent</th>
                  <th className="text-left p-4 font-medium text-stone-600">Last Order</th>
                  <th className="text-left p-4 font-medium text-stone-600">Status</th>
                  <th className="text-left p-4 font-medium text-stone-600">Joined</th>
                  <th className="text-left p-4 font-medium text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-stone-50">
                    <td className="p-4">
                      <div className="font-medium">{customer.firstName} {customer.lastName}</div>
                      <div className="text-sm text-stone-500">{customer.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{customer.phone}</div>
                    </td>
                    <td className="p-4 font-medium">{customer.totalOrders}</td>
                    <td className="p-4 font-medium">৳{customer.totalSpent.toLocaleString()}</td>
                    <td className="p-4 text-sm text-stone-600">
                      {customer.lastOrderDate 
                        ? new Date(customer.lastOrderDate).toLocaleDateString()
                        : "Never"
                      }
                    </td>
                    <td className="p-4">
                      <Badge className={customer.isDeleted 
                        ? "bg-red-100 text-red-800" 
                        : "bg-green-100 text-green-800"
                      }>
                        {customer.isDeleted ? "Inactive" : "Active"}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-stone-600">
                      {new Date(customer.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusToggle(customer.id)}
                          className={customer.isDeleted 
                            ? "text-green-600 hover:text-green-700" 
                            : "text-red-600 hover:text-red-700"
                          }
                        >
                          {customer.isDeleted ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
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