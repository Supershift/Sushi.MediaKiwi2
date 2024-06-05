using Microsoft.AspNetCore.Http;
using Moq;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.WebAPI.Sorting;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Sorting
{
    public class SortingRetrieverTest
    {
        [Fact]
        public void GetSortingTest()
        {
            // arrange
            var expected = new SortValues<TestFake>(x => x.Name, SortDirection.DESC);

            var contextItems = new Dictionary<object, object?>();

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(x => x.Items).Returns(contextItems);

            contextItems["sorting"] = expected;

            var accessorMock = new Mock<IHttpContextAccessor>();
            accessorMock.Setup(x => x.HttpContext).Returns(httpContextMock.Object);

            var retriever = new SortingRetriever(accessorMock.Object);

            // act
            var result = retriever.GetSorting();

            // assert
            Assert.Same(expected, result);
        }

        [Fact]
        public void GetSortingTest_Generic()
        {
            // arrange
            var expected = new SortValues<TestFake>(x => x.Name, SortDirection.DESC);

            var contextItems = new Dictionary<object, object?>();

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(x => x.Items).Returns(contextItems);

            contextItems["sorting"] = expected;

            var accessorMock = new Mock<IHttpContextAccessor>();
            accessorMock.Setup(x => x.HttpContext).Returns(httpContextMock.Object);

            var retriever = new SortingRetriever(accessorMock.Object);

            // act
            var result = retriever.GetSorting<TestFake>();

            // assert
            Assert.NotNull(result);
            Assert.Equal(expected.SortField, result.SortField);
            Assert.Equal(expected.Direction, result.Direction);
        }

        [Fact]
        public void GetSortingTest_Default_ValueProvided()
        {
            // arrange
            var expected = new SortValues<TestFake>(x => x.Name, SortDirection.DESC);

            var contextItems = new Dictionary<object, object?>();

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(x => x.Items).Returns(contextItems);

            contextItems["sorting"] = expected;

            var accessorMock = new Mock<IHttpContextAccessor>();
            accessorMock.Setup(x => x.HttpContext).Returns(httpContextMock.Object);

            var retriever = new SortingRetriever(accessorMock.Object);

            // act
            var result = retriever.GetSorting<TestFake>(x => x.Id, SortDirection.ASC);

            // assert
            Assert.NotNull(result);
            Assert.Equal(expected.SortField, result.SortField);
            Assert.Equal(expected.Direction, result.Direction);
        }

        [Fact]
        public void GetSortingTest_Default_NoneProvided()
        {
            // arrange
            var expected = new SortValues<TestFake>(x => x.Description, SortDirection.ASC);

            var contextItems = new Dictionary<object, object?>();

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(x => x.Items).Returns(contextItems);

            var accessorMock = new Mock<IHttpContextAccessor>();
            accessorMock.Setup(x => x.HttpContext).Returns(httpContextMock.Object);

            var retriever = new SortingRetriever(accessorMock.Object);

            // act
            var result = retriever.GetSorting(expected.SortField, expected.Direction);

            // assert
            Assert.NotNull(result);
            Assert.Equal(expected.SortField, result.SortField);
            Assert.Equal(expected.Direction, result.Direction);
        }

        [Fact]
        public void GetSortingTest_Generic_TypeError()
        {
            // arrange
            var expected = new SortValues<object>(x => x, SortDirection.DESC);

            var contextItems = new Dictionary<object, object?>();

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(x => x.Items).Returns(contextItems);

            contextItems["sorting"] = expected;

            var accessorMock = new Mock<IHttpContextAccessor>();
            accessorMock.Setup(x => x.HttpContext).Returns(httpContextMock.Object);

            var retriever = new SortingRetriever(accessorMock.Object);

            // act
            var action = () => retriever.GetSorting<TestFake>();

            // assert
            Assert.Throws<InvalidCastException>(() => action());
        }

        [Fact]
        public void GetSortingTest_Generic_Null()
        {
            // arrange
            var contextItems = new Dictionary<object, object?>();

            var httpContextMock = new Mock<HttpContext>();
            httpContextMock.Setup(x => x.Items).Returns(contextItems);            

            var accessorMock = new Mock<IHttpContextAccessor>();
            accessorMock.Setup(x => x.HttpContext).Returns(httpContextMock.Object);

            var retriever = new SortingRetriever(accessorMock.Object);

            // act
            var result = retriever.GetSorting<TestFake>();

            // assert
            Assert.Null(result);
        }
    }


}
