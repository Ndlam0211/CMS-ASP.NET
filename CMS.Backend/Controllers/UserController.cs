using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            // Tạo mock data cho 2 tài khoản người dùng
            var users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Username = "admin",
                    FullName = "Nguyễn Đình Lâm",
                    Role = "Admin",
                    PasswordHash = "hashed_password_admin_123"
                },
                new User
                {
                    Id = 2,
                    Username = "editor",
                    FullName = "Trần Thị Bích",
                    Role = "Editor",
                    PasswordHash = "hashed_password_editor_456"
                }
            };

            return View(users);
        }
    }
}
