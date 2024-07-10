using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.LanguageExtensions.Validation;
using Sushi.MediaKiwi.SampleAPI.Domain.Errors;
using System.Text.RegularExpressions;

namespace Sushi.MediaKiwi.SampleAPI.Domain
{
    public partial class Account
    {
        // for serialization only
        private Account()
        {
            Number = "";
        }

        private Account(string number, string holderName, decimal balance, AccountStatus status)
        {
            Number = number;
            HolderName = holderName;
            Balance = balance;
            Status = status;
        }

        public static Result<Account, Error> Create(string number, string holderName)
        {   
            // check if input is valid
            var validationResult = Validate
                .Value(number).Required().MaxLength(64).Regex(AccountNumberRegex())
                .Value(holderName).Required().MaxLength(64)                
                .Result();

            if(validationResult.Error != null)
                return validationResult.Error;
            
            // create account with empty balance
            return new Account(number, holderName, 0, AccountStatus.Open);
        }
        
        public string Number { get; private set; }
        public string HolderName { get; private set; } = "";
        public decimal Balance { get; private set; }
        
        public AccountStatus Status { get; private set; }

        /// <summary>
        /// Deposits money into the account
        /// </summary>
        /// <param name="amount"></param>
        /// <returns></returns>
        public Result<Error> Deposit(decimal amount)
        {
            // check if input is valid
            var validationResult = Validate.Value(amount).Range(0.01, double.MaxValue).Result();

            // check business rules (is the account open?)
            if (Status != AccountStatus.Open)
                return new AccountClosedError(Number);

            if (validationResult.Error != null)
                return validationResult.Error;  

            Balance += amount;

            return Result.Success<Error>();
        }

        /// <summary>
        /// Withdraws money from the account.
        /// </summary>
        /// <param name="amount"></param>
        /// <returns></returns>
        public Result<Error> Withdraw(decimal amount)
        {
            // check if input is valid
            var validationResult = Validate.Value(amount).Range(0.01, double.MaxValue).Result();

            // check business rules 
            if (Status != AccountStatus.Open)
                return new AccountClosedError(Number);

            if (amount > Balance)
                return new InsufficientFundsError(amount, Balance);

            if (validationResult.Error != null)
                return validationResult.Error;

            Balance += amount;

            return Result.Success<Error>();
        }

        public Result<Error> CloseAccount()
        {
            // what happens with the money left in balance?
            Status = AccountStatus.Closed;
            return Result.Success<Error>();
        }

        [GeneratedRegex("^[0-9]*$")]
        private static partial Regex AccountNumberRegex();
    }
}
