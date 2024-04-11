using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <summary>
    /// Provides methods to work with <see cref="NavigationItem"/>.
    /// </summary>
    public class NavigationItemRepository : INavigationItemRepository
    {
        private readonly IConnector<NavigationItem> _connector;

        /// <summary>
        /// Creates a new instance of <see cref="NavigationItemRepository"/>.
        /// </summary>
        /// <param name="connector"></param>
        public NavigationItemRepository(IConnector<NavigationItem> connector)
        {
            _connector = connector;
        }

        /// <inheritdoc/>
        public async Task<QueryListResult<NavigationItem>> GetAllAsync(int? sectionID, PagingValues pagingValues)
        {
            var query = _connector.CreateQuery();

            if (sectionID.HasValue)
            {
                query.Add(x => x.SectionId, sectionID.Value);
            }
            query.AddOrder(x => x.Name);
            query.AddPaging(pagingValues);

            var result = await _connector.GetAllAsync(query);

            return result;
        }
        
        /// <inheritdoc/>
        public async Task<NavigationItem?> GetAsync(int id)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Id, id);
            var result = await _connector.GetFirstAsync(query); 
            return result;
        }

        /// <inheritdoc/>
        public async Task InsertAsync(NavigationItem navigationItem)
        {
            await _connector.InsertAsync(navigationItem);      
        }

        /// <inheritdoc/>
        public async Task UpdateAsync(NavigationItem navigationItem)
        {
            await _connector.UpdateAsync(navigationItem);
        }
        
        /// <inheritdoc/>
        public async Task DeleteAsync(int id)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Id, id);
            await _connector.DeleteAsync(query);
        }
    }
}
