using Sushi.MicroORM;

namespace Sushi.MediaKiwi.DAL.Repository
{
    public interface INavigationItemRepository
    {
        Task<QueryListResult<NavigationItem>> GetAllAsync(int? sectionID);
    }
}