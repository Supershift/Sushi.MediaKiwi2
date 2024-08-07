using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.MediaKiwi.SampleAPI.Domain;
using Sushi.MediaKiwi.SampleAPI.Service.Interfaces;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
using Sushi.MicroORM.Exceptions;

namespace Sushi.MediaKiwi.SampleAPI.Service
{
    /// <summary>
    /// Handles account operations
    /// </summary>
    public class AccountHandler
    {
        private readonly IAccountRepository _accountRepository;

        public AccountHandler(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<Result<AccountDto, Error>> CreateAccountAsync(CreateAccountRequest openAccountRequest)
        {
            // create the account
            var createAccountResult = Account.Create(openAccountRequest.Number, openAccountRequest.HolderName);

            if (createAccountResult.Error != null)
                return createAccountResult.Error;

            var account = createAccountResult.Value!;

            // store in database
            try
            {
                await _accountRepository.InsertAsync(account);
            }
            catch (UniqueConstraintViolationException)
            {
                return new AlreadyExistsError();
            }

            // map to result
            var result = new AccountDto()
            {
                Balance = account.Balance,
                HolderName = account.HolderName,
                Number = account.Number,
                Status = account.Status
            };

            return result;
        }

        public async Task<Result<AccountDto, Error>> GetAccountAsync(string number)
        {
            var account = await _accountRepository.GetAsync(number);

            if (account == null)
                return new NotFoundError();

            // map to result
            var result = new AccountDto()
            {
                Balance = account.Balance,
                HolderName = account.HolderName,
                Number = account.Number,
                Status = account.Status
            };

            return result;
        }

        public async Task<Result<Error>> CloseAccountAsync(string number)
        {
            // get account
            var account = await _accountRepository.GetAsync(number);

            if (account == null)
                return new NotFoundError();

            // close account
            var closeAccountResult = account.CloseAccount();

            if (closeAccountResult.Error != null)
                return closeAccountResult.Error;

            // update account
            await _accountRepository.UpdateAsync(account);

            return Result.Success<Error>();
        }

        public async Task<Result<Error>> WithdrawAsync(string number, WithdrawMoneyRequest request)
        {
            // get the account
            var account = await _accountRepository.GetAsync(number);
            if (account == null)
                return new NotFoundError();

            // open transaction
            using (var ts = TransactionUtility.CreateTransactionScope())
            {
                // withdraw money
                var withdrawResult = account.Withdraw(request.Amount);

                if (withdrawResult.Error != null)
                    return withdrawResult.Error;

                // update the account
                await _accountRepository.UpdateAsync(account);

                // commit
                ts.Complete();
            }

            return Result.Success<Error>();
        }

        public async Task<Result<Error>> DepositAsync(string number, DepositMoneyRequest request)
        {
            // get the account
            var account = await _accountRepository.GetAsync(number);
            if (account == null)
                return new NotFoundError();

            // open transaction
            using (var ts = TransactionUtility.CreateTransactionScope())
            {
                // Deposit money
                var withdrawResult = account.Deposit(request.Amount);

                if (withdrawResult.Error != null)
                    return withdrawResult.Error;

                // update the account
                await _accountRepository.UpdateAsync(account);

                // commit
                ts.Complete();
            }

            return Result.Success<Error>();
        }

        public async Task<Result<Error>> TransferMoneyAsync(TransferMoneyRequest request)
        {
            // start transaction
            using (var ts = TransactionUtility.CreateTransactionScope())
            {
                // get accounts
                var sourceAccount = await _accountRepository.GetAsync(request.SourceAccountNumber);
                var targetAccount = await _accountRepository.GetAsync(request.TargetAccountNumber);
                if (sourceAccount == null || targetAccount == null)
                {
                    // this needs refinement. which item was not found?
                    return new NotFoundError();
                }

                // perform transfer
                var service = new MoneyTransferService();
                var transferResult = service.TransferMoney(sourceAccount, targetAccount, request.Amount);
                if (transferResult.Error != null)
                    return transferResult.Error;

                // update the accounts
                await _accountRepository.UpdateAsync(sourceAccount);
                await _accountRepository.UpdateAsync(targetAccount);

                // commit
                ts.Complete();

                return Result.Success<Error>();
            }
        }
    }
}
