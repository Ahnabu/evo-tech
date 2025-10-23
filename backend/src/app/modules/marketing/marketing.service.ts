import { 
  ICoupon, 
  IFlashDeal, 
  ISubscriber, 
  INewsletter, 
  Coupon, 
  FlashDeal, 
  Subscriber, 
  Newsletter 
} from "./marketing.model";
import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

// Coupon Services
const createCouponIntoDB = async (payload: Partial<ICoupon>): Promise<ICoupon> => {
  const couponData = {
    ...payload,
    id: uuidv4(),
    code: payload.code?.toUpperCase(),
  };

  const result = await Coupon.create(couponData);
  return result;
};

const getAllCouponsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.$or = [
      { code: { $regex: query.search, $options: "i" } },
      { name: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.status) {
    searchQuery.status = query.status;
  }

  if (query.discountType) {
    searchQuery.discountType = query.discountType;
  }

  const result = await Coupon.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Coupon.countDocuments(searchQuery);

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleCouponFromDB = async (id: string): Promise<ICoupon> => {
  const result = await Coupon.findOne({ id });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  }

  return result;
};

const getCouponByCodeFromDB = async (code: string): Promise<ICoupon> => {
  const result = await Coupon.findOne({ 
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() }
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid or expired coupon code");
  }

  if (result.usageLimit && result.usedCount >= result.usageLimit) {
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon usage limit exceeded");
  }

  return result;
};

const updateCouponIntoDB = async (
  id: string,
  payload: Partial<ICoupon>
): Promise<ICoupon> => {
  if (payload.code) {
    payload.code = payload.code.toUpperCase();
  }

  const result = await Coupon.findOneAndUpdate({ id }, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  }

  return result;
};

const deleteCouponFromDB = async (id: string): Promise<void> => {
  const result = await Coupon.findOneAndDelete({ id });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  }
};

// Flash Deal Services
const createFlashDealIntoDB = async (payload: Partial<IFlashDeal>): Promise<IFlashDeal> => {
  const flashDealData = {
    ...payload,
    id: uuidv4(),
  };

  const result = await FlashDeal.create(flashDealData);
  return result;
};

const getAllFlashDealsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.isActive !== undefined) {
    searchQuery.isActive = query.isActive === "true";
  }

  const result = await FlashDeal.find(searchQuery)
    .populate("products.productId")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await FlashDeal.countDocuments(searchQuery);

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getActiveFlashDealsFromDB = async () => {
  const result = await FlashDeal.find({
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  }).populate("products.productId");

  return result;
};

const getSingleFlashDealFromDB = async (id: string): Promise<IFlashDeal> => {
  const result = await FlashDeal.findOne({ id }).populate("products.productId");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Flash deal not found");
  }

  return result;
};

const updateFlashDealIntoDB = async (
  id: string,
  payload: Partial<IFlashDeal>
): Promise<IFlashDeal> => {
  const result = await FlashDeal.findOneAndUpdate({ id }, payload, {
    new: true,
    runValidators: true,
  }).populate("products.productId");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Flash deal not found");
  }

  return result;
};

const deleteFlashDealFromDB = async (id: string): Promise<void> => {
  const result = await FlashDeal.findOneAndDelete({ id });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Flash deal not found");
  }
};

// Subscriber Services
const createSubscriberIntoDB = async (payload: Partial<ISubscriber>): Promise<ISubscriber> => {
  const subscriberData = {
    ...payload,
    id: uuidv4(),
  };

  const result = await Subscriber.create(subscriberData);
  return result;
};

const getAllSubscribersFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.$or = [
      { email: { $regex: query.search, $options: "i" } },
      { name: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.status) {
    searchQuery.status = query.status;
  }

  const result = await Subscriber.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Subscriber.countDocuments(searchQuery);

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleSubscriberFromDB = async (id: string): Promise<ISubscriber> => {
  const result = await Subscriber.findOne({ id });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscriber not found");
  }

  return result;
};

const updateSubscriberIntoDB = async (
  id: string,
  payload: Partial<ISubscriber>
): Promise<ISubscriber> => {
  if (payload.status === "unsubscribed" && !payload.unsubscribedAt) {
    payload.unsubscribedAt = new Date();
  }

  const result = await Subscriber.findOneAndUpdate({ id }, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscriber not found");
  }

  return result;
};

const unsubscribeFromDB = async (email: string): Promise<ISubscriber> => {
  const result = await Subscriber.findOneAndUpdate(
    { email },
    { 
      status: "unsubscribed",
      unsubscribedAt: new Date()
    },
    { new: true }
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscriber not found");
  }

  return result;
};

// Newsletter Services
const createNewsletterIntoDB = async (payload: Partial<INewsletter>): Promise<INewsletter> => {
  const newsletterData = {
    ...payload,
    id: uuidv4(),
  };

  const result = await Newsletter.create(newsletterData);
  return result;
};

const getAllNewslettersFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.$or = [
      { subject: { $regex: query.search, $options: "i" } },
      { content: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.status) {
    searchQuery.status = query.status;
  }

  const result = await Newsletter.find(searchQuery)
    .populate("createdBy")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Newsletter.countDocuments(searchQuery);

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleNewsletterFromDB = async (id: string): Promise<INewsletter> => {
  const result = await Newsletter.findOne({ id }).populate("createdBy");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Newsletter not found");
  }

  return result;
};

const updateNewsletterIntoDB = async (
  id: string,
  payload: Partial<INewsletter>
): Promise<INewsletter> => {
  const result = await Newsletter.findOneAndUpdate({ id }, payload, {
    new: true,
    runValidators: true,
  }).populate("createdBy");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Newsletter not found");
  }

  return result;
};

const deleteNewsletterFromDB = async (id: string): Promise<void> => {
  const result = await Newsletter.findOneAndDelete({ id });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Newsletter not found");
  }
};

// Marketing Stats
const getMarketingStatsFromDB = async () => {
  const totalCoupons = await Coupon.countDocuments();
  const activeCoupons = await Coupon.countDocuments({ isActive: true });
  const activeFlashDeals = await FlashDeal.countDocuments({ 
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  });
  const totalSubscribers = await Subscriber.countDocuments({ status: "active" });
  const sentNewsletters = await Newsletter.countDocuments({ status: "sent" });

  return {
    coupons: {
      total: totalCoupons,
      active: activeCoupons,
    },
    flashDeals: {
      active: activeFlashDeals,
    },
    subscribers: {
      total: totalSubscribers,
    },
    newsletters: {
      sent: sentNewsletters,
    },
  };
};

export const MarketingServices = {
  // Coupon services
  createCouponIntoDB,
  getAllCouponsFromDB,
  getSingleCouponFromDB,
  getCouponByCodeFromDB,
  updateCouponIntoDB,
  deleteCouponFromDB,

  // Flash deal services
  createFlashDealIntoDB,
  getAllFlashDealsFromDB,
  getActiveFlashDealsFromDB,
  getSingleFlashDealFromDB,
  updateFlashDealIntoDB,
  deleteFlashDealFromDB,

  // Subscriber services
  createSubscriberIntoDB,
  getAllSubscribersFromDB,
  getSingleSubscriberFromDB,
  updateSubscriberIntoDB,
  unsubscribeFromDB,

  // Newsletter services
  createNewsletterIntoDB,
  getAllNewslettersFromDB,
  getSingleNewsletterFromDB,
  updateNewsletterIntoDB,
  deleteNewsletterFromDB,

  // Stats
  getMarketingStatsFromDB,
};