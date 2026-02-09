using Microsoft.AspNetCore.Mvc;
using WebProdavnica.BusinessLayer;
using WebProdavnica.Entities;

namespace WebProdavnica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewsController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        // POST: api/reviews
        [HttpPost]
        public IActionResult Create([FromBody] Review review)
        {
            try
            {
                // Validacija ratinga
                if (review.Rating < 1 || review.Rating > 5)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Ocena mora biti između 1 i 5"
                    });
                }

                bool success = _reviewService.Add(review);

                if (success)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Recenzija uspešno dodata!",
                        data = review
                    });
                }

                return BadRequest(new
                {
                    success = false,
                    message = "Dodavanje recenzije nije uspelo"
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

        // GET: api/reviews/craftsman/5
        [HttpGet("craftsman/{craftsmanId}")]
        public IActionResult GetByCraftsman(int craftsmanId)
        {
            try
            {
                var reviews = _reviewService.GetByCraftsman(craftsmanId);

                return Ok(new
                {
                    success = true,
                    craftsmanId = craftsmanId,
                    data = reviews,
                    count = reviews.Count,
                    averageRating = reviews.Count > 0
                        ? Math.Round(reviews.Average(r => r.Rating), 2)
                        : 0
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