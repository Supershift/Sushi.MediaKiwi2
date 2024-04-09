using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Model
{
    /// <summary>
    /// Request sent to update the value of a translation.
    /// </summary>
    public record UpdateTranslationRequest
    {        
        [Required]
        public required string Value { get; set; }
    }
}
