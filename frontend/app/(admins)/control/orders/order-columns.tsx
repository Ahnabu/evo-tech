"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { OrderWithItemsType } from "@/schemas/admin/sales/orderSchema";
import OrderTableRowActions from "@/components/admin/orders/comps/order-table-row-actions";


export const ordersColumns: ColumnDef<OrderWithItemsType>[] = [
  {
    accessorKey: "orderid",
    header: () => <div>Order ID</div>,
    cell: ({ row }) => {
      const orderId = row.getValue("orderid") as string;
      const viewed = row.original.viewed as boolean;
      return (
        <div>
          <Link
            href={`/control/orders/${orderId}`}
            className={`text-primary text-xs hover:underline hover:underline-offset-2 flex items-center ${!viewed ? 'font-extrabold' : 'font-medium'}`}
          >
            {orderId}
            {!viewed &&
              (<div className="ml-1.5 size-1.5 bg-emerald-500/85 rounded-full"></div>)
            }
          </Link>
        </div>
      );
    },
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const rowdata = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-[0.625rem] leading-tight whitespace-nowrap">
            {`Name: ${rowdata.firstName}${rowdata.lastName ? ` ${rowdata.lastName}` : ''}`}
          </span>
          {rowdata.email ? <span className="text-[0.625rem] text-muted-foreground whitespace-nowrap">Email: {rowdata.email}</span>
            : <span className="text-[0.625rem] text-muted-foreground">Email: --</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "total_payable",
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_payable") as string);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "BDT",
      }).format(amount);

      return <div className="text-xs font-medium whitespace-nowrap">{formatted}</div>;
    },
  },
  {
    accessorKey: "order_status",
    header: "Order Status",
    cell: ({ row }) => {
      const status = row.getValue("order_status") as string;

      // Define badge styles based on status
      const getBadgeVariant = (status: string) => {
        switch (status) {
          case "placed":
            return "customdefault";
          case "confirmed":
            return "inprogress";
          case "picked_up":
            return "inprogress";
          case "on_the_way":
            return "warning";
          case "delivered":
            return "success";
          case "cancelled":
            return "failed";
          default:
            return "customdefault";
        }
      };

      return (
        <Badge
          variant={getBadgeVariant(status) as any}
          className={`capitalize whitespace-nowrap`}
        >
          {status.replaceAll('_', ' ')}
        </Badge>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
    cell: ({ row }) => {
      const method = row.getValue("payment_method") as string;
      return <div className="capitalize text-xs whitespace-nowrap">{method.replaceAll('_', ' ')}</div>;
    },
  },
  {
    accessorKey: "shipping_type",
    header: () => <div>Shipping Type</div>,
    cell: ({ row }) => {
      const shippingType = row.getValue("shipping_type") as string;

      return <div className="text-xs capitalize whitespace-nowrap">{shippingType.replaceAll('_', ' ')}</div>;
    },
  },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.getValue("payment_status") as string;

      // Define badge styles based on status
      const getBadgeVariant = (status: string) => {
        switch (status) {
          case "paid":
            return "success";
          case "pending":
            return "failed";
          case "refunded":
            return "warning";
          case "partial":
            return "failed";
          default:
            return "default";
        }
      };

      return (
        <Badge
          variant={getBadgeVariant(status) as any}
          className="capitalize whitespace-nowrap"
        >
          {status.replace('_', ' ')}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {

      return (
        <OrderTableRowActions row={row} />
      )
    },
  },
];
