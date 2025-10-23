import express from "express";
import { SupportControllers } from "./support.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Public routes
router.post("/contacts", SupportControllers.createContact);
router.post("/product-queries", SupportControllers.createProductQuery);

// User routes (authenticated)
router.post("/tickets", auth(USER_ROLE.USER), SupportControllers.createTicket);

// Admin routes
router.get("/stats", auth(USER_ROLE.ADMIN), SupportControllers.getSupportStats);

// Ticket routes (Admin only)
router.get("/tickets", auth(USER_ROLE.ADMIN), SupportControllers.getAllTickets);
router.get("/tickets/:id", auth(USER_ROLE.ADMIN), SupportControllers.getSingleTicket);
router.put("/tickets/:id", auth(USER_ROLE.ADMIN), SupportControllers.updateTicket);
router.delete("/tickets/:id", auth(USER_ROLE.ADMIN), SupportControllers.deleteTicket);

// Product query routes (Admin only for management)
router.get("/product-queries", auth(USER_ROLE.ADMIN), SupportControllers.getAllProductQueries);
router.get("/product-queries/:id", auth(USER_ROLE.ADMIN), SupportControllers.getSingleProductQuery);
router.put("/product-queries/:id", auth(USER_ROLE.ADMIN), SupportControllers.updateProductQuery);
router.delete("/product-queries/:id", auth(USER_ROLE.ADMIN), SupportControllers.deleteProductQuery);

// Contact routes (Admin only for management)
router.get("/contacts", auth(USER_ROLE.ADMIN), SupportControllers.getAllContacts);
router.get("/contacts/:id", auth(USER_ROLE.ADMIN), SupportControllers.getSingleContact);
router.put("/contacts/:id", auth(USER_ROLE.ADMIN), SupportControllers.updateContact);
router.delete("/contacts/:id", auth(USER_ROLE.ADMIN), SupportControllers.deleteContact);

export const SupportRoutes = router;