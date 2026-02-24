using Microsoft.AspNetCore.Mvc;
using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.BusinessLayer.Impl;
using WebProdavnica.Entities;

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

        // POST: api/users/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            try
            {
                bool success = _userService.Add(user);

                if (success)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Korisnik uspešno registrovan!"
                    });
                }

                return BadRequest(new
                {
                    success = false,
                    message = "Registracija nije uspela"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }

        // GET: api/users
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var users = _userService.GetAll();
                return Ok(new
                {
                    success = true,
                    data = users,
                    count = users.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    error = ex.Message
                });
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
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"Korisnik sa ID {id} nije pronađen"
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = user
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }

        // PUT: api/users/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] User user)
        {
            try
            {
                if (id != user.UserId)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID se ne poklapa"
                    });
                }

                bool success = _userService.Update(user);

                if (success)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Korisnik uspešno ažuriran"
                    });
                }

                return BadRequest(new
                {
                    success = false,
                    message = "Ažuriranje nije uspelo"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    error = ex.Message
                });
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
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Korisnik uspešno obrisan"
                    });
                }

                return NotFound(new
                {
                    success = false,
                    message = "Korisnik nije pronađen"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }
    }
}