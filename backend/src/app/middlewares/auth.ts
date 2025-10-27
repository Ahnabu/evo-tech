import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../config";
import AppError from "../errors/AppError";
import { catchAsync } from "../utils/catchAsync";
import { verifyToken } from "../utils/verifyJWT";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    console.log('🔐 Auth middleware - Headers:', {
      hasAuth: !!authorizationHeader,
      authHeader: authorizationHeader ? authorizationHeader.substring(0, 20) + '...' : 'none',
      requiredRoles
    });

    // Checking if the token is missing
    if (!authorizationHeader) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // Extract token from "Bearer <token>" format
    const token = authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.substring(7)
      : authorizationHeader;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token, config.jwt_access_secret as string);
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token!");
    }

    const { email, role } = decoded;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError(httpStatus.FORBIDDEN, "User is not active!");
    }

    // Check role authorization
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to access this resource!"
      );
    }

    // Attach user to request
    req.user = decoded;
    next();
  });
};

export default auth;
