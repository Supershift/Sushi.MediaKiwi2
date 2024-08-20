using Sushi.MediaKiwi.SystemIntegrationTests.Supporting;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.SystemIntegrationTests
{
    public class SectionTest : IAssemblyFixture<ApiConnectionFixture>
    {
        private readonly ApiConnectionFixture _fixture;

        public SectionTest(ApiConnectionFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task GetAllSections()
        {
            var connector = _fixture.GetConnector();
            var response = await connector.GetSectionsAsync();

            Assert.Null(response.Error);
            Assert.NotNull(response.Value);
            Assert.NotEmpty(response.Value.Result);
        }
    }
}