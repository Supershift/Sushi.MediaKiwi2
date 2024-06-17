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
using Sushi.MediaKiwi.WebAPI.Paging;
using Sushi.MediaKiwi.Services;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Paging
{
    public class QueryStringPagingAttributeTest
    {
        [Fact]
        public void AddPagingTest()
        {
            // arrange
            int pageSize = 20;
            int pageIndex = 3;

            var attribute = new QueryStringPagingAttribute();

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
                Mock.Of<IDictionary<string, object?>>(),
                new object());


            queryStore["pageSize"] = pageSize.ToString();
            queryStore["pageIndex"] = pageIndex.ToString();

            // act
            attribute.OnActionExecuting(actionExecutingContextMock);
            var result = contextItems["paging"];

            // assert
            Assert.NotNull(result);
            Assert.IsType<PagingValues>(result);
            Assert.Equal(pageSize, ((PagingValues)result).PageSize);
            Assert.Equal(pageIndex, ((PagingValues)result).PageIndex);
        }

        [Fact]
        public void AddPagingTest_Default()
        {
            // arrange
            int pageSize = 33;
            var attribute = new QueryStringPagingAttribute(pageSize);

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
                Mock.Of<IDictionary<string, object?>>(),
                new object());

            // act
            attribute.OnActionExecuting(actionExecutingContextMock);

            // assert
            var result = contextItems["paging"] as PagingValues;
            Assert.NotNull(result);
            Assert.Equal(pageSize, result.PageSize);
            Assert.Equal(0, result.PageIndex);
        }
    }
}
