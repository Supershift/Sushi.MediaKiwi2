using Microsoft.AspNetCore.Mvc;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Represents values used when adding continuous scroll on datasets.
    /// </summary>
    public record ContinuationValues([property: FromQuery(Name = "token")] string? Token = null, [property: FromQuery(Name = "maxItems")] int MaxItems = 10)
    {
        /// <summary>
        /// Gets a <see cref="ContinuationValues"/> instance with default values (maxItems = 10, token = NULL).
        /// </summary>
        public static readonly ContinuationValues Default = new ContinuationValues();        
    }
}
