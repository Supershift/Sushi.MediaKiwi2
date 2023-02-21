using Microsoft.AspNetCore.Mvc.Filters;
using Sushi.MediaKiwi.DAL.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.Paging
{
    /// <summary>
    /// Attribute adding paging querystring parameters when applied to a WebAPI method. <see cref="PagingValues"/> can be retrieved using <see cref="PagingRetriever"/>.
    /// </summary>
    public class PagingAttribute : ActionFilterAttribute
    {
        private readonly int _defaultPageSize;

        /// <summary>
        /// Creates a new instance of <see cref="PagingAttribute"/>.
        /// </summary>
        public PagingAttribute()
        {
            _defaultPageSize = 10;
        }

        /// <summary>
        /// Creates a new instance of <see cref="PagingAttribute"/>.
        /// </summary>
        public PagingAttribute(int defaultPageSize)
        {
            _defaultPageSize = defaultPageSize;
        }

        /// <inheritdoc/>        
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var request = context.HttpContext.Request;

            // get default values
            int pageSize = _defaultPageSize;
            int pageIndex = 0;

            // try to parse pagesize and page index from querystring
            if (request.Query.ContainsKey("pageSize"))
            {

                int.TryParse(request.Query["pageSize"], out pageSize);

            }

            if (request.Query.ContainsKey("pageIndex"))
            {
                int.TryParse(request.Query["pageIndex"], out pageIndex);
            }

            // add to http context items
            context.HttpContext.Items["paging"] = new PagingValues(pageIndex, pageSize);            

            base.OnActionExecuting(context);
        }
    }
}
