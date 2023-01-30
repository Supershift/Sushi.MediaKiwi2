using AutoMapper;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services
{
    public class NavigationItemService
    {
        private readonly INavigationItemRepository _navigationItemRepository;
        private readonly IMapper _mapper;

        public NavigationItemService(
            INavigationItemRepository navigationItemRepository, 
            IMapper mapper)
        {
            _navigationItemRepository = navigationItemRepository;
            _mapper = mapper;
        }

        public async Task<Result<ListResult<NavigationItem>>> GetAllAsync(int? sectionID)
        {
            // get navigationitems from datastore
            var items = await _navigationItemRepository.GetAllAsync(sectionID);

            // create result object
            var result = new ListResult<NavigationItem>(items.TotalNumberOfRows, items.TotalNumberOfPages);

            // map to result
            _mapper.Map(items, result.Result);

            return new Result<ListResult<NavigationItem>>(result);
        }
    }
}
