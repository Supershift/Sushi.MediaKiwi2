using FluentValidation;
using Sushi.MediaKiwi.Services.Model;
using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.SampleAPI.Service.Model
{
    public record CreateHotelRequest
    {   
        /// <summary>
        /// ISO country code
        /// </summary>        
        public required string CountryCode { get; init; }

        /// <summary>
        /// Name of the hotel
        /// </summary>                
        public required string Name { get; init; }

        /// <summary>
        /// Is the hotel active
        /// </summary>
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
