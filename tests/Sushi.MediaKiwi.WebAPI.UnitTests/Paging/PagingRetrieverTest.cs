using Microsoft.AspNetCore.Http;
using Moq;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Paging
{
    public class PagingRetrieverTest
    {
        [Fact]
        [Obsolete("Remove this test once GetPaging is removed.")]
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
        [Obsolete("Remove this test once GetPaging is removed.")]
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
