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
        private readonly IEmailService _emailService;

        public AuthService(ApplicationDbContext dbContext, IEmailService emailService)
        {
            _dbContext = dbContext;
            _emailService = emailService;
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
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password), // hash password với BCrypt.Net-Next
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

            if (!BCrypt.Net.BCrypt.Verify(request.Password, customer.Password))
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

        public async Task<AuthResponse> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            var customer = await _dbContext.Customers
                .FirstOrDefaultAsync(c => c.Email == request.Email);

            if (customer == null)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Email không tồn tại",
                    Customer = null
                };
            }

            var token = new Random().Next(100000, 999999).ToString();

            customer.ResetPasswordToken = token;
            customer.ResetPasswordTokenExpiry = DateTime.Now.AddMinutes(15);

            await _dbContext.SaveChangesAsync();

            var emailBody = $@"
        <h2>Đặt lại mật khẩu LamCMS</h2>
        <p>Mã xác nhận của bạn là:</p>
        <h1>{token}</h1>
        <p>Mã này có hiệu lực trong 15 phút.</p>
    ";

            await _emailService.SendEmailAsync(
                customer.Email,
                "Đặt lại mật khẩu LamCMS",
                emailBody
            );

            return new AuthResponse
            {
                Success = true,
                Message = "Mã xác nhận đã được gửi đến email của bạn",
                Customer = null
            };
        }

        public async Task<AuthResponse> ResetPasswordAsync(ResetPasswordRequest request)
        {
            var customer = await _dbContext.Customers
                .FirstOrDefaultAsync(c => c.Email == request.Email);

            if (customer == null)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Email không tồn tại",
                    Customer = null
                };
            }

            if (customer.ResetPasswordToken != request.Token)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Mã xác nhận không đúng",
                    Customer = null
                };
            }

            if (customer.ResetPasswordTokenExpiry == null ||
                customer.ResetPasswordTokenExpiry < DateTime.Now)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = "Mã xác nhận đã hết hạn",
                    Customer = null
                };
            }

            customer.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            customer.ResetPasswordToken = null;
            customer.ResetPasswordTokenExpiry = null;

            await _dbContext.SaveChangesAsync();

            return new AuthResponse
            {
                Success = true,
                Message = "Đặt lại mật khẩu thành công",
                Customer = null
            };
        }
    }
}
