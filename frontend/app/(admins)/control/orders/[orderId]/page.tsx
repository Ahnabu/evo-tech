import { currentRouteProps } from "@/utils/types_interfaces/shared_types";
import { OrderWithItemsType } from "@/schemas/admin/sales/orderSchema";
import axiosIntercept from "@/utils/axios/axiosIntercept";
import axiosErrorLogger from "@/components/error/axios_error";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import OrderInfo from "@/components/admin/orders/order-info";
import { OrderDetailsHeader } from "@/components/admin/orders/order-details-header";


const getOrderDetails = async (orderId: string): Promise<OrderWithItemsType | null> => {
  const axioswithIntercept = await axiosIntercept();

  noStore();
  const orderData = await axioswithIntercept.get(`/orders/${orderId}`)
    .then((res) => res.data.order_data)
    .catch((error: any) => {
      axiosErrorLogger({ error });
      return null;
    });

  return orderData;
};


const AdminOrderDetailsPage = async ({ params }: currentRouteProps) => {
  const { orderId } = await params;
  const orderData = await getOrderDetails(orderId);

  if (!orderData) {
    notFound();
  }

  return (
    <div className="w-full h-full flex flex-col px-5 md:px-7 py-6 font-inter">
      <div className="w-full h-full flex flex-col gap-6">
        {/* Page Header */}
        <OrderDetailsHeader order={orderData} />

        <OrderInfo orderData={orderData} />
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
