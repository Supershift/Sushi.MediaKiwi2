using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    public class NavigationItemRepository : INavigationItemRepository
    {
        private readonly IConnector<NavigationItem> _connector;

        public NavigationItemRepository(IConnector<NavigationItem> connector)
        {
            _connector = connector;
        }

        public async Task<QueryListResult<NavigationItem>> GetAllAsync(int? sectionID)
        {
            var query = _connector.CreateQuery();

            if (sectionID.HasValue)
            {
                query.Add(x => x.SectionId, sectionID.Value);
            }

            var result = await _connector.GetAllAsync(query);

            return result;
        }
    }
}
