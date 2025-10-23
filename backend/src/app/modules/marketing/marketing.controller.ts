import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { MarketingServices } from "./marketing.service";

// Coupon Controllers
const createCoupon = catchAsync(async (req, res) => {
  const result = await MarketingServices.createCouponIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Coupon created successfully",
    data: result,
  });
});

const getAllCoupons = catchAsync(async (req, res) => {
  const coupons = await MarketingServices.getAllCouponsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupons retrieved successfully",
    data: coupons.result,
    meta: coupons.meta,
  });
});

const getSingleCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MarketingServices.getSingleCouponFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon retrieved successfully",
    data: result,
  });
});

const validateCoupon = catchAsync(async (req, res) => {
  const { code } = req.params;
  const result = await MarketingServices.getCouponByCodeFromDB(code);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon is valid",
    data: result,
  });
});

const updateCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MarketingServices.updateCouponIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon updated successfully",
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;
  await MarketingServices.deleteCouponFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Coupon deleted successfully",
    data: null,
  });
});

// Flash Deal Controllers
const createFlashDeal = catchAsync(async (req, res) => {
  const result = await MarketingServices.createFlashDealIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Flash deal created successfully",
    data: result,
  });
});

const getAllFlashDeals = catchAsync(async (req, res) => {
  const flashDeals = await MarketingServices.getAllFlashDealsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flash deals retrieved successfully",
    data: flashDeals.result,
    meta: flashDeals.meta,
  });
});

const getActiveFlashDeals = catchAsync(async (req, res) => {
  const result = await MarketingServices.getActiveFlashDealsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Active flash deals retrieved successfully",
    data: result,
  });
});

const getSingleFlashDeal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MarketingServices.getSingleFlashDealFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flash deal retrieved successfully",
    data: result,
  });
});

const updateFlashDeal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MarketingServices.updateFlashDealIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flash deal updated successfully",
    data: result,
  });
});

const deleteFlashDeal = catchAsync(async (req, res) => {
  const { id } = req.params;
  await MarketingServices.deleteFlashDealFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flash deal deleted successfully",
    data: null,
  });
});

// Subscriber Controllers
const createSubscriber = catchAsync(async (req, res) => {
  const result = await MarketingServices.createSubscriberIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Subscription successful",
    data: result,
  });
});

const getAllSubscribers = catchAsync(async (req, res) => {
  const subscribers = await MarketingServices.getAllSubscribersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscribers retrieved successfully",
    data: subscribers.result,
    meta: subscribers.meta,
  });
});

const getSingleSubscriber = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MarketingServices.getSingleSubscriberFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscriber retrieved successfully",
    data: result,
  });
});

const updateSubscriber = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MarketingServices.updateSubscriberIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Subscriber updated successfully",
    data: result,
  });
});

const unsubscribe = catchAsync(async (req, res) => {
  const { email } = req.params;
  const result = await MarketingServices.unsubscribeFromDB(email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully unsubscribed",
    data: result,
  });
});

// Newsletter Controllers
const createNewsletter = catchAsync(async (req, res) => {
  const result = await MarketingServices.createNewsletterIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Newsletter created successfully",
    data: result,
  });
});

const getAllNewsletters = catchAsync(async (req, res) => {
  const newsletters = await MarketingServices.getAllNewslettersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Newsletters retrieved successfully",
    data: newsletters.result,
    meta: newsletters.meta,
  });
});

const getSingleNewsletter = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MarketingServices.getSingleNewsletterFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Newsletter retrieved successfully",
    data: result,
  });
});

const updateNewsletter = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MarketingServices.updateNewsletterIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Newsletter updated successfully",
    data: result,
  });
});

const deleteNewsletter = catchAsync(async (req, res) => {
  const { id } = req.params;
  await MarketingServices.deleteNewsletterFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Newsletter deleted successfully",
    data: null,
  });
});

// Marketing Stats Controller
const getMarketingStats = catchAsync(async (req, res) => {
  const result = await MarketingServices.getMarketingStatsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Marketing statistics retrieved successfully",
    data: result,
  });
});

export const MarketingControllers = {
  // Coupon controllers
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  validateCoupon,
  updateCoupon,
  deleteCoupon,

  // Flash deal controllers
  createFlashDeal,
  getAllFlashDeals,
  getActiveFlashDeals,
  getSingleFlashDeal,
  updateFlashDeal,
  deleteFlashDeal,

  // Subscriber controllers
  createSubscriber,
  getAllSubscribers,
  getSingleSubscriber,
  updateSubscriber,
  unsubscribe,

  // Newsletter controllers
  createNewsletter,
  getAllNewsletters,
  getSingleNewsletter,
  updateNewsletter,
  deleteNewsletter,

  // Stats
  getMarketingStats,
};