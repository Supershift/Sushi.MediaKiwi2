using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.MediaKiwi.WebAPI;

namespace Sushi.MediaKiwi.SampleAPI.Controllers
{
    [AllowAnonymous]
    public class ErrorController : SampleControllerBase
    {
        private readonly IStringLocalizer<Error> _stringLocalizer;

        public ErrorController(IStringLocalizer<Error> stringLocalizer)
        {
            _stringLocalizer = stringLocalizer;
        }

        [HttpGet]
        [Route($"genericError")]
        public ActionResult GenerateGenericError()
        {
            var localized = _stringLocalizer["Hello {0}", "Jaap" ];
            
            var error = new Error("Auto generated error");
            var result = new Result<Error>(error);
            return this.ToResponse(result);
        }

        [HttpGet]
        [Route($"aggregateError")]
        public ActionResult GenerateAggregateError()
        {
            var error1 = new Error("Auto generated error");
            var error2 = new Error("Auto generated error 2");
            var aggregateError = new AggregateError(error1, error2);
            var result = new Result<Error>(aggregateError);
            return this.ToResponse(result);
        }
    }
}
