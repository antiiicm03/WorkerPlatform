using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebProdavnica.Entities
{
    public class Review
    {
        public int ReviewId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }

      
        public int UserId { get; set; }
        public int CraftsmanId { get; set; }

        public User User { get; set; }
        public Craftsman Craftsman { get; set; }
    }
}
