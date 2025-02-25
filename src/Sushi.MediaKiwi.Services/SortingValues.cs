using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace Sushi.MediaKiwi.Services;

/// <summary>
/// Represents a sort field and direction from a query.
/// </summary>
public record SortingValues(
    [property: FromQuery(Name = "sortBy")] string? SortBy,
    [property: FromQuery(Name = "sortDirection")] string? SortDirection)
{
    /// <summary>
    /// Extract sorting matched with a type
    /// </summary>
    public SortingValidated<T> Allow<T>(params Expression<Func<T, object?>>[] allow) => new(this, allow);

    /// <summary>
    /// Gets a <see cref="SortingValues"/> instance with no values.
    /// </summary>
    public static readonly SortingValues Default = new(null, null);
}
