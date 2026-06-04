# LamCMS Backend Context Document

**Version:** 1.0  
**Date:** May 28, 2026  
**Platform:** .NET 8 ASP.NET Core MVC with Razor Views  
**Database:** SQL Server  
**Repository:** https://github.com/Ndlam0211/CMS-ASP.NET (Branch: Buoi-07)

---

## 1. Project Overview

**Project Name:** LamCMS (Lam Content Management System)

**Business Domain:** Content Management System (CMS) with integrated e-commerce capabilities

**Main Purpose:** 
- Manage blog posts, categories, and content publishing
- Manage products, product categories, and inventory
- Manage customers and orders
- Admin user management with role-based access control

**Target Users:**
- Admin: Full system access (user management, all CRUD operations)
- Editor: Can create/edit posts and manage content
- Customers: Can browse products and place orders (frontend only, not in this backend)

**System Architecture:**
- **Monolithic MVC**: ASP.NET Core MVC with server-side rendered Razor Views for admin panel
- **API Layer**: RESTful API endpoints for frontend integrations (e.g., React at http://localhost:3000)
- **Database**: SQL Server with Entity Framework Core ORM
- **Authentication**: Cookie-based authentication for admin panel
- **CORS**: Enabled for React frontend at http://localhost:3000

**Technology Stack:**
- Runtime: .NET 8
- Web Framework: ASP.NET Core MVC
- ORM: Entity Framework Core
- UI: Razor Views + Bootstrap 5
- API Documentation: Swagger/OpenAPI
- Client Integration: React (CORS enabled)
- Authentication: ASP.NET Core Identity (Cookie-based)

---

## 2. Complete Database Schema

### Entity Relationship Diagram (ERD)

```
Category (1) ??? (N) Post

CategoryProduct (1) ??? (N) Product

Customer (1) ??? (N) Order

Order (1) ??? (N) OrderDetail

Product (1) ??? (N) OrderDetail

User (independent - Admin/Editor accounts)
```

### Database Tables

#### Categories (Blog Post Categories)

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| Id | INT | No | PK, Identity(1,1) | Primary Key |
| Name | NVARCHAR(200) | No | NOT NULL | Category name (3-200 chars) |
| Description | NVARCHAR(1000) | No | NOT NULL | Category description (10-1000 chars) |

**Indexes:**
- PK_Categories (Id)

**Relationships:**
- One Category has many Posts (1:N) - FK: Posts.CategoryId

---

#### Posts (Blog Articles)

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| Id | INT | No | PK, Identity(1,1) | Primary Key |
| Title | NVARCHAR(500) | No | NOT NULL | Post title (5-500 chars) |
| Content | NVARCHAR(MAX) | No | NOT NULL | Post content (20-10000 chars) |
| ImageUrl | NVARCHAR(MAX) | Yes | NULL | Featured image URL (nullable, uploaded to /uploads/) |
| CreatedDate | DATETIME2 | No | DEFAULT (GETDATE()) | Post creation timestamp |
| CategoryId | INT | No | NOT NULL, FK | Foreign key to Categories |

**Indexes:**
- PK_Posts (Id)
- IX_Posts_CategoryId (CategoryId)

**Relationships:**
- Many Posts belong to one Category (N:1) - FK: CategoryId ? Categories.Id

**Validation:**
- Title: Required, StringLength(500, MinimumLength = 5)
- Content: Required, StringLength(10000, MinimumLength = 20)
- CategoryId: Required

---

#### Users (Admin/Editor Accounts)

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| Id | INT | No | PK, Identity(1,1) | Primary Key |
| Username | NVARCHAR(MAX) | No | NOT NULL, UNIQUE | Login username |
| PasswordHash | NVARCHAR(MAX) | No | NOT NULL | Password (plain text, not hashed - as per spec) |
| FullName | NVARCHAR(MAX) | No | NOT NULL | User's full name |
| Role | NVARCHAR(MAX) | No | NOT NULL | Role: "Admin" or "Editor" |

**Indexes:**
- PK_Users (Id)

**Validation:**
- Username: Required, must be unique
- PasswordHash: Required (minimum 8 characters recommended for security)
- FullName: Required
- Role: Required (expected values: "Admin", "Editor")

---

#### CategoriesProducts (Product Categories)

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| Id | INT | No | PK, Identity(1,1) | Primary Key |
| Name | NVARCHAR(100) | No | NOT NULL | Product category name |
| Description | NVARCHAR(MAX) | Yes | NULL | Category description |

**Indexes:**
- PK_CategoriesProducts (Id)

**Relationships:**
- One CategoryProduct has many Products (1:N) - FK: Products.CategoryProductId

**Validation:**
- Name: Required, StringLength(100)

---

#### Products (E-commerce Products)

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| Id | INT | No | PK, Identity(1,1) | Primary Key |
| Name | NVARCHAR(MAX) | No | NOT NULL | Product name |
| Description | NVARCHAR(MAX) | Yes | NULL | Product description |
| Price | DECIMAL(18,2) | No | NOT NULL | Product price |
| StockQuantity | INT | No | NOT NULL | Available stock quantity |
| ImageUrl | NVARCHAR(MAX) | Yes | NULL | Product image URL (nullable, uploaded to /uploads/) |
| CategoryProductId | INT | No | NOT NULL, FK | Foreign key to CategoriesProducts |

**Indexes:**
- PK_Products (Id)
- IX_Products_CategoryProductId (CategoryProductId)

**Relationships:**
- Many Products belong to one CategoryProduct (N:1) - FK: CategoryProductId ? CategoriesProducts.Id
- One Product has many OrderDetails (1:N) - FK: OrderDetails.ProductId

**Validation:**
- Name: Required
- Price: Range(0, double.MaxValue)
- CategoryProductId: Required

---

#### Customers (E-commerce Customers)

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| Id | INT | No | PK, Identity(1,1) | Primary Key |
| FullName | NVARCHAR(MAX) | No | NOT NULL | Customer's full name |
| Email | NVARCHAR(MAX) | No | NOT NULL | Customer email address |
| Phone | NVARCHAR(MAX) | Yes | NULL | Phone number |
| Address | NVARCHAR(MAX) | Yes | NULL | Delivery address |
| Password | NVARCHAR(MAX) | No | NOT NULL | Customer password (plain text as per spec) |

**Indexes:**
- PK_Customers (Id)

**Relationships:**
- One Customer has many Orders (1:N) - FK: Orders.CustomerId

**Validation:**
- FullName: Required
- Email: Required, valid email format
- Password: Required

---

#### Orders (Customer Orders)

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| Id | INT | No | PK, Identity(1,1) | Primary Key |
| Status | INT | No | NOT NULL | Order status: 0=Pending, 1=Shipping, 2=Completed |
| Notes | NVARCHAR(MAX) | Yes | NULL | Order notes/comments |
| OrderDate | DATETIME2 | No | NOT NULL, DEFAULT GETDATE() | Order creation date (auto-set) |
| CustomerId | INT | No | NOT NULL, FK | Foreign key to Customers |

**Indexes:**
- PK_Orders (Id)
- IX_Orders_CustomerId (CustomerId)

**Relationships:**
- Many Orders belong to one Customer (N:1) - FK: CustomerId ? Customers.Id
- One Order has many OrderDetails (1:N) - FK: OrderDetails.OrderId

**Validation:**
- CustomerId: Required

---

#### OrderDetails (Order Line Items)

| Column | Type | Nullable | Constraints | Description |
|--------|------|----------|-------------|-------------|
| Id | INT | No | PK, Identity(1,1) | Primary Key |
| OrderId | INT | No | NOT NULL, FK | Foreign key to Orders |
| ProductId | INT | No | NOT NULL, FK | Foreign key to Products |
| Quantity | INT | No | NOT NULL | Quantity ordered |
| UnitPrice | DECIMAL(18,2) | No | NOT NULL | Price at time of purchase |

**Indexes:**
- PK_OrderDetails (Id)
- IX_OrderDetails_OrderId (OrderId)
- IX_OrderDetails_ProductId (ProductId)

**Relationships:**
- Many OrderDetails belong to one Order (N:1) - FK: OrderId ? Orders.Id
- Many OrderDetails reference one Product (N:1) - FK: ProductId ? Products.Id

---

## 3. Entity Documentation

### Entity: Category

**Purpose:** Blog post categories for organizing content

**Fields:**
- `Id` (int): Primary key, auto-increment
- `Name` (string): Category name (required, 3-200 characters)
- `Description` (string): Category description (required, 10-1000 characters)

**Navigation Properties:**
- `Posts` (ICollection<Post>): One-to-many relationship with posts

**Usage:**
- Categorize blog posts
- Display on frontend as filter options
- Referenced by Post entity

---

### Entity: Post

**Purpose:** Blog articles/content published on the platform

**Fields:**
- `Id` (int): Primary key, auto-increment
- `Title` (string): Post title (required, 5-500 characters)
- `Content` (string): Post body content (required, 20-10000 characters)
- `ImageUrl` (string): Featured image URL (nullable)
- `CreatedDate` (DateTime): Publication date (auto-set to DateTime.Now)
- `CategoryId` (int): Foreign key to Category (required)

**Navigation Properties:**
- `Category` (Category): Many-to-one relationship with Category entity

**Usage:**
- Blog article management
- Category filtering
- Displays latest 3 posts on admin dashboard

---

### Entity: User

**Purpose:** Admin and editor accounts for system management

**Fields:**
- `Id` (int): Primary key, auto-increment
- `Username` (string): Login username (required, must be unique)
- `PasswordHash` (string): Password (required, stored as plain text as per specification)
- `FullName` (string): User's full name (required)
- `Role` (string): User role (required, expected: "Admin" or "Editor")

**Usage:**
- Authentication and authorization
- Admin panel user accounts
- Role-based access control (Admin-only endpoints)

---

### Entity: CategoryProduct

**Purpose:** Categories for e-commerce products

**Fields:**
- `Id` (int): Primary key, auto-increment
- `Name` (string): Category name (required, max 100 characters)
- `Description` (string): Category description (optional)

**Navigation Properties:**
- `Products` (ICollection<Product>): One-to-many relationship with products

**Usage:**
- Organize products by category
- Filter products by category
- Display category options in dropdowns

---

### Entity: Product

**Purpose:** E-commerce product catalog items

**Fields:**
- `Id` (int): Primary key, auto-increment
- `Name` (string): Product name (required)
- `Description` (string): Product description (optional)
- `Price` (decimal): Product price in currency units (required, decimal 18,2)
- `StockQuantity` (int): Available stock quantity (required)
- `ImageUrl` (string): Product image URL (nullable, stored in /uploads/)
- `CategoryProductId` (int): Foreign key to CategoryProduct (required)

**Navigation Properties:**
- `CategoryProduct` (CategoryProduct): Many-to-one relationship
- `OrderDetails` (ICollection<OrderDetail>): One-to-many relationship

**Usage:**
- Product catalog
- Shopping and orders
- Inventory tracking

---

### Entity: Customer

**Purpose:** E-commerce customer accounts (for order placement)

**Fields:**
- `Id` (int): Primary key, auto-increment
- `FullName` (string): Customer's full name (required)
- `Email` (string): Email address (required, must be valid format)
- `Phone` (string): Phone number (optional)
- `Address` (string): Delivery address (optional)
- `Password` (string): Customer password (required, plain text as per spec)

**Navigation Properties:**
- `Orders` (ICollection<Order>): One-to-many relationship with orders

**Usage:**
- Customer profile management
- Order history tracking
- Order creation association

---

### Entity: Order

**Purpose:** Customer orders placed through the system

**Fields:**
- `Id` (int): Primary key, auto-increment
- `Status` (int): Order status (0=Pending, 1=Shipping, 2=Completed)
- `Notes` (string): Order notes/special requests (optional)
- `OrderDate` (DateTime): Order creation timestamp (auto-set via SQL Server GETDATE())
- `CustomerId` (int): Foreign key to Customer (required)

**Navigation Properties:**
- `Customer` (Customer): Many-to-one relationship
- `OrderDetails` (ICollection<OrderDetail>): One-to-many relationship

**Usage:**
- Order management
- Track customer purchases
- Order status tracking

---

### Entity: OrderDetail

**Purpose:** Line items within an order (products ordered)

**Fields:**
- `Id` (int): Primary key, auto-increment
- `OrderId` (int): Foreign key to Order (required)
- `ProductId` (int): Foreign key to Product (required)
- `Quantity` (int): Quantity of product ordered (required)
- `UnitPrice` (decimal): Price per unit at time of purchase (required, decimal 18,2)

**Navigation Properties:**
- `Order` (Order): Many-to-one relationship
- `Product` (Product): Many-to-one relationship

**Usage:**
- Store individual items in each order
- Track historical pricing (price at time of order)
- Calculate order totals

---

## 4. DTO Documentation

### Request DTOs

#### OrderInputDTO

**Purpose:** Receive order creation data from frontend

**Fields:**
```csharp
public int CustomerId { get; set; }      // Required: Existing customer ID
public string Notes { get; set; }         // Optional: Order notes
```

**Usage Location:** `POST /api/Orders`

**Example Request:**
```json
{
  "customerId": 1,
  "notes": "Please deliver before 5 PM"
}
```

---

### Response Models

#### PaginatedList<T>

**Purpose:** Wrap list results with pagination metadata (used across all list endpoints)

**Fields:**
```csharp
public List<T> Items { get; set; }               // List of items on current page
public int CurrentPage { get; set; }             // Current page number (1-indexed)
public int TotalPages { get; set; }              // Total number of pages
public int PageSize { get; set; }                // Items per page
public int TotalItems { get; set; }              // Total items across all pages
public bool HasPreviousPage { get; }             // Computed: whether previous page exists
public bool HasNextPage { get; }                 // Computed: whether next page exists
public int StartIndex { get; }                   // Computed: 1-based index of first item on page
public int EndIndex { get; }                     // Computed: 1-based index of last item on page
```

**Example Response Structure:**
```json
{
  "items": [ /* array of entities */ ],
  "currentPage": 1,
  "totalPages": 5,
  "pageSize": 10,
  "totalItems": 47,
  "hasPreviousPage": false,
  "hasNextPage": true,
  "startIndex": 1,
  "endIndex": 10
}
```

---

## 5. Complete REST API Documentation

### Authentication & Authorization

**Authentication Method:** Cookie-based (ASP.NET Core Identity)

**Protected Routes:** 
- All MVC controller actions require `[Authorize]` attribute
- Most endpoints require login via `/Account/Login`
- Admin-only endpoints require `[Authorize(Roles = "Admin")]`

**CORS Configuration:**
- Allowed Origin: `http://localhost:3000`
- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed Headers: All
- Credentials: Allowed

---

### Account Management

#### POST /Account/Login

**Description:** User login endpoint

**Authentication:** Not required

**Request Method:** POST

**Request Body (Form-Encoded):**
```
username: string (required)
password: string (required)
```

**Response on Success:** 
- Status: 302 Redirect to Home/Index
- Sets authentication cookie

**Response on Failure:**
- Status: 200 OK
- Returns Login view with error message: "T�n ??ng nh?p ho?c m?t kh?u kh�ng ?�ng!"

**Validation Rules:**
- username: Required (error: "T�n ??ng nh?p kh�ng ???c ?? tr?ng!")
- password: Required (error: "M?t kh?u kh�ng ???c ?? tr?ng!")

**Notes:**
- Username and password stored in User entity with plain text comparison
- Claims set: ClaimTypes.Name, ClaimTypes.Role, "FullName"
- Redirects to Home/Index on successful login
- Persists failed input values in ViewBag for UX

---

#### GET /Account/Logout

**Description:** User logout endpoint

**Authentication:** Required

**Request Method:** GET

**Response:**
- Status: 302 Redirect to Account/Login
- Clears authentication cookie

---

### Home/Dashboard

#### GET /Home/Index

**Description:** Admin dashboard with system overview

**Authentication:** Required

**Response Body (ViewBag data):**
```csharp
ViewBag.TotalPosts              // int: Total post count
ViewBag.TotalCategories          // int: Total category count
ViewBag.TotalUsers               // int: Total user count
ViewBag.TotalCustomers           // int: Total customer count
ViewBag.TotalOrders              // int: Total order count
ViewBag.TotalProducts            // int: Total product count
ViewBag.TotalCategoryProducts     // int: Total product category count
```

**Model (View Data):**
- List<Post>: Latest 3 posts (ordered by CreatedDate descending, include Category)

---

### Blog Management

#### GET /Post/Index

**Description:** List all blog posts with pagination and category filtering

**Authentication:** Required

**Query Parameters:**
- `page` (int, optional): Page number (default: 1, minimum: 1)
- `pageSize` (int, optional): Items per page (default: 10, range: 5-50)
- `categoryId` (int, optional): Filter by category ID

**Response:**
- Model: `PaginatedList<Post>`
- ViewBag.PageSize: Current page size
- ViewBag.SelectedCategoryId: Selected category filter
- ViewBag.Categories: List<Category> for dropdown

**Sorting:** By CreatedDate descending

---

#### GET /Post/Details/{id}

**Description:** Display single post details

**Authentication:** Required

**URL Parameters:**
- `id` (int): Post ID

**Response:**
- Model: Post entity (includes Category via Include)
- Status: 404 NotFound if post doesn't exist

---

#### GET /Post/Create

**Description:** Display post creation form

**Authentication:** Required

**Response:**
- ViewData["Categories"]: List<Category> for dropdown

---

#### POST /Post/Create

**Description:** Create new blog post with image upload

**Authentication:** Required

**Request Body (Form-Multipart):**
```csharp
public string Title { get; set; }              // Required: 5-500 chars
public string Content { get; set; }            // Required: 20-10000 chars
public int CategoryId { get; set; }            // Required: Valid category ID
public IFormFile uploadImage { get; set; }     // Required: Image file (new posts)
```

**Validation Rules:**
- Title: Required, StringLength(500, MinimumLength=5)
- Content: Required, StringLength(10000, MinimumLength=20)
- CategoryId: Required, must exist in database
- uploadImage: Required, file types: JPG, PNG, GIF (max 5MB)

**File Upload Details:**
- Stored in: `wwwroot/uploads/` directory
- Filename: GUID-based unique name (e.g., `f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg`)
- URL stored: `/uploads/{filename}` (relative path)

**Response on Success:**
- Status: 302 Redirect to Post/Index

**Response on Validation Failure:**
- Status: 200 OK
- Returns Create view with ModelState errors
- ViewData["Categories"] repopulated

**Error Messages:**
- "H�nh ?nh b�i vi?t kh�ng ???c ?? tr?ng"
- "Ch? ch?p nh?n file ?nh (JPG, PNG, GIF)"
- "K�ch th??c file kh�ng ???c v??t qu� 5MB"

---

#### GET /Post/Edit/{id}

**Description:** Display post edit form

**Authentication:** Required

**URL Parameters:**
- `id` (int): Post ID

**Response:**
- Model: Post entity
- ViewData["Categories"]: List<Category>
- Status: 404 NotFound if not found

---

#### POST /Post/Edit/{id}

**Description:** Update existing post (optional image re-upload)

**Authentication:** Required

**URL Parameters:**
- `id` (int): Post ID

**Request Body (Form-Multipart):**
```csharp
public int Id { get; set; }                    // Required: Must match URL parameter
public string Title { get; set; }              // Required: 5-500 chars
public string Content { get; set; }            // Required: 20-10000 chars
public string ImageUrl { get; set; }           // Auto-populated from DB if not uploading new
public DateTime CreatedDate { get; set; }      // Preserved from DB
public int CategoryId { get; set; }            // Required: Valid category ID
public IFormFile uploadImage { get; set; }     // Optional: If provided, replace image
```

**Image Handling:**
- If uploadImage provided: Validate, upload, store new URL
- If uploadImage null/empty: Preserve existing ImageUrl from database

**Response on Success:**
- Status: 302 Redirect to Post/Index

**Response on Failure:**
- Status: 200 OK
- Returns Edit view with errors
- ViewData["Categories"] repopulated

---

#### GET /Post/Delete/{id}

**Description:** Display post delete confirmation

**Authentication:** Required

**URL Parameters:**
- `id` (int): Post ID

**Response:**
- Model: Post entity (includes Category)
- Status: 404 NotFound if not found

---

#### POST /Post/Delete/{id}

**Description:** Confirm and delete post

**Authentication:** Required

**URL Parameters:**
- `id` (int): Post ID

**Response on Success:**
- Status: 302 Redirect to Post/Index
- Post and associated relationships cascade deleted

---

### Category Management (Blog)

#### GET /Category/Index

**Description:** List blog post categories with pagination

**Authentication:** Required

**Query Parameters:**
- `page` (int, optional): Page number (default: 1)
- `pageSize` (int, optional): Items per page (default: 10, range: 5-50)

**Response:**
- Model: `PaginatedList<Category>`
- ViewBag.PageSize: Current page size

---

#### GET /Category/Details/{id}

**Description:** Display single category

**Authentication:** Required

**URL Parameters:**
- `id` (int): Category ID

**Response:**
- Model: Category entity

---

#### GET /Category/Create

**Description:** Display category creation form

**Authentication:** Required

---

#### POST /Category/Create

**Description:** Create new blog post category

**Authentication:** Required

**Request Body (Form-Encoded):**
```csharp
public string Name { get; set; }               // Required: 3-200 chars
public string Description { get; set; }        // Required: 10-1000 chars
```

**Validation Rules:**
- Name: Required, StringLength(200, MinimumLength=3)
- Description: Required, StringLength(1000, MinimumLength=10)

**Response on Success:**
- Status: 302 Redirect to Category/Index

**Response on Failure:**
- Status: 200 OK
- Returns Create view with validation errors

---

#### GET /Category/Edit/{id}

**Description:** Display category edit form

**Authentication:** Required

**URL Parameters:**
- `id` (int): Category ID

---

#### POST /Category/Edit/{id}

**Description:** Update blog post category

**Authentication:** Required

**URL Parameters:**
- `id` (int): Category ID

**Request Body:**
```csharp
public int Id { get; set; }
public string Name { get; set; }               // Required: 3-200 chars
public string Description { get; set; }        // Required: 10-1000 chars
```

---

#### GET /Category/Delete/{id}

**Description:** Display category delete confirmation

**Authentication:** Required

---

#### POST /Category/Delete/{id}

**Description:** Confirm and delete category

**Authentication:** Required

---

### User Management

#### GET /User/Index

**Description:** List admin users with pagination

**Authentication:** Required

**Authorization:** Admin role required (`[Authorize(Roles="Admin")]`)

**Query Parameters:**
- `page` (int, optional): Page number (default: 1)
- `pageSize` (int, optional): Items per page (default: 10, range: 5-100)

**Response:**
- Model: `PaginatedList<User>`
- ViewBag.PageSize: Current page size

---

#### GET /User/Details/{id}

**Description:** Display single user details

**Authentication:** Required

**Authorization:** Admin role required

**URL Parameters:**
- `id` (int): User ID

---

#### GET /User/Create

**Description:** Display user creation form

**Authentication:** Required

**Authorization:** Admin role required

---

#### POST /User/Create

**Description:** Create new admin/editor user

**Authentication:** Required

**Authorization:** Admin role required

**Request Body:**
```csharp
public string Username { get; set; }           // Required: Must be unique
public string PasswordHash { get; set; }       // Required: Plain text (min 8 chars recommended)
public string FullName { get; set; }           // Required
public string Role { get; set; }               // Required: "Admin" or "Editor"
```

**Validation Rules:**
- Username: Required, must be unique (error: "T�n ??ng nh?p n�y ?� c� ng??i d�ng!")
- PasswordHash: Required
- FullName: Required
- Role: Required

**Response on Success:**
- Status: 302 Redirect to User/Index

**Response on Failure:**
- Status: 200 OK
- Returns Create view with validation errors

---

#### GET /User/Edit/{id}

**Description:** Display user edit form

**Authentication:** Required

**Authorization:** Admin role required

---

#### POST /User/Edit/{id}

**Description:** Update user account

**Authentication:** Required

**Authorization:** Admin role required

---

#### GET /User/Delete/{id}

**Description:** Display user delete confirmation

**Authentication:** Required

**Authorization:** Admin role required

---

#### POST /User/Delete/{id}

**Description:** Confirm and delete user account

**Authentication:** Required

**Authorization:** Admin role required

---

### Product Management

#### GET /Product/Index

**Description:** List products with pagination, category filtering, and price sorting

**Authentication:** Required

**Query Parameters:**
- `page` (int, optional): Page number (default: 1, minimum: 1)
- `pageSize` (int, optional): Items per page (default: 10, range: 5-100)
- `categoryProductId` (int, optional): Filter by product category ID
- `sortPrice` (string, optional): Sort direction "asc" or "desc" (default: by ID)

**Response:**
- Model: `PaginatedList<Product>`
- ViewBag.PageSize: Current page size
- ViewBag.CategoryProducts: List<CategoryProduct> for dropdown
- ViewBag.SelectedCategoryId: Selected filter
- ViewBag.SelectedSortPrice: Selected sort option

**Sorting Logic:**
- If sortPrice="asc": Order by Price ascending
- If sortPrice="desc": Order by Price descending
- Otherwise: Order by Id ascending

---

#### GET /Product/Details/{id}

**Description:** Display single product details

**Authentication:** Required

**URL Parameters:**
- `id` (int): Product ID

**Response:**
- Model: Product entity (includes CategoryProduct)

---

#### GET /Product/Create

**Description:** Display product creation form

**Authentication:** Required

**Response:**
- ViewBag.CategoryProducts: List<CategoryProduct> for dropdown

---

#### POST /Product/Create

**Description:** Create new product with image upload

**Authentication:** Required

**Request Body (Form-Multipart):**
```csharp
public string Name { get; set; }               // Required
public string Description { get; set; }        // Optional
public decimal Price { get; set; }             // Required: >= 0
public int StockQuantity { get; set; }         // Required
public int CategoryProductId { get; set; }     // Required
public IFormFile uploadImage { get; set; }     // Optional for Create
```

**Validation Rules:**
- Name: Required
- Price: Required, Range(0, double.MaxValue)
- CategoryProductId: Required
- uploadImage: If provided, must be JPG/PNG/GIF, max 5MB

**File Upload Details:**
- Same as Post: stored in `wwwroot/uploads/`, GUID-based filename
- URL stored: `/uploads/{filename}`

**Response on Success:**
- Status: 302 Redirect to Product/Index

**Response on Failure:**
- Status: 200 OK
- Returns Create view with validation errors

---

#### GET /Product/Edit/{id}

**Description:** Display product edit form

**Authentication:** Required

**URL Parameters:**
- `id` (int): Product ID

---

#### POST /Product/Edit/{id}

**Description:** Update product (optional image re-upload)

**Authentication:** Required

**URL Parameters:**
- `id` (int): Product ID

**Request Body:**
```csharp
public int Id { get; set; }                    // Required: Must match URL
public string Name { get; set; }               // Required
public string Description { get; set; }        // Optional
public decimal Price { get; set; }             // Required
public int StockQuantity { get; set; }         // Required
public string ImageUrl { get; set; }           // Auto-preserved from DB if not uploading
public int CategoryProductId { get; set; }     // Required
public IFormFile uploadImage { get; set; }     // Optional: If provided, replace image
```

**Image Handling:**
- If uploadImage provided: Validate, upload, store new URL
- If uploadImage null: Query DB for old product, preserve existing ImageUrl

---

#### GET /Product/Delete/{id}

**Description:** Display product delete confirmation

**Authentication:** Required

---

#### POST /Product/Delete/{id}

**Description:** Confirm and delete product

**Authentication:** Required

---

### Product Category Management

#### GET /CategoryProduct/Index

**Description:** List product categories with pagination

**Authentication:** Required

**Query Parameters:**
- `page` (int, optional): Page number (default: 1)
- `pageSize` (int, optional): Items per page (default: 10, range: 5-100)

**Response:**
- Model: `PaginatedList<CategoryProduct>`
- ViewBag.PageSize: Current page size

---

#### GET /CategoryProduct/Details/{id}

**Description:** Display product category details

**Authentication:** Required

**URL Parameters:**
- `id` (int): CategoryProduct ID

**Response:**
- Model: CategoryProduct (includes Products collection)

---

#### GET /CategoryProduct/Create

**Description:** Display product category creation form

**Authentication:** Required

---

#### POST /CategoryProduct/Create

**Description:** Create new product category

**Authentication:** Required

**Request Body:**
```csharp
public string Name { get; set; }               // Required: max 100 chars
public string Description { get; set; }        // Optional
```

---

#### GET /CategoryProduct/Edit/{id}

**Description:** Display product category edit form

**Authentication:** Required

---

#### POST /CategoryProduct/Edit/{id}

**Description:** Update product category

**Authentication:** Required

---

#### GET /CategoryProduct/Delete/{id}

**Description:** Display product category delete confirmation

**Authentication:** Required

---

#### POST /CategoryProduct/Delete/{id}

**Description:** Confirm and delete product category

**Authentication:** Required

---

### Customer Management

#### GET /Customer/Index

**Description:** List all customers (no pagination currently)

**Authentication:** Required

**Response:**
- Model: List<Customer>

---

#### GET /Customer/Details/{id}

**Description:** Display customer details with order history

**Authentication:** Required

**URL Parameters:**
- `id` (int): Customer ID

**Response:**
- Model: Customer (includes Orders collection)

---

#### GET /Customer/Create

**Description:** Display customer creation form

**Authentication:** Required

---

#### POST /Customer/Create

**Description:** Create new customer account

**Authentication:** Required

**Request Body:**
```csharp
public string FullName { get; set; }           // Required
public string Email { get; set; }              // Required: Valid email format
public string Phone { get; set; }              // Optional
public string Address { get; set; }            // Optional
public string Password { get; set; }           // Required
```

**Validation Rules:**
- FullName: Required
- Email: Required, EmailAddress format
- Password: Required

---

#### GET /Customer/Edit/{id}

**Description:** Display customer edit form

**Authentication:** Required

---

#### POST /Customer/Edit/{id}

**Description:** Update customer account

**Authentication:** Required

---

#### GET /Customer/Delete/{id}

**Description:** Display customer delete confirmation

**Authentication:** Required

---

#### POST /Customer/Delete/{id}

**Description:** Confirm and delete customer

**Authentication:** Required

---

### Orders API

#### POST /api/Orders

**Description:** Create new customer order (REST API endpoint for frontend)

**Authentication:** Not required (CORS-enabled for React frontend)

**Route:** `[Route("api/[controller]")] [ApiController]`

**Request Body (JSON):**
```json
{
  "customerId": 1,
  "notes": "Please deliver by Friday"
}
```

**Request DTO:**
```csharp
public class OrderInputDTO
{
  public int CustomerId { get; set; }
  public string Notes { get; set; }
}
```

**Response on Success (201 Created):**
```json
{
  "message": "??t h�ng th�nh c�ng!",
  "orderId": 5
}
```

**Response on Failure:**

**400 Bad Request** (invalid input):
```json
{
  "message": "D? li?u ??n h�ng kh�ng h?p l?"
}
```

**404 Not Found** (customer doesn't exist):
```json
{
  "message": "Kh�ch h�ng kh�ng t?n t?i v?i ID: 999"
}
```

**500 Internal Server Error**:
```json
{
  "message": "L?i x? l� t?o ??n h�ng ng?m",
  "detail": "Exception message details"
}
```

**Order Creation Logic:**
1. Validate OrderInputDTO not null
2. Check if CustomerId exists in Customers table
3. Create new Order with:
   - OrderDate: Auto-set to GETDATE() via SQL Server default
   - Status: 0 (Pending)
   - CustomerId: From DTO
   - Notes: From DTO
4. Save and return generated Order ID

**Notes:**
- CORS enabled for http://localhost:3000
- OrderDate automatically set by database
- Status defaults to 0 (pending review/processing)

---

## 6. Authentication & Authorization

### Authentication Scheme

**Type:** Cookie-based Authentication (ASP.NET Core Identity)

**Configuration:**
- Scheme: `CookieAuthenticationDefaults.AuthenticationScheme`
- LoginPath: `/Account/Login`
- AccessDeniedPath: `/Account/AccessDenied`

**Claims Set on Login:**
- `ClaimTypes.Name`: Username
- `ClaimTypes.Role`: User role ("Admin" or "Editor")
- `"FullName"`: Full name

**Cookie Storage:** Signed HTTP-only cookies stored in browser

---

### Roles & Permissions

**Roles Defined:**
1. **Admin**
   - Can access all endpoints
   - User management (create/edit/delete users)
   - Full CMS control
   - Full e-commerce control
   - Attribute: `[Authorize(Roles="Admin")]`

2. **Editor**
   - Can create/edit/delete posts
   - Can manage categories
   - Cannot manage users
   - Cannot manage products/orders (implied by absence of Editor-specific endpoints)
   - Attribute: `[Authorize]` (generic authorization)

---

### Protected Endpoints

**All MVC Views (Razor Pages)** require `[Authorize]`:
- All Category endpoints
- All Post endpoints
- All User endpoints (also `[Authorize(Roles="Admin")]`)
- All Product endpoints
- All ProductCategory endpoints
- All Customer endpoints
- Home/Dashboard endpoints

**Admin-Only:**
- `/User/Index`, `/User/Create`, `/User/Edit/*`, `/User/Delete/*`, `/User/Details/*`

**Public/CORS Endpoints:**
- `POST /api/Orders` (no authentication, CORS enabled)

---

### CORS Configuration

**Allowed Origins:**
- `http://localhost:3000` (React development server)

**Allowed Methods:**
- GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers:**
- All headers

**Credentials:**
- Allowed (supports cookie/session transmission)

---

## 7. Validation Rules

### Global Validation Annotations

All validation attributes applied via C# `[DataAnnotations]` namespace:

### Category

- **Name**
  - Required: Yes (ErrorMessage: "T�n danh m?c kh�ng ???c ?? tr?ng")
  - StringLength: 3-200 characters (ErrorMessage: "T�n danh m?c ph?i t? 3 ??n 200 k� t?")

- **Description**
  - Required: Yes (ErrorMessage: "M� t? kh�ng ???c ?? tr?ng")
  - StringLength: 10-1000 characters (ErrorMessage: "M� t? ph?i t? 10 ??n 1000 k� t?")

### Post

- **Title**
  - Required: Yes (ErrorMessage: "Ti�u ?? b�i vi?t kh�ng ???c ?? tr?ng")
  - StringLength: 5-500 characters (ErrorMessage: "Ti�u ?? ph?i t? 5 ??n 500 k� t?")

- **Content**
  - Required: Yes (ErrorMessage: "N?i dung b�i vi?t kh�ng ???c ?? tr?ng")
  - StringLength: 20-10000 characters (ErrorMessage: "N?i dung ph?i t? 20 ??n 10000 k� t?")

- **ImageUrl**
  - Required: Yes for Create (enforced in controller)
  - Nullable: Yes for Edit (optional re-upload)
  - File type: JPG, PNG, GIF
  - File size: Max 5MB
  - Error messages:
    - "H�nh ?nh b�i vi?t kh�ng ???c ?? tr?ng" (no file)
    - "Ch? ch?p nh?n file ?nh (JPG, PNG, GIF)" (invalid type)
    - "K�ch th??c file kh�ng ???c v??t qu� 5MB" (too large)

- **CategoryId**
  - Required: Yes (ErrorMessage: "Danh m?c b�i vi?t kh�ng ???c ?? tr?ng")
  - Must exist in Categories table

### User

- **Username**
  - Required: Yes (ErrorMessage: "T�n ??ng nh?p kh�ng ???c ?? tr?ng")
  - Must be unique (enforced in controller)
  - Error: "T�n ??ng nh?p n�y ?� c� ng??i d�ng!"

- **PasswordHash**
  - Required: Yes (ErrorMessage: "M?t kh?u kh�ng ???c ?? tr?ng")
  - Note: Stored as plain text as per project specification

- **FullName**
  - Required: Yes

- **Role**
  - Required: Yes
  - Expected values: "Admin", "Editor"

### Product

- **Name**
  - Required: Yes

- **Price**
  - Required: Yes
  - Range: 0 to double.MaxValue

- **ImageUrl**
  - Required: No (optional)
  - File type: JPG, PNG, GIF
  - File size: Max 5MB
  - If provided: Validate and upload

- **CategoryProductId**
  - Required: Yes
  - Must exist in CategoriesProducts table

- **StockQuantity**
  - Required: Yes (implicitly, not nullable int)

### Customer

- **FullName**
  - Required: Yes

- **Email**
  - Required: Yes
  - Format: Valid email address (EmailAddress annotation)

- **Password**
  - Required: Yes

- **Phone**
  - Required: No (nullable)

- **Address**
  - Required: No (nullable)

### CategoryProduct

- **Name**
  - Required: Yes
  - StringLength: Max 100 characters

- **Description**
  - Required: No (nullable)

---

## 8. Pagination Standard

### Pagination Query Parameters

**Standard Across All List Endpoints:**
- `page` (int, default: 1)
  - Must be >= 1 (enforced in controller: `if (page < 1) page = 1`)
  - 1-indexed (first page is page 1)

- `pageSize` (int, default: varies by endpoint)
  - Minimum enforced per endpoint
  - Maximum enforced per endpoint
  - Common ranges: 5-50 items, or 5-100 items for users

### Pagination Response Structure

All list endpoints return `PaginatedList<T>` with:

```csharp
public List<T> Items                    // Array of items on current page
public int CurrentPage                  // Current page number
public int TotalPages                   // Total pages (calculated)
public int PageSize                     // Items per page
public int TotalItems                   // Total items across all pages
public bool HasPreviousPage             // Computed: CurrentPage > 1
public bool HasNextPage                 // Computed: CurrentPage < TotalPages
public int StartIndex                   // 1-based index of first item on page
public int EndIndex                     // 1-based index of last item on page
```

### Calculation Logic

```csharp
TotalPages = Ceiling(TotalItems / PageSize)
StartIndex = (CurrentPage - 1) * PageSize + 1
EndIndex = Min(StartIndex + PageSize - 1, TotalItems)
HasPreviousPage = CurrentPage > 1
HasNextPage = CurrentPage < TotalPages
```

### Endpoint-Specific Defaults

| Endpoint | Default PageSize | Min | Max |
|----------|------------------|-----|-----|
| Category/Index | 10 | 5 | 50 |
| Post/Index | 10 | 5 | 50 |
| Product/Index | 10 | 5 | 100 |
| CategoryProduct/Index | 10 | 5 | 100 |
| User/Index | 10 | 5 | 100 |
| Customer/Index | No pagination (all) | N/A | N/A |

### ViewBag Data Passed to Views

- `ViewBag.PageSize`: Current page size (for dropdown selector)
- `ViewBag.CurrentPage`: Current page (implicit from model)
- `ViewBag.TotalPages`: Total pages (implicit from model)

---

## 9. Filtering & Sorting

### Post Filtering

**Endpoint:** `GET /Post/Index`

**Available Filters:**
- `categoryId` (int, optional): Filter posts by category ID
  - Query parameter: `categoryId=2`
  - Implementation: `query.Where(p => p.CategoryId == categoryId.Value)`

**Sort Options:**
- Default: By CreatedDate descending (newest first)
- No user-configurable sort on frontend

**Query String Example:**
```
/Post/Index?page=1&pageSize=10&categoryId=3
```

---

### Product Filtering & Sorting

**Endpoint:** `GET /Product/Index`

**Available Filters:**
- `categoryProductId` (int, optional): Filter products by product category
  - Query parameter: `categoryProductId=2`
  - Implementation: `query.Where(p => p.CategoryProductId == categoryProductId.Value)`

**Available Sort Options:**
- `sortPrice` (string, optional):
  - Value "asc": Order by Price ascending
  - Value "desc": Order by Price descending
  - Default (omitted or other): Order by Id ascending
  - Query parameter: `sortPrice=asc` or `sortPrice=desc`

**Query String Examples:**
```
/Product/Index?page=1&pageSize=10&categoryProductId=2&sortPrice=asc
/Product/Index?page=2&pageSize=20
/Product/Index?categoryProductId=1
```

### UI Component: Filter Bar (Product/Index View)

Components included:
- Page Size dropdown (5, 10, 20, 50, 100)
- Category filter dropdown (populated from ViewBag.CategoryProducts)
- Price sort dropdown (Ascending, Descending, Default)
- Reset button (clears all filters)
- Apply filters via form submission

---

## 10. File Upload APIs

### Upload Endpoints

Two main upload flows:

#### Post Image Upload

**Endpoint:** `POST /Post/Create` and `POST /Post/Edit/{id}`

**File Input:** `IFormFile uploadImage`

**Storage Location:** `wwwroot/uploads/`

**Filename Strategy:** GUID-based unique name
- Format: `{Guid}.{extension}`
- Example: `f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg`

**Stored URL:** `/uploads/{filename}` (relative path)

**Validation:**
- File type: JPG, JPEG, PNG, GIF
- File size: Max 5MB (5 * 1024 * 1024 bytes)

**Error Handling:**
- Invalid type: "Ch? ch?p nh?n file ?nh (JPG, PNG, GIF)"
- Too large: "K�ch th??c file kh�ng ???c v??t qu� 5MB"

---

#### Product Image Upload

**Endpoint:** `POST /Product/Create` and `POST /Product/Edit/{id}`

**File Input:** `IFormFile uploadImage` (optional)

**Storage Location:** `wwwroot/uploads/` (same as posts)

**Filename Strategy:** GUID-based unique name (same as posts)

**Stored URL:** `/uploads/{filename}`

**Validation:** Same as post uploads

---

### Upload Implementation Details

**Directory Creation:**
```csharp
string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
```

**File Stream Copy:**
```csharp
using (var stream = new FileStream(filePath, FileMode.Create))
{
    uploadImage.CopyTo(stream);
}
```

**URL Persistence:**
- Stored in entity's ImageUrl property
- Relative path format: `/uploads/{filename}`
- Used in HTML `<img src="/uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg" />`

---

## 11. Business Flows

### Blog Publishing Flow

1. **Create Category (Editor/Admin)**
   - POST /Category/Create
   - Provide Name (3-200 chars), Description (10-1000 chars)
   - Category ID auto-generated

2. **Create Post (Editor/Admin)**
   - POST /Post/Create
   - Provide Title, Content, select CategoryId, upload ImageUrl
   - Post ID auto-generated
   - CreatedDate set to DateTime.Now
   - Post appears in latest posts on dashboard

3. **View/Edit Post (Editor/Admin)**
   - GET /Post/Index ? browse paginated posts with category filter
   - GET /Post/Details/{id} ? view full post
   - POST /Post/Edit/{id} ? update post (optional image re-upload)
   - POST /Post/Delete/{id} ? remove post

4. **Publish to Frontend (assumed - not in backend)**
   - Frontend fetches posts via API (CORS-enabled)
   - Displays posts grouped by category
   - Filters by category, pagination support

---

### E-commerce Product Catalog Flow

1. **Create Product Category (Admin)**
   - POST /CategoryProduct/Create
   - Provide Name (max 100 chars), optional Description

2. **Create Products (Admin)**
   - POST /Product/Create
   - Provide Name, Description, Price (decimal), StockQuantity, select CategoryProductId, upload ImageUrl
   - Product ID auto-generated

3. **Manage Product Catalog (Admin)**
   - GET /Product/Index ? browse products with category filter and price sort
   - GET /Product/Details/{id} ? view product details
   - POST /Product/Edit/{id} ? update product (optional image re-upload)
   - POST /Product/Delete/{id} ? remove product from catalog

4. **View Catalog (Frontend - React)**
   - Frontend fetches products via CORS-enabled endpoints (implied: need product list API)
   - Displays products with category filter and price sort

---

### Customer & Order Flow

1. **Register Customer (Frontend assumed)**
   - POST /Customer/Create (backend management view)
   - Provides: FullName, Email, Phone, Address, Password

2. **Customer Places Order (Frontend - React via API)**
   - POST /api/Orders
   - Request: { "customerId": 1, "notes": "..." }
   - Backend creates Order with Status=0 (pending), OrderDate auto-set
   - Returns: { "orderId": 5 } (201 Created)

3. **Add Order Items (Frontend assumed - not in current API)**
   - Need endpoint to add OrderDetails to order
   - Each OrderDetail: ProductId, Quantity, UnitPrice (at time of order)

4. **Manage Orders (Admin - backend UI assumed)**
   - View order status
   - Update order status (0?1?2)
   - View order details and customer info

5. **Order Fulfillment (Out of scope - manual process)**
   - Pack items
   - Update order status to 2 (Completed)

---

### Admin User Management Flow

1. **Admin Creates New User (Admin only)**
   - POST /User/Create
   - Provide: Username (unique), PasswordHash, FullName, Role ("Admin" or "Editor")

2. **User Login**
   - POST /Account/Login
   - Provide: Username, Password (plain text)
   - Backend verifies credentials against Users table
   - Sets authentication cookie and claims
   - Redirects to Home/Index dashboard

3. **Admin Manages Users (Admin only)**
   - GET /User/Index ? paginated list
   - GET /User/Details/{id} ? view user info
   - POST /User/Edit/{id} ? update user
   - POST /User/Delete/{id} ? remove user

4. **Dashboard Overview (Authenticated users)**
   - GET /Home/Index
   - Displays:
     - Total count of posts, categories, users, customers, orders, products, product categories
     - Latest 3 posts with category info

---

## 12. Frontend Integration Guide

### Suggested Frontend Architecture

**Frontend Type:** React SPA (Single Page Application)

**Base API URL:** `https://localhost:7214` (ASP.NET backend, adjust port as needed)

**CORS Setup:** Already configured on backend for `http://localhost:3000`

---

### Suggested Pages/Components

#### 1. **Public (No Auth Required)**
- Product Catalog Page
  - Product list with pagination, category filter, price sort
  - Product detail card
  - Add to cart functionality

- Customer Registration
  - Form to register new customer account

- Customer Login
  - Form for customer authentication (if separate from admin)

#### 2. **Customer (Auth Optional)**
- Shopping Cart
  - Display selected products
  - Remove/update quantities
  - Calculate total price

- Checkout
  - Collect delivery address
  - Review order
  - Submit order via POST /api/Orders

- Order Confirmation
  - Display created Order ID
  - Order tracking info

- My Orders Page
  - List customer's orders
  - Order status tracking

#### 3. **Admin (Auth Required - separate from customer auth)**
- Admin Dashboard
  - Overview cards: total posts, categories, users, customers, orders, products
  - Latest posts list
  - Link to management sections

- Post Management
  - List with pagination and category filter
  - Create new post form (title, content, category, image upload)
  - Edit post form
  - Delete confirmation

- Category Management (Blog)
  - List with pagination
  - Create/edit/delete categories

- Product Management
  - List with pagination, category filter, price sort
  - Create new product form
  - Edit product form
  - Delete confirmation

- Product Category Management
  - List with pagination
  - Create/edit/delete categories

- Customer Management (Backend UI assumed - no pagination in backend currently)
  - List customers
  - Create/edit/delete customers

- User Management (Admin only)
  - List users with pagination
  - Create new admin/editor user
  - Edit user roles
  - Delete users

---

### Suggested API Layer Structure (TypeScript/JavaScript)

```typescript
// Services/APIs
src/
??? api/
?   ??? authApi.ts              // Login, logout
?   ??? postApi.ts              // Post CRUD + listing with filters
?   ??? categoryApi.ts          // Category CRUD
?   ??? productApi.ts           // Product CRUD with filters/sort
?   ??? categoryProductApi.ts   // Product category CRUD
?   ??? customerApi.ts          // Customer CRUD
?   ??? orderApi.ts             // Order creation (public), order list (admin)
?   ??? userApi.ts              // User CRUD (admin only)
??? types/
?   ??? post.ts                 // Post, Category interfaces
?   ??? product.ts              // Product, CategoryProduct interfaces
?   ??? order.ts                // Order, OrderDetail, OrderInputDTO interfaces
?   ??? customer.ts             // Customer interface
?   ??? user.ts                 // User interface
?   ??? auth.ts                 // Auth types (claims, user principal)
?   ??? pagination.ts           // PaginatedList<T> interface
??? hooks/
    ??? useAuth.ts              // Authentication hook
    ??? usePagination.ts        // Pagination state management
    ??? useApi.ts               // Generic API call hook
```

---

### TypeScript Interfaces (from DTOs & Entities)

#### Post & Category

```typescript
interface Category {
  id: number;
  name: string;
  description: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdDate: string; // ISO 8601 format
  categoryId: number;
  category?: Category;
}

interface CreatePostRequest {
  title: string;
  content: string;
  categoryId: number;
  uploadImage?: File;
}
```

#### Product & CategoryProduct

```typescript
interface CategoryProduct {
  id: number;
  name: string;
  description?: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number; // Decimal as number
  stockQuantity: number;
  imageUrl?: string;
  categoryProductId: number;
  categoryProduct?: CategoryProduct;
}

interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryProductId: number;
  uploadImage?: File;
}
```

#### Order & Customer

```typescript
interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
}

interface OrderDetail {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product?: Product;
}

interface Order {
  id: number;
  status: number; // 0=Pending, 1=Shipping, 2=Completed
  notes?: string;
  orderDate: string; // ISO 8601 format
  customerId: number;
  customer?: Customer;
  orderDetails?: OrderDetail[];
}

interface OrderInputDTO {
  customerId: number;
  notes?: string;
}
```

#### User & Authentication

```typescript
interface User {
  id: number;
  username: string;
  fullName: string;
  role: string; // "Admin" or "Editor"
}

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  user: User;
  isAuthenticated: boolean;
}
```

#### Pagination

```typescript
interface PaginatedList<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startIndex: number;
  endIndex: number;
}
```

---

### API Endpoint Summary for Frontend

#### Authentication
- `POST /Account/Login` ? Login and set auth cookie
- `GET /Account/Logout` ? Logout

#### Posts (Public - recommend adding public API endpoints)
- `GET /api/posts?page=1&pageSize=10&categoryId=1` (need to create)
- `GET /api/posts/{id}` (need to create)

#### Products (Public - recommend adding public API endpoints)
- `GET /api/products?page=1&pageSize=10&categoryProductId=1&sortPrice=asc` (need to create)
- `GET /api/products/{id}` (need to create)

#### Orders (Public API - already exists)
- `POST /api/Orders` ? Create order from cart

#### Admin Management Endpoints (existing, but server-rendered views)
- All endpoints in previous documentation
- Consider creating REST API versions of CRUD endpoints if separate admin app needed

---

### Recommended Frontend Libraries

- **HTTP Client:** `axios` or `fetch` API
- **State Management:** `Redux` or `Zustand` or `TanStack Query`
- **UI Framework:** `React Bootstrap` or `Material-UI` or `Chakra UI`
- **Form Handling:** `React Hook Form` with `Zod` or `Yup` validation
- **Routing:** `React Router v6`
- **Image Upload:** `react-dropzone` or `react-fine-uploader`

---

### Authentication Flow (Frontend)

1. User navigates to `/login`
2. Submit POST /Account/Login (form-encoded, not JSON)
3. Backend sets authentication cookie on response
4. Frontend stores auth state in local state or Redux
5. Subsequent requests include credentials: `withCredentials: true` in axios
6. On logout: POST /Account/Logout clears cookie

---

### Data Fetching Patterns (Frontend)

#### Paginated List Fetch
```typescript
const fetchPosts = async (page = 1, pageSize = 10, categoryId?: number) => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (categoryId) params.append('categoryId', categoryId.toString());

  const response = await fetch(`/api/posts?${params}`, {
    credentials: 'include',
  });
  return response.json(); // PaginatedList<Post>
};
```

#### Create with File Upload
```typescript
const createPost = async (formData: FormData) => {
  const response = await fetch('/Post/Create', {
    method: 'POST',
    body: formData, // FormData automatically handles multipart/form-data
    credentials: 'include',
  });
  if (response.redirected) {
    window.location.href = response.url; // Follow redirect
  }
};
```

---

### Example React Component (Product List with Filters)

```typescript
import { useState, useEffect } from 'react';

interface ProductListProps {}

export function ProductList() {
  const [products, setProducts] = useState<PaginatedList<Product> | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [sortPrice, setSortPrice] = useState<string>('');
  const [categories, setCategories] = useState<CategoryProduct[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, pageSize, categoryFilter, sortPrice]);

  const fetchProducts = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
    if (categoryFilter) params.append('categoryProductId', categoryFilter.toString());
    if (sortPrice) params.append('sortPrice', sortPrice);

    const response = await fetch(`/api/products?${params}`, {
      credentials: 'include',
    });
    const data = await response.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const response = await fetch('/api/categoryproducts', {
      credentials: 'include',
    });
    const data = await response.json();
    setCategories(data);
  };

  return (
    <div>
      <select onChange={(e) => setCategoryFilter(e.target.value ? parseInt(e.target.value) : null)}>
        <option value="">All Categories</option>
        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
      </select>

      <select onChange={(e) => setSortPrice(e.target.value)}>
        <option value="">Default</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>

      {products && (
        <>
          <div>
            {products.items.map(product => (
              <div key={product.id}>
                <h3>{product.name}</h3>
                <p>${product.price}</p>
                {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
              </div>
            ))}
          </div>

          <div>
            <button disabled={!products.hasPreviousPage} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span>Page {products.currentPage} of {products.totalPages}</span>
            <button disabled={!products.hasNextPage} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

## 13. Backend Development Notes

### Current Build Status
- Solution builds successfully
- All migrations prepared (initial schema + OrderDate addition)
- Database migrations not yet applied (tooling/environment issue noted)

### Known Issues & Recommendations

1. **Password Security**
   - Currently stored as plain text in User entity
   - **Recommendation:** Implement bcrypt or ASP.NET Core Identity password hashing before production

2. **File Upload Storage**
   - Currently stored locally in `wwwroot/uploads/`
   - **Recommendation:** Move to cloud storage (Azure Blob Storage, AWS S3) for production

3. **API Endpoints for Frontend**
   - Current endpoints are MVC (server-rendered views)
   - **Recommendation:** Create separate REST API endpoints for React frontend (e.g., `/api/posts`, `/api/products`)

4. **Order Line Items**
   - OrderDetails table created but no endpoint to add items to orders
   - **Recommendation:** Create `POST /api/Orders/{orderId}/items` to add products to orders

5. **Customer Authentication**
   - No separate customer login (only admin Cookie auth)
   - **Recommendation:** Implement JWT or OAuth for customer API authentication

---

### Migration Notes

**Pending Migration:** `AddOrderDateToOrders` (file exists but not applied to database)

```bash
# To apply migrations after resolving tooling issues:
dotnet ef database update -p CMS.Data -s CMS.Backend
```

**Changes in migration:**
- Post.Title: Made StringLength(500)
- Post.ImageUrl: Made nullable
- Order.OrderDate: Added with SQL Server default (GETDATE())
- Category.Name: Made StringLength(200)
- Category.Description: Made StringLength(1000)

---

### Directory Structure Summary

```
CMS.Backend/
??? Controllers/
?   ??? AccountController.cs
?   ??? CategoryController.cs
?   ??? CategoryProductController.cs
?   ??? CustomerController.cs
?   ??? HomeController.cs
?   ??? OrdersController.cs (REST API)
?   ??? PostController.cs
?   ??? ProductController.cs
?   ??? UserController.cs
??? Models/
?   ??? OrderInputDTO.cs
?   ??? PaginatedList.cs
?   ??? ErrorViewModel.cs
??? Views/
?   ??? Account/
?   ??? Category/
?   ??? CategoryProduct/
?   ??? Customer/
?   ??? Home/
?   ??? Order/
?   ??? Post/
?   ??? Product/
?   ??? User/
?   ??? Shared/ (_LayoutAdmin.cshtml, etc.)
??? Program.cs
??? wwwroot/
    ??? uploads/ (file storage)

CMS.Data/
??? Entities/
?   ??? Category.cs
?   ??? CategoryProduct.cs
?   ??? Customer.cs
?   ??? Order.cs
?   ??? OrderDetail.cs
?   ??? Post.cs
?   ??? Product.cs
?   ??? User.cs
??? Migrations/
?   ??? 20260521062807_InitialCreate.cs
?   ??? 20260528140841_AddOrderDateToOrders.cs
?   ??? ApplicationDbContextModelSnapshot.cs
??? ApplicationDbContext.cs
```

---

## 14. Frontend Implementation Checklist

### Phase 1: Setup & Authentication
- [ ] Create React project
- [ ] Install dependencies (react-router, axios, etc.)
- [ ] Implement login page (POST /Account/Login form-encoded)
- [ ] Implement logout
- [ ] Create auth context/hook for state management
- [ ] Implement protected route wrapper

### Phase 2: Public Pages
- [ ] Create Product catalog page with:
  - [ ] Product list display
  - [ ] Category filter
  - [ ] Price sort (asc/desc)
  - [ ] Pagination
  - [ ] Product detail modal/page
- [ ] Create Product search/filter UI
- [ ] Create Shopping cart UI

### Phase 3: Checkout & Order
- [ ] Create checkout form
- [ ] Implement POST /api/Orders API call
- [ ] Order confirmation page
- [ ] Display order ID

### Phase 4: Admin Dashboard (if separate app)
- [ ] Admin login
- [ ] Dashboard overview (counts, latest posts)
- [ ] Post CRUD pages
- [ ] Product CRUD pages
- [ ] Category CRUD pages
- [ ] User management (admin only)
- [ ] Customer management

### Phase 5: Optimization
- [ ] Implement error boundaries
- [ ] Add loading states
- [ ] Implement toast notifications
- [ ] Add form validation
- [ ] Implement image preview for uploads
- [ ] Add pagination UI library
- [ ] SEO optimization (if needed)

---

## 15. Testing Recommendations

### API Testing
- **Tool:** Postman or Insomnia
- **Test endpoints:** All CRUD operations
- **Test pagination:** Various page/pageSize combinations
- **Test filtering:** Category filters on Post/Product lists
- **Test sorting:** Price sorting on Product list
- **Test file uploads:** Valid/invalid file types and sizes
- **Test validation:** Required field validation, string length limits

### Frontend Testing
- **Unit Tests:** Component rendering, business logic
- **Integration Tests:** API calls with mock responses
- **E2E Tests:** User workflows (login ? browse ? add to cart ? checkout)

---

## Document Information

**Last Updated:** May 28, 2026

**Maintained By:** LamCMS Development Team

**Target Audience:** Frontend developers, AI code generators, integration partners

**Usage:** This document should be the sole reference for frontend implementation without accessing backend source code.

---

**End of Context Document**
