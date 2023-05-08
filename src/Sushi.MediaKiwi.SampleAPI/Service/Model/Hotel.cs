using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.SampleAPI.Service.Model;

public class Hotel
{     
    /// <summary>
    /// ISO country code
    /// </summary>
    [Required, StringLength(2, MinimumLength = 2)]
    public string CountryCode { get; set; }

    /// <summary>
    /// Name of the hotel
    /// </summary>
    [Required, StringLength(256)]
    public string Name { get; set; }

    /// <summary>
    /// Is the hotel active
    /// </summary>
    public bool IsActive { get; set; }
}
