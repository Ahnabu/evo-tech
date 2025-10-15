import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  db_url: process.env.MONGODB_URI,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 10,
  jwt_access_secret: process.env.JWT_SECRET,
  jwt_access_expires_in: process.env.JWT_EXPIRES_IN || "8h",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  admin_firstname: process.env.ADMIN_FIRSTNAME || "Admin",
  admin_lastname: process.env.ADMIN_LASTNAME || "123",
  admin_phone: process.env.ADMIN_PHONE,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  cors_origin: process.env.FRONTEND_URL || "http://localhost:3000",
};
