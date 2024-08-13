using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Sushi.MediaKiwi.Services;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Diagnostics;

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
            var sortMap = (attributes.FirstOrDefault(x => x is IQueryStringSortingAttribute) as IQueryStringSortingAttribute)?.SortMap;

            if (sortMap is null)
            {
                var parameters = context.MethodInfo.GetParameters();
                var sortable = parameters.FirstOrDefault(p => p.ParameterType.IsGenericType && p.ParameterType.GetGenericTypeDefinition() == typeof(SortQuery<,>));
                if (sortable is not null)
                {
                    sortMap = (ISortMap?)Activator.CreateInstance(sortable.ParameterType.GetGenericArguments()[0]);
                }
            }

            if (sortMap != null)
            {
                var descriptor = context.ApiDescription.ActionDescriptor as ControllerActionDescriptor;

                if (descriptor != null)
                {
                    // add parameters object if it doesn't exist
                    if (operation.Parameters == null)
                    {
                        operation.Parameters = new List<OpenApiParameter>();
                    }

                    var sortByParameter = operation.Parameters.FirstOrDefault(x => x.Name == "SortBy");
                    if (sortByParameter is not null)
                    {
                        operation.Parameters.Remove(sortByParameter);
                    }

                    var sortDirectionParameter = operation.Parameters.FirstOrDefault(x => x.Name == "SortDirection");
                    if (sortDirectionParameter is not null)
                    {
                        operation.Parameters.Remove(sortDirectionParameter);
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
                            Enum = sortMap.GetSortFields().Select(x => new OpenApiString(x)).ToList<IOpenApiAny>()
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
                            Enum = Enum.GetValues<SortDirection>().Select(x => new OpenApiString(x.ToString())).ToList<IOpenApiAny>()
                        }
                    });
                }
            }
        }
    }
}
