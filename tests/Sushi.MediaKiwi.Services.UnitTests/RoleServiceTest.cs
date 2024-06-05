using AutoMapper;
using Moq;
using NuGet.Frameworks;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class RoleServiceTest
    {        
        [Fact]
        public async Task GetAllRolesTest()
        {
            // arrange
            var roleStubs = new QueryListResult<Entities.Role>
            {
                new Entities.Role(),
                new Entities.Role()
            };

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            var repositoryMock = new Mock<IRoleRepository>();
            repositoryMock.Setup(x => x.GetAllAsync()).ReturnsAsync(roleStubs);

            var service = new RoleService(repositoryMock.Object, mapper);

            // act
            var result = await service.GetAllAsync();

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);            
            Assert.NotNull(result.Value);
            Assert.NotNull(result.Value.Result);
            Assert.Equal(2, result.Value.Result.Count);
        }
    }
}