import { BarChartIcon, UsersIcon, ChartArea, NotebookText, SquarePercent, BookText, Contact, HelpCircleIcon, Settings2, Container } from "lucide-react";
import { RiBox1Line, RiDashboardHorizontalLine } from "react-icons/ri";


// sidebar menus for admin dashboard
const adminSidebarMenus = [
    {
        title: "Dashboard",
        url: "/control/dashboard",
        icon: RiDashboardHorizontalLine,
        collapsibleItems: [],
    },
    {
        title: "Products",
        icon: RiBox1Line,
        collapsibleItems: [
            {
                title: "All Products",
                url: "/control/products",
            },
            {
                title: "All Categories",
                url: "/control/categories",
            },
            {
                title: "All Sub-Categories",
                url: "/control/subcategories",
            },
            {
                title: "All Brands",
                url: "/control/brands",
            },
        ],
    },
    {
        title: "Sales",
        icon: BarChartIcon,
        collapsibleItems: [
            {
                title: "All Orders",
                url: "/control/orders",
            },
        ],
    },
    {
        title: "Supply",
        icon: Container,
        collapsibleItems: [
            {
                title: "Add New Supply",
                url: "/control/supplies/add",
            },
            {
                title: "All Supplies",
                url: "/control/supplies",
            },
            {
                title: "Add New Shipment",
                url: "/control/shipments/add",
            },
            {
                title: "All Shipments",
                url: "/control/shipments",
            },
        ],
    },
    {
        title: "Customers",
        icon: UsersIcon,
        collapsibleItems: [
            {
                title: "All Customers",
                url: "/control/all-customers",
            },
        ],
    },
    {
        title: "Reports",
        icon: ChartArea,
        collapsibleItems: [
            {
                title: "Earning Report",
                url: "/control/reports/earning",
            },
            {
                title: "In House Products Sale",
                url: "/control/reports/in-house-sale",
            },
            {
                title: "Products Wishlist",
                url: "/control/reports/products-wishlist",
            },
        ],
    },
    {
        title: "Support",
        icon: NotebookText,
        collapsibleItems: [
            {
                title: "Tickets",
                url: "/control/support/tickets",
            },
            {
                title: "Product Queries",
                url: "/control/support/product-queries",
            },
            {
                title: "Contacts",
                url: "/control/support/contacts",
            },
        ],
    },
    {
        title: "Marketing",
        icon: SquarePercent,
        collapsibleItems: [
            {
                title: "Flash Deals",
                url: "/control/marketing/flash-deals",
            },
            {
                title: "Dynamic Popups",
                url: "/control/marketing/dynamic-popups",
            },
            {
                title: "Newsletter",
                url: "/control/marketing/newsletter",
            },
            {
                title: "Subscribers",
                url: "/control/marketing/subscribers",
            },
            {
                title: "Coupons",
                url: "/control/marketing/coupons",
            },
            {
                title: "Referral",
                url: "/control/marketing/referral",
            },
        ],
    },
    {
        title: "Staffs",
        icon: Contact,
        collapsibleItems: [
            {
                title: "All Staffs",
                url: "/control/all-staffs",
            },
        ]
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
            },
            {
                title: "Feature Activation",
                url: "/control/setup-config/feature-activation",
            },
            {
                title: "Pickup Points",
                url: "/control/setup-config/pickup-points",
            },
            {
                title: "Currency",
                url: "/control/setup-config/currency",
            },
            {
                title: "VAT & Tax",
                url: "/control/setup-config/vat-tax",
            },
            {
                title: "Social Media Logins",
                url: "/control/setup-config/social-logins",
            },
            {
                title: "Roles & Permissions",
                url: "/control/setup-config/roles-permissions",
            },
        ],
    },
    {
        title: "Help",
        url: "#",
        icon: HelpCircleIcon,
        collapsibleItems: [],
    },
]

export { adminSidebarMenus, adminSecondarySidebarMenus };
