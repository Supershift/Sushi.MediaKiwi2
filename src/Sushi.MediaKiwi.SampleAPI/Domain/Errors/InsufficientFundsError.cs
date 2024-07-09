using Sushi.LanguageExtensions.Errors;

namespace Sushi.MediaKiwi.SampleAPI.Domain.Errors
{
    public record InsufficientFundsError : Error
    {
        public InsufficientFundsError(decimal orderAmount, decimal maxFunds) : base($"Order of {orderAmount} exceeds available funds of {maxFunds}.")
        {
            
        }
    }
}
