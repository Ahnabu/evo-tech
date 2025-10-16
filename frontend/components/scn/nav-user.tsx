"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { BsPerson, BsGear } from "react-icons/bs";
import { Avatar } from "@nextui-org/avatar";
import { getNameInitials } from "@/utils/essential_functions";
import { Button } from "../ui/button";
import useDebounce from "@rooks/use-debounce";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";




export const NavUser = ({ currentUser }: { currentUser: any }) => {
  const { isMobile } = useSidebar()

  const handleSignOutDebounced = useDebounce(async () => {
    try {
      // won't redirect anywhere and the page won't reload, middleware will handle redirection for protected routes.
      await signOut({
        redirectTo: "/et-admin/auth/sign-in",
      });
      toast.success("You signed out of your account.");
    } catch (err) {
      toast.error("Something went wrong while signing out.");
    }
  }, 200);

  if (!currentUser) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="custom"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-within:ring-0 bg-stone-200"
            >
              <div className="w-full flex justify-center items-center gap-1.5">
                <Avatar
                  aria-label="user avatar"
                  showFallback
                  name={getNameInitials(`${currentUser.firstName} ${currentUser.lastName ?? ""}`)}
                  radius="full"
                  classNames={{
                    base: "w-6 h-6 bg-[#f5f5f4] box-border border-0 outline-0 ring-1 ring-[#a8a8a8] group-hover:ring-[#0866ff] cursor-pointer transition duration-200",
                    name: "text-[#292524] text-[11px] leading-3 tracking-tight font-[600]",
                    icon: "w-5 h-5 text-[#292524]",
                  }}
                />
                <div className="grid flex-1 font-inter text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{`${currentUser.firstName} ${currentUser.lastName ?? ""}`}</span>
                  <span className="truncate text-xs">{currentUser.email}</span>
                </div>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup className="py-2">
              <DropdownMenuItem className="hover:!bg-stone-200 transition-colors duration-100 ease-in">
                <BsPerson />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:!bg-stone-200 transition-colors duration-100 ease-in">
                <BsGear />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-stone-300" />
            <DropdownMenuItem asChild>
              <Button
                variant="secondary"
                onClick={handleSignOutDebounced as React.MouseEventHandler<HTMLButtonElement>}
                className="w-full flex justify-start py-2 hover:!bg-stone-200 transition-colors duration-100 ease-in"
              >
                <LogOut />
                Log out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
