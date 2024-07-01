using Sushi.MediaKiwi.Services.Entities;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <inheritdoc/>    
    public class ViewRoleRepository : IViewRoleRepository
    {
        private readonly IConnector<ViewRole> _connector;

        /// <summary>
        /// Creates a new instance of <see cref="ViewRoleRepository"/>.
        /// </summary>
        public ViewRoleRepository(IConnector<ViewRole> connector)
        {
            _connector = connector;
        }

        /// <inheritdoc/>    
        public async Task DeleteForViewAsync(string viewId)
        {
            var query = _connector.CreateQuery();

            query.Add(x => x.ViewId, viewId);
            await _connector.DeleteAsync(query);
        }

        /// <inheritdoc/>    
        public async Task<QueryListResult<ViewRole>> GetAllAsync(string? viewId)
        {
            var query = _connector.CreateQuery();
            if (viewId != null)
                query.Add(x => x.ViewId, viewId);
            var result = await _connector.GetAllAsync(query);
            return result;
        }

        /// <inheritdoc/>    
        public async Task InsertAsync(ViewRole viewRole)
        {
            await _connector.InsertAsync(viewRole);
        }
    }
}
