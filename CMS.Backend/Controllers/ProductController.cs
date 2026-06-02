/*
 * Sinh vien: Nguyen Dinh Lam
 * MSSV: 2122110509
 * Ngay tao: 21-05-2026
 * Version: 1.0
 */

using CMS.Backend.Models;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize] // Bắt buộc phải đăng nhập mới được vào các hàm bên dưới
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Product/Index
        public IActionResult Index(int page = 1, int pageSize = 10, int? categoryProductId = null, string? sortPrice = null)
        {
            // Kiểm tra tham số hợp lệ
            if (page < 1) page = 1;
            if (pageSize < 5) pageSize = 5;
            if (pageSize > 100) pageSize = 100;

            var query = _context.Products
                .Include(p => p.CategoryProduct)
                .AsQueryable();

            // Filter by Category
            if (categoryProductId.HasValue && categoryProductId > 0)
            {
                query = query.Where(p => p.CategoryProductId == categoryProductId.Value);
            }

            // Sort by Price
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
                query = query.OrderBy(p => p.Id);
            }

            // Calculate total items before pagination
            int totalItems = query.Count();

            // Pagination
            var products = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var paginatedList = new PaginatedList<Product>(products, totalItems, page, pageSize);

            // Pass data to view
            ViewBag.PageSize = pageSize;
            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();
            ViewBag.SelectedCategoryId = categoryProductId;
            ViewBag.SelectedSortPrice = sortPrice;

            return View(paginatedList);
        }

        // GET: Product/Details/5
        public IActionResult Details(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefault(p => p.Id == id);

            if (product == null)
                return NotFound();

            return View(product);
        }

        // GET: Product/Create
        public IActionResult Create()
        {
            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();
            return View();
        }

        // POST: Product/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create([Bind("Name,Description,Price,StockQuantity,ImageUrl,CategoryProductId")] Product product, IFormFile? uploadImage)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors);
                foreach (var error in errors)
                {
                    Console.WriteLine(error.ErrorMessage);
                }
            }
            if (ModelState.IsValid)
            {
                try
                {
                    if (uploadImage != null && uploadImage.Length > 0)
                    {
                        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                        var extension = Path.GetExtension(uploadImage.FileName).ToLower();
                        if (!allowedExtensions.Contains(extension))
                        {
                            ModelState.AddModelError("uploadImage", "Chỉ chấp nhận file ảnh (JPG, PNG, GIF)");
                            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();
                            return View(product);
                        }

                        if (uploadImage.Length > 5 * 1024 * 1024)
                        {
                            ModelState.AddModelError("uploadImage", "Kích thước file không được vượt quá 5MB");
                            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();
                            return View(product);
                        }

                        string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                        if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
                        string fileName = Guid.NewGuid().ToString() + extension;
                        string filePath = Path.Combine(folder, fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            uploadImage.CopyTo(stream);
                        }
                        product.ImageUrl = "/uploads/" + fileName;
                    }

                    _context.Products.Add(product);
                    _context.SaveChanges();
                    return RedirectToAction(nameof(Index));
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError("ImageUrl", "Có lỗi khi lưu ảnh: " + ex.Message);
                }
            }

            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();
            return View(product);
        }

        // GET: Product/Edit/5
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
                return NotFound();

            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();
            return View(product);
        }

        // POST: Product/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, [Bind("Id,Name,Description,Price,StockQuantity,ImageUrl,CategoryProductId")] Product product, IFormFile? uploadImage)
        {
            if (id != product.Id)
                return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    if (uploadImage != null && uploadImage.Length > 0)
                    {
                        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                        var extension = Path.GetExtension(uploadImage.FileName).ToLower();
                        if (!allowedExtensions.Contains(extension))
                        {
                            ModelState.AddModelError("uploadImage", "Ch? ch?p nh?n file ?nh (JPG, PNG, GIF)");
                            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();
                            return View(product);
                        }

                        if (uploadImage.Length > 5 * 1024 * 1024)
                        {
                            ModelState.AddModelError("uploadImage", "Kích th??c file không ???c v??t quá 5MB");
                            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();
                            return View(product);
                        }

                        string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                        if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
                        string fileName = Guid.NewGuid().ToString() + extension;
                        string filePath = Path.Combine(folder, fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            uploadImage.CopyTo(stream);
                        }
                        product.ImageUrl = "/uploads/" + fileName;
                    }
                    else
                    {
                        var old = _context.Products.AsNoTracking().FirstOrDefault(p => p.Id == product.Id);
                        if (old != null && string.IsNullOrEmpty(product.ImageUrl))
                        {
                            product.ImageUrl = old.ImageUrl;
                        }
                    }

                    _context.Update(product);
                    _context.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProductExists(product.Id))
                        return NotFound();
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }

            ViewBag.CategoryProducts = _context.CategoriesProducts.ToList();
            return View(product);
        }

        // GET: Product/Delete/5
        public IActionResult Delete(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefault(p => p.Id == id);

            if (product == null)
                return NotFound();

            return View(product);
        }

        // POST: Product/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
