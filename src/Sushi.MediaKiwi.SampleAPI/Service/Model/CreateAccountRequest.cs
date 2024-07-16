using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.SampleAPI.Service.Model
{
    public record CreateAccountRequest
    {
        [Required, MaxLength(64)]
        public required string Number { get; init; }

        [Required, MaxLength(64)]
        public required string HolderName { get; init; } 
    }
}
