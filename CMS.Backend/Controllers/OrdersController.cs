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
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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

            // 3. Kiểm tra items không trống
            if (order.Items == null || order.Items.Count == 0)
            {
                return BadRequest(new { message = "Đơn hàng phải chứa ít nhất một sản phẩm" });
            }

            // 4. Kiểm tra tất cả sản phẩm trong items có tồn tại và kiểm tra inventory
            var productIds = order.Items.Select(i => i.ProductId).Distinct().ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id);

            foreach (var item in order.Items)
            {
                if (!products.ContainsKey(item.ProductId))
                {
                    return NotFound(new { message = $"Sản phẩm với ID {item.ProductId} không tồn tại" });
                }

                var product = products[item.ProductId];
                if (product.StockQuantity < item.Quantity)
                {
                    return BadRequest(new 
                    { 
                        message = $"Số lượng tồn kho không đủ cho sản phẩm '{product.Name}'. Tồn kho hiện tại: {product.StockQuantity}, Yêu cầu: {item.Quantity}" 
                    });
                }
            }

            try
            {
                // Bước A: Tự động khởi tạo cấu trúc thực thể Đơn hàng mới
                var newOrder = new Order
                {
                    CustomerId = order.CustomerId,
                    Status = 0,                      // 0: Mặc định đơn hàng mới ở trạng thái "Chờ xử lý"
                    Notes = order.Notes,
                    ShippingAddress = order.ShippingAddress
                };

                // Bước B: Thêm vào bảng tạm
                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync(); // Ép hệ thống sinh ra mã ID Đơn hàng tự động tăng

                // Bước C: Xử lý từng item trong giỏ hàng
                var orderDetails = new List<OrderDetail>();
                foreach (var item in order.Items)
                {
                    var product = products[item.ProductId];

                    // Tạo OrderDetail
                    var orderDetail = new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice > 0 ? item.UnitPrice : product.Price
                    };

                    orderDetails.Add(orderDetail);

                    // Trừ số lượng tồn kho
                    product.StockQuantity -= item.Quantity;
                    _context.Products.Update(product);
                }

                // Thêm tất cả OrderDetails
                _context.OrderDetails.AddRange(orderDetails);

                // Lưu tất cả thay đổi xuống database
                await _context.SaveChangesAsync();

                // Bước D: Trả về mã thành công 201 Created và gửi ngược lại mã ID đơn hàng vừa tạo
                return StatusCode(201, new
                {
                    message = "Đặt hàng thành công!",
                    orderId = newOrder.Id,
                    itemsCount = orderDetails.Count
                });
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, new { message = "Lỗi cập nhật cơ sở dữ liệu", detail = dbEx.InnerException?.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi xử lý tạo đơn hàng", detail = ex.Message });
            }
        }

        /// <summary>
        /// API: Tra cứu danh sách đơn hàng của khách hàng
        /// Đường dẫn: GET https://localhost:xxxx/api/Orders/customer/{customerId}
        /// </summary>
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetCustomerOrders(int customerId)
        {
            // 1. Kiểm tra khách hàng có tồn tại không
            var customer = await _context.Customers.FindAsync(customerId);
            if (customer == null)
            {
                return NotFound(new { message = $"Khách hàng với ID {customerId} không tồn tại" });
            }

            try
            {
                // 2. Lấy danh sách tất cả đơn hàng của khách hàng
                var orders = await _context.Orders
                    .Where(o => o.CustomerId == customerId)
                    .Include(o => o.OrderDetails)
                        .ThenInclude(od => od.Product)
                    .OrderByDescending(o => o.OrderDate) // Sắp xếp theo ngày mới nhất trước
                    .ToListAsync();

                // 3. Nếu không có đơn hàng
                if (orders.Count == 0)
                {
                    return Ok(new
                    {
                        message = "Khách hàng chưa có đơn hàng nào",
                        customerId = customerId,
                        orders = new List<object>()
                    });
                }

                // 4. Chuyển đổi dữ liệu thành DTO để trả về
                var ordersData = orders.Select(o => new
                {
                    orderId = o.Id,
                    customerId = o.CustomerId,
                    orderDate = o.OrderDate,
                    status = o.Status,
                    statusName = GetStatusName(o.Status),
                    notes = o.Notes,
                    shippingAddress = o.ShippingAddress,
                    totalItems = o.OrderDetails?.Count ?? 0,
                    totalAmount = o.OrderDetails?.Sum(od => od.UnitPrice * od.Quantity) ?? 0,
                    items = o.OrderDetails?.Select(od => new
                    {
                        productId = od.ProductId,
                        productName = od.Product?.Name,
                        imageUrl = od.Product?.ImageUrl,
                        quantity = od.Quantity,
                        unitPrice = od.UnitPrice,
                        subtotal = od.UnitPrice * od.Quantity
                    }).ToList()
                }).ToList();

                return Ok(new
                {
                    message = "Tra cứu đơn hàng thành công",
                    customerId = customerId,
                    ordersCount = ordersData.Count,
                    orders = ordersData
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tra cứu đơn hàng", detail = ex.Message });
            }
        }

        /// <summary>
        /// Helper method: Chuyển đổi mã trạng thái thành tên trang thái
        /// </summary>
        private string GetStatusName(int status)
        {
            return status switch
            {
                0 => "Chờ xử lý",
                1 => "Đang giao",
                2 => "Đã xong",
                _ => "Không xác định"
            };
        }
    }
}
