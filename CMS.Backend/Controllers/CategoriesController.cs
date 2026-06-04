using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                // Bước A: Quét bảng dữ liệu Categories số nhiều dưới SQL Server lên
                var categories = await _context.Categories
                    .OrderBy(c => c.Id)
                    // Bước B: Kỹ thuật gọt tỉa (Projection) - chỉ lấy các trường cần thiết ra FrontEnd
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        c.Description
                    })
                    .ToListAsync(); // Chuyển đổi bất đồng bộ sang dạng danh sách mảng

                // Bước C: Trả về mã thành công HTTP 200 OK đính kèm chuỗi chữ JSON sạch
                return Ok(categories);
            }
            catch (System.Exception ex)
            {
                // Bảo vệ hệ thống: Nếu sập kết nối SQL thì trả về lỗi 500 kèm lời nhắn lý do lỗi
                return StatusCode(500, new
                {
                    message = "Lỗi kết nối cơ sở dữ liệu hệ thống",
                    detail = ex.Message
                });
            }
        }
    }
}
