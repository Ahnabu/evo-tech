import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";

const placeOrder = catchAsync(async (req, res) => {
  const userUuid = req.user.uuid;
  const result = await OrderServices.placeOrderIntoDB(req.body, userUuid);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order placed successfully",
    data: result,
  });
});

const getUserOrders = catchAsync(async (req, res) => {
  const userUuid = req.user.uuid;
  const orders = await OrderServices.getUserOrdersFromDB(userUuid, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders Retrieved Successfully",
    data: orders.result,
    meta: orders.meta,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  console.log('📦 getAllOrders called with query:', req.query);
  const orders = await OrderServices.getAllOrdersFromDB(req.query);
  console.log('📦 Returning', orders.result?.length || 0, 'orders');

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders Retrieved Successfully",
    data: orders.result,
    meta: orders.meta,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userUuid = req.user?.uuid;
  const isAdmin = req.user?.role === "admin";

  const order = await OrderServices.getSingleOrderFromDB(
    id,
    isAdmin ? undefined : userUuid
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order Retrieved Successfully",
    data: order,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderServices.updateOrderStatusIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status updated successfully",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  await OrderServices.deleteOrderFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order deleted successfully",
    data: null,
  });
});

export const OrderControllers = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
};
