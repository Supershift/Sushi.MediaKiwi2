using AutoMapper;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.DAL.Sorting;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM.Supporting;
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
        /// Deletes a view.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Result> DeleteAsync(string id)
        {
            // get item from datastore
            var view = await _viewRepository.GetAsync(id);

            // todo: check if view is used by any navigation items?

            if (view != null)
            {   
                // delete item
                await _viewRepository.DeleteAsync(view.Id);
                return new Result(ResultCode.Success);
            }
            else
            {
                return new Result(ResultCode.NotFound);
            }
        }

        /// <summary>
        /// Gets all views matching the provided filter parameters.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result<ListResult<View>>> GetAllAsync(int? sectionID, PagingValues pagingValues, SortValues<View>? sortValues = null)
        {   
            // map sort values to dal
            var sortValuesDal = _mapper.MapSortValues<DAL.View>(sortValues);
            
            // get items from datastore
            var views = await _viewRepository.GetAllAsync(sectionID, pagingValues, sortValuesDal);
            var viewsRoles = await _viewRoleRepository.GetAllAsync(null);

            // map to result
            var viewsDto = _mapper.Map<List<View>>(views);

            // create result object
            var result = new ListResult<View>(viewsDto, views);            

            // add roles
            foreach(var view in result.Result)
            {
                view.Roles = viewsRoles.Where(x => x.ViewId == view.Id).Select(x=>x.Role).ToList();
            }

            return new Result<ListResult<View>>(result);
        }

        public async Task<Result<View>> GetAsync(string id)
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

        public async Task<Result<View>> CreateAsync(string id, View request)
        {
            var view = new DAL.View() { Id = id };

            // map from model to database
            _mapper.Map(request, view);

            // start transaction
            using (var ts = DAL.Utility.CreateTransactionScope())
            {
                // save view
                // todo: handle pk constraint fail
                await _viewRepository.InsertAsync(view);

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

        public async Task<Result<View>> UpdateAsync(string id, View request)
        {
            // get existing view, based on id
            DAL.View view = await _viewRepository.GetAsync(id);
            if (view == null)
            {
                return new Result<View>(ResultCode.NotFound);
            }

            // map from model to database
            _mapper.Map(request, view);

            // start transaction
            using (var ts = DAL.Utility.CreateTransactionScope())
            {
                // update view                
                await _viewRepository.UpdateAsync(view);

                // todo: only do this if roles have changed
                // delete existing roles for view                
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
