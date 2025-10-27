import { BarChartIcon, UsersIcon, ChartArea, HelpCircleIcon, Settings2, Contact } from "lucide-react";
import { RiBox1Line, RiDashboardHorizontalLine } from "react-icons/ri";


// sidebar menus for admin dashboard
const adminSidebarMenus = [
    {
        title: "Dashboard",
        url: "/control/dashboard",
        icon: RiDashboardHorizontalLine,
        collapsibleItems: [],
        permissions: ["VIEW_DASHBOARD"], // Required permissions
    },
    {
        title: "Products",
        icon: RiBox1Line,
        collapsibleItems: [
            {
                title: "All Products",
                url: "/control/products",
                permissions: ["VIEW_PRODUCTS"],
            },
            {
                title: "All Categories",
                url: "/control/categories",
                permissions: ["MANAGE_CATEGORIES"],
            },
            {
                title: "All Sub-Categories",
                url: "/control/subcategories",
                permissions: ["MANAGE_CATEGORIES"],
            },
            {
                title: "All Brands",
                url: "/control/brands",
                permissions: ["MANAGE_BRANDS"],
            },
        ],
        permissions: ["VIEW_PRODUCTS", "MANAGE_CATEGORIES", "MANAGE_BRANDS"], // Any of these
    },
    {
        title: "Sales",
        icon: BarChartIcon,
        collapsibleItems: [
            {
                title: "All Orders",
                url: "/control/orders",
                permissions: ["VIEW_ORDERS"],
            },
        ],
        permissions: ["VIEW_ORDERS"],
    },
    {
        title: "Customers",
        icon: UsersIcon,
        collapsibleItems: [
            {
                title: "All Customers",
                url: "/control/all-customers",
                permissions: ["VIEW_CUSTOMERS"],
            },
        ],
        permissions: ["VIEW_CUSTOMERS"],
    },
    {
        title: "Reports",
        icon: ChartArea,
        collapsibleItems: [
            {
                title: "Earnings Report",
                url: "/control/reports/earnings",
                permissions: ["VIEW_EARNINGS_REPORT"],
            },
        ],
        permissions: ["VIEW_REPORTS", "VIEW_EARNINGS_REPORT"],
    },
    {
        title: "Staffs",
        icon: Contact,
        collapsibleItems: [
            {
                title: "All Staffs",
                url: "/control/staff",
                permissions: ["VIEW_STAFF"],
            },
        ],
        permissions: ["VIEW_STAFF", "MANAGE_STAFF"],
    },
]

const adminSecondarySidebarMenus = [
    {
        title: "Setup & Configurations",
        icon: Settings2,
        collapsibleItems: [
            {
                title: "Home Page Config",
                url: "/control/setup-config/homepage-config",
                permissions: ["MANAGE_SITE_SETTINGS"],
            },
            {
                title: "Feature Activation",
                url: "/control/setup-config/feature-activation",
                permissions: ["MANAGE_SITE_SETTINGS"],
            },
            {
                title: "Pickup Points",
                url: "/control/setup-config/pickup-points",
                permissions: ["MANAGE_SITE_SETTINGS"],
            },
            {
                title: "Currency",
                url: "/control/setup-config/currency",
                permissions: ["MANAGE_SITE_SETTINGS"],
            },
            {
                title: "VAT & Tax",
                url: "/control/setup-config/vat-tax",
                permissions: ["MANAGE_SITE_SETTINGS"],
            },
            {
                title: "Social Media Logins",
                url: "/control/setup-config/social-logins",
                permissions: ["MANAGE_SITE_SETTINGS"],
            },
            {
                title: "Roles & Permissions",
                url: "/control/setup-config/roles-permissions",
                permissions: ["MANAGE_PERMISSIONS"],
            },
        ],
        permissions: ["VIEW_SETTINGS", "MANAGE_SITE_SETTINGS"],
    },
    {
        title: "Help",
        url: "#",
        icon: HelpCircleIcon,
        collapsibleItems: [],
        permissions: [], // Everyone can see Help
    },
]

export { adminSidebarMenus, adminSecondarySidebarMenus };
