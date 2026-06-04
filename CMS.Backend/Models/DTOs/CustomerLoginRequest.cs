using System.ComponentModel.DataAnnotations;

namespace CMS.Backend.Models.DTOs
{
    /// <summary>
    /// DTO for customer login request
    /// </summary>
    public class CustomerLoginRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}
