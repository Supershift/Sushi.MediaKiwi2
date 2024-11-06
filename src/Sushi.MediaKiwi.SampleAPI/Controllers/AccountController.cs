using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.SampleAPI.Service;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
using Sushi.MediaKiwi.WebAPI;
using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.SampleAPI.Controllers
{
    public class AccountController : SampleControllerBase
    {
        private readonly AccountHandler _accountHandler;

        public AccountController(AccountHandler accountHandler)
        {
            _accountHandler = accountHandler;
        }

        [HttpGet]
        [Route("{number}")]
        public async Task<ActionResult<AccountDto>> GetAccount([Required, MaxLength(64)] string number)
        {
            var result = await _accountHandler.GetAccountAsync(number);
            return this.ToResponse(result);
        }

        [HttpPost]
        [Route("CreateAccount")]
        public async Task<ActionResult<AccountDto>> CreateAccount(CreateAccountRequest request)
        {
            var result = await _accountHandler.CreateAccountAsync(request);
            return this.ToResponse(result);
        }

        [HttpPost]
        [Route("{number}/CloseAccount")]
        public async Task<ActionResult<AccountDto>> CloseAccount([Required, MaxLength(64)] string number)
        {
            var result = await _accountHandler.CloseAccountAsync(number);
            return this.ToResponse(result);
        }

        // maybe this should have its own controller and path
        [HttpPost]
        [Route("TransferMoney")]
        public async Task<ActionResult<AccountDto>> TransferMoney(TransferMoneyRequest request)
        {
            var result = await _accountHandler.TransferMoneyAsync(request);
            return this.ToResponse(result);
        }

        [HttpPost]
        [Route("{number}/Deposit")]
        public async Task<ActionResult<AccountDto>> Deposit([Required, MaxLength(64)] string number, DepositMoneyRequest request)
        {
            var result = await _accountHandler.DepositAsync(number, request);
            return this.ToResponse(result);
        }

        [HttpPost]
        [Route("{number}/Withdraw")]
        public async Task<ActionResult<AccountDto>> Withdraw([Required, MaxLength(64)] string number, WithdrawMoneyRequest request)
        {
            var result = await _accountHandler.WithdrawAsync(number, request);
            return this.ToResponse(result);
        }
    }
}
