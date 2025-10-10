"use client"

import { ElementType } from "react"
import { ChevronRight, CircleSmall, type LucideIcon } from "lucide-react"
import { IconProps } from "@/utils/types_interfaces/shared_types"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"



export function NavMenu({
  collapsibleItems,
  title,
  url,
  Icon,
}: {
  title: string;
  url?: string;
  Icon?: LucideIcon | ElementType<IconProps>;
  collapsibleItems: {
    title: string
    url: string
  }[];
}) {
  return (
    <>
      {collapsibleItems.length > 0 ?
        <Collapsible key={title} title={title} className="group/collapsible transition-all duration-200 ease-linear w-full">
          <SidebarGroup className="py-0.5 px-0">
            <SidebarGroupLabel asChild className="group/label">
              <CollapsibleTrigger className="hover:bg-[#4a4a57]/50 transition-all duration-100 ease-linear text-stone-300 text-shadow-sm shadow-cyan-500 text-[0.875rem] leading-5 font-medium">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{title}</span>
                </div>
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent className="pl-1 border-l-2 border-evoAdminAccent/70">
              <SidebarGroupContent className="flex flex-col gap-2 py-2">
                <SidebarMenu>
                  {collapsibleItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-[#4a4a57]/50 transition-all duration-100 ease-linear text-[0.75rem] text-stone-300 hover:text-stone-400">
                        <Link href={item.url || '/'} className="flex items-center gap-2">
                          <CircleSmall className="!size-2" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        :
        <SidebarMenu className="py-0.5">
          <SidebarMenuItem key={title}>
            <SidebarMenuButton asChild tooltip={title} className="hover:bg-[#4a4a57]/50 transition-all duration-100 ease-linear text-stone-300 hover:text-stone-300">
              <Link href={url || '/'} className="flex items-center gap-2 text-shadow-sm shadow-cyan-400">
                {Icon && <Icon className="!size-5" />}
                <span className="text-[0.75rem] leading-5 font-medium">{title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      }
    </>
  )
}
