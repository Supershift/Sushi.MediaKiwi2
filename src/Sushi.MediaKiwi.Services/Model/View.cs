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
    /// Represents a view in the application.
    /// </summary>
    public class View
    {
        /// <summary>
        /// Human-readable unique ID.
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public string? Id { get; set; }

        /// <summary>
        /// Name for this view.
        /// </summary>
        [Required, StringLength(128)]
        public string Name { get; set; }

        /// <summary>
        /// The key of the Vue component implementing this view, e.g. ./views/myView.vue, MyKey
        /// </summary>
        [Required, StringLength(128)]
        public string ComponentKey { get; set; }

        /// <summary>
        /// Name of the URL parameter required by this view.
        /// </summary>
        public string? ParameterName { get; set; }

        /// <summary>
        /// If not empty, access to this view is restricted to these roles.
        /// </summary>
        [Required]
        public List<string> Roles { get; set; } = new List<string>();
    }
}
