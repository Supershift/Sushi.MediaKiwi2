using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Interfaces;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.IntegrationTests
{
    [Collection("Database collection")]
    public class RoleRepositoryTest(DatabaseFixture configFixture) : IAssemblyFixture<DatabaseFixture>
    {
        private readonly IRoleRepository _repository = configFixture.Services.GetRequiredService<IRoleRepository>();

        [Fact]
        public async Task GetAllTest()
        {
            var sections = await _repository.GetAllAsync();

            Assert.Equal(2, sections.Count);
        }
    }

}