using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Model
{
    /// <summary>
    /// Represents a locale used in localization.
    /// </summary>
    public class Locale
    {
        /// <summary>
        /// Unique id of the locale, following ISO standards, e.g. en, jp, nl-NL, en-US
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public string? Id { get; set; }
        /// <summary>
        /// Display name of the locale in its own language.
        /// </summary>
        [Required, StringLength(128)]
        public string Name { get; set; } = null!;
        /// <summary>
        /// If set to true, this locale can be used.
        /// </summary>
        [Required]
        public bool IsEnabled { get; set; }
    }
}
