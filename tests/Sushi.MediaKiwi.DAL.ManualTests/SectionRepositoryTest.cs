using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class SectionRepositoryTest : IClassFixture<ConfigFixture>
    {
        private readonly ConfigFixture _configFixture;

        public SectionRepositoryTest(ConfigFixture configFixture)
        {
            _configFixture = configFixture;
        }
        
        [Fact]
        public async Task GetAllTest()
        {
            var repository = _configFixture.Services.GetRequiredService<SectionRepository>();

            var sections = await repository.GetAllAsync();

            Assert.Equal(1, sections.Count);
        }
    }
}