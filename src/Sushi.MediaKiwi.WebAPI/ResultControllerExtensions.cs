using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.MediaKiwi.Services.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// 
    /// </summary>
    public static class ResultControllerExtensions
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public static ActionResult ToResponse(this ControllerBase controller, Result<ActionResult, Error> result)
        {
            return result.Match(
                Success: value =>
                {
                    return value;
                },
                Fail: error =>
                {
                    return ToResponse(controller, error);
                }
            );
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="TResult"></typeparam>
        /// <param name="controller"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public static ActionResult<TResult> ToResponse<TResult>(
            this ControllerBase controller,
            Result<TResult, Error> result
        )
        {
            return result.Match<ActionResult<TResult>>(
                Success: value => controller.Ok(value),
                Fail: error =>
                {
                    return ToResponse(controller, error);
                }
            );
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public static ActionResult ToResponse(this ControllerBase controller, Result<Error> result)
        {
            return result.Match(
                Success: () => controller.Ok(),
                Fail: error =>
                {
                    return ToResponse(controller, error);
                }
            );
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="controller"></param>
        /// <param name="error"></param>
        /// <returns></returns>
        public static ActionResult ToResponse(this ControllerBase controller, Error error)
        {
            var problemDetails = new ErrorProblemDetails
            {
                Title = error.ErrorType,
                Detail = error.Message,
                Status = (int)HttpStatusCode.BadRequest,
                Error = error,                
            };
            return controller.BadRequest(problemDetails);
            
        }
    }
}
