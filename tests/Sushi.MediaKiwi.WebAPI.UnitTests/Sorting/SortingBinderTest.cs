using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Routing;
using Sushi.MediaKiwi.WebAPI.Sorting;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Sorting;

public class SortingBinderTest
{
    [Fact]
    public void SortingBinderTest1()
    {
        // arrange
        var bindingContext = new DefaultModelBindingContext();
        var bindingSource = new BindingSource("", "", false, false);
        var routeValueDictionary = new RouteValueDictionary
            {
                { "sortBy", "name" },
                { "sortDirection", "DESC" }
            };

        bindingContext.ValueProvider = new RouteValueProvider(bindingSource, routeValueDictionary);

        var binder = new SortingBinder<TestSortMap, TestDto>();
        binder.BindModelAsync(bindingContext);

        // act
        var result = (SortQuery<TestSortMap, TestDto>?)bindingContext.Result.Model;

        // assert
        Assert.NotNull(result);
        Assert.Equal("name", result.SortBy);
        Assert.Equal("DESC", result.SortDirection);
    }

    [Fact]
    public void SortingBinderTest_NoSortingInput()
    {
        // arrange
        var bindingContext = new DefaultModelBindingContext();
        var bindingSource = new BindingSource("", "", false, false);
        var routeValueDictionary = new RouteValueDictionary { };

        bindingContext.ValueProvider = new RouteValueProvider(bindingSource, routeValueDictionary);

        var binder = new SortingBinder<TestSortMap, TestDto>();
        binder.BindModelAsync(bindingContext);

        // act
        var result = (SortQuery<TestSortMap, TestDto>?)bindingContext.Result.Model;

        // assert
        Assert.NotNull(result);
        Assert.Null(result.SortBy);
        Assert.Null(result.SortDirection);
    }

    class TestDto(string Name)
    {
        public string Name { get; } = Name;
    }

    class TestSortMap : SortMap<TestDto>
    {
        public TestSortMap()
        {
            Add(x => x.Name);
        }
    }
}
