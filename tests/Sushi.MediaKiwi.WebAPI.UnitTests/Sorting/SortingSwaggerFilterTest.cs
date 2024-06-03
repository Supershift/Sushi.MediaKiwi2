using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Moq;
using Sushi.MediaKiwi.WebAPI.Sorting;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Sorting
{
    public class SortingSwaggerFilterTest
    {
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

        [QueryStringSorting<TestFake.TestFakeSortMap>]
        private void SampleSortingMethod() { }


        private void SampleNonSortingMethod() { }
    }
}
