using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;

namespace WebProdavnica.Entities.DTOs
{
    public class RatingRequest
    {
        [Range(1, 5, ErrorMessage = "Ocena mora biti između 1 i 5")]
        public int Rating { get; set; }
    }
}