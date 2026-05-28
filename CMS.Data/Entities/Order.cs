/*
 * Sinh vien: Nguyen Dinh Lam
 * MSSV: 2122110509
 * Ngay tao: 14-05-2026
 * Version: 1.0
 */

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    // Đơn hàng
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public int Status { get; set; } // 0: Chờ duyệt, 1: Đang giao, 2: Đã xong

        public string? Notes { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public int CustomerId { get; set; } // Khóa ngoại liên kết tới Customer

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }

        // Quan hệ: Một đơn hàng có nhiều chi tiết đơn hàng
        public virtual ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}
