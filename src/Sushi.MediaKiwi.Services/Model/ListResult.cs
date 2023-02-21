using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Model
{
    public class ListResult<T> : IPagingResult
    {
        public ListResult() : this(null, null) { }

        public ListResult(List<T> result) : this(result, null, null) { }

        public ListResult(int? totalCount, int? pageCount) : this(new List<T>(), totalCount, pageCount) { }

        public ListResult(List<T> result, int? totalCount, int? pageCount)
        {
            Result = result;
            TotalCount = totalCount;
            PageCount = pageCount;
        }

        public List<T> Result { get; }
        
        /// <inheritdoc/>        
        public int? TotalCount { get; }
        
        /// <inheritdoc/>
        public int? PageCount { get; }
    }
}
