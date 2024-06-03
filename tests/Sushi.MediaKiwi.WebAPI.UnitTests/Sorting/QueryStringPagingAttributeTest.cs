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
using Sushi.MediaKiwi.WebAPI.Sorting;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.DAL.Sorting;
using System.Linq.Expressions;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Sorting
{
    public class QueryStringSortingAttributeTest
    {
        [Fact]
        public void AddSortingTest()
        {
            // arrange
            string sortBy = "name";
            string sortDirection = "desc";

            var attribute = new QueryStringSortingAttribute<TestFake.TestFakeSortMap>();

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


            queryStore["sortBy"] = sortBy;
            queryStore["sortDirection"] = sortDirection;

            // act
            attribute.OnActionExecuting(actionExecutingContextMock);
            var result = contextItems["sorting"];

            // assert
            Assert.NotNull(result);
            Assert.IsType<SortValues>(result);
            var sortValues = (SortValues)result;
            Assert.Equal(SortDirection.DESC, sortValues.Direction);            
            Assert.IsAssignableFrom<Expression<Func<TestFake, object>>>(sortValues.SortField);

            // we need to assert sort field is an expression towards 'name'
            var testFake = new TestFake() { Name = "expected value" };
            var sortField = (Expression<Func<TestFake, object>>)sortValues.SortField;
            var name = sortField.Compile()(testFake);
            Assert.Equal(testFake.Name, name);
        }

        [Fact]
        public void AddSortingTest_Empty()
        {
            // arrange            
            var attribute = new QueryStringSortingAttribute<TestFake.TestFakeSortMap>();

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
            Assert.False(contextItems.ContainsKey("sorting"));
        }

        [Fact]
        public void AddSortingTest_InvalidField()
        {
            // arrange
            string sortBy = "doesnotexist";
            string sortDirection = "desc";

            var attribute = new QueryStringSortingAttribute<TestFake.TestFakeSortMap>();

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


            queryStore["sortBy"] = sortBy;
            queryStore["sortDirection"] = sortDirection;

            // act
            attribute.OnActionExecuting(actionExecutingContextMock);
            
            // assert            
            Assert.False(contextItems.ContainsKey("sorting"));
        }

        [Fact]
        public void AddSortingTest_InvalidDirection()
        {
            // arrange
            string sortBy = "name";
            string sortDirection = "wrong";

            var attribute = new QueryStringSortingAttribute<TestFake.TestFakeSortMap>();

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


            queryStore["sortBy"] = sortBy;
            queryStore["sortDirection"] = sortDirection;

            // act
            attribute.OnActionExecuting(actionExecutingContextMock);
            var result = contextItems["sorting"];

            // assert
            Assert.NotNull(result);            
            var sortValues = (SortValues)result;
            Assert.Equal(SortDirection.ASC, sortValues.Direction);
        }
    }
}
