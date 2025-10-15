import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { createToken } from "../../utils/verifyJWT";
import { USER_ROLE } from "../user/user.constant";
import { User } from "../user/user.model";
import { TLoginUser, TOAuthUser, TRegisterUser } from "./auth.interface";

const registerUser = async (payload: TRegisterUser) => {
  // Check if user already exists
  const existingUser = await User.isUserExistsByEmail(payload.email);

  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists!");
  }

  // Set default role
  const userData = {
    ...payload,
    userType: USER_ROLE.USER,
  };

  // Create new user with hashed password
  const newUser = await User.create(userData);

  // Create access token
  const jwtPayload = {
    _id: newUser._id as string,
    email: newUser.email,
    role: newUser.userType,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  // Remove password from response
  const userObject = (newUser as any).toObject();
  delete (userObject as any).password;

  return {
    user: userObject,
    accessToken,
  };
};

const loginUser = async (payload: TLoginUser) => {
  // Check if user exists
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  // Check if password matches
  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials!");
  }

  // Update last active time
  user.lastActiveAt = new Date();
  await (user as any).save();

  // Create JWT payload
  const jwtPayload = {
    _id: user._id as string,
    email: user.email,
    role: user.userType,
  };

  // Create access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  // Create refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  // Remove password from response
  const userObject = (user as any).toObject();
  delete (userObject as any).password;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

const handleOAuthUser = async (payload: TOAuthUser) => {
  // Check if user exists
  let user = await User.findOne({ email: payload.email });

  if (!user) {
    // Create new user for OAuth
    user = await User.create({
      email: payload.email,
      firstname: payload.firstname,
      lastname: payload.lastname,
      userType: USER_ROLE.USER,
      password: Math.random().toString(36).slice(-10), // Random password for OAuth users
      emailVerifiedAt: new Date(), // OAuth users are pre-verified
    });
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  // Update last active time
  user.lastActiveAt = new Date();
  await user.save();

  // Create JWT payload
  const jwtPayload = {
    _id: user._id as string,
    email: user.email,
    role: user.userType,
  };

  // Create access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  // Create refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  // Remove password from response
  const userObject = (user as any).toObject();
  delete userObject.password;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  registerUser,
  loginUser,
  handleOAuthUser,
};
