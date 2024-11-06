using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.SampleAPI.Service.Model
{
    public record WithdrawMoneyRequest
    {
        // check on amount >0 is missing on purpose, so we can demo input validation in the domain layer
        [Required]
        public required decimal Amount { get; init; }
    }
}
