import express from "express";
import { MarketingControllers } from "./marketing.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Public routes
router.post("/subscribe", MarketingControllers.createSubscriber);
router.put("/unsubscribe/:email", MarketingControllers.unsubscribe);
router.get("/coupons/validate/:code", MarketingControllers.validateCoupon);
router.get("/flash-deals/active", MarketingControllers.getActiveFlashDeals);

// Admin routes
router.get("/stats", auth(USER_ROLE.ADMIN), MarketingControllers.getMarketingStats);

// Coupon routes (Admin only)
router.get("/coupons", auth(USER_ROLE.ADMIN), MarketingControllers.getAllCoupons);
router.get("/coupons/:id", auth(USER_ROLE.ADMIN), MarketingControllers.getSingleCoupon);
router.post("/coupons", auth(USER_ROLE.ADMIN), MarketingControllers.createCoupon);
router.put("/coupons/:id", auth(USER_ROLE.ADMIN), MarketingControllers.updateCoupon);
router.delete("/coupons/:id", auth(USER_ROLE.ADMIN), MarketingControllers.deleteCoupon);

// Flash deal routes (Admin only)
router.get("/flash-deals", auth(USER_ROLE.ADMIN), MarketingControllers.getAllFlashDeals);
router.get("/flash-deals/:id", auth(USER_ROLE.ADMIN), MarketingControllers.getSingleFlashDeal);
router.post("/flash-deals", auth(USER_ROLE.ADMIN), MarketingControllers.createFlashDeal);
router.put("/flash-deals/:id", auth(USER_ROLE.ADMIN), MarketingControllers.updateFlashDeal);
router.delete("/flash-deals/:id", auth(USER_ROLE.ADMIN), MarketingControllers.deleteFlashDeal);

// Subscriber routes (Admin only for management)
router.get("/subscribers", auth(USER_ROLE.ADMIN), MarketingControllers.getAllSubscribers);
router.get("/subscribers/:id", auth(USER_ROLE.ADMIN), MarketingControllers.getSingleSubscriber);
router.put("/subscribers/:id", auth(USER_ROLE.ADMIN), MarketingControllers.updateSubscriber);

// Newsletter routes (Admin only)
router.get("/newsletters", auth(USER_ROLE.ADMIN), MarketingControllers.getAllNewsletters);
router.get("/newsletters/:id", auth(USER_ROLE.ADMIN), MarketingControllers.getSingleNewsletter);
router.post("/newsletters", auth(USER_ROLE.ADMIN), MarketingControllers.createNewsletter);
router.put("/newsletters/:id", auth(USER_ROLE.ADMIN), MarketingControllers.updateNewsletter);
router.delete("/newsletters/:id", auth(USER_ROLE.ADMIN), MarketingControllers.deleteNewsletter);

export const MarketingRoutes = router;