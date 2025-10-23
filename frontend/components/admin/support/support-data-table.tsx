"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, MessageSquare, AlertCircle, CheckCircle, Clock, User } from "lucide-react";

interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  category: "technical" | "billing" | "general" | "product";
  customerName: string;
  customerEmail: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  responses: number;
}

const mockTickets: SupportTicket[] = [
  {
    id: "1",
    ticketNumber: "TKT-001",
    subject: "Payment Gateway Issue",
    description: "Unable to complete payment using bKash",
    priority: "high",
    status: "open",
    category: "technical",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    assignedTo: "Admin User",
    createdAt: "2024-10-20T10:00:00Z",
    updatedAt: "2024-10-20T10:00:00Z",
    responses: 0
  },
  {
    id: "2",
    ticketNumber: "TKT-002",
    subject: "Product Defect Report",
    description: "Received damaged smartphone, need replacement",
    priority: "medium",
    status: "in-progress",
    category: "product",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    assignedTo: "Support Team",
    createdAt: "2024-10-19T14:30:00Z",
    updatedAt: "2024-10-20T09:15:00Z",
    responses: 2
  },
  {
    id: "3",
    ticketNumber: "TKT-003",
    subject: "Account Login Problem",
    description: "Forgot password and reset email not received",
    priority: "low",
    status: "resolved",
    category: "technical",
    customerName: "Bob Wilson",
    customerEmail: "bob.wilson@example.com",
    createdAt: "2024-10-18T16:45:00Z",
    updatedAt: "2024-10-19T11:20:00Z",
    responses: 3
  }
];

export const SupportDataTable = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);

  // Stats calculation
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === "open").length;
  const inProgressTickets = tickets.filter(t => t.status === "in-progress").length;
  const resolvedTickets = tickets.filter(t => t.status === "resolved").length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-stone-100 text-stone-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "closed": return "bg-stone-100 text-stone-800";
      default: return "bg-stone-100 text-stone-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="w-4 h-4" />;
      case "in-progress": return <Clock className="w-4 h-4" />;
      case "resolved": return <CheckCircle className="w-4 h-4" />;
      case "closed": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{openTickets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inProgressTickets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedTickets}</div>
          </CardContent>
        </Card>
      </div>

      {/* Support Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-stone-600">Ticket</th>
                  <th className="text-left p-4 font-medium text-stone-600">Customer</th>
                  <th className="text-left p-4 font-medium text-stone-600">Subject</th>
                  <th className="text-left p-4 font-medium text-stone-600">Priority</th>
                  <th className="text-left p-4 font-medium text-stone-600">Status</th>
                  <th className="text-left p-4 font-medium text-stone-600">Assigned</th>
                  <th className="text-left p-4 font-medium text-stone-600">Responses</th>
                  <th className="text-left p-4 font-medium text-stone-600">Created</th>
                  <th className="text-left p-4 font-medium text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-stone-50">
                    <td className="p-4">
                      <div className="font-medium">{ticket.ticketNumber}</div>
                      <div className="text-sm text-stone-500 capitalize">{ticket.category}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{ticket.customerName}</div>
                      <div className="text-sm text-stone-500">{ticket.customerEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{ticket.subject}</div>
                      <div className="text-sm text-stone-500 max-w-xs truncate">
                        {ticket.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-stone-500" />
                        <span className="text-sm">{ticket.assignedTo || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant="outline">{ticket.responses}</Badge>
                    </td>
                    <td className="p-4 text-sm text-stone-600">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4" />
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