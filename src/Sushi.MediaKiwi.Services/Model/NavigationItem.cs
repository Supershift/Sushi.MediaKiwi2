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
        [SwaggerSchema(ReadOnly = true)]
        public string Id { get; set; } = null!;

        /// <summary>
        /// Name of this navigation item.
        /// </summary>
        [Required, StringLength(128)]
        public string Name { get; set; } = null!;
        
        /// <summary>
        /// The section to which the item belongs in the navigation tree.
        /// </summary>
        [Required, StringLength(64)]
        public string SectionId { get; set; } = null!;

        /// <summary>
        /// If not empty, Id of the parent navigation item.
        /// </summary>
        [StringLength(64)]
        public string? ParentNavigationItemId { get; set; }
        
        /// <summary>
        /// If not empty, Id of the view to display when this item is selected. If empty, this item is a folder.
         /// </summary>
        public string? ViewId { get; set; }        
        
        /// <summary>
        /// Icon to display for this item.
        /// </summary>
        public string? Icon { get; set; }   

        /// <summary>
        /// Order in which this item should be displayed. Lower values are displayed first.
        /// </summary>
        public int SortOrder { get; set; }
    }
}
