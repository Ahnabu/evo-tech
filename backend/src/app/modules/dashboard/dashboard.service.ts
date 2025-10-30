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
        orderStatus: { $ne: "cancelled" }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: dateFormat, date: "$createdAt" }
        },
        sales: {
          $sum: {
            $ifNull: ["$totalPayable", 0]
          }
        },
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
  // Get all orders and sort: pending first, then by creation date
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "firstName lastName email")
    .lean();

  // Sort to show pending orders first
  const sortedOrders = orders.sort((a, b) => {
    if (a.orderStatus === 'pending' && b.orderStatus !== 'pending') return -1;
    if (a.orderStatus !== 'pending' && b.orderStatus === 'pending') return 1;
    return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
  });

  return sortedOrders.map(order => ({
    id: order._id,
    orderNumber: order.orderNumber || `ORD-${order._id}`,
    customer: (() => {
      if (order.user) {
        const first = (order.user as any).firstName || (order.user as any).firstname || "";
        const last = (order.user as any).lastName || (order.user as any).lastname || "";
        const full = `${first} ${last}`.trim();
        if (full) return full;
      }
      const firstName = (order as any).firstname || (order as any).firstName || "";
      const lastName = (order as any).lastname || (order as any).lastName || "";
      const fullFallback = `${firstName} ${lastName}`.trim();
      return fullFallback || order.email || "Unknown";
    })(),
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

const getEarningsReport = async () => {
  const now = new Date();
  
  // Get all time earnings
  const allOrders = await Order.find({ orderStatus: { $ne: "cancelled" } });
  const totalEarnings = allOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
  
  // Get current year earnings
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const yearOrders = await Order.find({
    createdAt: { $gte: startOfYear, $lte: now },
    orderStatus: { $ne: "cancelled" }
  });
  const yearlyEarnings = yearOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
  
  // Get current month earnings
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthOrders = await Order.find({
    createdAt: { $gte: startOfMonth, $lte: now },
    orderStatus: { $ne: "cancelled" }
  });
  const monthlyEarnings = monthOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
  
  // Get last month for comparison
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastMonthOrders = await Order.find({
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    orderStatus: { $ne: "cancelled" }
  });
  const lastMonthEarnings = lastMonthOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
  
  // Get last year for comparison
  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
  const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);
  const lastYearOrders = await Order.find({
    createdAt: { $gte: startOfLastYear, $lte: endOfLastYear },
    orderStatus: { $ne: "cancelled" }
  });
  const lastYearEarnings = lastYearOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
  
  // Calculate growth
  const monthlyGrowth = lastMonthEarnings > 0 
    ? ((monthlyEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 
    : 0;
  
  const yearlyGrowth = lastYearEarnings > 0 
    ? ((yearlyEarnings - lastYearEarnings) / lastYearEarnings) * 100 
    : 0;
  
  // Get monthly breakdown for current year
  const monthlyBreakdown = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear, $lte: now },
        orderStatus: { $ne: "cancelled" }
      }
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        earnings: { $sum: "$totalPayable" },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { "_id": 1 }
    }
  ]);
  
  // Get yearly breakdown for last 5 years
  const fiveYearsAgo = new Date(now.getFullYear() - 4, 0, 1);
  const yearlyBreakdown = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: fiveYearsAgo, $lte: now },
        orderStatus: { $ne: "cancelled" }
      }
    },
    {
      $group: {
        _id: { $year: "$createdAt" },
        earnings: { $sum: "$totalPayable" },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { "_id": 1 }
    }
  ]);
  
  return {
    total: {
      earnings: totalEarnings,
      orders: allOrders.length
    },
    yearly: {
      earnings: yearlyEarnings,
      orders: yearOrders.length,
      growth: Math.round(yearlyGrowth * 100) / 100,
      breakdown: yearlyBreakdown.map(item => ({
        year: item._id,
        earnings: item.earnings,
        orders: item.orders
      }))
    },
    monthly: {
      earnings: monthlyEarnings,
      orders: monthOrders.length,
      growth: Math.round(monthlyGrowth * 100) / 100,
      breakdown: monthlyBreakdown.map(item => ({
        month: item._id,
        earnings: item.earnings,
        orders: item.orders
      }))
    },
    avgOrderValue: allOrders.length > 0 ? totalEarnings / allOrders.length : 0
  };
};

const getPendingOrdersCount = async () => {
  // Get count of orders that are pending (not processed yet)
  const pendingCount = await Order.countDocuments({
    orderStatus: "pending"
  });

  return {
    count: pendingCount
  };
};

export const DashboardServices = {
  getDashboardStats,
  getSalesData,
  getRecentOrders,
  getTopProducts,
  getEarningsReport,
  getPendingOrdersCount,
};