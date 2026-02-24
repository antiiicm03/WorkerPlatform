using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebProdavnica.Entities.DTOs
{
    public class JobOrderRequest
    {
        public DateTime ScheduledDate { get; set; }
        public string JobDescription { get; set; }
        public bool Urgent { get; set; }
        public decimal TotalPrice { get; set; }
        public int UserId { get; set; }
        public int CraftsmanId { get; set; }
    }
}
