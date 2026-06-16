/*
 * Sinh vien: Nguyen Dinh Lam
 * MSSV: 2122110509
 * Ngay tao: 28-05-2026
 * Version: 1.0
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn gọi API. [controller] tự động ánh xạ thành "Products" (api/products)
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Container khởi tạo tiêm DBContext
        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. API Lấy danh sách sản phẩm: Hỗ trợ linh hoạt bộ lọc danh mục, tìm kiếm, sắp xếp và phân trang
        // Đường dẫn truy cập: GET https://localhost:xxxx/api/products?categoryProductId=1&search=ao&sortPrice=asc&page=1&pageSize=8
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? categoryProductId = null,
            [FromQuery] string? search = null,
            [FromQuery] string? sortPrice = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 8)
        {
            // Khởi tạo Queryable để xây dựng câu lệnh SQL tối ưu
            var query = _context.Products.AsQueryable();

            // Lọc theo loại sản phẩm (CategoryProductId) nếu được truyền vào
            if (categoryProductId.HasValue)
            {
                query = query.Where(p => p.CategoryProductId == categoryProductId.Value);
            }

            // Lọc theo từ khóa tìm kiếm (Không phân biệt chữ hoa/thường)
            if (!string.IsNullOrEmpty(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(s));
            }

            // Xử lý sắp xếp theo giá cả hoặc sắp xếp mặc định (mới nhất lên đầu)
            if (sortPrice == "asc")
            {
                query = query.OrderBy(p => p.Price);
            }
            else if (sortPrice == "desc")
            {
                query = query.OrderByDescending(p => p.Price);
            }
            else
            {
                query = query.OrderByDescending(p => p.Id); // Mặc định sắp xếp theo sản phẩm mới nhất
            }

            // Đếm tổng số sản phẩm thỏa mãn điều kiện lọc (trước khi phân trang)
            var totalItems = await query.CountAsync();

            // Tính toán chỉ số phân trang
            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);
            var startIndex = (page - 1) * pageSize;

            // Thực hiện truy vấn phân trang lấy danh sách Record sạch
            var items = await query
                .Skip(startIndex)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryProductName = p.CategoryProduct != null ? p.CategoryProduct.Name : null
                })
                .ToListAsync();

            // Khớp chính xác 100% cấu trúc đối tượng phân trang của productService.js
            var paginatedResult = new
            {
                items = items,
                currentPage = page,
                totalPages = totalPages,
                pageSize = pageSize,
                totalItems = totalItems,
                hasPreviousPage = page > 1,
                hasNextPage = page < totalPages,
                startIndex = startIndex + 1,
                endIndex = Math.Min(startIndex + pageSize, totalItems)
            };

            return Ok(paginatedResult);
        }

        // 2. Định nghĩa đường dẫn lấy sản phẩm theo danh mục cụ thể
        // Hỗ trợ đồng thời cả hai dạng viết endpoint để tránh lỗi lệch đường dẫn phát sinh
        [HttpGet("categoryproduct/{categoryProductId}")]
        [HttpGet("category/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            var products = await _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryProductName = p.CategoryProduct != null ? p.CategoryProduct.Name : null
                })
                .ToListAsync();

            return Ok(products);
        }

        // 3. Định nghĩa đường dẫn nhận ID trực tiếp lấy chi tiết sản phẩm: GET api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);

            // Xử lý bảo vệ hệ thống nếu ID không tồn tại
            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            return Ok(product);
        }

        // 4. API Lấy danh sách sản phẩm mới nhất (8 sản phẩm)
        // Đường dẫn truy cập: GET https://localhost:xxxx/api/products/latest
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest()
        {
            try
            {
                var products = await _context.Products
                    .OrderByDescending(p => p.CreatedAt)
                    .Take(8)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.ImageUrl,
                        p.StockQuantity,
                        p.CreatedAt,
                        p.IsFeatured,
                        CategoryProductName = p.CategoryProduct != null ? p.CategoryProduct.Name : null
                    })
                    .ToListAsync();

                if (products.Count == 0)
                {
                    return Ok(new { message = "Không có sản phẩm nào", products = new List<object>() });
                }

                return Ok(new { products = products });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách sản phẩm mới nhất", detail = ex.Message });
            }
        }

        // 5. API Lấy danh sách sản phẩm nổi bật (isFeatured = true)
        // Đường dẫn truy cập: GET https://localhost:xxxx/api/products/featured
        [HttpGet("featured")]
        public async Task<IActionResult> GetFeatured()
        {
            try
            {
                var products = await _context.Products
                    .Where(p => p.IsFeatured == true)
                    .OrderByDescending(p => p.CreatedAt)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.ImageUrl,
                        p.StockQuantity,
                        p.CreatedAt,
                        p.IsFeatured,
                        CategoryProductName = p.CategoryProduct != null ? p.CategoryProduct.Name : null
                    })
                    .ToListAsync();

                if (products.Count == 0)
                {
                    return Ok(new { message = "Không có sản phẩm nổi bật nào", products = new List<object>() });
                }

                return Ok(new { products = products });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách sản phẩm nổi bật", detail = ex.Message });
            }
        }
    }
}