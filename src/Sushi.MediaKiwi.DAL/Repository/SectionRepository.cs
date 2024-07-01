using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Entities;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MicroORM;

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
        public async Task DeleteAsync(string id)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Id, id);
            await _connector.DeleteAsync(query);
        }

        /// <inheritdoc/>
        public async Task<QueryListResult<Section>> GetAllAsync(PagingValues? pagingValues = null)
        {
            var query = _connector.CreateQuery();
            query.AddOrder(x => x.SortOrder);
            if(pagingValues != null)
                query.AddPaging(pagingValues);
            var result = await _connector.GetAllAsync(query);
            return result;
        }

        /// <inheritdoc/>    
        public async Task<Section?> GetAsync(string id)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Id, id);
            var result = await _connector.GetFirstAsync(query);
            return result;
        }

        /// <inheritdoc/>    
        public async Task InsertAsync(Section section)
        {
            await _connector.InsertAsync(section);
        }

        /// <inheritdoc/>    
        public async Task UpdateAsync(Section section)
        {
            await _connector.UpdateAsync(section);
        }

        /// <inheritdoc/>    
        public async Task UpdateIdAsync(string oldId, string newId)
        {
            var query = _connector.CreateQuery();
            query.AddParameter("@oldId", oldId);
            query.AddParameter("@newId", newId);
            query.SqlQuery = "UPDATE mk_Sections SET SectionId = @newId WHERE SectionId = @oldId";
            await _connector.ExecuteNonQueryAsync(query);
        }
    }
}
