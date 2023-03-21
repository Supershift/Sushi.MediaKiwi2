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
    /// Represents a screen in the application.
    /// </summary>
    public class Screen
    {
        /// <summary>
        /// Unique identifier for this screen.
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public int Id { get; set; }

        /// <summary>
        /// Name for this screen.
        /// </summary>
        [Required, StringLength(128)]
        public string Name { get; set; }

        /// <summary>
        /// The filename of the Vue the component implementing this screen, 
        /// relative to the components folder, e.g. MyScreen.vue, checkout/Payment.vue
        /// </summary>
        [Required, StringLength(128)]
        public string ComponentKey { get; set; }

        /// <summary>
        /// Section to which this screen belongs.
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public int SectionId { get; set; }
    }
}
