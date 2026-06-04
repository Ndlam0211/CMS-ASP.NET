namespace CMS.Backend.Models.DTOs
{
    public class AuthResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public CustomerResponse Customer { get; set; }
    }
}
