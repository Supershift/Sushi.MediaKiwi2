using Sushi.MediaKiwi.DAL.Paging;
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
        public async Task DeleteAsync(int id)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Id, id);
            await _connector.DeleteAsync(query);
        }

        /// <inheritdoc/>
        public async Task<QueryListResult<Section>> GetAllAsync(PagingValues pagingValues)
        {
            var query = _connector.CreateQuery();
            query.AddOrder(x => x.SortOrder);
            query.AddPaging(pagingValues);
            var result = await _connector.GetAllAsync(query);
            return result;
        }

        /// <inheritdoc/>    
        public async Task<Section?> GetAsync(int id)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Id, id);
            var result = await _connector.GetFirstAsync(query);
            return result;
        }

        /// <inheritdoc/>    
        public async Task SaveAsync(Section section)
        {
            await _connector.SaveAsync(section);
        }
    }
}
