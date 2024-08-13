using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Moq;
using Sushi.MediaKiwi.WebAPI.Sorting;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Sorting
{
    public class SortingSwaggerFilterTest
    {
        [Fact]
        public void AddSortingToSwaggerTestOld()
        {
            // arrange
            var filter = new SortingSwaggerFilter();

            var method = typeof(SortingSwaggerFilterTest).GetMethod(nameof(SampleSortingMethodOld), BindingFlags.NonPublic | BindingFlags.Instance)!;

            var actionDescriptor = new ControllerActionDescriptor();
            actionDescriptor.MethodInfo = method;

            var apiDescription = new ApiDescription();
            apiDescription.ActionDescriptor = actionDescriptor;

            var context = new OperationFilterContext(
                apiDescription,
                Mock.Of<ISchemaGenerator>(),
                new SchemaRepository(),
                method);

            var operation = new OpenApiOperation();

            // act
            filter.Apply(operation, context);

            // assert
            Assert.Contains(operation.Parameters, x => x.Name == "sortBy");
            Assert.Contains(operation.Parameters, x => x.Name == "sortDirection");
        }

        [Fact]
        public void AddSortingToSwaggerTest()
        {
            // arrange
            var filter = new SortingSwaggerFilter();

            var method = typeof(SortingSwaggerFilterTest).GetMethod(nameof(SampleSortingMethod), BindingFlags.NonPublic | BindingFlags.Instance)!;

            var actionDescriptor = new ControllerActionDescriptor();
            actionDescriptor.MethodInfo = method;

            var apiDescription = new ApiDescription();
            apiDescription.ActionDescriptor = actionDescriptor;

            var context = new OperationFilterContext(
                apiDescription,
                Mock.Of<ISchemaGenerator>(),
                new SchemaRepository(),
                method);

            var operation = new OpenApiOperation();

            // act
            filter.Apply(operation, context);

            // assert
            Assert.Contains(operation.Parameters, x => x.Name == "sortBy");
            Assert.Contains(operation.Parameters, x => x.Name == "sortDirection");
        }

        [Fact]
        public void AddSortingToSwaggerTest_NoAttribute()
        {
            // arrange
            var filter = new SortingSwaggerFilter();

            var method = typeof(SortingSwaggerFilterTest).GetMethod(nameof(SampleNonSortingMethod), BindingFlags.NonPublic | BindingFlags.Instance)!;

            var actionDescriptor = new ControllerActionDescriptor();
            actionDescriptor.MethodInfo = method;

            var apiDescription = new ApiDescription();
            apiDescription.ActionDescriptor = actionDescriptor;

            var context = new OperationFilterContext(
                apiDescription,
                Mock.Of<ISchemaGenerator>(),
                new SchemaRepository(),
                method);

            var operation = new OpenApiOperation();

            // act
            filter.Apply(operation, context);

            // assert
            Assert.DoesNotContain(operation.Parameters, x => x.Name == "sortBy");
            Assert.DoesNotContain(operation.Parameters, x => x.Name == "sortDirection");
        }

#pragma warning disable CS0618 // Type or member is obsolete
        [QueryStringSorting<TestFake.TestFakeSortMap>]
        private void SampleSortingMethodOld() { }
#pragma warning restore CS0618 // Type or member is obsolete

        private void SampleSortingMethod(SortQuery<TestFake.TestFakeSortMap, TestFake> sort) { }


        private void SampleNonSortingMethod() { }
    }
}
