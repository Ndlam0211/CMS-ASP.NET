using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CMS.Backend.Models.DTOs;
using CMS.Backend.Services;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("CustomerRegister")]
        public async Task<IActionResult> CustomerRegister([FromBody] CustomerRegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterAsync(request);

            if (!result.Success)
            {
                // Email already exists -> conflict
                return Conflict(result);
            }

            return Ok(result);
        }

        [HttpPost("CustomerLogin")]
        public async Task<IActionResult> CustomerLogin([FromBody] CustomerLoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.LoginAsync(request);

            if (!result.Success)
            {
                // Invalid credentials
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.ForgotPasswordAsync(request);

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.ResetPasswordAsync(request);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
