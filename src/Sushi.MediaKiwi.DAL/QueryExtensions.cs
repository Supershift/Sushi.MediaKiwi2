using Sushi.MediaKiwi.Services;
using Sushi.MicroORM;
using System.Linq.Expressions;

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
        /// Adds sorting to a query, taking values from <see cref="SortingValues"/>.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="query"></param>
        /// <param name="sortingValues"></param>
        public static void AddOrder<T>(this DataQuery<T> query, SortingValidated<T> sortingValues)
        {
            if (sortingValues.By is not null)
            {
                query.AddOrder(sortingValues.By, sortingValues.Direction == SortDirection.DESC ? SortOrder.DESC : SortOrder.ASC);
            }
        }

        /// <summary>
        /// Adds sorting to a query, taking values from <see cref="SortingValues"/>.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        public static void AddOrderWithDefault<T>(this DataQuery<T> query, SortingValidated<T> sortingValues, params Expression<Func<T, object?>>[] defaults)
        {
            if (sortingValues.By is not null)
            {
                query.AddOrder(sortingValues.By, sortingValues.Direction == SortDirection.DESC ? SortOrder.DESC : SortOrder.ASC);
            }
            else
            {
                foreach (var defaultOrder in defaults)
                {
                    query.AddOrder(defaultOrder);
                }
            }
        }
    }
}
