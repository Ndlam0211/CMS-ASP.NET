using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Models
{
    // LỚP DTO TRUNG GIAN ĐỂ HỨNG DỮ LIỆU TỪ FRONTEND TRUYỀN LÊN
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; }
        public string ShippingAddress { get; set; }
        public List<OrderItemDTO> Items { get; set; }
    }
}

