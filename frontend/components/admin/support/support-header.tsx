"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Download, LifeBuoy } from "lucide-react";
import Link from "next/link";

export const SupportHeader = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  return (
    <div className="flex flex-col gap-4">
      {/* Title and Create Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LifeBuoy className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight">Support System</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/control/support/create-ticket">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
            <Input
              placeholder="Search tickets, customers, subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Link href="/control/support">
          <Button variant="default" size="sm">All Tickets</Button>
        </Link>
        <Link href="/control/support/product-queries">
          <Button variant="outline" size="sm">Product Queries</Button>
        </Link>
        <Link href="/control/support/contacts">
          <Button variant="outline" size="sm">Contact Messages</Button>
        </Link>
        <Link href="/control/support/knowledgebase">
          <Button variant="outline" size="sm">Knowledge Base</Button>
        </Link>
      </div>
    </div>
  );
};