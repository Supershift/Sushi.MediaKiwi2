using AutoMapper;
using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MediaKiwi.Services.Model;

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
        /// Creates a new instance of <see cref="ViewService"/>.
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
        public async Task<Result<Error>> DeleteAsync(string id)
        {
            // get item from datastore
            var view = await _viewRepository.GetAsync(id);

            // todo: check if view is used by any navigation items?

            if (view != null)
            {   
                // delete item
                await _viewRepository.DeleteAsync(view.Id);
                return Result.Success<Error>();
            }
            else
            {
                return new NotFoundError();
            }
        }

        /// <summary>
        /// Gets all views matching the provided filter parameters.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result<ListResult<View>, Error>> GetAllAsync(PagingValues pagingValues, SortValues<View>? sortValues = null)
        {   
            // map sort values to dal
            var sortValuesDal = _mapper.MapSortValues<Entities.View>(sortValues);
            
            // get items from datastore
            var views = await _viewRepository.GetAllAsync(pagingValues, sortValuesDal);
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

            return result;
        }

        /// <summary>
        /// Gets a single <see cref="View"/> by its ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Result<View, Error>> GetAsync(string id)
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

                return result;
            }
            else
            {
                return new NotFoundError();
            }
        }

        /// <summary>
        /// Creates a new <see cref="View"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<Result<View, Error>> CreateAsync(string id, View request)
        {
            var view = new Entities.View() { Id = id };

            // map from model to database
            _mapper.Map(request, view);

            // start transaction
            using (var ts = TransactionUtility.CreateTransactionScope())
            {
                // save view
                // todo: handle pk constraint fail
                await _viewRepository.InsertAsync(view);

                // insert roles for view
                foreach (var role in request.Roles)
                {
                    var viewRole = new Entities.ViewRole() { Role = role, ViewId = view.Id };
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

            return result;            
        }

        /// <summary>
        /// Updates a <see cref="View"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<Result<View, Error>> UpdateAsync(string id, View request)
        {
            // get existing view, based on id
            var view = await _viewRepository.GetAsync(id);
            if (view == null)
            {
                return new NotFoundError();
            }

            // map from model to database
            _mapper.Map(request, view);

            // start transaction
            using (var ts = TransactionUtility.CreateTransactionScope())
            {
                // update view                
                await _viewRepository.UpdateAsync(view);

                // todo: only do this if roles have changed
                // delete existing roles for view                
                await _viewRoleRepository.DeleteForViewAsync(view.Id);

                // insert roles for view
                foreach (var role in request.Roles)
                {
                    var viewRole = new Entities.ViewRole() { Role = role, ViewId = view.Id };
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

            return result;
        }
    }
}
