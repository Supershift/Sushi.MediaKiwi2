using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <inheritdoc/>    
    public class SectionRoleRepository : ISectionRoleRepository
    {
        private readonly IConnector<SectionRole> _connector;

        /// <summary>
        /// Creates a new instance of <see cref="SectionRoleRepository"/>.
        /// </summary>
        public SectionRoleRepository(IConnector<SectionRole> connector)
        {
            _connector = connector;
        }

        /// <inheritdoc/>    
        public async Task DeleteForSectionAsync(int sectionId)
        {
            var query = _connector.CreateQuery();

            query.Add(x => x.SectionId, sectionId);
            await _connector.DeleteAsync(query);
        }

        /// <inheritdoc/>    
        public async Task<QueryListResult<SectionRole>> GetAllAsync(int? sectionId)
        {
            var query = _connector.CreateQuery();
            if (sectionId != null)
                query.Add(x => x.SectionId, sectionId);
            var result = await _connector.GetAllAsync(query);
            return result;
        }

        /// <inheritdoc/>    
        public async Task InsertAsync(SectionRole sectionRole)
        {
            await _connector.InsertAsync(sectionRole);
        }
    }
}
