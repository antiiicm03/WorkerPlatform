using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;

namespace WebProdavnica.Entities.DTOs
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Email je obavezan")]
        [EmailAddress(ErrorMessage = "Email nije u ispravnom formatu")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Lozinka je obavezna")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tip korisnika je obavezan")]
        [RegularExpression(@"^(user|craftsman)$", ErrorMessage = "UserType mora biti 'user' ili 'craftsman'")]
        public string UserType { get; set; } = "user";
    }
}