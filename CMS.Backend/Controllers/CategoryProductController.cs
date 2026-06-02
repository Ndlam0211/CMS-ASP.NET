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
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: CategoryProduct/Index
        public IActionResult Index(int page = 1, int pageSize = 10)
        {
            // Kiểm tra tham số hợp lệ
            if (page < 1) page = 1;
            if (pageSize < 5) pageSize = 5;
            if (pageSize > 100) pageSize = 100;

            int totalItems = _context.CategoriesProducts.Count();
            var categoryProducts = _context.CategoriesProducts
                .Include(cp => cp.Products)
                .OrderBy(cp => cp.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var paginatedList = new PaginatedList<CategoryProduct>(categoryProducts, totalItems, page, pageSize);
            ViewBag.PageSize = pageSize;
            return View(paginatedList);
        }

        // GET: CategoryProduct/Details/5
        public IActionResult Details(int id)
        {
            var categoryProduct = _context.CategoriesProducts
                .Include(cp => cp.Products)
                .FirstOrDefault(cp => cp.Id == id);

            if (categoryProduct == null)
                return NotFound();

            return View(categoryProduct);
        }

        // GET: CategoryProduct/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CategoryProduct/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create([Bind("Name,Description")] CategoryProduct categoryProduct)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(categoryProduct);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            return View(categoryProduct);
        }

        // GET: CategoryProduct/Edit/5
        public IActionResult Edit(int id)
        {
            var categoryProduct = _context.CategoriesProducts.Find(id);
            if (categoryProduct == null)
                return NotFound();

            return View(categoryProduct);
        }

        // POST: CategoryProduct/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, [Bind("Id,Name,Description")] CategoryProduct categoryProduct)
        {
            if (id != categoryProduct.Id)
                return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(categoryProduct);
                    _context.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CategoryProductExists(categoryProduct.Id))
                        return NotFound();
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }

            return View(categoryProduct);
        }

        // GET: CategoryProduct/Delete/5
        public IActionResult Delete(int id)
        {
            var categoryProduct = _context.CategoriesProducts
                .Include(cp => cp.Products)
                .FirstOrDefault(cp => cp.Id == id);

            if (categoryProduct == null)
                return NotFound();

            return View(categoryProduct);
        }

        // POST: CategoryProduct/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var categoryProduct = _context.CategoriesProducts.Find(id);
            if (categoryProduct != null)
            {
                _context.CategoriesProducts.Remove(categoryProduct);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool CategoryProductExists(int id)
        {
            return _context.CategoriesProducts.Any(e => e.Id == id);
        }
    }
}
