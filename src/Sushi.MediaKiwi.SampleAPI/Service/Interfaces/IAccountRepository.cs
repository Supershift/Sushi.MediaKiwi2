using Sushi.MediaKiwi.SampleAPI.Domain;

namespace Sushi.MediaKiwi.SampleAPI.Service.Interfaces
{
    public interface IAccountRepository
    {
        Task<Account?> GetAsync(string number);
        Task InsertAsync(Account account);
        Task UpdateAsync(Account account);
    }
}
