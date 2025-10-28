"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { createAxiosClientWithSession } from "@/utils/axios/axiosClient";
import { Permission } from "@/schemas/admin/permissionSchema";

interface PermissionsContextType {
    permissions: string[]; // Array of permission codes
    permittedRoutes: string[]; // Array of permitted routes from session
    allPermissions: Permission[]; // Full permission objects with details
    hasPermission: (permissionCode: string) => boolean;
    hasAnyPermission: (permissionCodes: string[]) => boolean;
    hasAllPermissions: (permissionCodes: string[]) => boolean;
    hasRouteAccess: (route: string) => boolean;
    isLoading: boolean;
    refreshPermissions: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [permittedRoutes, setPermittedRoutes] = useState<string[]>([]);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshPermissions = useCallback(async () => {
        if (!session) {
            setPermissions([]);
            setPermittedRoutes([]);
            setAllPermissions([]);
            setIsLoading(false);
            return;
        }

        console.log('👤 Current session user:', {
            role: session.user?.role,
            permittedRoutes: session.user?.permittedRoutes,
            hasPermittedRoutes: !!session.user?.permittedRoutes && session.user.permittedRoutes.length > 0
        });

        // Admins have all permissions
        if (session.user?.role?.toUpperCase() === 'ADMIN') {
            try {
                const axiosInstance = createAxiosClientWithSession(session);
                const response = await axiosInstance.get("/permissions");
                
                if (response.data.success) {
                    const allPerms = response.data.data;
                    setAllPermissions(allPerms);
                    setPermissions(allPerms.map((p: Permission) => p.code));
                    // Admins have access to all routes
                    setPermittedRoutes(allPerms.map((p: Permission) => p.route).filter(Boolean));
                }
            } catch (error) {
                console.error("Error fetching all permissions:", error);
            }
            setIsLoading(false);
            return;
        }

        // For staff/employees, first try to use session data
        if (session.user?.permittedRoutes && session.user.permittedRoutes.length > 0) {
            setPermittedRoutes(session.user.permittedRoutes);
            console.log('📋 Staff permissions loaded from session:', session.user.permittedRoutes);
            // Still fetch full permission details for codes
            try {
                const axiosInstance = createAxiosClientWithSession(session);
                const response = await axiosInstance.get("/permissions/my-permissions");

                if (response.data.success) {
                    const perms = response.data.data.permissionCodes || [];
                    const fullPerms = response.data.data.permissions || [];
                    setPermissions(perms);
                    setAllPermissions(fullPerms);
                    console.log('✅ Staff permission codes:', perms);
                }
            } catch (error) {
                console.error("Error fetching permission details:", error);
            }
            setIsLoading(false);
            return;
        }

        // Fallback: fetch from API if not in session
        console.log('⚠️ No permissions in session, fetching from API');
        try {
            setIsLoading(true);
            const axiosInstance = createAxiosClientWithSession(session);
            console.log('📡 Calling /permissions/my-permissions...');
            const response = await axiosInstance.get("/permissions/my-permissions");

            console.log('📥 API Response:', response.data);
            if (response.data.success) {
                const perms = response.data.data.permissionCodes || [];
                const fullPerms = response.data.data.permissions || [];
                const routes = response.data.data.permittedRoutes || [];
                
                console.log('✅ Loaded from API:', {
                    permissionCodes: perms,
                    permittedRoutes: routes,
                    totalPermissions: fullPerms.length
                });
                
                setPermissions(perms);
                setAllPermissions(fullPerms);
                setPermittedRoutes(routes);
            }
        } catch (error: any) {
            console.error("❌ Error fetching permissions:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            setPermissions([]);
            setAllPermissions([]);
            setPermittedRoutes([]);
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

    const hasRouteAccess = useCallback((route: string): boolean => {
        // Admins always have access
        if (session?.user?.role?.toUpperCase() === 'ADMIN') return true;
        
        // Check if the route or a parent route is in permitted routes
        return permittedRoutes.some(permittedRoute => {
            // Exact match
            if (route === permittedRoute) return true;
            // Check if route starts with permitted route (for subroutes)
            if (route.startsWith(permittedRoute + '/')) return true;
            return false;
        });
    }, [permittedRoutes, session]);

    return (
        <PermissionsContext.Provider 
            value={{ 
                permissions, 
                permittedRoutes,
                allPermissions,
                hasPermission, 
                hasAnyPermission, 
                hasAllPermissions, 
                hasRouteAccess,
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
