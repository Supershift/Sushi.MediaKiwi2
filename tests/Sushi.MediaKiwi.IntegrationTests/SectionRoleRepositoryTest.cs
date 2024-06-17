using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Interfaces;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.IntegrationTests
{
    public class SectionRoleRepositoryTest : IAssemblyFixture<DatabaseFixture>
    {
        private readonly DatabaseFixture _configFixture;
        private readonly ISectionRoleRepository _repository;

        public SectionRoleRepositoryTest(DatabaseFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<ISectionRoleRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var items = await _repository.GetAllAsync(null);

            Assert.NotEmpty(items);
        }
    }
}