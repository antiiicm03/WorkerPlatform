using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebProdavnica.Entities.DTOs
{
    public class RegisterCraftsmanRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Profession { get; set; } = string.Empty;
        public int Experience { get; set; }
        public decimal HourlyRate { get; set; }
        public string WorkingHours { get; set; } = string.Empty;
    }
}