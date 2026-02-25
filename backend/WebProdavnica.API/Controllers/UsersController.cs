using Microsoft.AspNetCore.Mvc;
using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.Entities;
using WebProdavnica.Entities.DTOs;

namespace WebProdavnica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/users
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var users = _userService.GetAll();
                return Ok(new { success = true, data = users, count = users.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var user = _userService.Get(id);
                if (user == null)
                    return NotFound(new { success = false, message = $"Korisnik sa ID {id} nije pronađen" });

                // Vraćamo samo potrebne podatke, bez passwordHash
                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        userId = user.UserId,
                        firstName = user.FirstName,
                        lastName = user.LastName,
                        email = user.Email,
                        phone = user.Phone,
                        location = user.Location,
                        createdAt = user.CreatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // PUT: api/users/5/profile
        [HttpPut("{id}/profile")]
        public IActionResult UpdateProfile(int id, [FromBody] UpdateProfileRequest request)
        {
            try
            {
                var user = _userService.Get(id);
                if (user == null)
                    return NotFound(new { success = false, message = "Korisnik nije pronađen" });

                user.FirstName = request.FirstName;
                user.LastName = request.LastName;
                user.Email = request.Email;
                user.Phone = request.Phone;
                user.Location = request.Location;

                bool success = _userService.Update(user);
                if (success)
                    return Ok(new { success = true, message = "Profil uspešno ažuriran" });

                return BadRequest(new { success = false, message = "Ažuriranje nije uspelo" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // PUT: api/users/5/password
        [HttpPut("{id}/password")]
        public IActionResult UpdatePassword(int id, [FromBody] UpdatePasswordRequest request)
        {
            try
            {
                var user = _userService.Get(id);
                if (user == null)
                    return NotFound(new { success = false, message = "Korisnik nije pronađen" });

                if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
                    return BadRequest(new { success = false, message = "Stara lozinka nije ispravna" });

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
                bool success = _userService.Update(user);

                if (success)
                    return Ok(new { success = true, message = "Lozinka uspešno promenjena" });

                return BadRequest(new { success = false, message = "Promena lozinke nije uspela" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                bool success = _userService.Delete(id);
                if (success)
                    return Ok(new { success = true, message = "Korisnik uspešno obrisan" });

                return NotFound(new { success = false, message = "Korisnik nije pronađen" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    }
}