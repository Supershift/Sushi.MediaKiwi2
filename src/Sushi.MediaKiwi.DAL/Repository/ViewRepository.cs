using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Entities;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MicroORM;

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
        public async Task DeleteAsync(string id)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Id, id);
            await _connector.DeleteAsync(query);
        }

        /// <inheritdoc/>    
        public async Task<QueryListResult<View>> GetAllAsync(PagingValues pagingValues, SortValues<View>? sortValues = null)
        {
            var query = _connector.CreateQuery();

            if(sortValues != null)
            {
                query.AddOrder(sortValues);
            }
            else
            {
                query.AddOrder(x => x.Name);
            }
            
            query.AddPaging(pagingValues);

            var result = await _connector.GetAllAsync(query);
            return result;
        }

        /// <inheritdoc/>    
        public async Task<View?> GetAsync(string id)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Id, id);
            var result = await _connector.GetFirstAsync(query); 
            return result;
        }

        /// <inheritdoc/>    
        public async Task InsertAsync(View view)
        {
            await _connector.InsertAsync(view);            
        }

        /// <inheritdoc/>    
        public async Task UpdateAsync(View view)
        {
            await _connector.UpdateAsync(view);
        }
    }
}
