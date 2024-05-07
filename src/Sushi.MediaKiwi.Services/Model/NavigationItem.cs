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
    public class NavigationItem
    {
        [SwaggerSchema(ReadOnly = true)]
        public int Id { get; set; }
        
        [Required, StringLength(128)]
        public string Name { get; set; }
        
        [Required]
        public int SectionId { get; set; }
        
        public int? ParentNavigationItemId { get; set; }
        
        public string? ViewId { get; set; }        
        
        public string? Icon { get; set; }   

        public int SortOrder { get; set; }
    }
}
