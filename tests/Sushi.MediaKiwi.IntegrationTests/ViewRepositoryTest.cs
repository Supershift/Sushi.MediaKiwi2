using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.IntegrationTests
{
    public class ViewRepositoryTest : IAssemblyFixture<DatabaseFixture>
    {
        private readonly DatabaseFixture _configFixture;
        private readonly IViewRepository _repository;

        public ViewRepositoryTest(DatabaseFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = configFixture.Services.GetRequiredService<IViewRepository>();
        }

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
