using AutoMapper;
using Moq;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;
using AutoMapper.Extensions.ExpressionMapping;
using Sushi.MediaKiwi.Services.Interfaces;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class NavigationItemServiceTest
    {   
        
        private readonly IMapper _mapper;     

        public NavigationItemServiceTest()
        {
            var config = new MapperConfiguration(cfg =>
            {   
                cfg.AddProfile<AutoMapperProfile>();
                cfg.AddExpressionMapping();
            });
            _mapper = config.CreateMapper();
        }

        [Fact]
        public async Task GetAllNavigationItemTest()
        {
            // arrange
            var stubs = new QueryListResult<Entities.NavigationItem>
            {
                new Entities.NavigationItem(),
                new Entities.NavigationItem()
            };

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            var repositoryMock = new Mock<INavigationItemRepository>();
            repositoryMock.Setup(x => x.GetAllAsync(It.IsAny<string?>(), It.IsAny<PagingValues>(), null)).ReturnsAsync(stubs);

            var service = new NavigationItemService(repositoryMock.Object, mapper);

            // act
            var result = await service.GetAllAsync(null, PagingValues.Default);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);            
            Assert.NotNull(result.Value);
            Assert.NotNull(result.Value.Result);
            Assert.Equal(2, result.Value.Result.Count);
        }

        [Fact]
        public async Task GetAllNavigationItemsTest_Filters()
        {
            // arrange
            string? actualFilterID = null;
            string? expectedFilterID = "1";

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            
            var repositoryMock = new Mock<INavigationItemRepository>();
            repositoryMock
                .Setup(x => x.GetAllAsync(It.IsAny<string?>(), It.IsAny<PagingValues>(), null))
                .Callback((string? sectionId, PagingValues pagingValues, SortValues<Entities.NavigationItem>? sort) => actualFilterID = sectionId)
                .ReturnsAsync(new QueryListResult<Entities.NavigationItem>());

            var service = new NavigationItemService(repositoryMock.Object, mapper);

            // act
            var result = await service.GetAllAsync(expectedFilterID, PagingValues.Default);

            // assert
            Assert.Equal(expectedFilterID, actualFilterID);
        }

        [Fact]
        public async Task DeleteNavigationItemTest()
        {
            // arrange
            var navigationItemStub = new Entities.NavigationItem()
            {
                Id = "itemId"
            };

            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.GetAsync(navigationItemStub.Id)).ReturnsAsync(navigationItemStub);
            navigationItemRepositoryMock.Setup(x => x.DeleteAsync(navigationItemStub.Id)).Verifiable();

            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
            var result = await service.DeleteAsync(navigationItemStub.Id);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            navigationItemRepositoryMock.Verify(x=>x.DeleteAsync(navigationItemStub.Id), Times.Once);
        }

        [Fact]
        public async Task DeleteNavigationItemTest_NotFound()
        {
            // arrange
            Entities.NavigationItem? navigationItemStub = null;
            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.GetAsync(It.IsAny<string>())).ReturnsAsync(navigationItemStub);

            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
            var result = await service.DeleteAsync("someId");

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
            
        }[Fact]
        public async Task GetNavigationItemTest()
        {
            // arrange
            var navigationItemStub = new Entities.NavigationItem()
            {
                Id = "itemId"
            };                

            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.GetAsync(It.Is<string>(x=>x == navigationItemStub.Id))).ReturnsAsync(navigationItemStub);
            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
            var result = await service.GetAsync("itemId");

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(navigationItemStub.Id, result.Value.Id);
        }

        [Fact]
        public async Task GetNavigationItemTest_NotFound()
        {
            // arrange
            Entities.NavigationItem? navigationItemStub = null;
            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.GetAsync(It.IsAny<string>())).ReturnsAsync(navigationItemStub);

            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
           var result = await service.DeleteAsync("someId");

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
        }

        [Fact]
        public async Task CreateNavigationItemTest()
        {
            // arrange
            var navigationItem = new NavigationItem()
            {
                Name = "name",
                SectionId = "section",
                ParentNavigationItemId = "parentId",
                ViewId = "abc",
            };

            string newId = "newId";            

            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.InsertAsync(It.Is<Entities.NavigationItem>(x => x.Id == newId)));

            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
            var result = await service.CreateAsync(newId, navigationItem);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
        }

        [Fact]
        public async Task UpdateNavigationItemTest()
        {
            // arrange
            var navigationItem = new NavigationItem()
            {
                Id = "3",
                Name = "name",
                SectionId = "section",
                ParentNavigationItemId = "2",
                ViewId = "abc",
            };


            var existingId = "1";
            var dalResult = new Entities.NavigationItem() { Id = existingId };

            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.GetAsync(existingId)).ReturnsAsync(dalResult).Verifiable();
            navigationItemRepositoryMock.Setup(x => x.UpdateAsync(dalResult)).Verifiable();

            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
            var result = await service.UpdateAsync(existingId, navigationItem);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(existingId, result.Value.Id);
            navigationItemRepositoryMock.Verify(x=>x.GetAsync(existingId), Times.Once);
            navigationItemRepositoryMock.Verify(x=>x.UpdateAsync(dalResult), Times.Once);
        }

        [Fact]
        public async Task UpdateNavigationItemTest_NotFound()
        {
            // arrange
            Entities.NavigationItem? navigationItemStub = null;
            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.GetAsync(It.IsAny<string>())).ReturnsAsync(navigationItemStub);

            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
            var result = await service.UpdateAsync("myId", new NavigationItem());

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
        }

        [Fact]
        public async Task UpdateIdTest()
        {
            // arrange
            var oldId = "1";
            var newId = "newId";
            var oldItem = new Entities.NavigationItem() { Id = oldId };
            var newItem = new Entities.NavigationItem() { Id = newId };

            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.GetAsync(oldId)).ReturnsAsync(oldItem).Verifiable(Times.Once);
            navigationItemRepositoryMock.Setup(x => x.GetAsync(newId)).ReturnsAsync(newItem).Verifiable(Times.Once);
            navigationItemRepositoryMock.Setup(x => x.UpdateIdAsync(oldId, newId)).Verifiable(Times.Once);

            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
            var result = await service.UpdateIdAsync(oldId, newId);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(newId, result.Value.Id);
            navigationItemRepositoryMock.Verify();            
        }
    }
}