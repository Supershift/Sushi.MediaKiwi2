using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class RoleRepositoryTest : IClassFixture<ConfigFixture>
    {
        private readonly ConfigFixture _configFixture;
        private readonly IRoleRepository _repository;

        public RoleRepositoryTest(ConfigFixture configFixture)
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