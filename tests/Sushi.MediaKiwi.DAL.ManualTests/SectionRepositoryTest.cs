using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class SectionRepositoryTest : IClassFixture<ConfigFixture>
    {
        private readonly ConfigFixture _configFixture;
        private readonly ISectionRepository _repository;

        public SectionRepositoryTest(ConfigFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<ISectionRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var sections = await _repository.GetAllAsync(new Paging.PagingValues(0, 50));

            Assert.True(sections.Count > 1);
        }

        [Fact]
        public async Task UpdateId()
        {
            using (var ts = Utility.CreateTransactionScope())
            {
                string oldId = "Hotels";
                string newId = "Hotelz";

                var oldItem = await _repository.GetAsync(oldId);

                Assert.NotNull(oldItem);

                await _repository.UpdateIdAsync(oldId, newId);

                var newItem = await _repository.GetAsync(newId);

                Assert.NotNull(newItem);
            }
        }
    }
}