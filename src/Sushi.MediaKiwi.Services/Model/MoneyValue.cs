using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Represents a monetary value, e.g. EUR 25.00, USD 10.00, etc.
    /// </summary>
    public record MoneyValue
    {
        /// <summary>
        /// Currency of the monetary value, e.g. EUR, USD, NOK, etc.
        /// </summary>
        [Required, StringLength(3)]
        public string Currency { get; set; } = null!;

        /// <summary>
        /// Amount of the monetary value, e.g. 15.00, 25.50, etc.
        /// </summary>
        [Required]
        public decimal Amount { get; set; }        
    }
}
