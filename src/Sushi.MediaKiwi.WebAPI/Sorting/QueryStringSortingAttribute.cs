using Microsoft.AspNetCore.Mvc.Filters;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Sorting;
using System;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.Sorting
{
    /// <summary>
    /// Defines an attribute which adds sorting querystring parameters when applied to a WebAPI method.
    /// </summary>
    public interface IQueryStringSortingAttribute
    {
        /// <summary>
        /// Gets the fields available for sorting.
        /// </summary>
        ISortMap SortMap { get; }
    }
    
    /// <summary>
    /// Attribute adding sorting querystring parameters when applied to a WebAPI method. Adds 'sortBy' and 'sortDirection' querystring parameters.
    /// </summary>    
    public class QueryStringSortingAttribute<TSortMap> : ActionFilterAttribute, IQueryStringSortingAttribute where TSortMap : ISortMap, new()
    {
        /// <summary>
        /// Creates a new instance of <see cref="QueryStringSortingAttribute{T}"/>.
        /// </summary>
        public QueryStringSortingAttribute()
        {
            SortMap = new TSortMap();
        }

        /// <inheritdoc/>        
        public ISortMap SortMap { get; }

        /// <summary>
        /// Retrieves and parses sorting parameters from the request's querystring.
        /// </summary>
        /// <param name="context"></param>
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var request = context.HttpContext.Request;

            // get default values
            SortDirection sortDirection = SortDirection.ASC;            

            // try to parse sort field
            if (request.Query.ContainsKey("sortBy"))
            {
                string sortField = request.Query["sortBy"]!;

                // get sort expression
                var sortExpression = SortMap.GetItem(sortField);

                if (sortExpression != null)
                {
                    // try to parse sort direction
                    if (request.Query.ContainsKey("sortDirection"))
                    {
                        string sortDirectionString = request.Query["sortDirection"]!;
                        if (sortDirectionString.Equals(SortDirection.DESC.ToString(), StringComparison.OrdinalIgnoreCase))
                        {
                            sortDirection = SortDirection.DESC;
                        }
                    }

                    // add to http context items
                    context.HttpContext.Items["sorting"] = new SortValues(sortExpression, sortDirection);
                }
                else
                {
                    // optionally return 400?
                }
            }

            base.OnActionExecuting(context);
        }
    }
}
