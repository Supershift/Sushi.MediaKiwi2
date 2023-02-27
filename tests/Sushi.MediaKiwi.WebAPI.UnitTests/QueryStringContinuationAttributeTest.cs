using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Primitives;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.WebAPI.UnitTests
{
    public class QueryStringContinuationAttributeTest
    {
        [Fact]
        public void AddContinuationTest()
        {
            // arrange
            int maxItems = 20;
            string continuationToken = "mytoken";

            var attribute = new QueryStringContinuationAttribute();

            var contextItems = new Dictionary<object, object?>();
            var queryStore = new Dictionary<string, StringValues>();
            var query = new QueryCollection(queryStore);

            var requestMock = new Mock<HttpRequest>();
            requestMock.Setup(x=>x.Query).Returns(query);

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(x => x.Request).Returns(requestMock.Object);
            httpContextMock.Setup(x => x.Items).Returns(contextItems);

            var actionContext = new ActionContext(
                httpContextMock.Object,
                Mock.Of<RouteData>(),
                Mock.Of<ActionDescriptor>(),
                Mock.Of<ModelStateDictionary>()
            );

            var actionExecutingContextMock = new ActionExecutingContext(
                actionContext,
                Mock.Of<IList<IFilterMetadata>>(),
                Mock.Of<IDictionary<string, object>>(),
                new object());
            

            queryStore["maxItems"] = maxItems.ToString();
            queryStore["continuationToken"] = continuationToken;

            // act
            attribute.OnActionExecuting(actionExecutingContextMock);


            // assert
            Assert.Contains(contextItems.Keys, x=> x.ToString() == "continuation");
            
            var result = contextItems["continuation"];
            Assert.NotNull(result);
            Assert.IsType<ContinuationValues>(result);
            Assert.Equal(maxItems, ((ContinuationValues)result).MaxItems);
            Assert.Equal(continuationToken, ((ContinuationValues)result).Token);
        }

        [Fact]
        public void AddContinuationTest_Default()
        {
            // arrange
            int maxItems = 555;
            var attribute = new QueryStringContinuationAttribute(maxItems);

            var contextItems = new Dictionary<object, object?>();
            var queryStore = new Dictionary<string, StringValues>();
            var query = new QueryCollection(queryStore);

            var requestMock = new Mock<HttpRequest>();
            requestMock.Setup(x => x.Query).Returns(query);

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(x => x.Request).Returns(requestMock.Object);
            httpContextMock.Setup(x => x.Items).Returns(contextItems);

            var actionContext = new ActionContext(
                httpContextMock.Object,
                Mock.Of<RouteData>(),
                Mock.Of<ActionDescriptor>(),
                Mock.Of<ModelStateDictionary>()
            );

            var actionExecutingContextMock = new ActionExecutingContext(
                actionContext,
                Mock.Of<IList<IFilterMetadata>>(),
                Mock.Of<IDictionary<string, object>>(),
                new object());

            // act
            attribute.OnActionExecuting(actionExecutingContextMock);

            // assert
            var result = contextItems["continuation"] as ContinuationValues;
            Assert.NotNull(result);
            Assert.Equal(maxItems, result.MaxItems);
            Assert.Null(result.Token);
        }
    }
}
