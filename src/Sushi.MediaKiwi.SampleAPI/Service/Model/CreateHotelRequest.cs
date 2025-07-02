using FluentValidation;
using Sushi.MediaKiwi.Services.Model;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.SampleAPI.Service.Model
{
    public record CreateHotelRequest
    {
        /// <summary>
        /// ISO country code
        /// </summary>        
        [SwaggerSchema(Nullable = false), Required]
        public required string CountryCode { get; init; }

        /// <summary>
        /// Name of the hotel
        /// </summary>                
        [SwaggerSchema(Nullable = false), Required]
        public required string Name { get; init; }

        /// <summary>
        /// Is the hotel active
        /// </summary>
        [SwaggerSchema(Nullable = false), Required]
        public required bool IsActive { get; init; }

        public MoneyValue? SRP { get; set; }
    }

    public class CreateHotelRequestValidator : AbstractValidator<CreateHotelRequest>
    {
        public CreateHotelRequestValidator()
        {
            RuleFor(x => x.Name).MaximumLength(64);
            RuleFor(x => x.CountryCode).Length(2);
        }
    }
}
