using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Interfaces;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.IntegrationTests
{
    [Collection("Database collection")]
    public class ViewRoleRepositoryTest(DatabaseFixture configFixture) : IAssemblyFixture<DatabaseFixture>
    {
        private readonly IViewRoleRepository _repository = configFixture.Services.GetRequiredService<IViewRoleRepository>();

        [Fact]
        public async Task GetAllTest()
        {
            var items = await _repository.GetAllAsync(null);

            Assert.NotEqual(1, items.Count);
        }
    }
}