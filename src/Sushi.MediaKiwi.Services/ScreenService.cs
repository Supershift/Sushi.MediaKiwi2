using AutoMapper;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Provides methods to interact with Screen objects.
    /// </summary>
    public class ScreenService
    {
        private readonly IScreenRepository _screenRepository;
        private readonly IScreenRoleRepository _screenRoleRepository;
        private readonly IMapper _mapper;

        /// <summary>
        /// Creates a new instance of <see cref="ScreenRepository"/>.
        /// </summary>
        /// <param name="screenRepository"></param>
        /// <param name="mapper"></param>
        public ScreenService(
            IScreenRepository screenRepository,
            IScreenRoleRepository screenRoleRepository,
            IMapper mapper)
        {
            _screenRepository = screenRepository;
            _screenRoleRepository = screenRoleRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Gets all screens matching the provided filter parameters.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result<ListResult<Screen>>> GetAllAsync(int? sectionID, PagingValues pagingValues)
        {
            // get items from datastore
            var screens = await _screenRepository.GetAllAsync(sectionID, pagingValues);
            var screensRoles = await _screenRoleRepository.GetAllAsync();

            // create result object
            var result = new ListResult<Screen>(screens.TotalNumberOfRows, screens.TotalNumberOfPages);

            // map to result
            _mapper.Map(screens, result.Result);

            // add roles
            foreach(var screen in result.Result)
            {
                screen.Roles = screensRoles.Where(x => x.ScreenId == screen.Id).Select(x=>x.Role).ToList();
            }

            return new Result<ListResult<Screen>>(result);
        }
    }
}
