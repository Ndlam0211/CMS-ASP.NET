/*
 * Sinh vien: Nguyen Dinh Lam
 * MSSV: 2122110509
 * Ngay tao: 14-05-2026
 * Version: 1.0
 */
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles ="Admin")] // Bắt buộc phải đăng nhập và có role = Admin mới được vào các hàm bên dưới
    public class UserController : Controller
    {

        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(int page = 1, int pageSize = 10)
        {
            // Kiểm tra tham số hợp lệ
            if (page < 1) page = 1;
            if (pageSize < 5) pageSize = 5;
            if (pageSize > 100) pageSize = 100;

            // Lấy tổng số người dùng
            int totalItems = _context.Users.Count();

            // Lấy danh sách người dùng theo trang
            var users = _context.Users
                .OrderBy(u => u.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Tạo PaginatedList
            var paginatedList = new PaginatedList<User>(
                users,
                totalItems,
                page,
                pageSize
            );

            // Lưu pageSize vào ViewBag để dùng trong View
            ViewBag.PageSize = pageSize;

            return View(paginatedList);
        }

        // GET: User/Details/5
        public IActionResult Details(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                return NotFound();

            return View(user);
        }

        // GET: User/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: User/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create([Bind("Username,PasswordHash,FullName,Role")] User user)
        {
            if (ModelState.IsValid)
            {
                // Kiểm tra xem tên đăng nhập đã tồn tại chưa
                var checkExist = _context.Users.Any(u => u.Username == user.Username);
                if (checkExist)
                {
                    ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
                    return View(user);
                }

                if (string.IsNullOrWhiteSpace(user.PasswordHash))
                {
                    ModelState.AddModelError("PasswordHash", "Mật khẩu không được để trống!");
                    return View(user);
                }

                // Hash mật khẩu bằng BCrypt trước khi lưu vào Database
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

                // Lưu User mới vào Database
                _context.Users.Add(user);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(user);
        }

        // GET: User/Edit/5
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                return NotFound();

            return View(user);
        }

        // POST: User/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, [Bind("Id,Username,FullName,Role")] User user, string password)
        {
            if (id != user.Id)
                return NotFound();

            // 1. Tìm User gốc trong Database để lấy lại mật khẩu cũ nếu cần

            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == user.Id);


            if (existingUser == null) return NotFound();


            // 2. Xử lý mật khẩu: Nếu nhập mới thì lấy cái mới, nếu trống thì lấy cái cũ

            if (!string.IsNullOrEmpty(password))

            {

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            }

            else

            {

                user.PasswordHash = existingUser.PasswordHash;

            }


            // 3. Cập nhật vào Database

            _context.Users.Update(user);

            _context.SaveChanges();


            return RedirectToAction("Index");
        }

        // GET: User/Delete/5
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                return NotFound();

            return View(user);
        }

        // POST: User/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
