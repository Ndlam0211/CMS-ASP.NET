using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        public IActionResult Index()
        {
            // Tạo danh sách dữ liệu mẫu trực tiếp trong code
            var list = new List<Post> {
                new Post { Id = 1, Title = "Lộ trình học ASP.NET cho người mới"},
                new Post { Id = 2, Title = "Cài đặt ReactJS"},
                new Post { Id = 3, Title = "Hướng dẫn cài đặt Visual Studio"}
            };

            return View(list); // Gửi danh sách này sang giao diện
        }
    }
}
