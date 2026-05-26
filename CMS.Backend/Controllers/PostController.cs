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

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {

        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(int? id)
        {
            var list = new List<Post>();
            if(id == null)
            {
                list = _context.Posts
                    .Include(p => p.Category) // Kết hợp với bảng Category để lấy tên danh mục
                    .ToList();
                return View(list);
            }

            // Lấy dữ liệu THẬT từ bảng Posts trong SQL
             list = _context.Posts
                .Where(p => p.CategoryId == id) // Lọc theo CategoryId
                .OrderByDescending(p => p.CreatedDate) // Sắp xếp theo ngày tạo giảm dần
                .Include(p => p.Category) // Kết hợp với bảng Category để lấy tên danh mục
                .ToList();

            return View(list); // Gửi danh sách này sang giao diện
        }

        // Hàm Details: Hiển thị chi tiết một bài viết
        public IActionResult Details(int id)
        {

            // Tìm dữ liệu thực từ bảng Posts bằng Id
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            if (post == null) return NotFound();


            return View(post);

        }

        // GET: Post/Create
        public IActionResult Create()
        {
            ViewData["Categories"] = _context.Categories.ToList();
            return View();
        }

        // POST: Post/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create([Bind("Title,Content,ImageUrl,CategoryId")] Post post, IFormFile uploadImage)
        {
            if (ModelState.IsValid)
            {
                if (uploadImage != null && uploadImage.Length > 0)
                {
                    // 1. Định nghĩa đường dẫn lưu file: wwwroot/uploads
                    string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                    // Tạo thư mục nếu chưa tồn tại
                    if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                    // 2. Tạo tên file duy nhất để không bị đè dữ liệu
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                    string filePath = Path.Combine(folder, fileName);

                    // 3. Chép file vào thư mục
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        uploadImage.CopyTo(stream);
                    }

                    // 4. Lưu đường dẫn vào CSDL để sau này hiển thị
                    post.ImageUrl = "/uploads/" + fileName;
                }

                _context.Posts.Add(post);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            ViewData["Categories"] = _context.Categories.ToList();
            return View(post);
        }

        // GET: Post/Edit/5
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null)
                return NotFound();

            ViewData["Categories"] = _context.Categories.ToList();
            return View(post);
        }

        // POST: Post/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(int id, [Bind("Id,Title,Content,ImageUrl,CreatedDate,CategoryId")] Post post, IFormFile uploadImage)
        {
            if (id != post.Id)
                return NotFound();

            if (ModelState.IsValid)
            {
                try
                {
                    if (uploadImage != null && uploadImage.Length > 0)
                    {
                        // Thực hiện quy trình upload giống như trang Create
                        string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                        if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                        string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);

                        string filePath = Path.Combine(folder, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            uploadImage.CopyTo(stream);
                        }

                        // Cập nhật đường dẫn ảnh mới vào model
                        post.ImageUrl = "/uploads/" + fileName;
                    }
                    else
                    {
                        // Bước quan trọng: Nếu không upload ảnh mới, chúng ta phải giữ lại ảnh cũ
                        // Chúng ta cần lấy lại giá trị ImageUrl từ Database để tránh bị ghi đè thành rỗng
                        var oldPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == post.Id);

                        if (oldPost != null && string.IsNullOrEmpty(post.ImageUrl))
                        {
                            post.ImageUrl = oldPost.ImageUrl;
                        }
                    }

                    _context.Posts.Update(post);
                    _context.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PostExists(post.Id))
                        return NotFound();
                    throw;
                }
                return RedirectToAction(nameof(Index));
            }

            ViewData["Categories"] = _context.Categories.ToList();
            return View(post);
        }

        // GET: Post/Delete/5
        public IActionResult Delete(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);
            if (post == null)
                return NotFound();

            return View(post);
        }

        // POST: Post/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }

        private bool PostExists(int id)
        {
            return _context.Posts.Any(e => e.Id == id);
        }

    }
}
