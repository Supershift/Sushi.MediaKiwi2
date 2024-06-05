using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Interfaces;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.IntegrationTests
{
    public class SectionRepositoryTest : IAssemblyFixture<DatabaseFixture>
    {
        private readonly DatabaseFixture _configFixture;
        private readonly ISectionRepository _repository;

        public SectionRepositoryTest(DatabaseFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<ISectionRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var sections = await _repository.GetAllAsync(new PagingValues(0, 50));

            Assert.True(sections.Count > 1);
        }
    }
}