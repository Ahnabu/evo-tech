"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '@/store/store';
import { setProductsList } from "@/store/slices/productSlice";
import { ProductDisplayType } from "@/schemas/admin/product/productschemas";
import { ServerSidePaginationProps } from "@/utils/types_interfaces/data-table-props";
import axios from "axios";

interface PaginationData {
    current_page: number;
    last_page: number;
    total_items: number;
    per_page: number;
}

interface UseProductsDataReturn {
    products: ProductDisplayType[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    paginationData: PaginationData | null;
    serverSidePagination: ServerSidePaginationProps | null;
}

export function useProductsData(): UseProductsDataReturn {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paginationData, setPaginationData] = useState<PaginationData | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const products = useSelector((state: RootState) => state.products.allProducts);
    const dispatch = useDispatch<AppDispatch>();

    const fetchProducts = useCallback(async () => {

        try {
            setIsLoading(true);
            setError(null);

            // Build query string from search params
            const queryParams = new URLSearchParams();

            const search = searchParams.get('search');
            const category = searchParams.get('category');
            const subcategory = searchParams.get('subcategory');
            const brand = searchParams.get('brand');
            const page = searchParams.get('page');
            const limit = searchParams.get('limit');

            if (search) queryParams.set('search', search);
            if (category) queryParams.set('category', category);
            if (subcategory) queryParams.set('subcategory', subcategory);
            if (brand) queryParams.set('brand', brand);
            if (page) queryParams.set('page', page);
            if (limit) queryParams.set('limit', limit);

            const queryString = queryParams.toString();

            const response = await axios.get(
                `/api/admin/products${queryString ? `?${queryString}` : ""}`
            );

            const productsData = response.data.items_data;
            const pagination: PaginationData = {
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total_items: response.data.total_items,
                per_page: response.data.per_page,
            };

            dispatch(setProductsList(productsData));
            setPaginationData(pagination);
        } catch (error: any) {
            setError('Failed to fetch products.');
            dispatch(setProductsList([]));
            setPaginationData(null);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams, dispatch]);

    // Handle page change
    const handlePageChange = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    }, [searchParams, router, pathname]);

    // Handle page size change
    const handlePageSizeChange = useCallback((pageSize: number) => {
        const params = new URLSearchParams(searchParams);
        // remove the limit for default page size
        if (pageSize === 10) {
            params.delete('limit');
        } else {
            params.set('limit', pageSize.toString());
        }
        params.set('page', '1'); // Reset to first page when changing page size
        router.replace(`${pathname}?${params.toString()}`); // use replace instead of push for page size change
    }, [searchParams, router, pathname]);

    // Create server-side pagination props
    const serverSidePagination: ServerSidePaginationProps | null = paginationData ? {
        pageCount: paginationData.last_page,
        currentPage: paginationData.current_page,
        totalRecords: paginationData.total_items,
        pageSize: paginationData.per_page,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
        isLoading: isLoading,
    } : null;

    // Fetch products on mount and when search params change
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        isLoading,
        error,
        refetch: fetchProducts,
        paginationData,
        serverSidePagination,
    };
}
