using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL;
using Sushi.MediaKiwi.DAL.Repository;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.IntegrationTests
{
    public class LocaleRepositoryTest : IAssemblyFixture<DatabaseFixture>
    {
        private readonly DatabaseFixture _configFixture;
        private readonly ILocaleRepository _repository;

        public LocaleRepositoryTest(DatabaseFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<ILocaleRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var locales = await _repository.GetAllAsync(true, new DAL.Paging.PagingValues(0, 50));

            Assert.True(locales.Count > 1);
        }

        [Fact]
        public async Task GetTest()
        {
            var locale = await _repository.GetAsync("en");
            Assert.NotNull(locale);
        }

        [Fact]
        public async Task GetDefaultTest()
        {
            var locale = await _repository.GetDefaultAsync();
            Assert.NotNull(locale);
            Assert.True(locale.IsDefault);
        }

        [Fact]
        public async Task InsertTest()
        {
            var locale = new Locale()
            {
                Id = "test",
                IsEnabled = true,
                Name = "test",
            };

            // start transaction to prevent test changing state permanently
            using (var ts = Utility.CreateTransactionScope())
            {
                await _repository.InsertAsync(locale);

                var result = await _repository.GetAsync(locale.Id);
                Assert.NotNull(result);
                Assert.Equal(locale, result);
            }
        }

        [Fact]
        public async Task UpdateTest()
        {
            // start transaction to prevent test changing state permanently
            using (var ts = Utility.CreateTransactionScope())
            {
                // get existing locale
                var locale = await _repository.GetAsync("en");

                Assert.NotNull(locale);

                // change something
                locale.Name = locale.Name + locale.Name;

                await _repository.UpdateAsync(locale);

                var result = await _repository.GetAsync(locale.Id);
                Assert.NotNull(result);
                Assert.Equal(locale, result);
            }
        }

        [Fact]
        public async Task DeleteTest()
        {
            // start transaction to prevent test changing state permanently
            using (var ts = Utility.CreateTransactionScope())
            {
                // create a new locale
                var locale = new Locale()
                {
                    Id = "test",
                    IsEnabled = true,
                    Name = "test",
                };
                await _repository.InsertAsync(locale);

                // delete it
                await _repository.DeleteAsync(locale);

                // check it doesn't exist anymore
                var result = await _repository.GetAsync(locale.Id);
                Assert.Null(result);
            }
        }
    }
}