using Sushi.MicroORM.Mapping;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Model
{
    /// <summary>
    /// Represents a translation for a specific locale, namespace and key.
    /// </summary>
    public record Translation
    {   
        /// <summary>
        /// Id of the translation's locale.
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public required string LocaleId { get; set; }
        /// <summary>
        /// Id of the translation's namespace.
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public required string Namespace { get; set; }
        /// <summary>
        /// Unique key for this translation within the namespace and locale.
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public required string Key { get; set; }
        /// <summary>
        /// Value to display for this translation.
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public required string Value { get; set; }
    }
}
