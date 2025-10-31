"use client"

import * as React from "react";
import Image from "next/image";
import { adminSidebarMenus, adminSecondarySidebarMenus } from "@/dal/staticdata/admin_sidebar_menus";
import { staffSidebarMenus, staffSecondarySidebarMenus } from "@/dal/staticdata/staff_sidebar_menus";
import { userSidebarMenus, userSecondarySidebarMenus } from "@/dal/staticdata/user_sidebar_menus";
import { NavUser } from "@/components/scn/nav-user";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { usePermissions } from "@/contexts/PermissionsContext";
import { toast } from "sonner";

import BrandIcon from "@/public/assets/brand_icon.png";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { NavMenu } from "@/components/scn/nav-menu";



export const AppSidebar = ({ 
  userSession, 
  isStaffMode = false,
  ...props 
}: { 
  userSession: any; 
  isStaffMode?: boolean;
} & React.ComponentProps<typeof Sidebar>) => {

  // Determine user role
  const userRole = userSession?.role?.toUpperCase();
  const isUser = userRole === 'USER';
  
  // Use appropriate menus based on user role
  let sidebarMenus;
  let secondarySidebarMenus;
  
  if (isUser) {
    sidebarMenus = userSidebarMenus;
    secondarySidebarMenus = userSecondarySidebarMenus;
  } else if (isStaffMode) {
    sidebarMenus = staffSidebarMenus;
    secondarySidebarMenus = staffSecondarySidebarMenus;
  } else {
    sidebarMenus = adminSidebarMenus;
    secondarySidebarMenus = adminSecondarySidebarMenus;
  }
  
  const { refreshPermissions } = usePermissions();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshPermissions = async () => {
    setIsRefreshing(true);
    try {
      await refreshPermissions();
      toast.success("Permissions refreshed successfully!");
    } catch (error) {
      toast.error("Failed to refresh permissions");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" {...props} className="bg-stone-900 text-white">
      <SidebarHeader>
        <div className="w-full flex items-center py-3 bg-stone-800 rounded-md">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image
              src={BrandIcon}
              alt="Evo-TechBD icon"
              width={20}
              height={20}
              quality={100}
              draggable="false"
              className="size-5 object-contain"
              priority
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight text-stone-200">
            <span className="truncate font-bold">
              {isUser ? "My Dashboard" : (isStaffMode ? "Staff Portal" : "Evo-TechBD")}
            </span>
          </div>
        </div>
        {(isStaffMode || !isUser) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshPermissions}
            disabled={isRefreshing}
            className="w-full mt-2 bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-200"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Permissions'}
          </Button>
        )}
      </SidebarHeader>
      <SidebarContent className="scrollbar-custom gap-0.5">
        {
          sidebarMenus.map((mainMenu, idx) => (
            <NavMenu
              key={`${mainMenu.title}-${idx}`}
              title={mainMenu.title}
              url={mainMenu.url}
              Icon={mainMenu.icon}
              collapsibleItems={mainMenu.collapsibleItems}
              permissions={mainMenu.permissions}
            />
          ))
        }
        <SidebarGroup className="mt-auto px-0">
          <SidebarGroupContent>
            {
              secondarySidebarMenus.map((secondaryMenu, idx) => (
                <NavMenu
                  key={`${secondaryMenu.title}-${idx}`}
                  title={secondaryMenu.title}
                  url={secondaryMenu.url}
                  Icon={secondaryMenu.icon}
                  collapsibleItems={secondaryMenu.collapsibleItems}
                  permissions={secondaryMenu.permissions}
                />
              ))
            }
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-0">
        <NavUser currentUser={userSession} />
      </SidebarFooter>
    </Sidebar>
  )
}
