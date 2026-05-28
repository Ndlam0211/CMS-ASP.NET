/*
 * Sinh vien: Nguyen Dinh Lam
 * MSSV: 2122110509
 * Ngay tao: 14-05-2026
 * Version: 1.0
 */

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class Post
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tiêu đề bài viết không được để trống")]
        [StringLength(500, MinimumLength = 5, ErrorMessage = "Tiêu đề phải từ 5 đến 500 ký tự")]
        public string Title { get; set; } // Tiêu đề bài viết

        [Required(ErrorMessage = "Nội dung bài viết không được để trống")]
        [StringLength(10000, MinimumLength = 20, ErrorMessage = "Nội dung phải từ 20 đến 10000 ký tự")]
        public string Content { get; set; } // Nội dung chi tiết

        public string? ImageUrl { get; set; } // Hình ảnh đại diện

        public DateTime CreatedDate { get; set; } = DateTime.Now;


        // Khóa ngoại liên kết tới Category
        [Required(ErrorMessage = "Danh mục bài viết không được để trống")]
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
    }
}
