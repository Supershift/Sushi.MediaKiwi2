using Sushi.MicroORM.Mapping;
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
    /// Represents an item in the navigation tree.
    /// </summary>
    public class NavigationItem
    {
        /// <summary>
        /// Unique identifier for this navigation item.
        /// </summary>        
        [Required, SwaggerSchema(ReadOnly = true)]
        public required string Id { get; set; }

        /// <summary>
        /// Name of this navigation item.
        /// </summary>        
        [Required, StringLength(128)]
        public required string Name { get; set; }

        /// <summary>
        /// The section to which the item belongs in the navigation tree.
        /// </summary>        
        [Required, StringLength(64)]
        public required string SectionId { get; set; }

        /// <summary>
        /// If not empty, Id of the parent navigation item.
        /// </summary>        
        [StringLength(64)]
        public string? ParentNavigationItemId { get; set; }

        /// <summary>
        /// If not empty, Id of the view to display when this item is selected. If empty, this item is a folder.
        /// </summary>
        [StringLength(64)]
        public string? ViewId { get; set; }

        /// <summary>
        /// Icon to display for this item.
        /// </summary>
        [StringLength(255)]
        public string? Icon { get; set; }

        /// <summary>
        /// Order in which this item should be displayed. Lower values are displayed first.
        /// </summary>
        [Required]
        public int SortOrder { get; set; }
    }
}
