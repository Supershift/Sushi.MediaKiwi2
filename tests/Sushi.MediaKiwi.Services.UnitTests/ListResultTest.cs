using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class ListResultTest
    {
        [Fact]
        public void CreateListResult_FromList()
        {
            // arrange
            var list = new List<object>() { new object(), new object() };

            // act
            var result = new ListResult<object>(list);

            // assert
            Assert.NotNull(result.Result);
            Assert.Equal(list, result.Result);
            Assert.Null(result.TotalCount);
            Assert.Null(result.PageCount);
        }

        [Fact]
        public void CreateListResult_FromPagingResult()
        {
            // arrange
            int pageCount = 12;
            int totalCount = 128;
            var list = new List<object>() { new object(), new object() };
            var pagingResult = new QueryListResult<object>() { TotalNumberOfPages = pageCount, TotalNumberOfRows = totalCount };

            // act
            var result = new ListResult<object>(list, pagingResult);

            // assert
            Assert.NotNull(result.Result);
            Assert.Equal(list, result.Result);
            Assert.Equal(totalCount, result.TotalCount);
            Assert.Equal(pageCount, result.PageCount);
        }

        [Fact]
        public void CreateListResult_FromQueryListResult()
        {
            // arrange
            int pageCount = 12;
            int totalCount = 128;
            var list = new QueryListResult<object>() { new object(), new object() } ;
            list.TotalNumberOfPages = pageCount;
            list.TotalNumberOfRows = totalCount;

            // act
            var result = new ListResult<object>(list);

            // assert
            Assert.NotNull(result.Result);
            Assert.Equal(list, result.Result);
            Assert.Equal(totalCount, result.TotalCount);
            Assert.Equal(pageCount, result.PageCount);
        }

        [Fact]
        public void CreateListResult_Manual()
        {
            // arrange
            int pageCount = 12;
            int totalCount = 128;
            var list = new List<object>() { new object(), new object() };            

            // act
            var result = new ListResult<object>(list, totalCount, pageCount);

            // assert
            Assert.NotNull(result.Result);
            Assert.Equal(list, result.Result);
            Assert.Equal(totalCount, result.TotalCount);
            Assert.Equal(pageCount, result.PageCount);
        }
    }
}
