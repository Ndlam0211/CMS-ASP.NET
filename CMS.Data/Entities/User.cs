/*
 * Sinh vien: Nguyen Dinh Lam
 * MSSV: 2122110509
 * Ngay tao: 14-05-2026
 * Version: 1.0
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    // Người dùng
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; } // username

        public string PasswordHash { get; set; } // Mật khẩu đã được mã hóa
        
        public string FullName { get; set; } // Họ và tên

        public string Role { get; set; } // Quản trị viên hoặc Biên tập viên
    }
}
