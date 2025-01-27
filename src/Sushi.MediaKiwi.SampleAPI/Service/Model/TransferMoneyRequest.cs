using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.SampleAPI.Service.Model
{
    public record TransferMoneyRequest
    {
        [Required, MaxLength(64)]
        public required string SourceAccountNumber { get; init; }
        [Required, MaxLength(64)]
        public required string TargetAccountNumber { get; init; }
        [Required, Range(0.01, double.MaxValue)]
        public required decimal Amount { get; init; }
    }
}
