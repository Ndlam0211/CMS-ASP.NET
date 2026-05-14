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

        // Hàm Details: Hiển thị chi tiết một bài viết
        public IActionResult Details(int id)
        {

            // Giả lập tìm bài viết trong Database bằng Id
            // Trong thực tế tuần sau sẽ là: _context.Posts.Find(id);
            var post = new Post

            {

                Id = id,

                Title = "Nội dung chi tiết bài viết số " + id,

                Content = "Đây là nội dung đầy đủ của bài viết mà bạn vừa click vào. Ở đây có thể viết dài hơn để thấy sự khác biệt với trang danh sách.",

                ImageUrl = "https://via.placeholder.com/600x300", // Ảnh to hơn

                CreatedDate = DateTime.Now

            };


            if (post == null) return NotFound();


            return View(post);

        }

    }
}
