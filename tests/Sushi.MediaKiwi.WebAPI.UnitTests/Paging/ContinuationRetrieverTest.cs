using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Moq;
using Sushi.LanguageExtensions;
using Sushi.MediaKiwi.WebAPI.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Paging
{
    public class ContinuationRetrieverTest
    {
        [Fact]
        public void GetContinuationTest()
        {
            // arrange
            var expected = new ContinuationValues("mytoken", 500);

            var contextItems = new Dictionary<object, object?>();

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(x => x.Items).Returns(contextItems);

            contextItems["continuation"] = expected;

            var accessorMock = new Mock<IHttpContextAccessor>();
            accessorMock.Setup(x => x.HttpContext).Returns(httpContextMock.Object);

            var retriever = new ContinuationRetriever(accessorMock.Object);

            // act
            var result = retriever.GetContinuationValues();

            // assert
            Assert.Same(expected, result);
        }

        [Fact]
        public void GetContinuationTest_Default()
        {
            // arrange
            var contextItems = new Dictionary<object, object?>();

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(x => x.Items).Returns(contextItems);

            var accessorMock = new Mock<IHttpContextAccessor>();
            accessorMock.Setup(x => x.HttpContext).Returns(httpContextMock.Object);

            var retriever = new ContinuationRetriever(accessorMock.Object);

            // act
            var result = retriever.GetContinuationValues();

            // assert
            Assert.Same(ContinuationValues.Default, result);
        }
    }
}
