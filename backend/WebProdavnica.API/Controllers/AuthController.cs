using Microsoft.AspNetCore.Mvc;
using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.Entities.DTOs;

namespace WebProdavnica.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register/user")]
        public IActionResult RegisterUser([FromBody] RegisterUserRequest request)
        {
            try
            {
                var result = _authService.RegisterUser(request);
                if (result == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Email vec postoji ili registracija nije uspela"
                    });
                }
                return Ok(new
                {
                    success = true,
                    message = "Registracija uspesna!",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    inner = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        [HttpPost("register/craftsman")]
        public IActionResult RegisterCraftsman([FromBody] RegisterCraftsmanRequest request)
        {
            try
            {
                var result = _authService.RegisterCraftsman(request);
                if (result == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Email vec postoji ili registracija nije uspela"
                    });
                }
                return Ok(new
                {
                    success = true,
                    message = "Registracija uspesna!",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    inner = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                var result = _authService.Login(request);
                if (result == null)
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Pogresan email ili lozinka"
                    });
                }
                return Ok(new
                {
                    success = true,
                    message = "Prijava uspesna!",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    inner = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }
    }
}