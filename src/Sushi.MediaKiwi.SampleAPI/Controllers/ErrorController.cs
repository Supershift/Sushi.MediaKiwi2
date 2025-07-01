using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.MediaKiwi.WebAPI;
using System.ComponentModel.DataAnnotations;

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
            var localized = _stringLocalizer["Hello {0}", "Jaap"];

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

        [HttpGet]
        [Route($"internalServerError")]
        public ActionResult GenerateInternalServerError()
        {
            throw new System.Exception("This is an internal server error");
        }

        [HttpGet]
        [Route($"stringError")]
        public ActionResult GenerateStringResponse()
        {
            return BadRequest("This is a basic string response");
        }

        [HttpGet]
        [Route($"slow")]
        public ActionResult SlowResponse()
        {
            System.Threading.Thread.Sleep(10000);
            return BadRequest("This is a basic string response");
        }

        [HttpPost]
        [Route($"requirements")]
        public ActionResult Requirements(ClassWithRequirement inputValue)
        {
            return Ok();
        }

        public record ClassWithRequirement(string RequiredString, [Range(1, 10)] int? BetweenOneAndTen);
    }
}
