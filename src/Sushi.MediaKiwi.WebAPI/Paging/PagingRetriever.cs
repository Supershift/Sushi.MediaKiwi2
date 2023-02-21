using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.Paging
{
    public class PagingRetriever
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PagingRetriever(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public PagingValues GetPaging()
        {
            var context = _httpContextAccessor.HttpContext;

            PagingValues? result = null;

            // get value from context
            if (context?.Items != null)
            {
                if (context.Items.ContainsKey("paging"))
                {
                    result = context.Items["paging"] as PagingValues;
                }
            }

            // create default if none paging data found
            if(result == null)
            {
                result = new PagingValues(0, 10);
            }

            // return result
            return result;
        }
    }
}
