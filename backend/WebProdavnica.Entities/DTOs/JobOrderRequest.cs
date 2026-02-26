using System.ComponentModel.DataAnnotations;

namespace WebProdavnica.Entities.DTOs
{
    public class JobOrderRequest : IValidatableObject
    {
        [Required(ErrorMessage = "Datum je obavezan")]
        public DateTime ScheduledDate { get; set; }

        [StringLength(500, MinimumLength = 10, ErrorMessage = "Opis mora imati između 10 i 500 karaktera")]
        public string? JobDescription { get; set; }

        [RegularExpression(@"^(Zakazano|U toku|Završeno|Otkazano)$",
            ErrorMessage = "Status mora biti: Zakazano, U toku, Završeno ili Otkazano")]
        public string? Status { get; set; }

        public bool Urgent { get; set; }

        [Range(0.01, 10000000, ErrorMessage = "Cena mora biti pozitivan broj")]
        public decimal TotalPrice { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "UserId mora biti validan")]
        public int UserId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "CraftsmanId mora biti validan")]
        public int CraftsmanId { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (ScheduledDate < DateTime.UtcNow)
            {
                yield return new ValidationResult(
                    "Datum zakazivanja ne sme biti u prošlosti",
                    new[] { nameof(ScheduledDate) }
                );
            }
        }
    }
}