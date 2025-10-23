import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { BrandRoutes } from "../modules/brand/brand.route";
import { SubcategoryRoutes } from "../modules/subcategory/subcategory.route";
import { ProductRoutes } from "../modules/product/product.route";
import { CartRoutes } from "../modules/cart/cart.route";
import { OrderRoutes } from "../modules/order/order.route";
import { DashboardRoutes } from "../modules/dashboard/dashboard.route";
import { BannerRoutes } from "../modules/banner/banner.route";
import { ClientRoutes } from "../modules/client/client.route";
import { LandingSectionRoutes } from "../modules/landingsection/landingsection.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/brands",
    route: BrandRoutes,
  },
  {
    path: "/subcategories",
    route: SubcategoryRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/shopping",
    route: CartRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
  {
    path: "/banners",
    route: BannerRoutes,
  },
  {
    path: "/clients",
    route: ClientRoutes,
  },
  {
    path: "/landing-sections",
    route: LandingSectionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
