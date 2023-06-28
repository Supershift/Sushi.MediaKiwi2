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
        public string LocaleId { get; set; }
        [SwaggerSchema(ReadOnly = true)]
        public string Namespace { get; set; }
        [SwaggerSchema(ReadOnly = true)]
        public string Key { get; set; }
        [SwaggerSchema(ReadOnly = true)]
        public string Value { get; set; }
    }
}
