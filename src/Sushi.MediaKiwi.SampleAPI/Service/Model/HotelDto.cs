using Sushi.MediaKiwi.Services.Model;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.SampleAPI.Service.Model;

public class HotelDto
{
    /// <summary>
    /// The hotel identifier
    /// </summary>
    [SwaggerSchema(ReadOnly = true)]
    public required int Id { get; set; }

    /// <summary>
    /// ISO country code
    /// </summary>
    [Required, StringLength(2, MinimumLength = 2)]
    public required string CountryCode { get; set; }

    /// <summary>
    /// Name of the hotel
    /// </summary>
    [Required, StringLength(256)]
    public required string Name { get; set; }

    /// <summary>
    /// Is the hotel active
    /// </summary>
    public required bool IsActive { get; set; }

    /// <summary>
    /// When the hotel record was created.
    /// </summary>
    public DateTime Created { get; set; }

    public MoneyValue? SRP { get; set; }
}
