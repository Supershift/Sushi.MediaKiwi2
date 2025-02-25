using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Entities;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MicroORM;

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
        public async Task<QueryListResult<NavigationItem>> GetAllAsync(string? sectionID, PagingValues pagingValues, SortingValidated<NavigationItem> sortValues)
        {
            var query = _connector.CreateQuery();

            if (!string.IsNullOrWhiteSpace(sectionID))
            {
                query.Add(x => x.SectionId, sectionID);
            }

            query.AddOrderWithDefault(sortValues, x => x.SortOrder, x => x.Name);
            query.AddPaging(pagingValues);

            var result = await _connector.GetAllAsync(query);

            return result;
        }

        /// <inheritdoc/>
        public async Task<NavigationItem?> GetAsync(string id)
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
        public async Task DeleteAsync(string id)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Id, id);
            await _connector.DeleteAsync(query);
        }

        /// <inheritdoc/>
        public async Task UpdateIdAsync(string oldId, string newId)
        {
            var query = _connector.CreateQuery();
            query.AddParameter("@oldId", oldId);
            query.AddParameter("@newId", newId);
            query.SqlQuery = @"
BEGIN TRANSACTION

DECLARE @children TABLE(id VARCHAR(64))

INSERT INTO @children
SELECT NavigationItemId
FROM mk_NavigationItems
WHERE ParentNavigationItemID = @oldId

UPDATE mk_NavigationItems
SET ParentNavigationItemID = NULL
WHERE ParentNavigationItemID = @oldId

UPDATE mk_NavigationItems
SET NavigationItemID = @newId
WHERE NavigationItemID = @oldId

UPDATE mk_NavigationItems
SET ParentNavigationItemID = @newId
WHERE EXISTS
(
	SELECT *
	FROM @children
	WHERE id = NavigationItemID
)

COMMIT
";
            await _connector.ExecuteNonQueryAsync(query);
        }
    }
}
