using Sushi.MediaKiwi.Services.Model;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.SampleAPI.Service.Model;

public class HotelDto
{
    /// <summary>
    /// The hotel identifier
    /// </summary>
    [SwaggerSchema(ReadOnly = true)]
    public int Id { get; set; }

    /// <summary>
    /// ISO country code
    /// </summary>
    [Required, StringLength(2, MinimumLength = 2)]
    public string CountryCode { get; set; } = null!;

    /// <summary>
    /// Name of the hotel
    /// </summary>
    [Required, StringLength(256)]
    public string Name { get; set; } = null!;

    /// <summary>
    /// Is the hotel active
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// When the hotel record was created.
    /// </summary>
    public DateTime Created { get; set; }

    public MoneyValue? SRP { get; set; } 
}
