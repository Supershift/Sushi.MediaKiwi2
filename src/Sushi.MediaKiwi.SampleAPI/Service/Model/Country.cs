using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.SampleAPI.Service.Model
{
    public class Country
    {
        /// <summary>
        /// ISO country code
        /// </summary>
        [Required, StringLength(2, MinimumLength = 2)]
        public string Code { get; set; }

        /// <summary>
        /// Name of the country
        /// </summary>
        [Required, StringLength(128)]
        public string Name { get; set; }
    }
}
