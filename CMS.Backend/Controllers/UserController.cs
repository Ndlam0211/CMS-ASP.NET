/*
 * Sinh vien: Nguyen Dinh Lam
 * MSSV: 2122110509
 * Ngay tao: 14-05-2026
 * Version: 1.0
 */

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {

        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu THẬT từ bảng Users trong SQL
            var users = _context.Users.ToList();

            return View(users);
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

                user.PasswordHash = password; // Sau này sẽ mã hóa tại đây
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
