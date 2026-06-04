namespace CMS.Backend.Models.DTOs
{
    public class OrderItemDTO
    {
        public int ProductId { get; set; } // match database schema
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; } = decimal.Zero;
    }
}
