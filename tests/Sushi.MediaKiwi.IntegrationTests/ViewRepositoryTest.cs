using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Interfaces;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.IntegrationTests
{
    [Collection("Database collection")]
    public class ViewRepositoryTest(DatabaseFixture configFixture) : IAssemblyFixture<DatabaseFixture>
    {
        private readonly IViewRepository _repository = configFixture.Services.GetRequiredService<IViewRepository>();

        [Fact]
        public async Task GetAllTest()
        {
            var screens = await _repository.GetAllAsync(PagingValues.Default);

            Assert.NotEqual(1, screens.Count);
        }

        [Fact]
        public async Task GetOneTest()
        {
            var view = await _repository.GetAsync("Home");

            Assert.NotNull(view);
            Assert.Equal("Home", view.Id);
        }
    }
}
