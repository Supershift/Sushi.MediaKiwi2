using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Moq;
using Sushi.MediaKiwi.DAL.Sorting;
using Sushi.MediaKiwi.WebAPI.Sorting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        
    }


}
