"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { createAxiosClientWithSession } from "@/utils/axios/axiosClient";
import { Permission } from "@/schemas/admin/permissionSchema";

interface PermissionsContextType {
    permissions: string[]; // Array of permission codes
    allPermissions: Permission[]; // Full permission objects with details
    hasPermission: (permissionCode: string) => boolean;
    hasAnyPermission: (permissionCodes: string[]) => boolean;
    hasAllPermissions: (permissionCodes: string[]) => boolean;
    isLoading: boolean;
    refreshPermissions: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshPermissions = useCallback(async () => {
        if (!session) {
            setPermissions([]);
            setAllPermissions([]);
            setIsLoading(false);
            return;
        }

        // Admins have all permissions
        if (session.user?.role?.toUpperCase() === 'ADMIN') {
            try {
                const axiosInstance = createAxiosClientWithSession(session);
                const response = await axiosInstance.get("/permissions");
                
                if (response.data.success) {
                    const allPerms = response.data.data;
                    setAllPermissions(allPerms);
                    setPermissions(allPerms.map((p: Permission) => p.code));
                }
            } catch (error) {
                console.error("Error fetching all permissions:", error);
            }
            setIsLoading(false);
            return;
        }

        // For staff/employees, fetch their assigned permissions
        try {
            setIsLoading(true);
            const axiosInstance = createAxiosClientWithSession(session);
            const response = await axiosInstance.get("/permissions/my-permissions");

            if (response.data.success) {
                const perms = response.data.data.permissionCodes || [];
                const fullPerms = response.data.data.permissions || [];
                setPermissions(perms);
                setAllPermissions(fullPerms);
            }
        } catch (error) {
            console.error("Error fetching permissions:", error);
            setPermissions([]);
            setAllPermissions([]);
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    useEffect(() => {
        refreshPermissions();
    }, [refreshPermissions]);

    const hasPermission = useCallback((permissionCode: string): boolean => {
        // Admins always have all permissions
        if (session?.user?.role?.toUpperCase() === 'ADMIN') return true;
        return permissions.includes(permissionCode);
    }, [permissions, session]);

    const hasAnyPermission = useCallback((permissionCodes: string[]): boolean => {
        // Admins always have all permissions
        if (session?.user?.role?.toUpperCase() === 'ADMIN') return true;
        return permissionCodes.some(code => permissions.includes(code));
    }, [permissions, session]);

    const hasAllPermissions = useCallback((permissionCodes: string[]): boolean => {
        // Admins always have all permissions
        if (session?.user?.role?.toUpperCase() === 'ADMIN') return true;
        return permissionCodes.every(code => permissions.includes(code));
    }, [permissions, session]);

    return (
        <PermissionsContext.Provider 
            value={{ 
                permissions, 
                allPermissions,
                hasPermission, 
                hasAnyPermission, 
                hasAllPermissions, 
                isLoading,
                refreshPermissions 
            }}
        >
            {children}
        </PermissionsContext.Provider>
    );
}

export function usePermissions() {
    const context = useContext(PermissionsContext);
    if (context === undefined) {
        throw new Error("usePermissions must be used within a PermissionsProvider");
    }
    return context;
}
