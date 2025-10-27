require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL || process.env.DATABASE_URL || 'mongodb://localhost:27017/evotech';
    await mongoose.connect(dbUrl);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const permissionSchema = new mongoose.Schema({
  name: String,
  code: String,
  category: String,
  description: String,
  isActive: Boolean,
}, { timestamps: true });

const Permission = mongoose.model('Permission', permissionSchema);

// Default permissions
const defaultPermissions = [
  // Dashboard Permissions
  {
    name: 'View Dashboard',
    code: 'VIEW_DASHBOARD',
    category: 'dashboard',
    description: 'Access to main dashboard overview',
    isActive: true,
  },
  {
    name: 'View Dashboard Stats',
    code: 'VIEW_DASHBOARD_STATS',
    category: 'dashboard',
    description: 'View dashboard statistics and analytics',
    isActive: true,
  },
  
  // Product Permissions
  {
    name: 'View Products',
    code: 'VIEW_PRODUCTS',
    category: 'products',
    description: 'View product list',
    isActive: true,
  },
  {
    name: 'Create Products',
    code: 'CREATE_PRODUCTS',
    category: 'products',
    description: 'Create new products',
    isActive: true,
  },
  {
    name: 'Edit Products',
    code: 'EDIT_PRODUCTS',
    category: 'products',
    description: 'Edit existing products',
    isActive: true,
  },
  {
    name: 'Delete Products',
    code: 'DELETE_PRODUCTS',
    category: 'products',
    description: 'Delete products',
    isActive: true,
  },
  {
    name: 'Manage Categories',
    code: 'MANAGE_CATEGORIES',
    category: 'products',
    description: 'Manage product categories and subcategories',
    isActive: true,
  },
  {
    name: 'Manage Brands',
    code: 'MANAGE_BRANDS',
    category: 'products',
    description: 'Manage product brands',
    isActive: true,
  },
  
  // Order Permissions
  {
    name: 'View Orders',
    code: 'VIEW_ORDERS',
    category: 'orders',
    description: 'View order list and details',
    isActive: true,
  },
  {
    name: 'Update Order Status',
    code: 'UPDATE_ORDER_STATUS',
    category: 'orders',
    description: 'Update order status (pending, confirmed, shipped, etc.)',
    isActive: true,
  },
  {
    name: 'Cancel Orders',
    code: 'CANCEL_ORDERS',
    category: 'orders',
    description: 'Cancel orders',
    isActive: true,
  },
  {
    name: 'Delete Orders',
    code: 'DELETE_ORDERS',
    category: 'orders',
    description: 'Delete orders (permanent)',
    isActive: true,
  },
  
  // Customer Permissions
  {
    name: 'View Customers',
    code: 'VIEW_CUSTOMERS',
    category: 'customers',
    description: 'View customer list and profiles',
    isActive: true,
  },
  {
    name: 'Edit Customers',
    code: 'EDIT_CUSTOMERS',
    category: 'customers',
    description: 'Edit customer information',
    isActive: true,
  },
  {
    name: 'Delete Customers',
    code: 'DELETE_CUSTOMERS',
    category: 'customers',
    description: 'Delete customer accounts',
    isActive: true,
  },
  
  // Report Permissions
  {
    name: 'View Reports',
    code: 'VIEW_REPORTS',
    category: 'reports',
    description: 'Access to reports section',
    isActive: true,
  },
  {
    name: 'View Earnings Report',
    code: 'VIEW_EARNINGS_REPORT',
    category: 'reports',
    description: 'View earnings and revenue reports',
    isActive: true,
  },
  {
    name: 'Export Reports',
    code: 'EXPORT_REPORTS',
    category: 'reports',
    description: 'Export reports to PDF/CSV',
    isActive: true,
  },
  
  // Settings Permissions
  {
    name: 'View Settings',
    code: 'VIEW_SETTINGS',
    category: 'settings',
    description: 'Access to settings',
    isActive: true,
  },
  {
    name: 'Manage Site Settings',
    code: 'MANAGE_SITE_SETTINGS',
    category: 'settings',
    description: 'Manage site configuration and settings',
    isActive: true,
  },
  
  // Staff Permissions
  {
    name: 'View Staff',
    code: 'VIEW_STAFF',
    category: 'staff',
    description: 'View staff list',
    isActive: true,
  },
  {
    name: 'Manage Staff',
    code: 'MANAGE_STAFF',
    category: 'staff',
    description: 'Create, edit, delete staff accounts',
    isActive: true,
  },
  {
    name: 'Manage Permissions',
    code: 'MANAGE_PERMISSIONS',
    category: 'staff',
    description: 'Assign and revoke staff permissions',
    isActive: true,
  },
];

// Seed permissions
const seedPermissions = async () => {
  try {
    console.log('🔄 Seeding permissions...');
    
    // Delete existing permissions
    await Permission.deleteMany({});
    console.log('🗑️  Cleared existing permissions');
    
    // Insert default permissions
    const result = await Permission.insertMany(defaultPermissions);
    console.log(`✅ Created ${result.length} permissions`);
    
    // Group by category and display
    const categories = [...new Set(defaultPermissions.map(p => p.category))];
    console.log('\n📊 Permissions by Category:');
    for (const category of categories) {
      const perms = defaultPermissions.filter(p => p.category === category);
      console.log(`\n  ${category.toUpperCase()}:`);
      perms.forEach(p => console.log(`    - ${p.name} (${p.code})`));
    }
    
    console.log('\n🎉 Permissions seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding permissions:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await seedPermissions();
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  process.exit(0);
};

main();
