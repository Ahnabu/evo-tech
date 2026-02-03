import mongoose from "mongoose";
import app from "../src/app";
import config from "../src/app/config";
import { seedAdmin } from "../src/app/utils/seeding";

// Initialize database connection
let isConnected = false;

async function connectDatabase() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(config.db_url as string);
    console.log("🛢 Database connected successfully");
    isConnected = true;

    // Seed admin user if not exists
    await seedAdmin();
  } catch (err) {
    console.error("Failed to connect to database:", err);
    throw err;
  }
}

// Export the Express app as a serverless function
export default async (req: any, res: any) => {
  // Ensure database is connected
  await connectDatabase();
  
  // Handle the request with Express
  return app(req, res);
};
