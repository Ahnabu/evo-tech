"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HeroSectionDisplayType } from "@/schemas/admin/setupconfig/homepage/heroSection/heroSchema";
import HeroSectionTableRowActions from "@/components/admin/setup_config/homepage/comps/hero-section-table-row-actions";

export const getHeroSectionColumns = (): ColumnDef<HeroSectionDisplayType>[] => {
    return [
        {
            accessorKey: "title",
            header: () => <div className="text-left text-xs">Title</div>,
            cell: ({ row }) => (
                <div className="font-medium whitespace-nowrap text-xs">{row.getValue("title")}</div>
            ),
            enableHiding: false,
        },
        {
            accessorKey: "subtitle",
            header: () => <div className="text-left text-xs">Subtitle</div>,
            cell: ({ row }) => {
                const subtitle = row.getValue("subtitle") as string | null;
                return (
                    <div className="text-left font-[500] whitespace-nowrap truncate text-xs">
                        {subtitle || "-"}
                    </div>
                )
            },
        },
        {
            accessorKey: "button_text",
            header: () => <div className="text-left text-xs">Button Text</div>,
            cell: ({ row }) => {
                const buttonText = row.getValue("button_text") as string | null;
                return (
                    <div className="text-left font-[500] whitespace-nowrap truncate text-xs">
                        {buttonText || "-"}
                    </div>
                )
            },
        },
        {
            accessorKey: "button_url",
            header: () => <div className="text-left text-xs">Button URL</div>,
            cell: ({ row }) => {
                const buttonURL = row.getValue("button_url") as string | null;
                return (
                    <div className="text-left font-[500] whitespace-nowrap truncate text-xs">
                        {buttonURL || "-"}
                    </div>
                )
            },
        },
        {
            accessorKey: "sortorder",
            header: () => <div className="text-center text-xs">Sort Order</div>,
            cell: ({ row }) => {
                return (
                    <div className="text-center text-xs">{row.getValue("sortorder")}</div>
                )
            },
        },
        {
            accessorKey: "last_modified_at",
            header: () => <div className="text-center text-xs">Last Modified</div>,
            cell: ({ row }) => {
                const lastModified = row.getValue("last_modified_at") as string; // already formatted in the backend
                return (
                    <div className="text-center text-xs whitespace-nowrap">{lastModified}</div>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <HeroSectionTableRowActions row={row} />
                )
            },
        },
    ];
}
