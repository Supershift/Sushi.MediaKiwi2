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
    public class ViewRepository : IViewRepository
    {
        private readonly IConnector<View> _connector;

        /// <summary>
        /// Creates a new instance of <see cref="ViewRepository"/>.
        /// </summary>
        /// <param name="connector"></param>
        public ViewRepository(IConnector<View> connector)
        {
            _connector = connector;
        }

        /// <inheritdoc/>    
        public async Task<QueryListResult<View>> GetAllAsync(int? sectionID, PagingValues pagingValues)
        {
            var query = _connector.CreateQuery();
            if (sectionID.HasValue)
            {
                query.Add(x => x.SectionId, sectionID.Value);
            }

            query.AddPaging(pagingValues);

            var result = await _connector.GetAllAsync(query);
            return result;
        }
    }
}
