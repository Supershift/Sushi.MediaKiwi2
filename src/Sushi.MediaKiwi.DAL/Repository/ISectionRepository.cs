using Sushi.MicroORM;

namespace Sushi.MediaKiwi.DAL.Repository
{
    public interface ISectionRepository
    {
        Task<QueryListResult<Section>> GetAllAsync();
    }
}