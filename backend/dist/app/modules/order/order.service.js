"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = exports.normalizeOrderObject = void 0;
const order_model_1 = require("./order.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const product_model_1 = require("../product/product.model");
const mongoose_1 = require("mongoose");
const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
    return `ORD-${timestamp}-${random}`;
};
// Normalize phone number: convert +8801234567890 to 01234567890
const normalizePhoneNumber = (phone) => {
    if (!phone)
        return phone;
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
const normalizeOrderObject = (orderDoc) => {
    if (!orderDoc)
        return orderDoc;
    const obj = orderDoc.toObject ? orderDoc.toObject() : { ...orderDoc };
    // prefer existing camelCase if present, otherwise map from lowercase
    obj.firstName = obj.firstName || obj.firstname || "";
    obj.lastName = obj.lastName || obj.lastname || "";
    // also keep the original lowercase fields to avoid breaking consumers
    obj.firstname = obj.firstname || obj.firstName || "";
    obj.lastname = obj.lastname || obj.lastName || "";
    return obj;
};
exports.normalizeOrderObject = normalizeOrderObject;
const placeOrderIntoDB = async (payload, userUuid) => {
    const { items, ...orderData } = payload;
    // Cart is managed in frontend Redux, use items from request body
    if (!items || items.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cart is empty");
    }
    // Validate stock availability for all items
    for (const item of items) {
        const product = await product_model_1.Product.findById(item.item_id);
        if (!product) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product not found`);
        }
        if (!product.inStock || (product.stock ?? 0) < item.item_quantity) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Product "${product.name}" is out of stock or insufficient quantity available`);
        }
    }
    // Process items and create product details
    const productDetails = await Promise.all(items.map(async (item) => {
        const product = await product_model_1.Product.findById(item.item_id);
        if (!product) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product not found`);
        }
        return {
            product,
            quantity: item.item_quantity,
            selectedColor: item.item_color || "",
            subtotal: product.price * item.item_quantity,
        };
    }));
    // Normalize phone number
    if (orderData.phone) {
        orderData.phone = normalizePhoneNumber(orderData.phone);
    }
    // Generate order number
    orderData.orderNumber = generateOrderNumber();
    orderData.user = userUuid;
    orderData.isGuest = false;
    // Use the subtotal and totalPayable sent from frontend
    console.log("✅ Using frontend-calculated values:", {
        subtotal: orderData.subtotal,
        totalPayable: orderData.totalPayable,
    });
    // Create order
    const order = await order_model_1.Order.create(orderData);
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
    await order_model_1.OrderItem.insertMany(orderItemsData);
    // Update product stock quantities
    for (const detail of productDetails) {
        await product_model_1.Product.findByIdAndUpdate(detail.product._id, {
            $inc: { stock: -detail.quantity },
        });
    }
    // Get full order with items
    const fullOrder = await order_model_1.Order.findById(order._id);
    const orderItems = await order_model_1.OrderItem.find({ order: order._id }).populate("product");
    return {
        order: (0, exports.normalizeOrderObject)(fullOrder),
        items: orderItems,
    };
};
const getUserOrdersFromDB = async (userUuid, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = { user: userUuid };
    if (query.orderStatus) {
        searchQuery.orderStatus = query.orderStatus;
    }
    if (query.paymentStatus) {
        searchQuery.paymentStatus = query.paymentStatus;
    }
    const result = await order_model_1.Order.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();
    let itemCountMap = new Map();
    if (result.length) {
        const orderIds = result
            .map((order) => order._id)
            .filter(Boolean)
            .map((id) => typeof id === "string" ? new mongoose_1.Types.ObjectId(id) : id);
        if (orderIds.length) {
            const counts = await order_model_1.OrderItem.aggregate([
                { $match: { order: { $in: orderIds } } },
                {
                    $group: {
                        _id: "$order",
                        quantity: { $sum: "$quantity" },
                        lines: { $sum: 1 },
                    },
                },
            ]);
            itemCountMap = new Map(counts.map((entry) => [
                entry._id.toString(),
                { quantity: entry.quantity, lines: entry.lines },
            ]));
        }
    }
    const total = await order_model_1.Order.countDocuments(searchQuery);
    return {
        result: result.map((r) => {
            const normalized = (0, exports.normalizeOrderObject)(r);
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
const getAllOrdersFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = {};
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
    const result = await order_model_1.Order.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const total = await order_model_1.Order.countDocuments(searchQuery);
    return {
        result: result.map((r) => (0, exports.normalizeOrderObject)(r)),
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const getSingleOrderFromDB = async (orderId, userUuid) => {
    const query = { _id: orderId };
    if (userUuid) {
        query.user = userUuid;
    }
    const order = await order_model_1.Order.findOne(query);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    const orderItems = await order_model_1.OrderItem.find({ order: orderId }).populate("product");
    return {
        order: (0, exports.normalizeOrderObject)(order),
        items: orderItems,
    };
};
const updateOrderStatusIntoDB = async (orderId, payload) => {
    const order = await order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    // If order is being marked as delivered, set deliveredAt
    if (payload.orderStatus === "delivered" && !order.deliveredAt) {
        payload.deliveredAt = new Date();
    }
    const result = await order_model_1.Order.findByIdAndUpdate(orderId, payload, {
        new: true,
    });
    return result;
};
const deleteOrderFromDB = async (orderId) => {
    const order = await order_model_1.Order.findById(orderId);
    if (!order) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    // Delete order items
    await order_model_1.OrderItem.deleteMany({ order: orderId });
    // Delete order
    const result = await order_model_1.Order.findByIdAndDelete(orderId);
    return result;
};
// Guest checkout - no authentication required
const placeGuestOrderIntoDB = async (payload) => {
    const { items, ...orderData } = payload;
    if (!items || items.length === 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cart is empty");
    }
    if (!orderData.email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Email is required for guest checkout");
    }
    // Validate stock availability for all items
    for (const item of items) {
        const product = await product_model_1.Product.findById(item.item_id || item.product);
        if (!product) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product not found`);
        }
        if (!product.inStock || (product.stock && product.stock < item.quantity)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Product "${product.name}" is out of stock or insufficient quantity available`);
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
    const productDetails = await Promise.all(items.map(async (item) => {
        const product = await product_model_1.Product.findById(item.item_id || item.product);
        if (!product) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `Product not found`);
        }
        const itemTotal = product.price * (item.item_quantity || item.quantity);
        return {
            product,
            quantity: item.item_quantity || item.quantity,
            selectedColor: item.item_color || item.selectedColor,
            subtotal: itemTotal,
        };
    }));
    // Normalize phone number
    if (orderData.phone) {
        orderData.phone = normalizePhoneNumber(orderData.phone);
    }
    // Generate order number
    orderData.orderNumber = generateOrderNumber();
    orderData.isGuest = true;
    orderData.guestEmail = orderData.email;
    // Use the subtotal and totalPayable sent from frontend (already calculated correctly)
    // Don't recalculate here to avoid discrepancies
    console.log("✅ Using frontend-calculated values:", {
        subtotal: orderData.subtotal,
        totalPayable: orderData.totalPayable,
    });
    // Create order
    const order = await order_model_1.Order.create(orderData);
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
    await order_model_1.OrderItem.insertMany(orderItemsData);
    // Update product stock quantities
    for (const detail of productDetails) {
        await product_model_1.Product.findByIdAndUpdate(detail.product._id, {
            $inc: { stock: -detail.quantity },
        });
    }
    // Get full order with items
    const fullOrder = await order_model_1.Order.findById(order._id);
    const orderItems = await order_model_1.OrderItem.find({ order: order._id }).populate("product");
    return {
        order: (0, exports.normalizeOrderObject)(fullOrder),
        items: orderItems,
    };
};
// Link guest orders to user account when they register/login
const linkGuestOrdersToUserIntoDB = async (email, userUuid) => {
    // Find all guest orders with this email
    const guestOrders = await order_model_1.Order.find({
        guestEmail: email,
        isGuest: true,
    });
    if (guestOrders.length === 0) {
        return { linked: 0, orders: [] };
    }
    // Update all guest orders to link them to the user
    await order_model_1.Order.updateMany({ guestEmail: email, isGuest: true }, {
        $set: {
            user: userUuid,
            isGuest: false,
        },
    });
    return {
        linked: guestOrders.length,
        orders: guestOrders.map((o) => o.orderNumber),
    };
};
exports.OrderServices = {
    placeOrderIntoDB,
    placeGuestOrderIntoDB,
    linkGuestOrdersToUserIntoDB,
    getUserOrdersFromDB,
    getAllOrdersFromDB,
    getSingleOrderFromDB,
    updateOrderStatusIntoDB,
    deleteOrderFromDB,
};
//# sourceMappingURL=order.service.js.map