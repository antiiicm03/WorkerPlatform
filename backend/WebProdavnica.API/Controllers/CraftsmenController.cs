using Microsoft.AspNetCore.Mvc;
using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.BusinessLayer.Impl;
using WebProdavnica.Entities;

namespace WebProdavnica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CraftsmenController : ControllerBase
    {
        private readonly ICraftsmanService _craftsmanService;

        public CraftsmenController(ICraftsmanService craftsmanService)
        {
            _craftsmanService = craftsmanService;
        }

        // GET: api/craftsmen
        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                var craftsmen = _craftsmanService.GetAll();
                return Ok(new
                {
                    success = true,
                    data = craftsmen,
                    count = craftsmen.Count
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

        // GET: api/craftsmen/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var craftsman = _craftsmanService.Get(id);

                if (craftsman == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"Zanatlija sa ID {id} nije pronađen"
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = craftsman
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

        // GET: api/craftsmen/profession/stolar
        [HttpGet("profession/{profession}")]
        public IActionResult GetByProfession(string profession)
        {
            try
            {
                var craftsmen = _craftsmanService.GetAll()
                    .Where(c => c.Profession.ToLower() == profession.ToLower())
                    .ToList();

                return Ok(new
                {
                    success = true,
                    profession = profession,
                    data = craftsmen,
                    count = craftsmen.Count
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

        // GET: api/craftsmen/location/beograd
        [HttpGet("location/{location}")]
        public IActionResult GetByLocation(string location)
        {
            try
            {
                var craftsmen = _craftsmanService.GetAll()
                    .Where(c => c.Location.ToLower().Contains(location.ToLower()))
                    .ToList();

                return Ok(new
                {
                    success = true,
                    location = location,
                    data = craftsmen,
                    count = craftsmen.Count
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

        // PUT: api/craftsmen/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Craftsman craftsman)
        {
            try
            {
                if (id != craftsman.CraftsmanId)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID se ne poklapa"
                    });
                }

                bool success = _craftsmanService.Update(craftsman);

                if (success)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Zanatlija uspešno ažuriran"
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

        // DELETE: api/craftsmen/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                bool success = _craftsmanService.Delete(id);

                if (success)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Zanatlija uspešno obrisan"
                    });
                }

                return NotFound(new
                {
                    success = false,
                    message = "Zanatlija nije pronađen"
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