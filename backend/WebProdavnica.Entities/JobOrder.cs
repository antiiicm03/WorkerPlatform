using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebProdavnica.Entities
{
    public class JobOrder
    {
        public int JobId { get; set; }
        public DateTime ScheduledDate { get; set; }
        public string JobDescription { get; set; }
        public string Status { get; set; }
        public bool Urgent { get; set; }
        public decimal TotalPrice { get; set; }

        
        public int UserId { get; set; }
        public int CraftsmanId { get; set; }

        
        public User User { get; set; }
        public Craftsman Craftsman { get; set; }
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
