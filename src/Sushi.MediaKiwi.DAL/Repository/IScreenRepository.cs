using Sushi.MicroORM;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <summary>
    /// Provides methods to read and write <see cref="Screen"/> objects.
    /// </summary>
    public interface IScreenRepository
    {
        /// <summary>
        /// Gets all screens for the given filter parameters.
        /// </summary>
        /// <param name="sectionID"></param>
        /// <returns></returns>
        Task<QueryListResult<Screen>> GetAllAsync(int? sectionID);
    }
}