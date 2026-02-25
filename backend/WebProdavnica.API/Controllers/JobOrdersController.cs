using Microsoft.AspNetCore.Mvc;
using WebProdavnica.BusinessLayer.Abstract;
using WebProdavnica.BusinessLayer.Impl;
using WebProdavnica.Entities;
using WebProdavnica.Entities.DTOs;

namespace WebProdavnica.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobOrdersController : ControllerBase
    {
        private readonly IJobOrderService _jobOrderService;

        public JobOrdersController(IJobOrderService jobOrderService)
        {
            _jobOrderService = jobOrderService;
        }

        // POST: api/joborders
        [HttpPost]
        public IActionResult Create([FromBody] JobOrderRequest request)
        {
            try
            {
                var newJobOrder = new JobOrder
                {
                    ScheduledDate = request.ScheduledDate,
                    JobDescription = request.JobDescription,
                    Urgent = request.Urgent,
                    TotalPrice = request.TotalPrice,
                    UserId = request.UserId,
                    CraftsmanId = request.CraftsmanId,
                    Status = request.Status ?? "zakazano",
                };

                bool success = _jobOrderService.Add(newJobOrder);

                if (success)
                {
                    return CreatedAtAction(
                        nameof(GetById),
                        new { id = newJobOrder.JobId },
                        new
                        {
                            success = true,
                            message = "Radni nalog uspešno kreiran!",
                            data = new
                            {
                                jobId = newJobOrder.JobId,
                                scheduledDate = newJobOrder.ScheduledDate,
                                jobDescription = newJobOrder.JobDescription,
                                status = newJobOrder.Status,
                                urgent = newJobOrder.Urgent,
                                totalPrice = newJobOrder.TotalPrice,
                                userId = newJobOrder.UserId,
                                craftsmanId = newJobOrder.CraftsmanId
                            }
                        });
                }

                return BadRequest(new { success = false, message = "Kreiranje naloga nije uspelo" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }

        // GET: api/joborders/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var jobOrder = _jobOrderService.Get(id);

                if (jobOrder == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"Radni nalog sa ID {id} nije pronađen"
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = jobOrder
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

        // GET: api/joborders/user/5
        [HttpGet("user/{userId}")]
        public IActionResult GetByUser(int userId)
        {
            try
            {
                var jobOrders = _jobOrderService.GetAll()
                    .Where(j => j.UserId == userId)
                    .ToList();

                return Ok(new
                {
                    success = true,
                    userId = userId,
                    data = jobOrders,
                    count = jobOrders.Count
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

        // GET: api/joborders/craftsman/5
        [HttpGet("craftsman/{craftsmanId}")]
        public IActionResult GetByCraftsman(int craftsmanId)
        {
            try
            {
                var jobOrders = _jobOrderService.GetAll()
                    .Where(j => j.CraftsmanId == craftsmanId)
                    .ToList();

                return Ok(new
                {
                    success = true,
                    craftsmanId = craftsmanId,
                    data = jobOrders,
                    count = jobOrders.Count
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

        // GET: api/joborders/craftsman/5/status/zakazano
        [HttpGet("craftsman/{craftsmanId}/status/{status}")]
        public IActionResult GetByCraftsmanAndStatus(int craftsmanId, string status)
        {
            try
            {
                var jobOrders = _jobOrderService.GetAll()
                    .Where(j => j.CraftsmanId == craftsmanId && j.Status.ToLower() == status.ToLower())
                    .ToList();
                return Ok(new
                {
                    success = true,
                    craftsmanId = craftsmanId,
                    status = status,
                    data = jobOrders,
                    count = jobOrders.Count
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

        // GET: api/joborders/urgent
        [HttpGet("urgent")]
        public IActionResult GetUrgent()
        {
            try
            {
                var urgentOrders = _jobOrderService.GetAll()
                    .Where(j => j.Urgent == true)
                    .OrderBy(j => j.ScheduledDate)
                    .ToList();

                return Ok(new
                {
                    success = true,
                    data = urgentOrders,
                    count = urgentOrders.Count
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

        // PUT: api/joborders/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] JobOrder jobOrder)
        {
            try
            {
                if (id != jobOrder.JobId)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID se ne poklapa"
                    });
                }

                bool success = _jobOrderService.Update(jobOrder);

                if (success)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Radni nalog uspešno ažuriran"
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

        // PATCH: api/joborders/5/status
        [HttpPatch("{id}/status")]
        public IActionResult UpdateStatus(int id, [FromBody] StatusUpdate statusUpdate)
        {
            try
            {
                var jobOrder = _jobOrderService.Get(id);

                if (jobOrder == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Radni nalog nije pronađen"
                    });
                }

                jobOrder.Status = statusUpdate.Status;
                bool success = _jobOrderService.Update(jobOrder);

                if (success)
                {
                    return Ok(new
                    {
                        success = true,
                        message = $"Status promenjen na: {statusUpdate.Status}"
                    });
                }

                return BadRequest(new
                {
                    success = false,
                    message = "Promena statusa nije uspela"
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

        // DELETE: api/joborders/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                bool success = _jobOrderService.Delete(id);

                if (success)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Radni nalog uspešno obrisan"
                    });
                }

                return NotFound(new
                {
                    success = false,
                    message = "Radni nalog nije pronađen"
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

    // Helper klasa za ažuriranje statusa
    public class StatusUpdate
    {
        public string Status { get; set; }
    }
}