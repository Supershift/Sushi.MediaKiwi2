using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Routing;
using Sushi.MediaKiwi.Services;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Paging
{
    public class PagingBinderTest
    {
        [Fact]
        public void PagingBinderTest1()
        {
            // arrange
            var bindingContext = new DefaultModelBindingContext();
            var expectedPagingIndex = 1;
            var expectedPagingSize = 20;
            var expectedPagingValues = new PagingValues(expectedPagingIndex, expectedPagingSize);

            var bindingSource = new BindingSource("", "", false, false);
            var routeValueDictionary = new RouteValueDictionary
                {
                    { "pageIndex", expectedPagingIndex },
                    { "pageSize", expectedPagingSize }
                };

            bindingContext.ValueProvider = new RouteValueProvider(bindingSource, routeValueDictionary);

            var binder = new PagingBinder();
            binder.BindModelAsync(bindingContext);

            // act
            var pageValuesResult = bindingContext.Result.Model;

            // assert
            Assert.Equal(expectedPagingValues, pageValuesResult);
        }
        [Fact]
        public void PagingBinderTest_Default()
        {
            // arrange
            var bindingContext = new DefaultModelBindingContext();
            var expectedPagingIndex = 0;
            var expectedPagingSize = PagingValues.Default.PageSize;
            var expectedPagingValues = new PagingValues(expectedPagingIndex, expectedPagingSize);

            var bindingSource = new BindingSource("", "", false, false);
            var routeValueDictionary = new RouteValueDictionary{ };

            bindingContext.ValueProvider = new RouteValueProvider(bindingSource, routeValueDictionary);

            var binder = new PagingBinder();
            binder.BindModelAsync(bindingContext);

            // act
            var pageValuesResult = bindingContext.Result.Model;

            // assert
            Assert.Equal(expectedPagingValues, pageValuesResult);
        }
    }
}
