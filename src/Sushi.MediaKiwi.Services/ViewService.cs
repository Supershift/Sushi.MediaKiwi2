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
            var viewsRoles = await _viewRoleRepository.GetAllAsync(null);

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

        public async Task<Result<View>> GetAsync(int id)
        {
            // get item from datastore
            var view = await _viewRepository.GetAsync(id);
            

            if (view != null)
            {
                var viewsRoles = await _viewRoleRepository.GetAllAsync(view.Id);

                // map to result
                var result = new View();
                _mapper.Map(view, result);
                // add roles                
                result.Roles = viewsRoles.Select(x => x.Role).ToList();
                
                return new Result<View>(result);
            }
            else
            {
                return new Result<View>(ResultCode.NotFound);
            }
        }

        public async Task<Result<View>> SaveAsync(int? id, View request)
        {
            // get existing or create new view, based on id
            DAL.View view;
            if (id.HasValue)
            {
                var candidate = await _viewRepository.GetAsync(id.Value);
                if (candidate == null)
                {
                    return new Result<View>(ResultCode.NotFound);
                }
                view = candidate;

            }
            else
            {
                view = new DAL.View();
            }

            // map from model to database
            _mapper.Map(request, view);

            // start transaction
            using (var ts = DAL.Utility.CreateTransactionScope())
            {

                // save view
                // todo: handle uq constraint fail
                await _viewRepository.SaveAsync(view);

                // todo: only do this if roles have changed
                // delete existing roles for view
                if (id.HasValue)
                    await _viewRoleRepository.DeleteForViewAsync(view.Id);

                // insert roles for view
                foreach (var role in request.Roles)
                {
                    var viewRole = new DAL.ViewRole() { Role = role, ViewId = view.Id };
                    await _viewRoleRepository.InsertAsync(viewRole);
                }

                // commit transaction
                ts.Complete();
            }
            // return view
            var viewsRoles = await _viewRoleRepository.GetAllAsync(view.Id);
            var result = new View();
            _mapper.Map(view, result);
            // add roles                
            result.Roles = viewsRoles.Select(x => x.Role).ToList();

            return new Result<View>(result);
        }
    }
}
