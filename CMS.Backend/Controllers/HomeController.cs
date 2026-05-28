using CMS.Backend.Models;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize] // Bắt buộc phải đăng nhập mới được vào các hàm bên dưới
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;
        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // LINQ: Lấy 3 bài viết mới nhất
            var latestPosts = _context.Posts
                    .Include(p => p.Category) // Lấy kèm tên danh mục để hiển thị
                    .OrderByDescending(p => p.CreatedDate) // Sắp xếp ngày mới nhất lên đầu
                    .Take(3) // Chỉ lấy đúng 3 bản tin đầu tiên
                    .ToList();

            // Lấy tổng số lượng từ các bảng
            var totalPosts = _context.Posts.Count();
            var totalCategories = _context.Categories.Count();
            var totalUsers = _context.Users.Count();
            var totalCustomers = _context.Customers.Count();
            var totalOrders = _context.Orders.Count();
            var totalProducts = _context.Products.Count();
            var totalCategoryProducts = _context.CategoriesProducts.Count();

            // Gửi dữ liệu qua ViewBag
            ViewBag.TotalPosts = totalPosts;
            ViewBag.TotalCategories = totalCategories;
            ViewBag.TotalUsers = totalUsers;
            ViewBag.TotalCustomers = totalCustomers;
            ViewBag.TotalOrders = totalOrders;
            ViewBag.TotalProducts = totalProducts;
            ViewBag.TotalCategoryProducts = totalCategoryProducts;

            return View(latestPosts);
        }
    }
}
