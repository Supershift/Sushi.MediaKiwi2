using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Sorting
{
    /// <summary>
    /// Provides extension methods for <see cref="DataQuery{T}"/>.
    /// </summary>
    public static class QueryExtensions
    {
        /// <summary>
        /// Adds sorting to a query, taking values from <see cref="SortValues"/>.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="query"></param>
        /// <param name="sortingValues"></param>
        public static void AddOrder<T>(this DataQuery<T> query, SortValues<T> sortingValues) where T : new()
        {   
            query.AddOrder(sortingValues.SortField, sortingValues.Direction == SortDirection.DESC ? SortOrder.DESC : SortOrder.ASC);
        }
    }
}
