/*
 * Sinh vien: Nguyen Dinh Lam
 * MSSV: 2122110509
 * Ngay tao: 14-05-2026
 * Version: 1.0
 */

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class Post
    {
        public int Id { get; set; }

        public string Title { get; set; } // Tiêu đề bài viết

        public string Content { get; set; } // Nội dung chi tiết

        public string ImageUrl { get; set; } // Hình ảnh đại diện

        public DateTime CreatedDate { get; set; } = DateTime.Now;


        // Khóa ngoại liên kết tới Category
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; }
    }
}
