using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.LanguageExtensions.Validation;

namespace Sushi.MediaKiwi.SampleAPI.Domain
{
    public class MoneyTransferService
    {
        // this is a naive implementation of a money transfer service
        // in a real-world scenario, ledgers, transfer object etc. would be involved
        
        /// <summary>
        /// Transfers money from one account to another.
        /// </summary>
        /// <param name="sourceAccount"></param>
        /// <param name="targetAccount"></param>
        /// <param name="amount"></param>
        /// <returns></returns>
        public Result<Error> TransferMoney(Account sourceAccount, Account targetAccount, decimal amount)
        {
            var validationResult = Validate.Value(amount).Required().Range(0.01, double.MaxValue).Result();
            if (validationResult.Error != null)
                return validationResult.Error;
            
            // withdraw money from the source account
            var withdrawalResult = sourceAccount.Withdraw(amount);
            if (withdrawalResult.Error != null)
                return withdrawalResult.Error;

            // deposit money into target account
            var depositResult = targetAccount.Deposit(amount);
            if (depositResult.Error != null)
            {
                // book money back to source account
                var refundResult = sourceAccount.Deposit(amount);
                if (refundResult.Error != null)
                {
                    // this is bad
                    throw new Exception("Money withdrawn from source, but could not be sent to target account and could not be refunded.");
                }
                return depositResult.Error;
            }

            return Result.Success<Error>();
        }
    }
}
