using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <summary>
    /// Contains methods to read and write <see cref="Section"/> objects.
    /// </summary>
    public class SectionRepository
    {
        private readonly IConnector<Section> _connector;

        /// <summary>
        /// Creates a new instance of <see cref="SectionRepository"/>.
        /// </summary>
        /// <param name="connector"></param>
        public SectionRepository(IConnector<Section> connector) 
        {
            _connector = connector;
        }

        /// <summary>
        /// Gets all sections from the database.
        /// </summary>
        /// <returns></returns>
        public async Task<QueryListResult<Section>> GetAllAsync()
        {
            var query = _connector.CreateQuery();
            var result = await _connector.GetAllAsync(query);
            return result;
        }
    }
}
