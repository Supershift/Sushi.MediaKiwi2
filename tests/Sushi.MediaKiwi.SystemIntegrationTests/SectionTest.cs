using Sushi.MediaKiwi.SystemIntegrationTests.Supporting;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.SystemIntegrationTests
{
    [Collection("Api collection")]
    public class SectionTest(ApiConnectionFixture fixture) : IAssemblyFixture<ApiConnectionFixture>
    {
        [Fact]
        public async Task GetAllSections()
        {
            var connector = fixture.GetConnector();
            var response = await connector.GetSectionsAsync();

            Assert.Null(response.Error);
            Assert.NotNull(response.Value);
            Assert.NotEmpty(response.Value.Result);
        }
    }
}