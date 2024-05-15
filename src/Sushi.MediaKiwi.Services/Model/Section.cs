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
    /// Represents a section containing related screens within a portal.
    /// </summary>
    public record Section
    {
        /// <summary>
        /// Unique identifier for this section.
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public string Id { get; set; }

        /// <summary>
        /// Name for this section.
        /// </summary>
        [Required, StringLength(128)]
        public string Name { get; set; }

        /// <summary>
        /// Value used when sorting sections.
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public int SortOrder { get; set; }

        /// <summary>
        /// ID of the icon to display for this section.
        /// </summary>
        [StringLength(128)]
        public string? Icon { get; set; }

        /// <summary>
        /// If not empty, access to this view is restricted to these roles.
        /// </summary>
        [Required]
        public List<string> Roles { get; set; } = new List<string>();
    }
}
