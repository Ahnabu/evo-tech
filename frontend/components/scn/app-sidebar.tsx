"use client"

import * as React from "react";
import Image from "next/image";
import { adminSidebarMenus, adminSecondarySidebarMenus } from "@/dal/staticdata/admin_sidebar_menus";
import { NavUser } from "@/components/scn/nav-user";

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



export const AppSidebar = ({ userSession, ...props }: { userSession: any; } & React.ComponentProps<typeof Sidebar>) => {

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
              {`Evo-TechBD`}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="scrollbar-custom gap-0.5">
        {
          adminSidebarMenus.map((mainMenu, idx) => (
            <NavMenu
              key={`${mainMenu.title}-${idx}`}
              title={mainMenu.title}
              url={mainMenu.url}
              Icon={mainMenu.icon}
              collapsibleItems={mainMenu.collapsibleItems}
            />
          ))
        }
        <SidebarGroup className="mt-auto px-0">
          <SidebarGroupContent>
            {
              adminSecondarySidebarMenus.map((secondaryMenu, idx) => (
                <NavMenu
                  key={`${secondaryMenu.title}-${idx}`}
                  title={secondaryMenu.title}
                  url={secondaryMenu.url}
                  Icon={secondaryMenu.icon}
                  collapsibleItems={secondaryMenu.collapsibleItems}
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
