using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Moq;
using Sushi.MediaKiwi.Services;
using System.Net;

namespace Sushi.MediaKiwi.WebAPI.UnitTests
{
    public class ControllerExtensionsTest
    {
        [Theory]
        [InlineData(ResultCode.Success, (int)HttpStatusCode.OK)]
        [InlineData(ResultCode.Failed, (int)HttpStatusCode.InternalServerError)]
        [InlineData(ResultCode.NotFound, (int)HttpStatusCode.NotFound)]
        [InlineData(ResultCode.ValidationFailed, (int)HttpStatusCode.BadRequest)]
        [InlineData(ResultCode.DeleteConstraintViolation, (int)HttpStatusCode.BadRequest)]
        [InlineData((ResultCode)(-1), (int)HttpStatusCode.InternalServerError)]
        public void CreateResponseTest_StatusCode(ResultCode resultCode, int expected)
        {
            // arrange            
            var response = new Result(resultCode);

            var mockController = new MockController();

            // act            
            var result = ControllerExtensions.CreateResponse(mockController, response);
            
            // assert
            Assert.IsAssignableFrom<IStatusCodeActionResult>(result);
            var statusResult = (IStatusCodeActionResult)result;
            Assert.Equal(expected, statusResult.StatusCode);
        }
    }

    internal class MockController : ControllerBase
    {
        public override ActionResult ValidationProblem(ModelStateDictionary modelStateDictionary)
        {
            // override default ValidationProblem behavior because it is not working in a unit test scenario
            // this is acknowledged by the .NET dev-team and will be changed in the future
            return new StatusCodeResult(400);
        }
    }
}