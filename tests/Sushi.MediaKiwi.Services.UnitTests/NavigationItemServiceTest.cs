using AutoMapper;
using Moq;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;
using AutoMapper.Extensions.ExpressionMapping;

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
            var stubs = new QueryListResult<DAL.NavigationItem>
            {
                new DAL.NavigationItem(),
                new DAL.NavigationItem()
            };

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            var repositoryMock = new Mock<INavigationItemRepository>();
            repositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>(), null)).ReturnsAsync(stubs);

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
            int? actualFilterID = null;
            int? expectedFilterID = 1;

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            
            var repositoryMock = new Mock<INavigationItemRepository>();
            repositoryMock
                .Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>(), null))
                .Callback((int? sectionId, PagingValues pagingValues, DAL.Sorting.SortValues<DAL.NavigationItem>? sort) => actualFilterID = sectionId)
                .ReturnsAsync(new QueryListResult<DAL.NavigationItem>());

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
            var navigationItemStub = new DAL.NavigationItem()
            {
                Id = 1
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
            DAL.NavigationItem? navigationItemStub = null;
            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(navigationItemStub);

            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
            var result = await service.DeleteAsync(1);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
            
        }[Fact]
        public async Task GetNavigationItemTest()
        {
            // arrange
            var navigationItemStub = new DAL.NavigationItem()
            {
                Id = 1
            };                

            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.GetAsync(It.Is<int>(x=>x == navigationItemStub.Id))).ReturnsAsync(navigationItemStub);
            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
            var result = await service.GetAsync(1);

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
            DAL.NavigationItem? navigationItemStub = null;
            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(navigationItemStub);

            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
            var result = await service.DeleteAsync(2);

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
                SectionId = 2,
                ParentNavigationItemId = 2,
                ViewId = "abc",
            };

            int newId = 4;
            var dalResult = new DAL.NavigationItem() { Id = newId };

            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.InsertAsync(It.Is<DAL.NavigationItem>(x => x.Id == newId)));

            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
            var result = await service.CreateAsync(navigationItem);

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
                Id = 3,
                Name = "name",
                SectionId = 2,
                ParentNavigationItemId = 2,
                ViewId = "abc",
            };


            int existingId = 1;
            var dalResult = new DAL.NavigationItem() { Id = existingId };

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
            DAL.NavigationItem? navigationItemStub = null;
            var navigationItemRepositoryMock = new Mock<INavigationItemRepository>();
            navigationItemRepositoryMock.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(navigationItemStub);

            var service = new NavigationItemService(navigationItemRepositoryMock.Object, _mapper);

            // act
            var result = await service.UpdateAsync(5, new NavigationItem());

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
        }
    }
}