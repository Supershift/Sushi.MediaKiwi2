using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI
{
    public static class ControllerExtensions
    {
        /// <summary>
        /// Creates a response object based on the logic layer's result.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="result"></param>
        /// <returns></returns>
        public static ActionResult<T> CreateResponse<T>(this ControllerBase controller, Result<T> result) where T : class
        {
            switch (result.Code)
            {
                case ResultCode.Success:
                    return controller.Ok(result.Value);
                default:
                    return controller.CreateResponse((Result)result);
            }
        }

        /// <summary>
        /// Creates a response object based on the logic layer's result.
        /// </summary>        
        /// <param name="result"></param>
        /// <returns></returns>
        public static ActionResult CreateResponse(this ControllerBase controller, Result result) 
        {
            switch (result.Code)
            {
                case ResultCode.Success:
                    return controller.Ok();
                case ResultCode.NotFound:
                    return controller.Problem("The requested resource was not found.", null, 404, null, null);
                case ResultCode.ValidationFailed:
                    if (result.ValidationResult != null)
                    {
                        foreach (var item in result.ValidationResult.Errors)
                        {
                            controller.ModelState.AddModelError(item.Key, item.Value);
                        }
                    }
                    return controller.ValidationProblem(controller.ModelState);                    
                case ResultCode.DeleteConstraintViolation:
                    return controller.Problem(
                        statusCode: 400,
                        detail: "The requested resource cannot be deleted because other resources depend on it.");
                default:
                    return controller.Problem($"{result.Code} - {result.ErrorMessage}");
            }
        }
    }
}
