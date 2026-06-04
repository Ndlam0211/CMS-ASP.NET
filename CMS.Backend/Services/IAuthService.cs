using System.Threading.Tasks;
using CMS.Backend.Models.DTOs;

namespace CMS.Backend.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(CustomerRegisterRequest request);
        Task<AuthResponse> LoginAsync(CustomerLoginRequest request);
    }
}
