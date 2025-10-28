"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useState } from "react";
import { toast } from "sonner";

export function RefreshPermissionsButton() {
    const { refreshPermissions } = usePermissions();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshPermissions();
            toast.success("Permissions refreshed!");
        } catch (error) {
            toast.error("Failed to refresh permissions");
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
        >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Permissions
        </Button>
    );
}
