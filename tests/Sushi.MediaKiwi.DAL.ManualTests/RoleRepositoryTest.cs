using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class RoleRepositoryTest : IAssemblyFixture<DatabaseFixture>
    {
        private readonly DatabaseFixture _configFixture;
        private readonly IRoleRepository _repository;

        public RoleRepositoryTest(DatabaseFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<IRoleRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var sections = await _repository.GetAllAsync();

            Assert.Equal(2, sections.Count);
        }
    }
    
}