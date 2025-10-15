import config from "../config";
import { USER_ROLE } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";

export const seedAdmin = async () => {
  try {
    // Check if admin exists
    const admin = await User.findOne({
      userType: USER_ROLE.ADMIN,
      email: config.admin_email,
    });

    if (!admin) {
      console.log("Seeding started...");

      await User.create({
        firstname: config.admin_firstname,
        lastname: config.admin_lastname,
        userType: USER_ROLE.ADMIN,
        email: config.admin_email,
        password: config.admin_password,
        phone: config.admin_phone,
        isActive: true,
      });

      console.log("Admin created successfully...");
      console.log("Seeding completed...");
    }
  } catch (error) {
    console.log("Error in seeding", error);
  }
};
