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
    // Danh mục bài viết
    public class Category
    {
        public int Id { get; set; }

        public string Name { get; set; } // Tên danh mục (vd: Tin Giáo Dục)

        public string Description { get; set; } // Mô tả 


        // Quan hệ: Một danh mục có nhiều bài viết
        public virtual ICollection<Post> Posts { get; set; }
    }
}
