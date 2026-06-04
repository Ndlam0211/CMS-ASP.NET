namespace CMS.Backend.Models.DTOs
{
    /// <summary>
    /// DTO for customer response (without password)
    /// </summary>
    public class CustomerResponse
    {
        public int Id { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }
    }
}
