import { Order, OrderItem } from "./order.model";
import { TOrder, TOrderItem } from "./order.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Product } from "../product/product.model";
import { Types } from "mongoose";

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${timestamp}-${random}`;
};

// Generate unique tracking ID with date format: YYYYMMDD-XXXXX (8-10 digits)
const generateTrackingId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `${year}${month}${day}${random}`; // e.g., 2025111412345 (13 digits total)
};

// Normalize phone number: convert +8801234567890 to 01234567890
const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return phone;
  // Remove all spaces and dashes
  let normalized = phone.replace(/[\s-]/g, "");
  // If starts with +880, replace with 0
  if (normalized.startsWith("+880")) {
    normalized = "0" + normalized.slice(4);
  }
  // If starts with 880, replace with 0
  else if (normalized.startsWith("880")) {
    normalized = "0" + normalized.slice(3);
  }
  return normalized;
};

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

const placeOrderIntoDB = async (
  payload: TOrder & { items: any[] },
  userUuid: string
) => {
  const { items, ...orderData } = payload;

  // Cart is managed in frontend Redux, use items from request body
  if (!items || items.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  // Validate stock availability for all items
  for (const item of items) {
    const product = await Product.findById(item.item_id);
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, `Product not found`);
    }
    if (!product.inStock || (product.stock ?? 0) < item.item_quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Product "${product.name}" is out of stock or insufficient quantity available`
      );
    }
  }

  // Process items and create product details
  const productDetails = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.item_id);
      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, `Product not found`);
      }
      return {
        product,
        quantity: item.item_quantity,
        selectedColor: item.item_color || "",
        subtotal: product.price * item.item_quantity,
      };
    })
  );

  // Normalize phone number
  if (orderData.phone) {
    orderData.phone = normalizePhoneNumber(orderData.phone);
  }

  // Generate order number and tracking ID
  orderData.orderNumber = generateOrderNumber();
  orderData.trackingCode = generateTrackingId();
  orderData.user = userUuid;
  orderData.isGuest = false;

  // Use the subtotal and totalPayable sent from frontend
  console.log("✅ Using frontend-calculated values:", {
    subtotal: orderData.subtotal,
    totalPayable: orderData.totalPayable,
  });

  // Create order
  const order = await Order.create(orderData);

  // Create order items
  const orderItemsData = productDetails.map((detail) => ({
    order: order._id,
    product: detail.product._id,
    productName: detail.product.name,
    productPrice: detail.product.price,
    quantity: detail.quantity,
    selectedColor: detail.selectedColor,
    subtotal: detail.subtotal,
  }));

  await OrderItem.insertMany(orderItemsData);

  // Update product stock quantities
  for (const detail of productDetails) {
    await Product.findByIdAndUpdate(detail.product._id, {
      $inc: { stock: -detail.quantity },
    });
  }

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

// Guest checkout - no authentication required
const placeGuestOrderIntoDB = async (payload: TOrder & { items: any[] }) => {
  const { items, ...orderData } = payload;

  if (!items || items.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  if (!orderData.email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Email is required for guest checkout"
    );
  }

  // Validate stock availability for all items
  for (const item of items) {
    const product = await Product.findById(item.item_id || item.product);
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, `Product not found`);
    }
    if (!product.inStock || (product.stock && product.stock < item.quantity)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Product "${product.name}" is out of stock or insufficient quantity available`
      );
    }
  }

  console.log("📦 Backend received order data:", {
    subtotal: orderData.subtotal,
    totalPayable: orderData.totalPayable,
    deliveryCharge: orderData.deliveryCharge,
    additionalCharge: orderData.additionalCharge,
    discount: orderData.discount,
    itemsCount: items.length,
  });

  // Process items and create product details
  const productDetails = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.item_id || item.product);
      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, `Product not found`);
      }
      const itemTotal = product.price * (item.item_quantity || item.quantity);
      return {
        product,
        quantity: item.item_quantity || item.quantity,
        selectedColor: item.item_color || item.selectedColor,
        subtotal: itemTotal,
      };
    })
  );

  // Normalize phone number
  if (orderData.phone) {
    orderData.phone = normalizePhoneNumber(orderData.phone);
  }

  // Generate order number and tracking ID
  orderData.orderNumber = generateOrderNumber();
  orderData.trackingCode = generateTrackingId();
  orderData.isGuest = true;
  orderData.guestEmail = orderData.email;

  // Use the subtotal and totalPayable sent from frontend (already calculated correctly)
  // Don't recalculate here to avoid discrepancies
  console.log("✅ Using frontend-calculated values:", {
    subtotal: orderData.subtotal,
    totalPayable: orderData.totalPayable,
  });

  // Create order
  const order = await Order.create(orderData);

  // Create order items
  const orderItemsData = productDetails.map((detail) => ({
    order: order._id,
    product: detail.product._id,
    productName: detail.product.name,
    productPrice: detail.product.price,
    quantity: detail.quantity,
    selectedColor: detail.selectedColor,
    subtotal: detail.subtotal,
  }));

  await OrderItem.insertMany(orderItemsData);

  // Update product stock quantities
  for (const detail of productDetails) {
    await Product.findByIdAndUpdate(detail.product._id, {
      $inc: { stock: -detail.quantity },
    });
  }

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

// Link guest orders to user account when they register/login
const linkGuestOrdersToUserIntoDB = async (email: string, userUuid: string) => {
  // Find all guest orders with this email
  const guestOrders = await Order.find({
    guestEmail: email,
    isGuest: true,
  });

  if (guestOrders.length === 0) {
    return { linked: 0, orders: [] };
  }

  // Update all guest orders to link them to the user
  await Order.updateMany(
    { guestEmail: email, isGuest: true },
    {
      $set: {
        user: userUuid,
        isGuest: false,
      },
    }
  );

  return {
    linked: guestOrders.length,
    orders: guestOrders.map((o) => o.orderNumber),
  };
};

// Track order by tracking code - public endpoint (no auth required)
const trackOrderByTrackingCode = async (trackingCode: string) => {
  const order = await Order.findOne({ trackingCode }).lean();

  if (!order) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Order not found with this tracking code"
    );
  }

  // Get order items
  const orderItems = await OrderItem.find({ order: order._id })
    .populate("product", "name price images")
    .lean();

  // Return sanitized order info (hide sensitive customer details for public access)
  return {
    order: {
      orderNumber: order.orderNumber,
      trackingCode: order.trackingCode,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      shippingType: order.shippingType,
      city: order.city,
      subtotal: order.subtotal,
      discount: order.discount,
      deliveryCharge: order.deliveryCharge,
      additionalCharge: order.additionalCharge,
      totalPayable: order.totalPayable,
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt,
      // Partially mask sensitive info
      customerName: `${order.firstname} ${order.lastname?.charAt(0)}***`,
      phone: order.phone
        ? `${order.phone.slice(0, 3)}****${order.phone.slice(-2)}`
        : "",
    },
    items: orderItems.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      subtotal: item.subtotal,
      product: item.product,
    })),
  };
};

export const OrderServices = {
  placeOrderIntoDB,
  placeGuestOrderIntoDB,
  linkGuestOrdersToUserIntoDB,
  getUserOrdersFromDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderStatusIntoDB,
  deleteOrderFromDB,
  trackOrderByTrackingCode,
};
