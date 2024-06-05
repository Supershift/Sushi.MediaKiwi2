using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Moq;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.WebAPI.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Paging
{
    public class PagingRetrieverTest
    {
        [Fact]
        public void GetPagingTest()
        {
            // arrange
            var expected = new PagingValues(2, 11);

            var contextItems = new Dictionary<object, object?>();

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(x => x.Items).Returns(contextItems);

            contextItems["paging"] = expected;

            var accessorMock = new Mock<IHttpContextAccessor>();
            accessorMock.Setup(x => x.HttpContext).Returns(httpContextMock.Object);

            var retriever = new PagingRetriever(accessorMock.Object);

            // act
            var result = retriever.GetPaging();

            // assert
            Assert.Same(expected, result);
        }

        [Fact]
        public void GetPagingTest_Default()
        {
            // arrange
            var contextItems = new Dictionary<object, object?>();

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(x => x.Items).Returns(contextItems);

            var accessorMock = new Mock<IHttpContextAccessor>();
            accessorMock.Setup(x => x.HttpContext).Returns(httpContextMock.Object);

            var retriever = new PagingRetriever(accessorMock.Object);

            // act
            var result = retriever.GetPaging();

            // assert
            Assert.Same(PagingValues.Default, result);
        }
    }


}
