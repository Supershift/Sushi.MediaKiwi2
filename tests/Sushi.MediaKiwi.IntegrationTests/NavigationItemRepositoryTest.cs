using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.IntegrationTests
{
    public class NavigationItemRepositoryTest : IAssemblyFixture<DatabaseFixture>
    {
        private readonly INavigationItemRepository _repository;

        public NavigationItemRepositoryTest(DatabaseFixture configFixture)
        {
            _repository = configFixture.Services.GetRequiredService<INavigationItemRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var items = await _repository.GetAllAsync(null, PagingValues.Default, SortingValidated<Services.Entities.NavigationItem>.Default);

            Assert.NotEqual(1, items.Count);
        }

        [Fact]
        public async Task GetAllTest_BySectionID()
        {
            var items = await _repository.GetAllAsync("Admin", PagingValues.Default, SortingValidated<Services.Entities.NavigationItem>.Default);

            Assert.All(items, screen => Assert.Equal("Admin", screen.SectionId));
        }
    }
}
