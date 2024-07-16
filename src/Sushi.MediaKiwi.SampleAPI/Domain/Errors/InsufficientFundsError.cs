using Sushi.LanguageExtensions.Errors;

namespace Sushi.MediaKiwi.SampleAPI.Domain.Errors
{
    public record InsufficientFundsError : Error
    {
        public InsufficientFundsError(decimal amount, decimal maxAllowed) : base($"Withdrawal of {amount} exceeds max allowed {maxAllowed}.")
        {
            
        }
    }
}
