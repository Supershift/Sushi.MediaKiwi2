using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <inheritdoc/>
    public class SectionRepository : ISectionRepository
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

        /// <inheritdoc/>
        public async Task<QueryListResult<Section>> GetAllAsync()
        {
            var query = _connector.CreateQuery();            
            var result = await _connector.GetAllAsync(query);
            return result;
        }
    }
}
