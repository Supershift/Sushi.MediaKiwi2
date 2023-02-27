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
    /// Adds continuation parameters to Swagger docs for every operation decorated with <see cref="QueryStringContinuationAttribute"/>.
    /// </summary>
    public class ContinuationSwaggerFilter : IOperationFilter
    {
        /// <inheritdoc/>        
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // check if method has QueryStringContinuationAttribute
            var attributes = context.ApiDescription.CustomAttributes();
            var hasPaging = attributes.Any(x => x is QueryStringContinuationAttribute);

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
                        Name = "continuationToken",
                        In = ParameterLocation.Query,
                        Description = "When filled gives back the next set of items",
                        Required = false,
                        Schema = new OpenApiSchema()
                        {
                            Type = "string",
                            Format = "string"                            
                        }
                    });

                    operation.Parameters.Add(new OpenApiParameter()
                    {
                        Name = "maxItems",
                        In = ParameterLocation.Query,
                        Description = "Maximum number of items returned per call",
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
