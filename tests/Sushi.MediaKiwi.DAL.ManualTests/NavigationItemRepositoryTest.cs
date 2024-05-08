using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class NavigationItemRepositoryTest : IClassFixture<ConfigFixture>
    {
        private readonly ConfigFixture _configFixture;
        private readonly INavigationItemRepository _repository;

        public NavigationItemRepositoryTest(ConfigFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = configFixture.Services.GetRequiredService<INavigationItemRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var items = await _repository.GetAllAsync(null, PagingValues.Default);

            Assert.NotEqual(1, items.Count);
        }

        [Fact]
        public async Task GetAllTest_BySectionID()
        {
            var items = await _repository.GetAllAsync("Admin", PagingValues.Default);

            Assert.All(items, screen => Assert.Equal("Admin", screen.SectionId));
        }
    }
}
