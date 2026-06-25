using CMS.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        // Phương thức đăng nhập
        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            if(username == null)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập không được để trống!");
                ViewBag.Username = username;
                ViewBag.Password = password;
                return View();
            }
            if (password == null)
            {
                ModelState.AddModelError("PasswordHash", "Mật khẩu không được để trống!");
                ViewBag.Username = username;
                ViewBag.Password = password;
                return View();
            }

            // 1. Kiểm tra tài khoản trong Database
            var user = _context.Users.FirstOrDefault(u => u.Username == username);

            if (user != null && BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                // 2. Thiết lập danh tính (Claims)
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role), // Lưu vai trò: Admin/Editor
                    new Claim("FullName", user.FullName)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                // 3. Đăng nhập và lưu Cookie vào trình duyệt
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity));

                return RedirectToAction("Index", "Home");
            }

            // Giữ lại giá trị username và password nếu đăng nhập không thành công
            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không đúng!";
            ViewBag.Username = username;
            ViewBag.Password = password;
            return View();
        }

        // Phương thức đăng xuất
        public async Task<IActionResult> Logout()
        {
            // Xóa Cookie khỏi trình duyệt và đăng xuất
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        // Phương thức hiển thị trang Nếu người dùng không có quyền truy cập
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
