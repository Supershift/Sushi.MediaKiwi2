using AutoMapper;
using Moq;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class SectionServiceTest
    {
        private readonly IMapper _mapper;

        public SectionServiceTest()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            _mapper = config.CreateMapper();
        }

        [Fact]
        public async Task DeleteSectionTest()
        {
            // arrange
            var sectionStub = new Entities.Section()
            {
                Id = "MySection"
            };

            var sectionRepositoryMock = new Mock<ISectionRepository>();
            sectionRepositoryMock.Setup(x => x.GetAsync(sectionStub.Id)).ReturnsAsync(sectionStub);
            sectionRepositoryMock.Setup(x => x.DeleteAsync(sectionStub.Id)).Verifiable();
            var sectionRoleRepository = new Mock<ISectionRoleRepository>();            

            var service = new SectionService(sectionRepositoryMock.Object, sectionRoleRepository.Object, _mapper);

            // act
            var result = await service.DeleteAsync(sectionStub.Id);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            sectionRepositoryMock.Verify(x => x.DeleteAsync(sectionStub.Id), Times.Once);
        }

        [Fact]
        public async Task DeleteSectionTest_NotFound()
        {
            // arrange
            Entities.Section? sectionStub = null;
            var sectionRepositoryMock = new Mock<ISectionRepository>();
            sectionRepositoryMock.Setup(x => x.GetAsync(It.IsAny<string>())).ReturnsAsync(sectionStub);
            var sectionRoleRepository = new Mock<ISectionRoleRepository>();

            var service = new SectionService(sectionRepositoryMock.Object, sectionRoleRepository.Object, _mapper);

            // act
            var result = await service.DeleteAsync("section");

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);

        }

        [Fact]
        public async Task GetAllSectionsTest()
        {
            // arrange
            var sectionStubs = new QueryListResult<Entities.Section>
            {
                new Entities.Section(),
                new Entities.Section()
            };

            var sectionRepositoryMock = new Mock<ISectionRepository>();
            sectionRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<PagingValues>())).ReturnsAsync(sectionStubs);
            var sectionRoleRepository = new Mock<ISectionRoleRepository>();
            sectionRoleRepository.Setup(x => x.GetAllAsync(null)).ReturnsAsync(new QueryListResult<Entities.SectionRole>());

            var service = new SectionService(sectionRepositoryMock.Object, sectionRoleRepository.Object, _mapper);

            // act
            var result = await service.GetAllAsync(PagingValues.Default);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.NotNull(result.Value.Result);
            Assert.Equal(2, result.Value.Result.Count);
        }


        [Fact]
        public async Task GetSectionTest()
        {
            // arrange
            var sectionStub = new Entities.Section()
            {
                Id = "some section"
            };

            var sectionRepositoryMock = new Mock<ISectionRepository>();
            sectionRepositoryMock.Setup(x => x.GetAsync(It.Is<string>(x => x == sectionStub.Id))).ReturnsAsync(sectionStub);
            var sectionRoleRepository = new Mock<ISectionRoleRepository>();
            sectionRoleRepository.Setup(x => x.GetAllAsync(sectionStub.Id)).ReturnsAsync(new QueryListResult<Entities.SectionRole>());
            var service = new SectionService(sectionRepositoryMock.Object, sectionRoleRepository.Object, _mapper);

            // act
            var result = await service.GetAsync(sectionStub.Id);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(sectionStub.Id, result.Value.Id);
        }

        [Fact]
        public async Task GetSectionTest_NotFound()
        {
            // arrange
            Entities.Section? sectionStub = null;
            var sectionRepositoryMock = new Mock<ISectionRepository>();
            sectionRepositoryMock.Setup(x => x.GetAsync(It.IsAny<string>())).ReturnsAsync(sectionStub);
            var sectionRoleRepository = new Mock<ISectionRoleRepository>();

            var service = new SectionService(sectionRepositoryMock.Object, sectionRoleRepository.Object, _mapper);

            // act
            var result = await service.GetAsync("some id");

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
        }

        [Fact]
        public async Task UpdateSectionTest_NotFound()
        {
            // arrange
            Entities.Section? sectionStub = null;
            var sectionRepositoryMock = new Mock<ISectionRepository>();
            sectionRepositoryMock.Setup(x => x.GetAsync(It.IsAny<string>())).ReturnsAsync(sectionStub);
            var sectionRoleRepository = new Mock<ISectionRoleRepository>();            

            var service = new SectionService(sectionRepositoryMock.Object, sectionRoleRepository.Object, _mapper);

            // act
            var result = await service.UpdateAsync("some string", new Section());

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
        }

        [Fact]
        public async Task CreateSectionTest()
        {
            // arrange
            var section = new Section()
            {
                Name = "name",
                Icon = "mdi-icon",
                SortOrder = 0,
                Roles = { "Admin" }
            };

            string newId = "newSectionId";
            var dalResult = new Entities.Section() { Id = newId };

            var sectionRepositoryMock = new Mock<ISectionRepository>();
            sectionRepositoryMock.Setup(x => x.InsertAsync(It.IsAny<Entities.Section>())).Callback<Entities.Section>(x => x.Id = newId);
            var sectionRoleRepository = new Mock<ISectionRoleRepository>();
            sectionRoleRepository.Setup(x => x.InsertAsync(It.IsAny<Entities.SectionRole>())).Verifiable(Times.Once);

            var service = new SectionService(sectionRepositoryMock.Object, sectionRoleRepository.Object, _mapper);

            // act
            var result = await service.CreateAsync(newId, section);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(newId, result.Value.Id);
            sectionRoleRepository.Verify();
        }

        [Fact]
        public async Task UpdateSectionTest()
        {
            // arrange
            var section = new Section()
            {
                Name = "name",
                Icon = "mdi-icon",
                SortOrder = 0,
                Roles = { "Admin" }
            };

            string existingId = "existingId";
            var dalResult = new Entities.Section() { Id = existingId };


            var sectionRepositoryMock = new Mock<ISectionRepository>();
            sectionRepositoryMock.Setup(x => x.GetAsync(existingId)).ReturnsAsync(dalResult).Verifiable();
            sectionRepositoryMock.Setup(x => x.UpdateAsync(dalResult)).Verifiable();
            var sectionRoleRepository = new Mock<ISectionRoleRepository>();
            sectionRoleRepository.Setup(x=> x.DeleteForSectionAsync(existingId)).Verifiable(Times.Once);    
            sectionRoleRepository.Setup(x => x.InsertAsync(It.IsAny<Entities.SectionRole>())).Verifiable(Times.Once);

            var service = new SectionService(sectionRepositoryMock.Object, sectionRoleRepository.Object, _mapper);

            // act
            var result = await service.UpdateAsync(existingId, section);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(existingId, result.Value.Id);
            sectionRepositoryMock.Verify(x => x.GetAsync(existingId), Times.Once);
            sectionRepositoryMock.Verify(x => x.UpdateAsync(dalResult), Times.Once);
            sectionRoleRepository.Verify();
        }

        [Fact]
        public async Task UpdateSectionIdTest()
        {
            // arrange
            string oldId = "existingId";
            string newId = "newId";
            var oldItem = new Entities.Section() { Id = oldId };
            var newItem = new Entities.Section() { Id = newId };

            var sectionRepositoryMock = new Mock<ISectionRepository>();
            sectionRepositoryMock.Setup(x => x.GetAsync(oldId)).ReturnsAsync(oldItem).Verifiable(Times.Once);
            sectionRepositoryMock.Setup(x => x.GetAsync(newId)).ReturnsAsync(newItem).Verifiable(Times.Once);
            sectionRepositoryMock.Setup(x => x.UpdateIdAsync(oldId, newId)).Verifiable(Times.Once);
            var sectionRoleRepository = new Mock<ISectionRoleRepository>();
            sectionRoleRepository.Setup(x => x.GetAllAsync(newId)).ReturnsAsync(new QueryListResult<Entities.SectionRole>());

            var service = new SectionService(sectionRepositoryMock.Object, sectionRoleRepository.Object, _mapper);

            // act
            var result = await service.UpdateIdAsync(oldId, newId);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(newId, result.Value.Id);            
            sectionRoleRepository.Verify();
        }
    }
}