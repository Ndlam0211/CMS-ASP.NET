/*
 * Sinh vien: Nguyen Dinh Lam
 * MSSV: 2122110509
 * Ngay tao: 14-05-2026
 * Version: 1.0
 */

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    // Khách hàng
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; } // Họ và tên

        [Required]
        [EmailAddress]
        public string Email { get; set; } // địa chỉ email

        public string? Phone { get; set; } // Số điện thoại

        public string? Address { get; set; } // Địa chỉ

        [Required]
        public string Password { get; set; } // Lưu mật khẩu thô theo yêu cầu tối giản

        // Quan hệ: Một khách hàng có nhiều đơn hàng
        public virtual ICollection<Order>? Orders { get; set; }
    }
}
