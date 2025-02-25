using Sushi.MicroORM.Supporting;
using System.Linq.Expressions;

namespace Sushi.MediaKiwi.Services;

/// <summary>
/// Represents sort field and direction that is checked against the allowed properties of a class.
/// </summary>
public class SortingValidated<T>
{
    /// <summary>
    /// 
    /// </summary>
    public static SortingValidated<T> Default { get; } = new(SortingValues.Default, []);

    /// <summary>
    /// 
    /// </summary>
    public SortingValidated(SortingValues sort, Expression<Func<T, object?>>[] allow)
    {
        var allowPropertyNames = allow.Select(CreateId).ToArray();

        string? by = sort.SortBy is not null ? FirstCharToUpper(sort.SortBy) : null;
        IsValid = by is not null && allowPropertyNames.Contains(by);

        if (IsValid)
        {
            By = by;
            Direction = sort.SortDirection ?? SortDirection.ASC;
        }
        else
        {
            By = null;
            Direction = SortDirection.ASC;
        }
    }

    /// <summary>
    /// Is set by API and value is allowed
    /// </summary>
    public bool IsValid { get; }

    /// <summary>
    /// 
    /// </summary>
    public string? By { get; }

    /// <summary>
    /// 
    /// </summary>
    public SortDirection Direction { get; }

    private static string FirstCharToUpper(string n) => char.ToUpperInvariant(n[0]) + n[1..];

    private static string CreateId(Expression<Func<T, object?>> expression)
    {
        return string.Join(".", ReflectionHelper.GetMemberTree(expression).Select(x => x.Name));
    }
}
