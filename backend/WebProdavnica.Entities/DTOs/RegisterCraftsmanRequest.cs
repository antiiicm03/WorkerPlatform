using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;

namespace WebProdavnica.Entities.DTOs
{
    public class RegisterCraftsmanRequest
    {
        [Required(ErrorMessage = "Ime je obavezno")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Ime mora imati između 2 i 50 karaktera")]
        [RegularExpression(@"^[a-zA-ZčćđšžČĆĐŠŽ\s]+$", ErrorMessage = "Ime sme sadržati samo slova")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Prezime je obavezno")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Prezime mora imati između 2 i 50 karaktera")]
        [RegularExpression(@"^[a-zA-ZčćđšžČĆĐŠŽ\s]+$", ErrorMessage = "Prezime sme sadržati samo slova")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email je obavezan")]
        [EmailAddress(ErrorMessage = "Email nije u ispravnom formatu")]
        [StringLength(100, ErrorMessage = "Email ne sme biti duži od 100 karaktera")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Broj telefona je obavezan")]
        [RegularExpression(@"^(\+381|0)[0-9]{8,9}$", ErrorMessage = "Telefon mora biti u formatu +381XXXXXXXXX ili 0XXXXXXXXX")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Lozinka je obavezna")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Lozinka mora imati najmanje 8 karaktera")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
            ErrorMessage = "Lozinka mora sadržati bar jedno veliko slovo, malo slovo i broj")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Lokacija je obavezna")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Lokacija mora imati između 2 i 100 karaktera")]
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "Profesija je obavezna")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Profesija mora imati između 2 i 100 karaktera")]
        public string Profession { get; set; } = string.Empty;

        [Range(0, 60, ErrorMessage = "Iskustvo mora biti između 0 i 60 godina")]
        public int Experience { get; set; }

        [Range(0, 100000, ErrorMessage = "Cena po satu mora biti između 0 i 100,000 RSD")]
        public decimal HourlyRate { get; set; }

        [Required(ErrorMessage = "Radno vreme je obavezno")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Radno vreme mora imati između 3 i 100 karaktera")]
        public string WorkingHours { get; set; } = string.Empty;
    }
}