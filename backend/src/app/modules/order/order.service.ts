import { Order, OrderItem } from "./order.model";
import { TOrder, TOrderItem } from "./order.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Cart } from "../cart/cart.model";
import { Product } from "../product/product.model";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${timestamp}-${random}`;
};

// Ensure returned order objects have both `firstname`/`lastname` (existing DB fields)
// and camelCase `firstName`/`lastName` so frontend consumers can use either.
export const normalizeOrderObject = (orderDoc: any) => {
  if (!orderDoc) return orderDoc;
  const obj = orderDoc.toObject ? orderDoc.toObject() : { ...orderDoc };
  // prefer existing camelCase if present, otherwise map from lowercase
  obj.firstName = obj.firstName || obj.firstname || "";
  obj.lastName = obj.lastName || obj.lastname || "";
  // also keep the original lowercase fields to avoid breaking consumers
  obj.firstname = obj.firstname || obj.firstName || "";
  obj.lastname = obj.lastname || obj.lastName || "";
  return obj;
};

const placeOrderIntoDB = async (payload: TOrder, userUuid: string) => {
  // Get cart items
  const cartItems = await Cart.find({ user: userUuid }).populate("product");

  if (!cartItems || cartItems.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  // Calculate totals
  let subtotal = 0;
  cartItems.forEach((item: any) => {
    subtotal += item.product.price * item.quantity;
  });

  // Generate order number
  payload.orderNumber = generateOrderNumber();
  payload.user = userUuid;
  payload.subtotal = subtotal;
  payload.totalPayable =
    subtotal +
    (payload.deliveryCharge || 0) +
    (payload.additionalCharge || 0) -
    (payload.discount || 0);

  // Create order
  const order = await Order.create(payload);

  // Create order items
  const orderItemsData = cartItems.map((item: any) => ({
    order: order._id,
    product: item.product._id,
    productName: item.product.name,
    productPrice: item.product.price,
    quantity: item.quantity,
    selectedColor: item.selectedColor,
    subtotal: item.product.price * item.quantity,
  }));

  await OrderItem.insertMany(orderItemsData);

  // Clear cart
  await Cart.deleteMany({ user: userUuid });

  // Get full order with items
  const fullOrder = await Order.findById(order._id);
  const orderItems = await OrderItem.find({ order: order._id }).populate(
    "product"
  );

  return {
    order: normalizeOrderObject(fullOrder),
    items: orderItems,
  };
};

const getUserOrdersFromDB = async (
  userUuid: string,
  query: Record<string, unknown>
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = { user: userUuid };

  if (query.orderStatus) {
    searchQuery.orderStatus = query.orderStatus;
  }

  if (query.paymentStatus) {
    searchQuery.paymentStatus = query.paymentStatus;
  }

  const result = await Order.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  let itemCountMap = new Map<string, { quantity: number; lines: number }>();
  if (result.length) {
    const orderIds = result
      .map((order) => order._id)
      .filter(Boolean)
      .map((id) =>
        typeof id === "string" ? new Types.ObjectId(id) : (id as Types.ObjectId)
      );

    if (orderIds.length) {
      const counts = await OrderItem.aggregate<{
        _id: Types.ObjectId;
        quantity: number;
        lines: number;
      }>([
        { $match: { order: { $in: orderIds } } },
        {
          $group: {
            _id: "$order",
            quantity: { $sum: "$quantity" },
            lines: { $sum: 1 },
          },
        },
      ]);

      itemCountMap = new Map(
        counts.map((entry) => [
          entry._id.toString(),
          { quantity: entry.quantity, lines: entry.lines },
        ])
      );
    }
  }

  const total = await Order.countDocuments(searchQuery);

  return {
    result: result.map((r) => {
      const normalized = normalizeOrderObject(r);
      const countInfo = itemCountMap.get(r._id?.toString?.() || "");
      return {
        ...normalized,
        itemsCount: countInfo?.quantity ?? 0,
        lineItemsCount: countInfo?.lines ?? 0,
      };
    }),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.$or = [
      { orderNumber: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { phone: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.orderStatus) {
    searchQuery.orderStatus = query.orderStatus;
  }

  if (query.paymentStatus) {
    searchQuery.paymentStatus = query.paymentStatus;
  }

  if (query.user) {
    searchQuery.user = query.user;
  }

  const result = await Order.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments(searchQuery);

  return {
    result: result.map((r) => normalizeOrderObject(r)),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleOrderFromDB = async (orderId: string, userUuid?: string) => {
  const query: any = { _id: orderId };
  if (userUuid) {
    query.user = userUuid;
  }

  const order = await Order.findOne(query);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  const orderItems = await OrderItem.find({ order: orderId }).populate(
    "product"
  );

  return {
    order: normalizeOrderObject(order),
    items: orderItems,
  };
};

const updateOrderStatusIntoDB = async (
  orderId: string,
  payload: Partial<TOrder>
) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  // If order is being marked as delivered, set deliveredAt
  if (payload.orderStatus === "delivered" && !order.deliveredAt) {
    payload.deliveredAt = new Date();
  }

  const result = await Order.findByIdAndUpdate(orderId, payload, {
    new: true,
  });

  return result;
};

const deleteOrderFromDB = async (orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Delete order items
  await OrderItem.deleteMany({ order: orderId });

  // Delete order
  const result = await Order.findByIdAndDelete(orderId);
  return result;
};

export const OrderServices = {
  placeOrderIntoDB,
  getUserOrdersFromDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderStatusIntoDB,
  deleteOrderFromDB,
};
