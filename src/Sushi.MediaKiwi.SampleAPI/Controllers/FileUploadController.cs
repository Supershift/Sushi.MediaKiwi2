using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.SampleAPI.Controllers;
using Sushi.MediaKiwi.SampleAPI.Service;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.WebAPI.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace Sushi.MediaKiwi.SampleAPI.Controllers
{
    [Route($"{BaseRoute}/upload")]
    public class FileUploadController : SampleControllerBase
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
        public async Task<ActionResult<List<FileUpload>>> UploadFile([FromBody] List<IFormFile> files)
        {
            var result = await _fileUploadService.Upload(files);

            return Ok(result);
        }
    }
}
