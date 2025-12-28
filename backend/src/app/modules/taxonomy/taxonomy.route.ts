import express from "express";
import { Category } from "../category/category.model";
import { Subcategory } from "../subcategory/subcategory.model";
import { Brand } from "../brand/brand.model";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const router = express.Router();

const getTaxonomyAllData = catchAsync(async (req, res) => {
  const [categories, subcategories, brands] = await Promise.all([
    Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }),
    Subcategory.find({ isActive: true }).populate("category").sort({ sortOrder: 1, name: 1 }),
    Brand.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }),
  ]);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Taxonomy data retrieved successfully",
    data: {
      categories,
      subcategories,
      brands,
    },
  });
});

router.get("/alldata", getTaxonomyAllData);

export const TaxonomyRoutes = router;
