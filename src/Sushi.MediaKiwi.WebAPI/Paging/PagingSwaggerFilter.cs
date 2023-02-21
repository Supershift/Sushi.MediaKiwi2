using Azure;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.Paging
{
    /// <summary>
    /// Adds paging parameters to Swagger docs for every operation decorated with <see cref="PagingAttribute"/>.
    /// </summary>
    public class PagingSwaggerFilter : IOperationFilter
    {
        /// <inheritdoc/>        
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // check if method has PagingAttribute
            var attributes = context.ApiDescription.CustomAttributes();
            var hasPaging = attributes.Any(x => x is PagingAttribute);

            if (hasPaging)
            {
                var descriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;

                if (descriptor != null)
                {
                    // add parameters object if it doesn't exist
                    if (operation.Parameters == null) operation.Parameters = new List<OpenApiParameter>();

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
