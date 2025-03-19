using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Interfaces;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.IntegrationTests
{
    [Collection("Database collection")]
    public class SectionRoleRepositoryTest(DatabaseFixture configFixture) : IAssemblyFixture<DatabaseFixture>
    {
        private readonly ISectionRoleRepository _repository = configFixture.Services.GetRequiredService<ISectionRoleRepository>();

        [Fact]
        public async Task GetAllTest()
        {
            var items = await _repository.GetAllAsync(null);

            Assert.NotEmpty(items);
        }
    }
}