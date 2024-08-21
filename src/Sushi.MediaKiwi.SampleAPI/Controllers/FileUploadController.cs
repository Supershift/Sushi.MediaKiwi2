using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.SampleAPI.Service;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
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
        public ActionResult<List<FileUpload>> UploadFiles([FromBody] List<IFormFile> files)
        {
            var result = _fileUploadService.Upload(files);

            return Ok(result);
        }
    }
}
