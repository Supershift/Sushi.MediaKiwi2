using Sushi.MediaKiwi.SampleAPI.Domain;
using Sushi.MediaKiwi.SampleAPI.Service.Interfaces;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.SampleAPI.DAL.Repository
{
    internal class AccountRepository : IAccountRepository
    {
        private readonly IConnector<Account> _connector;

        public AccountRepository(IConnector<Account> connector)
        {
            _connector = connector;
        }

        public async Task<Account?> GetAsync(string number)
        {
            var query = _connector.CreateQuery();
            query.Add(x=>x.Number, number);
            var result = await _connector.GetFirstAsync(query);
            return result;
        }

        public async Task InsertAsync(Account account)
        {
            await _connector.InsertAsync(account);    
        }

        public async Task UpdateAsync(Account account)
        {
            await _connector.UpdateAsync(account);
        }
    }
}
