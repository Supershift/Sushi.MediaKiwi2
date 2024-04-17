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
        [SwaggerSchema(ReadOnly = true)]
        public required string LocaleId { get; set; }
        [SwaggerSchema(ReadOnly = true)]
        public required string Namespace { get; set; }
        [SwaggerSchema(ReadOnly = true)]
        public required string Key { get; set; }
        [SwaggerSchema(ReadOnly = true)]
        public required string Value { get; set; }
    }
}
