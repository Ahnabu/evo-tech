"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Ban, CheckCircle, Users, UserCheck, Shield, Activity } from "lucide-react";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "admin" | "manager" | "support" | "editor";
  department: string;
  status: "active" | "inactive" | "suspended";
  lastLogin?: string;
  joinedDate: string;
  permissions: string[];
}

const mockStaff: StaffMember[] = [
  {
    id: "1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@evotech.com",
    phone: "+8801712345678",
    role: "admin",
    department: "Administration",
    status: "active",
    lastLogin: "2024-10-20T10:30:00Z",
    joinedDate: "2024-01-01T00:00:00Z",
    permissions: ["all"]
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Manager",
    email: "sarah@evotech.com",
    phone: "+8801798765432",
    role: "manager",
    department: "Operations",
    status: "active",
    lastLogin: "2024-10-19T16:45:00Z",
    joinedDate: "2024-02-15T00:00:00Z",
    permissions: ["orders", "products", "customers", "reports"]
  },
  {
    id: "3",
    firstName: "John",
    lastName: "Support",
    email: "john.support@evotech.com",
    phone: "+8801612345678",
    role: "support",
    department: "Customer Service",
    status: "active",
    lastLogin: "2024-10-20T09:15:00Z",
    joinedDate: "2024-03-10T00:00:00Z",
    permissions: ["tickets", "customers", "orders"]
  },
  {
    id: "4",
    firstName: "Mike",
    lastName: "Editor",
    email: "mike@evotech.com",
    phone: "+8801555123456",
    role: "editor",
    department: "Content",
    status: "inactive",
    lastLogin: "2024-10-15T14:20:00Z",
    joinedDate: "2024-04-01T00:00:00Z",
    permissions: ["products", "categories", "content"]
  }
];

export const StaffDataTable = () => {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);

  // Stats calculation
  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === "active").length;
  const adminCount = staff.filter(s => s.role === "admin").length;
  const recentlyActive = staff.filter(s => 
    s.lastLogin && 
    new Date(s.lastLogin) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  const handleStatusToggle = (staffId: string) => {
    setStaff(prev => prev.map(member => 
      member.id === staffId 
        ? { 
            ...member, 
            status: member.status === "active" ? "inactive" : "active" 
          }
        : member
    ));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800";
      case "manager": return "bg-blue-100 text-blue-800";
      case "support": return "bg-green-100 text-green-800";
      case "editor": return "bg-purple-100 text-purple-800";
      default: return "bg-stone-100 text-stone-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-stone-100 text-stone-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Shield className="w-4 h-4" />;
      case "manager": return <UserCheck className="w-4 h-4" />;
      case "support": return <Users className="w-4 h-4" />;
      case "editor": return <Edit className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeStaff}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{adminCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recently Active</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{recentlyActive}</div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-stone-600">Staff Member</th>
                  <th className="text-left p-4 font-medium text-stone-600">Contact</th>
                  <th className="text-left p-4 font-medium text-stone-600">Role</th>
                  <th className="text-left p-4 font-medium text-stone-600">Department</th>
                  <th className="text-left p-4 font-medium text-stone-600">Status</th>
                  <th className="text-left p-4 font-medium text-stone-600">Last Login</th>
                  <th className="text-left p-4 font-medium text-stone-600">Joined</th>
                  <th className="text-left p-4 font-medium text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-stone-50">
                    <td className="p-4">
                      <div className="font-medium">{member.firstName} {member.lastName}</div>
                      <div className="text-sm text-stone-500">{member.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{member.phone}</div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getRoleColor(member.role)} flex items-center gap-1 w-fit`}>
                        {getRoleIcon(member.role)}
                        {member.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{member.department}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(member.status)}>
                        {member.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-stone-600">
                      {member.lastLogin 
                        ? new Date(member.lastLogin).toLocaleDateString()
                        : "Never"
                      }
                    </td>
                    <td className="p-4 text-sm text-stone-600">
                      {new Date(member.joinedDate).toLocaleDateString()}
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
                          onClick={() => handleStatusToggle(member.id)}
                          className={member.status === "active" 
                            ? "text-red-600 hover:text-red-700" 
                            : "text-green-600 hover:text-green-700"
                          }
                        >
                          {member.status === "active" ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
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