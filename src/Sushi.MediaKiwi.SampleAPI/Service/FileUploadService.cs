using Sushi.MediaKiwi.Services.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services
{
    public class FileUploadService
    {

        public FileUploadService()
        {
          
        }
        /// <summary>
        /// Creates a new <see cref="FileUpload"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        public async Task<Result<FileUpload>> CreateAsync(IFormFile file)
        {
            // TODO: This is just for mocking, later we really upload
            var result = new FileUpload();
            result.Name = file.Name;
            result.Size = file.Length;
            result.FileUrl = file.FileName;
            result.FileType = file.ContentType;

            return new Result<FileUpload>(result);
        }

    }
}
