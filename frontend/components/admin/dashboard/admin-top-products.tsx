"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Package } from "lucide-react";

interface TopProduct {
    id: string;
    name: string;
    image: string;
    price: number;
    sales: number;
    revenue: number;
    category: string;
    inStock: number;
}

export function AdminTopProducts() {
    const [products, setProducts] = useState<TopProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopProducts();
    }, []);

    const fetchTopProducts = async () => {
        try {
            setLoading(true);
            // Use client-side axios with session token
            const createAxiosClient = (await import('@/utils/axios/axiosClient')).default;
            const axiosInstance = await createAxiosClient();
            
            const response = await axiosInstance.get('/api/v1/dashboard/top-products');
            
            if (response.data.success) {
                setProducts(response.data.data || []);
            } else {
                throw new Error(response.data.message || 'Failed to fetch top products');
            }
        } catch (error) {
            console.error("Error fetching top products:", error);
            // Fallback to mock data
            const mockProducts: TopProduct[] = [
                {
                    id: "1",
                    name: "3D Printer Pro Max",
                    image: "/api/placeholder/60/60",
                    price: 599.99,
                    sales: 45,
                    revenue: 26999.55,
                    category: "3D Printers",
                    inStock: 12
                },
                {
                    id: "2", 
                    name: "Arduino Starter Kit",
                    image: "/api/placeholder/60/60",
                    price: 89.99,
                    sales: 78,
                    revenue: 7019.22,
                    category: "Electronics",
                    inStock: 25
                },
                {
                    id: "3",
                    name: "Raspberry Pi 5",
                    image: "/api/placeholder/60/60",
                    price: 129.99,
                    sales: 52,
                    revenue: 6759.48,
                    category: "Single Board Computers",
                    inStock: 8
                },
                {
                    id: "4",
                    name: "Filament Bundle Pack",
                    image: "/api/placeholder/60/60",
                    price: 199.99,
                    sales: 33,
                    revenue: 6599.67,
                    category: "3D Printing Supplies",
                    inStock: 15
                },
                {
                    id: "5",
                    name: "Smart Home Sensor Kit",
                    image: "/api/placeholder/60/60",
                    price: 149.99,
                    sales: 28,
                    revenue: 4199.72,
                    category: "IoT Devices",
                    inStock: 20
                }
            ];
            setProducts(mockProducts);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return `৳${new Intl.NumberFormat('en-US', {
            minimumIntegerDigits: 1,
            maximumFractionDigits: 0,
        }).format(amount)}`;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Top Products</CardTitle>
                <Link 
                    href="/control/products" 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    View All
                </Link>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-3 animate-pulse">
                                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {products.map((product, index) => (
                            <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                                    {index + 1}
                                </div>
                                
                                <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                                    <Package className="w-6 h-6 text-gray-400 absolute inset-0 m-auto" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Link 
                                            href={`/control/products/${product.id}`}
                                            className="font-medium text-sm hover:text-blue-600 truncate"
                                        >
                                            {product.name}
                                        </Link>
                                        {product.inStock < 10 && (
                                            <Badge variant="destructive" className="text-xs">
                                                Low Stock
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {product.category} • {product.inStock} in stock
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                                        <TrendingUp className="w-3 h-3" />
                                        {product.sales} sold
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatCurrency(product.revenue)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}