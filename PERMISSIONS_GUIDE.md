# Staff Permission System Guide

## Overview
The EvoTech admin panel uses a role-based permission system that allows administrators to control which features staff members can access.

## System Architecture

### Backend Components

#### 1. Permission Model (`backend/src/app/modules/permission/permission.model.ts`)
```typescript
{
  code: string;        // Unique identifier (e.g., "VIEW_ORDERS")
  name: string;        // Human-readable name (e.g., "View Orders")
  category: string;    // Group permissions (e.g., "Sales")
  description: string; // What this permission allows
  isActive: boolean;   // Enable/disable permissions
}
```

**Categories:**
- Dashboard
- Products
- Sales
- Customers
- Reports
- Staff Management
- Settings
- Reviews
- Inventory

#### 2. Staff Permission Model (`backend/src/app/modules/staff-permission/staff-permission.model.ts`)
```typescript
{
  user: ObjectId;           // Reference to User (staff member)
  permissions: ObjectId[];  // Array of Permission references
  grantedBy: ObjectId;      // Admin who granted permissions
}
```

#### 3. Permission API Endpoints

**GET /api/v1/permissions** (Admin only)
- Fetch all available permissions
- Optional category filter: `?category=Sales`

**GET /api/v1/permissions/my-permissions** (Admin & Employee)
- Fetch current user's permissions
- Admins automatically get all permissions
- Staff get their assigned permissions

**GET /api/v1/permissions/staff/:userUuid** (Admin only)
- Fetch a specific staff member's permissions

**PUT /api/v1/permissions/staff/:userUuid** (Admin only)
- Assign permissions to a staff member
- Body: `{ permissions: ["permission_id_1", "permission_id_2"] }`

### Frontend Components

#### 1. Permissions Context (`frontend/contexts/PermissionsContext.tsx`)

Provides global permission state and checking functions:

```typescript
// Check single permission
hasPermission('VIEW_ORDERS')

// Check if user has ANY of the permissions
hasAnyPermission(['VIEW_ORDERS', 'MANAGE_ORDERS'])

// Check if user has ALL permissions
hasAllPermissions(['VIEW_PRODUCTS', 'EDIT_PRODUCT'])

// Refresh permissions after update
refreshPermissions()
```

**Key Features:**
- Admins bypass all permission checks (always return true)
- Staff permissions fetched from `/api/v1/permissions/my-permissions`
- Permissions cached in context state
- Auto-refresh on mount and when explicitly called

#### 2. Manage Staff Permissions Page

**Location:** `frontend/app/(admins)/control/staff/[staffId]/permissions/page.tsx`

**Features:**
- View all available permissions grouped by category
- See current staff member's assigned permissions
- Select/deselect permissions with checkboxes
- Bulk select/deselect per category
- Color-coded category badges
- Save changes with API call

**Usage:**
1. Navigate to Staff section
2. Click on a staff member
3. Click "Manage Permissions" or navigate to permissions tab
4. Select/deselect desired permissions
5. Click "Save Permissions"

#### 3. Sidebar Menu Filtering (`frontend/components/scn/app-sidebar.tsx`)

The sidebar automatically filters menu items based on staff permissions:

```typescript
// Menu item with permissions
{
  title: "Sales",
  icon: BarChartIcon,
  permissions: ["VIEW_ORDERS"], // Staff must have this permission
  collapsibleItems: [
    {
      title: "All Orders",
      url: "/control/orders",
      permissions: ["VIEW_ORDERS"]
    }
  ]
}
```

**Filtering Logic:**
- Admins see all menu items
- Staff only see items they have permission for
- If no collapsible items are visible, the parent menu is hidden
- Menu items without `permissions` array are visible to everyone

## Seeded Permissions

### Dashboard (1)
| Code | Name | Description |
|------|------|-------------|
| VIEW_DASHBOARD | View Dashboard | Access to view the admin dashboard and analytics overview |

### Products (9)
| Code | Name | Description |
|------|------|-------------|
| VIEW_PRODUCTS | View Products | Access to view all products |
| CREATE_PRODUCT | Create Product | Ability to add new products |
| EDIT_PRODUCT | Edit Product | Ability to modify product details |
| DELETE_PRODUCT | Delete Product | Ability to remove products |
| MANAGE_PRODUCTS | Manage Products | Full access to create, edit, and delete products |
| VIEW_CATEGORIES | View Categories | Access to view categories and subcategories |
| MANAGE_CATEGORIES | Manage Categories | Full access to manage categories |
| VIEW_BRANDS | View Brands | Access to view all brands |
| MANAGE_BRANDS | Manage Brands | Full access to manage brands |

### Sales (5)
| Code | Name | Description |
|------|------|-------------|
| VIEW_ORDERS | View Orders | Access to view all customer orders |
| CREATE_ORDER | Create Order | Ability to create orders on behalf of customers |
| EDIT_ORDER | Edit Order | Ability to modify order details and status |
| DELETE_ORDER | Delete Order | Ability to delete orders |
| MANAGE_ORDERS | Manage Orders | Full access to create, edit, and delete orders |

### Customers (4)
| Code | Name | Description |
|------|------|-------------|
| VIEW_CUSTOMERS | View Customers | Access to view customer information |
| EDIT_CUSTOMER | Edit Customer | Ability to modify customer details |
| DELETE_CUSTOMER | Delete Customer | Ability to remove customers |
| MANAGE_CUSTOMERS | Manage Customers | Full access to manage customer accounts |

### Reports (4)
| Code | Name | Description |
|------|------|-------------|
| VIEW_REPORTS | View Reports | Access to view system reports |
| VIEW_EARNINGS_REPORT | View Earnings Report | Access to view earnings and financial reports |
| VIEW_SALES_REPORT | View Sales Report | Access to view sales analytics |
| EXPORT_REPORTS | Export Reports | Ability to export reports (PDF, Excel, CSV) |

### Staff Management (6)
| Code | Name | Description |
|------|------|-------------|
| VIEW_STAFF | View Staff | Access to view all staff members |
| CREATE_STAFF | Create Staff | Ability to add new staff members |
| EDIT_STAFF | Edit Staff | Ability to modify staff details |
| DELETE_STAFF | Delete Staff | Ability to remove staff members |
| MANAGE_STAFF | Manage Staff | Full access to manage staff members |
| MANAGE_PERMISSIONS | Manage Permissions | Ability to assign/revoke staff permissions |

### Settings (8)
| Code | Name | Description |
|------|------|-------------|
| VIEW_SETTINGS | View Settings | Access to view system settings |
| MANAGE_SITE_SETTINGS | Manage Site Settings | Full access to modify site settings |
| MANAGE_HOMEPAGE | Manage Homepage | Ability to configure homepage layout |
| MANAGE_FEATURES | Manage Features | Ability to enable/disable features |
| MANAGE_SHIPPING | Manage Shipping | Ability to configure shipping and pickup points |
| MANAGE_TAX | Manage Tax | Ability to configure VAT and tax |
| MANAGE_CURRENCY | Manage Currency | Ability to configure currency settings |
| MANAGE_INTEGRATIONS | Manage Integrations | Ability to configure third-party integrations |

### Reviews (2)
| Code | Name | Description |
|------|------|-------------|
| VIEW_REVIEWS | View Reviews | Access to view product reviews |
| MODERATE_REVIEWS | Moderate Reviews | Ability to approve/reject/delete reviews |

### Inventory (2)
| Code | Name | Description |
|------|------|-------------|
| VIEW_INVENTORY | View Inventory | Access to view stock levels |
| MANAGE_INVENTORY | Manage Inventory | Ability to update stock levels |

## How to Use

### 1. Create a Staff User
```bash
# Staff users should have role: "Employee" in the database
```

### 2. Assign Permissions to Staff
1. Login as Admin
2. Navigate to **Control Panel > Staffs > All Staffs**
3. Click on the staff member
4. Click **Manage Permissions** button
5. Select desired permissions
6. Click **Save Permissions**

### 3. Staff Login Experience
When a staff member logs in:
1. They see only the menu items they have permission for
2. Attempting to access unauthorized routes will be blocked
3. Their dashboard shows only the widgets/data they're permitted to view

### 4. Admin vs Staff Behavior
| Feature | Admin | Staff |
|---------|-------|-------|
| Sidebar Menu | See all items | See only permitted items |
| Permission Checks | Always pass | Based on assigned permissions |
| Manage Permissions | ✅ Can assign to staff | ❌ Cannot manage permissions |
| API Access | Full access | Permission-based access |

## Permission Patterns

### Hierarchical Permissions
Some permissions are hierarchical:
- `MANAGE_PRODUCTS` implies `VIEW_PRODUCTS`, `CREATE_PRODUCT`, `EDIT_PRODUCT`, `DELETE_PRODUCT`
- `MANAGE_ORDERS` implies `VIEW_ORDERS`, `CREATE_ORDER`, `EDIT_ORDER`, `DELETE_ORDER`

### Permission Combinations
Menu items can require multiple permissions:
```typescript
// Requires ANY of these permissions
permissions: ["VIEW_PRODUCTS", "MANAGE_CATEGORIES", "MANAGE_BRANDS"]

// Staff needs at least one to see this menu
```

## Adding New Permissions

### 1. Add to Database Seeder
Edit `backend/database/seeders/seedPermissions.ts`:

```typescript
{
    code: 'NEW_PERMISSION_CODE',
    name: 'Permission Name',
    category: 'Category',
    description: 'What this permission allows',
}
```

Run seeder:
```bash
cd backend
npx ts-node database/seeders/seedPermissions.ts
```

### 2. Add to Sidebar Menu
Edit `frontend/dal/staticdata/admin_sidebar_menus.ts`:

```typescript
{
    title: "New Feature",
    url: "/control/new-feature",
    permissions: ["NEW_PERMISSION_CODE"],
}
```

### 3. Add Permission Checks in Components
```typescript
import { usePermissions } from '@/contexts/PermissionsContext';

const { hasPermission } = usePermissions();

if (hasPermission('NEW_PERMISSION_CODE')) {
  // Show feature
}
```

## Testing

### Test with Staff Account
1. Create a test staff user
2. Assign limited permissions (e.g., only `VIEW_ORDERS`)
3. Login as that staff user
4. Verify:
   - Only Sales menu appears in sidebar
   - Cannot access other routes
   - Order page loads correctly
   - Other pages return 403 or redirect

### Test Permission Updates
1. Login as staff with limited permissions
2. Note which menus are visible
3. Admin assigns new permissions
4. Staff refreshes page or calls `refreshPermissions()`
5. New menus should appear

## Troubleshooting

### Staff Can't See Any Menus
**Cause:** No permissions assigned
**Solution:** Admin must assign at least one permission

### Menu Items Not Filtering
**Cause:** PermissionsProvider not wrapping the layout
**Solution:** Check `app/(admins)/layout.tsx` has `<PermissionsProvider>`

### Permission Changes Not Reflecting
**Cause:** Frontend permission cache not refreshed
**Solution:** Call `refreshPermissions()` or refresh the page

### Admin Sees "No Permission" Error
**Cause:** Admin role not correctly identified
**Solution:** Check `session.user.role === "Admin"` in PermissionsContext

## Security Notes

1. **Backend Validation:** Always validate permissions on the backend, not just frontend
2. **JWT Claims:** Consider adding permissions to JWT for faster checks
3. **Route Guards:** Implement middleware to check permissions on API routes
4. **Audit Trail:** Log permission changes for security auditing
5. **Least Privilege:** Assign minimum necessary permissions to staff

## Future Enhancements

- [ ] Role templates (e.g., "Sales Manager" preset with common permissions)
- [ ] Permission expiration dates
- [ ] Temporary permission grants
- [ ] Permission request workflow (staff requests, admin approves)
- [ ] Activity logs showing who accessed what
- [ ] Granular permissions (e.g., "Edit Own Orders" vs "Edit All Orders")
- [ ] Department-based permissions
- [ ] Permission inheritance from roles

## Database Schema

### Permissions Collection
```javascript
{
  _id: ObjectId,
  code: "VIEW_ORDERS",
  name: "View Orders",
  category: "Sales",
  description: "Access to view all customer orders",
  isActive: true,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### Staff Permissions Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId("staff_user_id"),
  permissions: [
    ObjectId("permission_1"),
    ObjectId("permission_2")
  ],
  grantedBy: ObjectId("admin_user_id"),
  createdAt: ISODate,
  updatedAt: ISODate
}
```

## API Examples

### Get All Permissions (Admin)
```bash
GET /api/v1/permissions
Authorization: Bearer <admin_token>
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "code": "VIEW_ORDERS",
      "name": "View Orders",
      "category": "Sales",
      "description": "Access to view all customer orders",
      "isActive": true
    }
  ]
}
```

### Get My Permissions (Staff)
```bash
GET /api/v1/permissions/my-permissions
Authorization: Bearer <staff_token>
```

Response:
```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": {
    "permissions": [
      {
        "_id": "...",
        "code": "VIEW_ORDERS",
        "name": "View Orders",
        "category": "Sales"
      }
    ],
    "permissionCodes": ["VIEW_ORDERS", "EDIT_ORDER"]
  }
}
```

### Assign Permissions to Staff (Admin)
```bash
PUT /api/v1/permissions/staff/abc-123-uuid
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "permissions": ["permission_id_1", "permission_id_2"]
}
```

Response:
```json
{
  "success": true,
  "message": "Permissions updated successfully",
  "data": {
    "user": "abc-123-uuid",
    "permissions": ["permission_id_1", "permission_id_2"],
    "grantedBy": "admin_id"
  }
}
```

---

**Last Updated:** 2024
**Maintained By:** EvoTech Development Team
