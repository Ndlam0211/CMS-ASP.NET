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
    // Danh mục bài viết
    public class Category
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Tên danh mục phải từ 3 đến 200 ký tự")]
        public string Name { get; set; } // Tên danh mục (vd: Tin Giáo Dục)

        [Required(ErrorMessage = "Mô tả không được để trống")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Mô tả phải từ 10 đến 1000 ký tự")]
        public string Description { get; set; } // Mô tả 


        // Quan hệ: Một danh mục có nhiều bài viết
        public virtual ICollection<Post>? Posts { get; set; } = new List<Post>();
    }
}
