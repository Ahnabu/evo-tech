"use client";

import { useEffect, useMemo } from "react";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useSearchParamsState } from "@/hooks/use-search-params-state";

const orderFilterSchema = z.object({
  search: z.string().optional(),
  order_status: z.string().optional(),
  payment_status: z.string().optional(),
});

type OrderFilterValues = z.infer<typeof orderFilterSchema>;

const OrdersHeaderClient = () => {
  const { updateSearchParams, resetSearchParams, getParam } = useSearchParamsState({
    basePath: "/control/orders",
  });

  // Memoize default values to prevent unnecessary re-renders
  const defaultValues = useMemo(() => ({
    search: getParam("search"),
    order_status: getParam("order_status"),
    payment_status: getParam("payment_status"),
  }), [getParam]);

  const form = useForm<OrderFilterValues>({
    resolver: zodResolver(orderFilterSchema),
    defaultValues,
  });

  // Update form values when search params change
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleExport = () => {
    // This would generate and download a CSV/Excel file
    toast.error("functionality not implemented yet");
  };

  const onSubmit = (data: OrderFilterValues) => {
    updateSearchParams({
      search: data.search || null,
      order_status: data.order_status || null,
      payment_status: data.payment_status || null,
    });
  };

  const handleReset = () => {
    // Reset filter form values
    form.reset({
      search: "",
      order_status: "",
      payment_status: "",
    });

    // Reset all search params
    resetSearchParams();
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-4 items-end xl:items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col xl:flex-row gap-4 items-end xl:items-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, phone, or ID"
                        className="pl-8 text-xs placeholder:text-stone-400 placeholder:text-xs"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order_status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder={<span className="text-stone-400 text-xs">Select order status</span>} />
                      </SelectTrigger>
                      <SelectContent>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs bg-stone-500/10 text-rose-500 mb-2"
                          onClick={() => {
                            field.onChange("");
                          }}
                        >
                          Clear
                        </Button>
                        <SelectItem value="placed">Placed</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="picked_up">Picked Up</SelectItem>
                        <SelectItem value="on_the_way">On The Way</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder={<span className="text-stone-400 text-xs">Select payment status</span>} />
                      </SelectTrigger>
                      <SelectContent>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs bg-stone-500/10 text-rose-500 mb-2"
                          onClick={() => {
                            field.onChange("");
                          }}
                        >
                          Clear
                        </Button>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 items-center">
            <Button type="submit" size="sm" aria-label="filter orders">
              Filter
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleReset}
              aria-label="reset filters"
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>

      <Button
        variant="outline"
        size="sm"
        className="whitespace-nowrap"
        onClick={handleExport}
        aria-label="export button for orders"
      >
        <Download className="mr-0.5 size-4" />
        Export
      </Button>
    </div>
  );
};

export { OrdersHeaderClient };
