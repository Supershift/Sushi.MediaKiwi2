using Sushi.MediaKiwi.Services;
using System.Linq.Expressions;

namespace Sushi.MediaKiwi.WebAPI.Sorting
{
    /// <summary>
    /// Represents a sort field and direction.
    /// </summary>   
    public record SortQuery<TMap, TType>(string? SortBy, string? SortDirection) where TMap : ISortMap, new()
    {
        private SortValues? GetSortingNoType()
        {
            if (SortBy == null)
            {
                return null;
            }

            var sortExpression = new TMap().GetItem(SortBy)!;
            var sortDirection = Enum.TryParse(typeof(SortDirection), SortDirection, true, out var direction)
                ? (SortDirection)direction
                : Services.SortDirection.ASC;
            return new SortValues(sortExpression, sortDirection);
        }

        /// <summary>
        /// Convert the string query to a strongly typed <see cref="SortValues{T}"/>.
        /// </summary>
        /// <returns></returns>
        public SortValues<TType>? GetSorting()
        {
            var sortValues = GetSortingNoType();
            return sortValues is not null
                ? new SortValues<TType>((Expression<Func<TType, object?>>)sortValues.SortField, sortValues.Direction)
                : null;
        }
    }
}
