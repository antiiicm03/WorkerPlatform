using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.Entities;

namespace WebProdavnica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IConfiguration _configuration;

        public PaymentsController(IPaymentService paymentService, IConfiguration configuration)
        {
            _paymentService = paymentService;
            _configuration = configuration;
            StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
        }

        // POST: api/payments/create-checkout-session
        [HttpPost("create-checkout-session")]
        public IActionResult CreateCheckoutSession([FromBody] CheckoutRequest request)
        {
            try
            {
                var options = new SessionCreateOptions
                {
                    PaymentMethodTypes = new List<string> { "card" },
                    LineItems = new List<SessionLineItemOptions>
                    {
                        new SessionLineItemOptions
                        {
                            PriceData = new SessionLineItemPriceDataOptions
                            {
                                UnitAmount = (long)(request.Amount / 117 * 100), // Stripe koristi cente
                                Currency = "eur",
                                ProductData = new SessionLineItemPriceDataProductDataOptions
                                {
                                    Name = $"Usluga: {request.JobDescription}",
                                    Description = $"Majstor: {request.CraftsmanName}"
                                }
                            },
                            Quantity = 1
                        }
                    },
                    Mode = "payment",
                    SuccessUrl = $"http://localhost:5174/payment-success?jobId={request.JobId}&session_id={{CHECKOUT_SESSION_ID}}",
                    CancelUrl = $"http://localhost:5174/payment-cancel?jobId={request.JobId}",
                    Metadata = new Dictionary<string, string>
                    {
                        { "jobId", request.JobId.ToString() },
                        { "userId", request.UserId.ToString() },
                        { "craftsmanId", request.CraftsmanId.ToString() }
                    }
                };

                var service = new SessionService();
                Session session = service.Create(options);

                return Ok(new
                {
                    success = true,
                    sessionId = session.Id,
                    url = session.Url
                });
            }
            catch (StripeException ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
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

        // POST: api/payments/confirm
        // Poziva se nakon uspešnog plaćanja da sačuvamo u bazu
        [HttpPost("confirm")]
        public IActionResult ConfirmPayment([FromBody] ConfirmPaymentRequest request)
        {
            try
            {
                StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
                var service = new SessionService();
                Session session = service.Get(request.SessionId);

                if (session.PaymentStatus != "paid")
                {
                    return BadRequest(new { success = false, message = "Plaćanje nije završeno" });
                }

                var payment = new Payment
                {
                    Amount = request.Amount,
                    PaymentDate = DateTime.Now,
                    PaymentMethod = "Card",
                    PaymentStatus = "Completed",
                    JobId = request.JobId
                };

                bool success = _paymentService.Add(payment);

                return Ok(new
                {
                    success = true,
                    message = "Uplata uspešno evidentirana!",
                    data = payment
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // POST: api/payments
        [HttpPost]
        public IActionResult Create([FromBody] Payment payment)
        {
            try
            {
                bool success = _paymentService.Add(payment);
                if (success)
                    return Ok(new { success = true, message = "Uplata uspešno evidentirana!", data = payment });

                return BadRequest(new { success = false, message = "Evidencija uplate nije uspela" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
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
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // GET: api/payments/publishable-key
        [HttpGet("publishable-key")]
        public IActionResult GetPublishableKey()
        {
            return Ok(new { publishableKey = _configuration["Stripe:PublishableKey"] });
        }
    }

    public class CheckoutRequest
    {
        public int JobId { get; set; }
        public int UserId { get; set; }
        public int CraftsmanId { get; set; }
        public decimal Amount { get; set; }
        public string JobDescription { get; set; } = string.Empty;
        public string CraftsmanName { get; set; } = string.Empty;
    }

    public class ConfirmPaymentRequest
    {
        public string SessionId { get; set; } = string.Empty;
        public int JobId { get; set; }
        public decimal Amount { get; set; }
    }
}