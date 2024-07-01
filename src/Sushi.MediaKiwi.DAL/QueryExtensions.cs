using Sushi.MediaKiwi.Services;
using Sushi.MicroORM;

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
        public static void AddPaging<T>(this DataQuery<T> query, PagingValues pagingValues)
        {
            query.AddPaging(pagingValues.PageSize, pagingValues.PageIndex);
        }

        /// <summary>
        /// Adds sorting to a query, taking values from <see cref="SortValues"/>.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="query"></param>
        /// <param name="sortingValues"></param>
        public static void AddOrder<T>(this DataQuery<T> query, SortValues<T> sortingValues)
        {
            query.AddOrder(sortingValues.SortField, sortingValues.Direction == SortDirection.DESC ? SortOrder.DESC : SortOrder.ASC);
        }
    }
}
