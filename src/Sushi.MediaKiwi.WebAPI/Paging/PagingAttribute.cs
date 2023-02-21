using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.Paging
{
    public class PagingAttribute : ActionFilterAttribute
    {
        private readonly int _defaultPageSize;

        public PagingAttribute()
        {
            _defaultPageSize = 10;
        }

        public PagingAttribute(int defaultPageSize)
        {
            _defaultPageSize = defaultPageSize;
        }

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
