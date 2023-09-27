using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.WebAPI.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI
{
    [Microsoft.AspNetCore.Components.Route($"{BaseRoute}/upload")]
    public class FileUploadController : MediaKiwiControllerBase
    {
        private FileUploadService _fileUploadService;

        /// <summary>
        /// Creates a new instance of <see cref="FileUploadController"/>.
        /// </summary>
        /// <param name="fileUploadService"></param>
        public FileUploadController(FileUploadService fileUploadService)
        {
            _fileUploadService = fileUploadService;
        }

        /// <summary>
        /// Uploads a new file.
        /// </summary>        
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<IActionResult>> UploadFile([FromBody] IFormFile file)
        {
            byte[] data = new byte[file.Length];

            using (var bstream = file.OpenReadStream())
            {
                while (bstream.CanRead)
                {
                    bstream.Read(data);
                }
            }

            return Ok();
        }
    }
}
