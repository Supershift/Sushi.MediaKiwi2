using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class ScreenRepositoryTest
    {
        private readonly ConfigFixture _configFixture;
        private readonly ScreenRepository _repository;

        public ScreenRepositoryTest(ConfigFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = configFixture.Services.GetRequiredService<ScreenRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var screens = await _repository.GetAllAsync(null);

            Assert.NotEqual(1, screens.Count);
        }

        [Fact]
        public async Task GetAllTest_BySectionID()
        {
            var screens = await _repository.GetAllAsync(1);

            Assert.All(screens, screen => Assert.Equal(1, screen.SectionId));
        }
    }
}
