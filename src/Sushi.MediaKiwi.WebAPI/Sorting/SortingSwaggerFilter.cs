using Azure;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Sushi.MediaKiwi.Services;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.Sorting
{
    /// <summary>
    /// Adds sorting parameters to Swagger docs for every operation decorated with QueryStringSortingAttribute.
    /// </summary>
    public class SortingSwaggerFilter : IOperationFilter
    {
        /// <inheritdoc/>        
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // check if method has sorting attribute
            var attributes = context.ApiDescription.CustomAttributes();
            var sortingAttribute = attributes.FirstOrDefault(x => x is IQueryStringSortingAttribute) as IQueryStringSortingAttribute;

            if (sortingAttribute != null)
            {
                var descriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;

                if (descriptor != null)
                {
                    // add parameters object if it doesn't exist
                    if (operation.Parameters == null)
                    {
                        operation.Parameters = new List<OpenApiParameter>();
                    }

                    // add sorting parameters
                    operation.Parameters.Add(new OpenApiParameter()
                    {
                        Name = "sortBy",
                        In = ParameterLocation.Query,
                        Description = "Field to sort by",
                        Required = false,
                        Schema = new OpenApiSchema()
                        {
                            Type = "string",                            
                            Enum = sortingAttribute.SortMap.GetSortFields().Select(x=> new OpenApiString(x)).ToList<IOpenApiAny>()
                        }
                    });

                    operation.Parameters.Add(new OpenApiParameter()
                    {
                        Name = "sortDirection",
                        In = ParameterLocation.Query,
                        Description = "Direction to sort on",
                        Required = false,
                        Schema = new OpenApiSchema()
                        {
                            Type = "string",                            
                            Enum = Enum.GetValues<SortDirection>().Select(x=> new OpenApiString(x.ToString())).ToList<IOpenApiAny>()
                        }
                    });
                }
            }
        }
    }
}
