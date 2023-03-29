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
    /// Provides methods to interact with View objects.
    /// </summary>
    public class ViewService
    {
        private readonly IViewRepository _viewRepository;
        private readonly IViewRoleRepository _viewRoleRepository;
        private readonly IMapper _mapper;

        /// <summary>
        /// Creates a new instance of <see cref="ViewRepository"/>.
        /// </summary>        
        public ViewService(
            IViewRepository viewRepository,
            IViewRoleRepository viewRoleRepository,
            IMapper mapper)
        {
            _viewRepository = viewRepository;
            _viewRoleRepository = viewRoleRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Gets all views matching the provided filter parameters.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result<ListResult<View>>> GetAllAsync(int? sectionID, PagingValues pagingValues)
        {
            // get items from datastore
            var views = await _viewRepository.GetAllAsync(sectionID, pagingValues);
            var viewsRoles = await _viewRoleRepository.GetAllAsync();

            // create result object
            var result = new ListResult<View>(views.TotalNumberOfRows, views.TotalNumberOfPages);

            // map to result
            _mapper.Map(views, result.Result);

            // add roles
            foreach(var view in result.Result)
            {
                view.Roles = viewsRoles.Where(x => x.ViewId == view.Id).Select(x=>x.Role).ToList();
            }

            return new Result<ListResult<View>>(result);
        }
    }
}
