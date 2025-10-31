"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { createAxiosClientWithSession } from "@/utils/axios/axiosClient";

interface PendingOrdersContextType {
    pendingCount: number;
    refreshPendingCount: () => Promise<void>;
    isLoading: boolean;
}

const PendingOrdersContext = createContext<PendingOrdersContextType | undefined>(undefined);

export function PendingOrdersProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [pendingCount, setPendingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const refreshPendingCount = useCallback(async () => {
        if (!session) {
            setPendingCount(0);
            setIsLoading(false);
            return;
        }

        // Only fetch pending orders for admin/staff roles
        const userRole = session.user?.role?.toUpperCase();
        if (userRole !== 'ADMIN' && userRole !== 'EMPLOYEE') {
            setPendingCount(0);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const axiosInstance = createAxiosClientWithSession(session);
            const response = await axiosInstance.get("/dashboard/pending-orders-count");

            if (response.data.success) {
                setPendingCount(response.data.data.count || 0);
            }
        } catch (error) {
            console.error("Error fetching pending orders count:", error);
            setPendingCount(0);
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    // Fetch pending count on mount and when session changes
    useEffect(() => {
        refreshPendingCount();
    }, [refreshPendingCount]);

    // Poll for updates every 30 seconds
    useEffect(() => {
        if (!session) return;

        const interval = setInterval(() => {
            refreshPendingCount();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [session, refreshPendingCount]);

    return (
        <PendingOrdersContext.Provider value={{ pendingCount, refreshPendingCount, isLoading }}>
            {children}
        </PendingOrdersContext.Provider>
    );
}

export function usePendingOrders() {
    const context = useContext(PendingOrdersContext);
    if (context === undefined) {
        throw new Error("usePendingOrders must be used within a PendingOrdersProvider");
    }
    return context;
}
