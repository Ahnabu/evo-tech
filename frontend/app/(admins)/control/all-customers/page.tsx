"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Search, Filter, Mail, Phone, Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import { createAxiosClientWithSession } from "@/utils/axios/axiosClient";
import { format } from "date-fns";

interface Customer {
  _id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  userType: string;
  isActive: boolean;
  emailVerifiedAt?: string;
  createdAt: string;
  lastActiveAt?: string;
  rewardPoints?: number;
}

const AllCustomersPage = () => {
    const { data: session } = useSession();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

    const fetchCustomers = useCallback(async () => {
        if (!session) return;
        
        try {
            const axiosClient = createAxiosClientWithSession(session);
            const response = await axiosClient.get('/api/users');
            
            // Filter to only show 'user' type (customers), not admin/employee
            const userCustomers = response.data.data.filter((user: Customer) => user.userType === 'user');
            setCustomers(userCustomers);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    useEffect(() => {
        // Filter customers based on search term
        const filtered = customers.filter(customer => 
            customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (customer.phone && customer.phone.includes(searchTerm))
        );
        setFilteredCustomers(filtered);
    }, [customers, searchTerm]);

    // Calculate stats
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.isActive && c.lastActiveAt).length;
    const newThisMonth = customers.filter(c => {
        const createdDate = new Date(c.createdAt);
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear;
    }).length;

    return (
        <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-stone-900">All Customers</h1>
                    <p className="text-stone-600 mt-1">
                        Manage and view all customer accounts
                    </p>
                </div>
                <Button className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add Customer
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Customers
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCustomers}</div>
                        <p className="text-xs text-muted-foreground">
                            Registered users
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Customers
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeCustomers}</div>
                        <p className="text-xs text-muted-foreground">
                            Active recently
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            New This Month
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{newThisMonth}</div>
                        <p className="text-xs text-muted-foreground">
                            New registrations
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Customer List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>

                    {/* Customer Table */}
                    {loading ? (
                        <div className="border rounded-lg p-8 text-center text-gray-500">
                            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p>Loading customers...</p>
                        </div>
                    ) : filteredCustomers.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Points
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredCustomers.map((customer) => (
                                            <tr key={customer._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {customer.firstName} {customer.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {customer.uuid.slice(-8)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1 text-sm text-gray-900">
                                                            <Mail className="w-3 h-3" />
                                                            {customer.email}
                                                        </div>
                                                        {customer.phone && (
                                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                <Phone className="w-3 h-3" />
                                                                {customer.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            customer.isActive 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {customer.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                        {customer.emailVerifiedAt && (
                                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-sm text-gray-900">
                                                        <Calendar className="w-3 h-3" />
                                                        {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {customer.rewardPoints || 0} pts
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="border rounded-lg p-8 text-center text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium mb-2">
                                {searchTerm ? 'No customers found' : 'No customers yet'}
                            </h3>
                            <p>
                                {searchTerm 
                                    ? 'Try adjusting your search criteria.' 
                                    : 'Customer data will appear here when users register.'
                                }
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AllCustomersPage;