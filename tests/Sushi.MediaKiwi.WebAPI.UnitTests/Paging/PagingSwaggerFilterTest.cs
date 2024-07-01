using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Moq;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.WebAPI.Paging;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Paging
{
    public class SortingSwaggerFilterTest
    {
        [Fact]
        public void AddPagingToSwaggerTest()
        {
            // arrange
            var filter = new PagingSwaggerFilter();

            var method = typeof(SortingSwaggerFilterTest).GetMethod(nameof(SamplePagingMethod), BindingFlags.NonPublic | BindingFlags.Instance)!;

            var actionDescriptor = new ControllerActionDescriptor();
            actionDescriptor.MethodInfo = method;

            var apiDescription = new ApiDescription();
            apiDescription.ActionDescriptor = actionDescriptor;
            apiDescription.ParameterDescriptions.Add(new ApiParameterDescription
            {
                Name = "paging",
                Type = typeof(PagingValues)
            });

            var context = new OperationFilterContext(
                apiDescription,
                Mock.Of<ISchemaGenerator>(),
                new SchemaRepository(),
                method);

            var operation = new OpenApiOperation();

            // act
            filter.Apply(operation, context);

            // assert
            Assert.Contains(operation.Parameters, x => x.Name == "pageIndex");
            Assert.Contains(operation.Parameters, x => x.Name == "pageSize");
        }

        [Fact]
        public void AddPagingToSwaggerTest_NoAttribute()
        {
            // arrange
            var filter = new PagingSwaggerFilter();

            var method = typeof(SortingSwaggerFilterTest).GetMethod(nameof(SampleNonPagingMethod), BindingFlags.NonPublic | BindingFlags.Instance)!;

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
            Assert.DoesNotContain(operation.Parameters, x => x.Name == "pageIndex");
            Assert.DoesNotContain(operation.Parameters, x => x.Name == "pageSize");
        }

        private void SamplePagingMethod() { }      


        private void SampleNonPagingMethod() { }
    }
}
