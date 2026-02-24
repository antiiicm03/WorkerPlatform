using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebProdavnica.Entities
{
    public class Chat
    {
        public int ChatId { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }

        // FK
        public int UserId { get; set; }
        public int CraftsmanId { get; set; }

        // Navigation properties
        public User User { get; set; }
        public Craftsman Craftsman { get; set; }
    }
}
