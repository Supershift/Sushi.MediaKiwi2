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

            response.Match(result =>
            {
                Assert.NotEmpty(result.Result);
            },
            error =>
            {
                Assert.Fail(error.Message);
            });
            
        }
    }
}