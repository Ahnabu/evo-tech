import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { catchAsync } from "../utils/catchAsync";

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Debug logging
    console.log("=== REQUEST VALIDATION DEBUG ===");
    console.log("Request URL:", req.url);
    console.log("Request Method:", req.method);
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    console.log("Request Headers:", req.headers);
    console.log("===============================");
    
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  });
};

export default validateRequest;