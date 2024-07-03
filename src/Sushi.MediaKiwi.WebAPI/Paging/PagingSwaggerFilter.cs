using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Sushi.MediaKiwi.Services;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Sushi.MediaKiwi.WebAPI.Paging
{
    /// <summary>
    /// Adds paging parameters to Swagger docs for every operation decorated with <see cref="QueryStringPagingAttribute"/>.
    /// </summary>
    public class PagingSwaggerFilter : IOperationFilter
    {
        /// <inheritdoc/>        
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // check if method has PagingAttribute
            var parameters = context.ApiDescription.ParameterDescriptions;
            var hasPaging = parameters.Any(x => x.Type == typeof(PagingValues));


            if (hasPaging)
            {
                var descriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;

                if (descriptor != null)
                {
                    // add parameters object if it doesn't exist
                    if (operation.Parameters == null)
                    {
                        operation.Parameters = new List<OpenApiParameter>();
                    }

                    // add paging parameters
                    operation.Parameters.Add(new OpenApiParameter()
                    {
                        Name = "pageIndex",
                        In = ParameterLocation.Query,
                        Description = "Zero based index of the page",
                        Required = false,
                        Schema = new OpenApiSchema()
                        {
                            Type = "integer",
                            Format = "int32",
                            Default = new OpenApiInteger(0)
                        }
                    });

                    operation.Parameters.Add(new OpenApiParameter()
                    {
                        Name = "pageSize",
                        In = ParameterLocation.Query,
                        Description = "Number of items per page",
                        Required = false,
                        Schema = new OpenApiSchema()
                        {
                            Type = "integer",
                            Format = "int32",
                            Default = new OpenApiInteger(10)
                        }
                    });
                }
            }
        }
    }
}
