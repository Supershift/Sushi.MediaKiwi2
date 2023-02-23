using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL
{
    /// <summary>
    /// Provides extension methods for <see cref="DataQuery{T}"/>.
    /// </summary>
    public static class QueryExtensions
    {
        /// <summary>
        /// Add paging to a query, taking values from <see cref="PagingValues"/>.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="query"></param>
        /// <param name="pagingValues"></param>
        public static void AddPaging<T>(this DataQuery<T> query, PagingValues pagingValues) where T : new()
        {
            query.AddPaging(pagingValues.PageSize, pagingValues.PageIndex);
        }
    }
}
