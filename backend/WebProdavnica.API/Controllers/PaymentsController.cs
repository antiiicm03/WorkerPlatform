using Microsoft.AspNetCore.Mvc;
using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.BusinessLayer.Impl;
using WebProdavnica.Entities;

namespace WebProdavnica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        // POST: api/payments
        [HttpPost]
        public IActionResult Create([FromBody] Payment payment)
        {
            try
            {
                bool success = _paymentService.Add(payment);

                if (success)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Uplata uspešno evidentirana!",
                        data = payment
                    });
                }

                return BadRequest(new
                {
                    success = false,
                    message = "Evidencija uplate nije uspela"
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

        // GET: api/payments/job/5
        [HttpGet("job/{jobId}")]
        public IActionResult GetByJob(int jobId)
        {
            try
            {
                var payments = _paymentService.GetByJob(jobId);

                return Ok(new
                {
                    success = true,
                    jobId = jobId,
                    data = payments,
                    count = payments.Count,
                    totalAmount = payments.Sum(p => p.Amount)
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