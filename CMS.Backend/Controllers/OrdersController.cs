/*
 * Sinh vien: Nguyen Dinh Lam
 * MSSV: 2122110509
 * Ngay tao: 28-05-2026
 * Version: 1.0
 */

using CMS.Backend.Models;
using CMS.Data; // Thay bằng namespace thực tế của anh
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API: Tiếp nhận đơn đặt hàng từ giỏ hàng FrontEnd gửi lên
        /// Đường dẫn: POST https://localhost:xxxx/api/Orders
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO order)
        {
            // 1. Kiểm tra kịch bản lỗi bảo vệ: Nếu dữ liệu truyền lên trống rỗng
            if (order == null)
            {
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ" });
            }

            // 2. Kiểm tra kịch bản lỗi bảo vệ: Nếu khách hàng không tồn tại trong hệ thống
            var customerExists = await _context.Customers.FindAsync(order.CustomerId);
            if (customerExists == null)
            {
                return NotFound(new { message = $"Khách hàng không tồn tại với ID: {order.CustomerId}" });
            }

            try
            {
                // Bước A: Tự động khởi tạo cấu trúc thực thể Đơn hàng mới
                // LƯU Ý: Đã hiệu chỉnh bỏ trường TotalAmount, dùng trường [Notes] số nhiều theo đúng hình ảnh thực tế
                var newOrder = new Order
                {
                    //OrderDate = DateTime.Now, // Tự động lấy ngày giờ thực tế máy tính lúc mua
                    CustomerId = order.CustomerId,
                    Status = 0,               // 0: Mặc định đơn hàng mới ở trạng thái "Chờ xử lý"
                    Notes = order.Notes
                };

                // Bước B: Thêm vào bảng tạm và chốt lưu xuống SQL Server
                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync(); // Ép hệ thống sinh ra mã ID Đơn hàng tự động tăng

                // Bước C: Trả về mã thành công 201 Created và gửi ngược lại mã ID đơn hàng vừa tạo
                return StatusCode(201, new
                {
                    message = "Đặt hàng thành công!",
                    orderId = newOrder.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi xử lý tạo đơn hàng ngầm", detail = ex.Message });
            }
        }
    }
}
