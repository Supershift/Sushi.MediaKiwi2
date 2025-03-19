using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Interfaces;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.IntegrationTests
{
    [Collection("Database collection")]
    public class SectionRepositoryTest(DatabaseFixture configFixture) : IAssemblyFixture<DatabaseFixture>
    {
        private readonly ISectionRepository _repository = configFixture.Services.GetRequiredService<ISectionRepository>();

        [Fact]
        public async Task GetAllTest()
        {
            var sections = await _repository.GetAllAsync(new PagingValues(0, 50));

            Assert.True(sections.Count > 1);
        }
    }
}