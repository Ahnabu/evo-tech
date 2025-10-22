import { User } from "../user/user.model";
import { Order } from "../order/order.model";
import { Product } from "../product/product.model";
import { Cart } from "../cart/cart.model";

const getDashboardStats = async () => {
  // Get current date and date ranges
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Get total counts
  const [totalUsers, totalProducts, currentMonthOrders, lastMonthOrders] = await Promise.all([
    User.countDocuments({ userType: "user" }),
    Product.countDocuments({ published: true }),
    Order.find({
      createdAt: { $gte: startOfMonth, $lte: now }
    }),
    Order.find({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    })
  ]);

  // Calculate revenue
  const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
  const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);

  // Calculate growth percentages
  const revenueGrowth = lastMonthRevenue > 0 
    ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;
  
  const ordersGrowth = lastMonthOrders.length > 0 
    ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 
    : 0;

  // Get customer growth (users created this month vs last month)
  const currentMonthUsers = await User.countDocuments({
    userType: "user",
    createdAt: { $gte: startOfMonth, $lte: now }
  });
  
  const lastMonthUsers = await User.countDocuments({
    userType: "user", 
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
  });

  const customersGrowth = lastMonthUsers > 0 
    ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 
    : 0;

  // Get product growth
  const currentMonthProducts = await Product.countDocuments({
    isActive: true,
    createdAt: { $gte: startOfMonth, $lte: now }
  });
  
  const lastMonthProducts = await Product.countDocuments({
    isActive: true,
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
  });

  const productsGrowth = lastMonthProducts > 0 
    ? ((currentMonthProducts - lastMonthProducts) / lastMonthProducts) * 100 
    : 0;

  return {
    totalRevenue: currentMonthRevenue,
    totalOrders: currentMonthOrders.length,
    totalCustomers: totalUsers,
    totalProducts: totalProducts,
    revenueGrowth: Math.round(revenueGrowth * 100) / 100,
    ordersGrowth: Math.round(ordersGrowth * 100) / 100,
    customersGrowth: Math.round(customersGrowth * 100) / 100,
    productsGrowth: Math.round(productsGrowth * 100) / 100,
  };
};

const getSalesData = async (period: string = "30d") => {
  const now = new Date();
  let startDate: Date;
  let dateFormat: string;

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFormat = "%Y-%m-%d";
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      dateFormat = "%Y-%m-%d";
      break;
    default: // 30d
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFormat = "%Y-%m-%d";
      break;
  }

  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: now },
        status: { $ne: "cancelled" }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: dateFormat, date: "$createdAt" }
        },
        sales: { $sum: "$totalAmount" },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { "_id": 1 }
    },
    {
      $project: {
        date: "$_id",
        sales: 1,
        orders: 1,
        _id: 0
      }
    }
  ]);

  return salesData;
};

const getRecentOrders = async (limit: number = 10) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "firstName lastName email")
    .lean();

  return orders.map(order => ({
    id: order._id,
    orderNumber: order.orderNumber || `ORD-${order._id}`,
    customer: order.user ? `${(order.user as any).firstName} ${(order.user as any).lastName}` : `${order.firstname} ${order.lastname}`,
    customerEmail: order.user ? (order.user as any).email : order.email || "",
    total: order.totalPayable || 0,
    status: order.orderStatus || "pending",
    createdAt: order.createdAt
  }));
};

const getTopProducts = async (limit: number = 10) => {
  // This would require order items collection to get actual sales data
  // For now, we'll return products sorted by creation date as a placeholder
  const products = await Product.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return products.map((product, index) => ({
    id: product._id,
    name: product.name,
    image: product.mainImage || "/placeholder-product.jpg",
    category: product.category || "Uncategorized",
    price: product.price || 0,
    sold: Math.floor(Math.random() * 100) + 1, // Mock data for now
    revenue: (product.price || 0) * (Math.floor(Math.random() * 100) + 1),
    stock: product.stock || 0,
    trend: index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'stable'
  }));
};

export const DashboardServices = {
  getDashboardStats,
  getSalesData,
  getRecentOrders,
  getTopProducts,
};