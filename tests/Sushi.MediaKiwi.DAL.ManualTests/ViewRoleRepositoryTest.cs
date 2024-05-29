using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class ViewRoleRepositoryTest : IAssemblyFixture<DatabaseFixture>
    {
        private readonly DatabaseFixture _configFixture;
        private readonly IViewRoleRepository _repository;

        public ViewRoleRepositoryTest(DatabaseFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<IViewRoleRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var items = await _repository.GetAllAsync(null);

            Assert.NotEqual(1, items.Count);
        }
    }
}