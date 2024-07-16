using Sushi.LanguageExtensions.Errors;

namespace Sushi.MediaKiwi.SampleAPI.Domain.Errors
{
    public record AccountClosedError : Error
    {
        public AccountClosedError(string number) : base($"Account {number} is closed.")
        {
                
        }
    }
}
