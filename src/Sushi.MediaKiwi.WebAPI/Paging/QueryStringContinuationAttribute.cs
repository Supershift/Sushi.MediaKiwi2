using Microsoft.AspNetCore.Mvc.Filters;
using Sushi.MediaKiwi.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.Paging
{
    /// <summary>
    /// Attribute adding continuation querystring parameters when applied to a WebAPI method. <see cref="PagingValues"/> can be retrieved using <see cref="PagingRetriever"/>.
    /// </summary>
    public class QueryStringContinuationAttribute : ActionFilterAttribute
    {
        private readonly int _defaultMaxItems;

        /// <summary>
        /// Creates a new instance of <see cref="QueryStringPagingAttribute"/>.
        /// </summary>
        public QueryStringContinuationAttribute()
        {
            _defaultMaxItems = ContinuationValues.Default.MaxItems;
        }

        /// <summary>
        /// Creates a new instance of <see cref="QueryStringContinuationAttribute"/>.
        /// </summary>
        public QueryStringContinuationAttribute(int defaultMaxItems)
        {
            _defaultMaxItems = defaultMaxItems;
        }

        /// <inheritdoc/>        
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var request = context.HttpContext.Request;

            // get default values
            int maxItems = _defaultMaxItems;
            string? continuationToken = null;

            // try to parse pagesize and page index from querystring
            if (request.Query.ContainsKey("maxItems"))
            {
                int.TryParse(request.Query["maxItems"], out maxItems);
            }

            if (request.Query.ContainsKey("continuationToken"))
            {
                continuationToken = request.Query["continuationToken"];
            }

            // add to http context items
            context.HttpContext.Items["continuation"] = new ContinuationValues(continuationToken, maxItems);            

            base.OnActionExecuting(context);
        }
    }
}
