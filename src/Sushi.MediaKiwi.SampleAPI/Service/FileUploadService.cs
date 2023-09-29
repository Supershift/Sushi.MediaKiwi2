using Sushi.MediaKiwi.SampleAPI.Service.Model;
using Sushi.MediaKiwi.Services.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.SampleAPI.Service
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
        /// <param name="files"></param>
        /// <returns></returns>
        public  async Task<ListResult<FileUpload>> Upload(List<IFormFile> files)
        {
            var results = new ListResult<FileUpload>();

            if (files.Any())
            {
                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                        // TODO: This is just for mocking, later we really upload
                        var result = new FileUpload();
                        result.Name = file.Name;
                        result.Size = file.Length;
                        result.FileUrl = file.FileName;
                        result.FileType = file.ContentType;
                        results.Result.Add(result);
                    }
                   
                }
            }

            return results;
        }

    }
}
