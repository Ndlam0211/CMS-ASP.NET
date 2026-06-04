using System.Threading.Tasks;
using CMS.Backend.Models.DTOs;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _dbContext;

        public AuthService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<AuthResponse> RegisterAsync(CustomerRegisterRequest request)
        {
            // Check email exists
            var existing = await _dbContext.Customers.FirstOrDefaultAsync(c => c.Email == request.Email);
            if (existing != null)
            {
                return new AuthResponse { Success = false, Message = "Email already exists", Customer = null };
            }

            var customer = new Customer
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password, // Plain text for educational purposes
                Phone = request.Phone,
                Address = request.Address
            };

            _dbContext.Customers.Add(customer);
            await _dbContext.SaveChangesAsync();

            return new AuthResponse
            {
                Success = true,
                Message = "Register successfully",
                Customer = new CustomerResponse
                {
                    Id = customer.Id,
                    FullName = customer.FullName,
                    Email = customer.Email,
                    Phone = customer.Phone,
                    Address = customer.Address
                }
            };
        }

        public async Task<AuthResponse> LoginAsync(CustomerLoginRequest request)
        {
            var customer = await _dbContext.Customers.FirstOrDefaultAsync(c => c.Email == request.Email);
            if (customer == null)
            {
                return new AuthResponse { Success = false, Message = "Invalid email or password", Customer = null };
            }

            if (customer.Password != request.Password)
            {
                return new AuthResponse { Success = false, Message = "Invalid email or password", Customer = null };
            }

            return new AuthResponse
            {
                Success = true,
                Message = "Login successfully",
                Customer = new CustomerResponse
                {
                    Id = customer.Id,
                    FullName = customer.FullName,
                    Email = customer.Email,
                    Phone = customer.Phone,
                    Address = customer.Address
                }
            };
        }
    }
}
