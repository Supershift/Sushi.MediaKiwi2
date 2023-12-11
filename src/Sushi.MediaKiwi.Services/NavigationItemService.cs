using AutoMapper;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.DAL.User;
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
        private readonly ISectionRoleRepository _sectionRoleRepository;
        private readonly IViewRoleRepository _viewRoleRepository;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public NavigationItemService(
            INavigationItemRepository navigationItemRepository,
            IMapper mapper,
            IUserProvider userProvider,
            ISectionRoleRepository sectionRoleRepository,
            IViewRoleRepository viewRoleRepository)
        {
            _navigationItemRepository = navigationItemRepository;
            _mapper = mapper;
            _userProvider = userProvider;
            _sectionRoleRepository = sectionRoleRepository;
            _viewRoleRepository = viewRoleRepository;
        }

        public async Task<Result<ListResult<NavigationItem>>> GetAllAsync(int? sectionID, PagingValues pagingValues)
        {
            // get navigationitems from datastore
            var items = await _navigationItemRepository.GetAllAsync(sectionID, pagingValues);

            // map to result
            var itemsDto = _mapper.Map<List<NavigationItem>>(items);

            // Get current role
            var role = _userProvider.GetRole();

            if (!string.IsNullOrWhiteSpace(role))
            {
                // Apply role on section
                var sectionRoles = await _sectionRoleRepository.GetAllAsync(null);
                var allowedSections = sectionRoles.Where(x => x.Role == role);

                if (allowedSections != null)
                {
                    itemsDto = itemsDto.Where(x => allowedSections.Any(y => y.SectionId == x.SectionId)).ToList();
                }

                // Apply role on views
                var viewRolesRoles = await _viewRoleRepository.GetAllAsync(null);
                var allowedViews = viewRolesRoles.Where(x => x.Role == role);

                if (allowedViews != null)
                {
                    itemsDto = itemsDto.Where(x => allowedViews.Any(y => y.ViewId == x.ViewId)).ToList();
                }
            }

            // create result object
            var result = new ListResult<NavigationItem>(itemsDto, items);

            return new Result<ListResult<NavigationItem>>(result);
        }
    }
}
