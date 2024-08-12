using Sushi.MediaKiwi.Services;
using System.Linq.Expressions;

namespace Sushi.MediaKiwi.WebAPI.Sorting
{
    /// <summary>
    /// Represents a sort field and direction.
    /// </summary>   
    public record SortingStrings(string? SortBy, string? SortDirection)
    {
        /// <summary>
        /// To <see cref="SortValues"/>.
        /// </summary>
        /// <returns></returns>
        public SortValues? GetSorting<T>() where T: ISortMap, new()
        {
            if (SortBy == null)
            {
                return null;
            }

            var sortExpression = new T().GetItem(SortBy)!;
            var sortDirection = Enum.TryParse(typeof(SortDirection), SortDirection, true, out var direction) ? (SortDirection)direction : Services.SortDirection.ASC;
            return new SortValues(sortExpression, sortDirection);
        }

        /// <summary>
        /// To <see cref="SortValues{T}"/>.
        /// </summary>
        /// <returns></returns>
        public SortValues<TType>? GetSorting<TMap, TType>() where TMap : ISortMap, new()
        {
            var sortValues = GetSorting<TMap>();
            return sortValues is not null 
                ? new SortValues<TType>((Expression<Func<TType, object?>>)sortValues.SortField, sortValues.Direction)
                : null;
        }
    }
}
