using System.ComponentModel.DataAnnotations;

namespace WebProdavnica.Entities.DTOs
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Email je obavezan")]
        [RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$",
    ErrorMessage = "Email nije u ispravnom formatu (primer: ime@gmail.com)")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Lozinka je obavezna")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tip korisnika je obavezan")]
        [RegularExpression(@"^(user|craftsman)$", ErrorMessage = "UserType mora biti 'user' ili 'craftsman'")]
        public string UserType { get; set; } = "user";
    }
}