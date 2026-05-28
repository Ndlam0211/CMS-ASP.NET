# Phân Trang Module Category & Post - Tài Li?u Tri?n Khai

## ?? T?ng Quan

?ã th?c hi?n phân trang cho các module:
- ? **Category** - Danh m?c bài vi?t
- ? **Post** - Bài vi?t

### Tính n?ng chung:
- ? Chuy?n trang (Previous/Next/Direct Page)
- ? Ch?n s? l??ng ph?n t? m?i trang (5, 10, 20, 50)
- ? Hi?n th? thông tin phân trang
- ? Production-ready UI
- ? Bootstrap 5 responsive design

---

## ?? Files ???c C?p Nh?t / T?o

### 1. **CMS.Backend\Models\PaginatedList.cs** (NEW)
```csharp
public class PaginatedList<T>
{
    public List<T> Items { get; set; }
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }

    // Properties h? tr?
    public bool HasPreviousPage { get; }
    public bool HasNextPage { get; }
    public int StartIndex { get; }  // S? th? t? b?t ??u
    public int EndIndex { get; }    // S? th? t? k?t thúc
}
```

**M?c ?ích:** Generic pagination model dùng cho t?t c? module (Product, Post, User, Order...)

---

### 2. **CMS.Backend\Controllers\CategoryController.cs** (UPDATED)

#### Ph??ng th?c `Index()` c?:
```csharp
public IActionResult Index()
{
    var data = _context.Categories.ToList();
    return View(data);
}
```

#### Ph??ng th?c `Index()` m?i:
```csharp
public IActionResult Index(int page = 1, int pageSize = 10)
{
    // 1?? Validate parameters
    if (page < 1) page = 1;
    if (pageSize < 5) pageSize = 5;
    if (pageSize > 50) pageSize = 50;

    // 2?? Get total count
    int totalItems = _context.Categories.Count();

    // 3?? Get paginated data using LINQ
    var categories = _context.Categories
        .OrderBy(c => c.Id)
        .Skip((page - 1) * pageSize)  // Skip (page-1)*pageSize items
        .Take(pageSize)                 // Take pageSize items
        .ToList();

    // 4?? Create PaginatedList
    var paginatedList = new PaginatedList<Category>(
        categories,
        totalItems,
        page,
        pageSize
    );

    // 5?? Pass pageSize to View
    ViewBag.PageSize = pageSize;

    return View(paginatedList);
}
```

---

### 3. **CMS.Backend\Views\Category\Index.cshtml** (UPDATED)

#### Model Binding:
```razor
@model CMS.Backend.Models.PaginatedList<CMS.Data.Entities.Category>
```

#### Hi?n th? thông tin phân trang:
```html
Showing <strong>@Model.StartIndex</strong> to <strong>@Model.EndIndex</strong> 
of <strong>@Model.TotalItems</strong> entries
```

#### Dropdown ch?n Page Size:
```html
<select onchange="changePageSize(this.value)">
    <option value="5">5</option>
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="50">50</option>
</select>
```

#### Pagination Controls:
- **Previous Button:** Disabled n?u không có trang tr??c
- **Page Numbers:** Hi?n th? dynamic (1...5 6 7 8 9...20)
- **Next Button:** Disabled n?u không có trang sau

---

## ?? Flow Phân Trang

### 1. User m? trang Category
```
GET /Category/Index
? page=1 (default), pageSize=10 (default)
? Hi?n th? 10 danh m?c ??u tiên
```

### 2. User ch?n Page Size = 20
```
JavaScript: changePageSize(20)
? Redirect: /Category/Index?page=1&pageSize=20
? Controller: page=1, pageSize=20
? Database: SELECT * FROM Categories SKIP(0) TAKE(20)
```

### 3. User click trang 2
```
Click: <a>2</a>
? Link: /Category/Index?page=2&pageSize=20
? Controller: page=2, pageSize=20
? Database: SELECT * FROM Categories SKIP(20) TAKE(20)
? Hi?n th?: Item 21-40
```

### 4. User click "Next"
```
Current page=2, pageSize=20
? Link: /Category/Index?page=3&pageSize=20
? Show items 41-60
```

---

## ?? Logic LINQ

```csharp
// Ví d?: page=2, pageSize=10
Skip((2-1) * 10) = Skip(10)   // B? 10 item ??u
Take(10)                        // L?y 10 item ti?p theo

// K?t qu?: Item 11-20
```

---

## ?? Bootstrap UI Components

### Pagination:
```html
<nav aria-label="Table pagination">
    <ul class="pagination justify-content-center">
        <li class="page-item">
            <a class="page-link">Previous</a>
        </li>
        <li class="page-item active">
            <span class="page-link">1 <span class="visually-hidden">(current)</span></span>
        </li>
        <li class="page-item">
            <a class="page-link">2</a>
        </li>
        <li class="page-item">
            <a class="page-link">Next</a>
        </li>
    </ul>
</nav>
```

### Page Size Selector:
```html
<select class="form-select" onchange="changePageSize(this.value)">
    <option value="5">5</option>
    <option value="10" selected>10</option>
</select>
```

---

## ? Tính N?ng ??c Bi?t

### 1. Dynamic Page Numbers
- Hi?n th?: `1 ... 5 6 7 8 9 ... 20`
- Tránh hi?n th? quá nhi?u link
- Luôn hi?n th? trang hi?n t?i

### 2. Disabled State
```html
<!-- Previous disabled khi ? trang 1 -->
<li class="page-item disabled">
    <span class="page-link">Previous</span>
</li>
```

### 3. Current Page Indicator
```html
<li class="page-item active">
    <span class="page-link">
        2 <span class="visually-hidden">(current)</span>
    </span>
</li>
```

### 4. Query String Persistence
- Click page size ? redirect `/Index?page=1&pageSize=20`
- Khi ??i page size ? luôn v? trang 1
- Gi? pageSize khi chuy?n trang

---

## ?? Validation & Security

```csharp
// Prevent invalid parameters
if (page < 1) page = 1;              // Min page = 1
if (pageSize < 5) pageSize = 5;      // Min 5 items
if (pageSize > 50) pageSize = 50;    // Max 50 items
```

**L?i ích:**
- Tránh `Skip()` v?i s? âm
- Tránh load quá nhi?u d? li?u
- Performance t?i ?u

---

## ?? Performance

### Query Optimization:
```csharp
// Only fetch needed data
.Skip((page - 1) * pageSize)
.Take(pageSize)
.ToList()
```

**SQL Query sinh ra:**
```sql
SELECT * FROM Categories
ORDER BY Id
OFFSET 10 ROWS
FETCH NEXT 10 ROWS ONLY
```

### Database Hits:
1. Count query: `SELECT COUNT(*) FROM Categories`
2. Data query: `SELECT * FROM Categories OFFSET X ROWS FETCH NEXT Y ROWS`

---

## ?? Module Post (NEW - Áp d?ng t??ng t? Category)

### 1. **CMS.Backend\Controllers\PostController.cs** (UPDATED)

#### Ph??ng th?c `Index()` m?i - H? tr? filter theo danh m?c + phân trang:
```csharp
public IActionResult Index(int? categoryId, int page = 1, int pageSize = 10)
{
    // 1?? Validate parameters
    if (page < 1) page = 1;
    if (pageSize < 5) pageSize = 5;
    if (pageSize > 50) pageSize = 50;

    // 2?? Build query
    IQueryable<Post> query = _context.Posts.Include(p => p.Category);

    // 3?? Filter by category if provided
    if (categoryId.HasValue && categoryId.Value > 0)
    {
        query = query.Where(p => p.CategoryId == categoryId.Value);
    }

    // 4?? Sort by created date descending
    query = query.OrderByDescending(p => p.CreatedDate);

    // 5?? Get total count
    int totalItems = query.Count();

    // 6?? Get paginated data
    var posts = query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToList();

    // 7?? Create PaginatedList
    var paginatedList = new PaginatedList<Post>(
        posts,
        totalItems,
        page,
        pageSize
    );

    // 8?? Pass data to view
    ViewBag.PageSize = pageSize;
    ViewBag.CategoryId = categoryId;

    return View(paginatedList);
}
```

**S? khác bi?t v?i Category:**
- H? tr? filter theo `categoryId` (nullable parameter)
- S?p x?p theo `CreatedDate` gi?m d?n (bài m?i nh?t lên ??u)
- Persist `categoryId` trong pagination links

### 2. **CMS.Backend\Views\Post\Index.cshtml** (UPDATED)

#### Model Binding:
```razor
@model CMS.Backend.Models.PaginatedList<CMS.Data.Entities.Post>
```

#### Pagination Links - Gi? filter categoryId:
```html
<!-- Ví d?: Khi filter theo category 5 -->
<a asp-action="Index" 
   asp-route-categoryId="@ViewBag.CategoryId"
   asp-route-page="2" 
   asp-route-pageSize="10">2</a>
<!-- Output: /Post/Index?categoryId=5&page=2&pageSize=10 -->
```

#### changePageSize() - H? tr? category filter:
```javascript
function changePageSize(pageSize) {
    const categoryId = '@ViewBag.CategoryId';
    const url = categoryId && categoryId !== '' && categoryId !== '0'
        ? '@Url.Action("Index")' + '?categoryId=' + categoryId + '&page=1&pageSize=' + pageSize
        : '@Url.Action("Index")' + '?page=1&pageSize=' + pageSize;
    window.location.href = url;
}
```

---

## ?? Flow Phân Trang - Post Module

### Scenario 1: Xem t?t c? bài vi?t
```
GET /Post/Index
? categoryId=null, page=1, pageSize=10
? Show 10 recent posts
```

### Scenario 2: Xem bài vi?t theo danh m?c
```
GET /Post/Index?categoryId=3
? Filter: WHERE CategoryId = 3
? Show 10 posts from category 3
```

### Scenario 3: Chuy?n trang v?i filter
```
Current: /Post/Index?categoryId=3&page=1&pageSize=10
Click page 2
? /Post/Index?categoryId=3&page=2&pageSize=10
? Show posts 11-20 from category 3
```

### Scenario 4: ??i page size v?i filter
```
Current: /Post/Index?categoryId=3
Change page size to 20
? /Post/Index?categoryId=3&page=1&pageSize=20
? Reset to page 1, keep category filter
```

---

## ?? Database Query - Post Module

### Query c? b?n (không filter):
```sql
SELECT * FROM Posts
ORDER BY CreatedDate DESC
OFFSET 10 ROWS
FETCH NEXT 10 ROWS ONLY
```

### Query v?i filter danh m?c:
```sql
SELECT * FROM Posts
WHERE CategoryId = 3
ORDER BY CreatedDate DESC
OFFSET 10 ROWS
FETCH NEXT 10 ROWS ONLY
```

---

## ?? Cách S? D?ng Cho Module Khác

### Áp d?ng cho Product Controller:

```csharp
public IActionResult Index(int page = 1, int pageSize = 10)
{
    if (page < 1) page = 1;
    if (pageSize < 5) pageSize = 5;
    if (pageSize > 50) pageSize = 50;

    int totalItems = _context.Products.Count();

    var products = _context.Products
        .OrderBy(p => p.Id)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToList();

    var paginatedList = new PaginatedList<Product>(
        products,
        totalItems,
        page,
        pageSize
    );

    ViewBag.PageSize = pageSize;
    return View(paginatedList);
}
```

### View:
```razor
@model CMS.Backend.Models.PaginatedList<Product>
<!-- Reuse pagination partial or copy HTML -->
```

---

## ? Testing Checklist

- [ ] Open `/Category/Index` ? Show 10 items (default)
- [ ] Change page size to 20 ? Show 20 items
- [ ] Click page 2 ? Show items 21-40
- [ ] Click "Previous" on page 2 ? Back to page 1
- [ ] Click "Next" on page 1 ? Go to page 2
- [ ] "Previous" disabled on page 1 ?
- [ ] "Next" disabled on last page ?
- [ ] Page numbers show dynamically ?
- [ ] Invalid page ? redirect to page 1 ?
- [ ] Large pageSize ? capped at 50 ?

---

## ?? Notes

- **Bootstrap Version:** 5.x (Pagination class names)
- **Razor Features:** `@foreach`, `@if` conditions
- **Query Parameter:** `page`, `pageSize`
- **Default:** page=1, pageSize=10
- **Max Records/Page:** 50

---

## ?? Related Files

- `PaginatedList.cs` - Pagination model (Shared)
- **Category Module:**
  - `CategoryController.cs` - Action logic
  - `Category/Index.cshtml` - View with pagination UI
- **Post Module:**
  - `PostController.cs` - Action logic with category filter support
  - `Post/Index.cshtml` - View with pagination UI
- `_LayoutAdmin.cshtml` - Master layout (unchanged)

---

## ? Testing Checklist - Post Module

- [ ] Open `/Post/Index` ? Show 10 recent posts (default)
- [ ] Change page size to 20 ? Show 20 posts
- [ ] Click page 2 ? Show posts 11-20
- [ ] Click category badge (filter) ? Filter posts by category
- [ ] Filter + change page size ? Keep category filter
- [ ] Filter + click next page ? Keep category filter
- [ ] "Previous" disabled on page 1 ?
- [ ] "Next" disabled on last page ?
- [ ] Page numbers show dynamically ?
- [ ] Invalid page ? redirect to page 1 ?
- [ ] Large pageSize ? capped at 50 ?

---

*Created: 2026-05-14*
*Updated: 2026-05-15*
*Version: 2.0 - Post Module Added*
*Status: Production Ready*
