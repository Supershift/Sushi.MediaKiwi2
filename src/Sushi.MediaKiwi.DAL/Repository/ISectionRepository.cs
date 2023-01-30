using Sushi.MicroORM;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <summary>
    /// Provides methods to read and write <see cref="Section"/> objects.
    /// </summary>
    public interface ISectionRepository
    {
        /// <summary>
        /// Gets all sections from the database.
        /// </summary>
        /// <returns></returns>
        Task<QueryListResult<Section>> GetAllAsync();
    }
}