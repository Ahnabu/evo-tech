import mongoose from 'mongoose';
import { Permission } from '../../src/app/modules/permission/permission.model';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Define all permissions based on the frontend sidebar menu structure
const permissions = [
    // Dashboard Permissions
    {
        code: 'VIEW_DASHBOARD',
        name: 'View Dashboard',
        category: 'Dashboard',
        description: 'Access to view the admin dashboard and analytics overview',
    },

    // Product Permissions
    {
        code: 'VIEW_PRODUCTS',
        name: 'View Products',
        category: 'Products',
        description: 'Access to view all products in the system',
    },
    {
        code: 'CREATE_PRODUCT',
        name: 'Create Product',
        category: 'Products',
        description: 'Ability to add new products to the system',
    },
    {
        code: 'EDIT_PRODUCT',
        name: 'Edit Product',
        category: 'Products',
        description: 'Ability to modify existing product details',
    },
    {
        code: 'DELETE_PRODUCT',
        name: 'Delete Product',
        category: 'Products',
        description: 'Ability to remove products from the system',
    },
    {
        code: 'MANAGE_PRODUCTS',
        name: 'Manage Products',
        category: 'Products',
        description: 'Full access to create, edit, and delete products',
    },

    // Category Permissions
    {
        code: 'VIEW_CATEGORIES',
        name: 'View Categories',
        category: 'Products',
        description: 'Access to view product categories and subcategories',
    },
    {
        code: 'MANAGE_CATEGORIES',
        name: 'Manage Categories',
        category: 'Products',
        description: 'Full access to create, edit, and delete categories and subcategories',
    },

    // Brand Permissions
    {
        code: 'VIEW_BRANDS',
        name: 'View Brands',
        category: 'Products',
        description: 'Access to view all brands',
    },
    {
        code: 'MANAGE_BRANDS',
        name: 'Manage Brands',
        category: 'Products',
        description: 'Full access to create, edit, and delete brands',
    },

    // Order Permissions
    {
        code: 'VIEW_ORDERS',
        name: 'View Orders',
        category: 'Sales',
        description: 'Access to view all customer orders',
    },
    {
        code: 'CREATE_ORDER',
        name: 'Create Order',
        category: 'Sales',
        description: 'Ability to create orders on behalf of customers',
    },
    {
        code: 'EDIT_ORDER',
        name: 'Edit Order',
        category: 'Sales',
        description: 'Ability to modify order details, status, and payment status',
    },
    {
        code: 'DELETE_ORDER',
        name: 'Delete Order',
        category: 'Sales',
        description: 'Ability to delete orders from the system',
    },
    {
        code: 'MANAGE_ORDERS',
        name: 'Manage Orders',
        category: 'Sales',
        description: 'Full access to create, edit, and delete orders',
    },

    // Customer Permissions
    {
        code: 'VIEW_CUSTOMERS',
        name: 'View Customers',
        category: 'Customers',
        description: 'Access to view customer information and profiles',
    },
    {
        code: 'EDIT_CUSTOMER',
        name: 'Edit Customer',
        category: 'Customers',
        description: 'Ability to modify customer details',
    },
    {
        code: 'DELETE_CUSTOMER',
        name: 'Delete Customer',
        category: 'Customers',
        description: 'Ability to remove customers from the system',
    },
    {
        code: 'MANAGE_CUSTOMERS',
        name: 'Manage Customers',
        category: 'Customers',
        description: 'Full access to edit and delete customer accounts',
    },

    // Report Permissions
    {
        code: 'VIEW_REPORTS',
        name: 'View Reports',
        category: 'Reports',
        description: 'Access to view system reports',
    },
    {
        code: 'VIEW_EARNINGS_REPORT',
        name: 'View Earnings Report',
        category: 'Reports',
        description: 'Access to view detailed earnings and financial reports',
    },
    {
        code: 'VIEW_SALES_REPORT',
        name: 'View Sales Report',
        category: 'Reports',
        description: 'Access to view sales analytics and trends',
    },
    {
        code: 'EXPORT_REPORTS',
        name: 'Export Reports',
        category: 'Reports',
        description: 'Ability to export reports in various formats (PDF, Excel, CSV)',
    },

    // Staff Permissions
    {
        code: 'VIEW_STAFF',
        name: 'View Staff',
        category: 'Staff Management',
        description: 'Access to view all staff members',
    },
    {
        code: 'CREATE_STAFF',
        name: 'Create Staff',
        category: 'Staff Management',
        description: 'Ability to add new staff members',
    },
    {
        code: 'EDIT_STAFF',
        name: 'Edit Staff',
        category: 'Staff Management',
        description: 'Ability to modify staff member details',
    },
    {
        code: 'DELETE_STAFF',
        name: 'Delete Staff',
        category: 'Staff Management',
        description: 'Ability to remove staff members',
    },
    {
        code: 'MANAGE_STAFF',
        name: 'Manage Staff',
        category: 'Staff Management',
        description: 'Full access to create, edit, and delete staff members',
    },
    {
        code: 'MANAGE_PERMISSIONS',
        name: 'Manage Permissions',
        category: 'Staff Management',
        description: 'Ability to assign and revoke permissions for staff members',
    },

    // Settings Permissions
    {
        code: 'VIEW_SETTINGS',
        name: 'View Settings',
        category: 'Settings',
        description: 'Access to view system settings and configurations',
    },
    {
        code: 'MANAGE_SITE_SETTINGS',
        name: 'Manage Site Settings',
        category: 'Settings',
        description: 'Full access to modify site settings, configurations, and features',
    },
    {
        code: 'MANAGE_HOMEPAGE',
        name: 'Manage Homepage',
        category: 'Settings',
        description: 'Ability to configure homepage layout and content',
    },
    {
        code: 'MANAGE_FEATURES',
        name: 'Manage Features',
        category: 'Settings',
        description: 'Ability to enable/disable system features',
    },
    {
        code: 'MANAGE_SHIPPING',
        name: 'Manage Shipping',
        category: 'Settings',
        description: 'Ability to configure shipping methods and pickup points',
    },
    {
        code: 'MANAGE_TAX',
        name: 'Manage Tax',
        category: 'Settings',
        description: 'Ability to configure VAT and tax settings',
    },
    {
        code: 'MANAGE_CURRENCY',
        name: 'Manage Currency',
        category: 'Settings',
        description: 'Ability to configure currency settings',
    },
    {
        code: 'MANAGE_INTEGRATIONS',
        name: 'Manage Integrations',
        category: 'Settings',
        description: 'Ability to configure third-party integrations (social logins, payment gateways)',
    },

    // Review & Rating Permissions
    {
        code: 'VIEW_REVIEWS',
        name: 'View Reviews',
        category: 'Reviews',
        description: 'Access to view product reviews and ratings',
    },
    {
        code: 'MODERATE_REVIEWS',
        name: 'Moderate Reviews',
        category: 'Reviews',
        description: 'Ability to approve, reject, or delete product reviews',
    },

    // Inventory Permissions
    {
        code: 'VIEW_INVENTORY',
        name: 'View Inventory',
        category: 'Inventory',
        description: 'Access to view stock levels and inventory status',
    },
    {
        code: 'MANAGE_INVENTORY',
        name: 'Manage Inventory',
        category: 'Inventory',
        description: 'Ability to update stock levels and manage inventory',
    },
];

async function seedPermissions() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing permissions
        const deleteResult = await Permission.deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} existing permissions`);

        // Insert new permissions
        const insertResult = await Permission.insertMany(permissions);
        console.log(`✅ Successfully seeded ${insertResult.length} permissions`);

        // Display grouped permissions
        const categories = [...new Set(permissions.map(p => p.category))];
        console.log('\n📋 Permissions by Category:');
        categories.forEach(category => {
            const categoryPerms = permissions.filter(p => p.category === category);
            console.log(`\n${category} (${categoryPerms.length}):`);
            categoryPerms.forEach(p => {
                console.log(`  - ${p.code}: ${p.name}`);
            });
        });

        console.log(`\n✅ Total permissions seeded: ${permissions.length}`);
        
    } catch (error) {
        console.error('❌ Error seeding permissions:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
    }
}

// Run the seeder
seedPermissions()
    .then(() => {
        console.log('✅ Permission seeding completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Permission seeding failed:', error);
        process.exit(1);
    });
