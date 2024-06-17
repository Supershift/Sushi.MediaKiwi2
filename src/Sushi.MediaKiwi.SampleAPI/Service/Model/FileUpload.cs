using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.SampleAPI.Service.Model
{
    public class FileUpload
    {
        /// <summary>
        /// Unique id of the file
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public string? Id { get; set; }

        /// <summary>
        /// Display name of the file.
        /// </summary>
        [Required, StringLength(256)]
        public string Name { get; set; } = null!;

        /// <summary>
        /// Size of the file.
        /// </summary>
        [Required]
        public long Size { get; set; }

        /// <summary>
        /// Created at 
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public DateTime Created { get; set; }

        /// <summary>
        /// File Type for the file in question
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public string FileType { get; set; } = null!;

        /// <summary>
        /// URI to access the file
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public string FileUrl { get; set; } = null!;

        /// <summary>
        /// Filename
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public string FileName { get; set; } = null!;
    }
}
