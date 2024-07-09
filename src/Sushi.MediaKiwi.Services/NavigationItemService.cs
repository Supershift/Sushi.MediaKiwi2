using AutoMapper;
using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Provides methods to work with <see cref="NavigationItem"/> objects.
    /// </summary>
    public class NavigationItemService
    {
        private readonly INavigationItemRepository _navigationItemRepository;        
        private readonly IMapper _mapper;

        /// <summary>
        /// Creates a new instance of <see cref="NavigationItemService"/>.
        /// </summary>        
        public NavigationItemService(
            INavigationItemRepository navigationItemRepository,             
            IMapper mapper)
        {
            _navigationItemRepository = navigationItemRepository;            
            _mapper = mapper;
        }

        /// <summary>
        /// Gets all <see cref="NavigationItem"/> objects for the given filters.
        /// </summary>
        /// <param name="sectionID"></param>
        /// <param name="pagingValues"></param>
        /// <param name="sortValues"></param>
        /// <returns></returns>
        public async Task<Result<ListResult<NavigationItem>, Error>> GetAllAsync(string? sectionID, PagingValues pagingValues, SortValues<NavigationItem>? sortValues = null)
        {
            // map sort values to dal
            var sortValuesDal = _mapper.MapSortValues<Entities.NavigationItem>(sortValues);

            // get navigationitems from datastore
            var items = await _navigationItemRepository.GetAllAsync(sectionID, pagingValues, sortValuesDal);

            // map to result
            var itemsDto = _mapper.Map<List<NavigationItem>>(items);

            // create result object
            var result = new ListResult<NavigationItem>(itemsDto, items);

            return result;
        }       
                
        /// <summary>
        /// Gets a single <see cref="NavigationItem"/> by its ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Result<NavigationItem, Error>> GetAsync(string id)
        {
            // get item from datastore
            var navigationItem = await _navigationItemRepository.GetAsync(id);
            
            if (navigationItem != null)
            {
                // map to result
                var result = new NavigationItem();
                _mapper.Map(navigationItem, result);

                return result;
            }
            else
            {
                return new NotFoundError();
            }
        }
         
        /// <summary>
        /// Creates a new <see cref="NavigationItem"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<Result<NavigationItem, Error>> CreateAsync(string id, NavigationItem request)
        {
            var navigationItem = new Entities.NavigationItem();

            // map from model to database
            _mapper.Map(request, navigationItem);

            // set id
            navigationItem.Id = id;

            // start transaction
            using (var ts = TransactionUtility.CreateTransactionScope())
            {                
                await _navigationItemRepository.InsertAsync(navigationItem);

                // commit transaction
                ts.Complete();
            }

            // return item
            var result = new NavigationItem();
            _mapper.Map(navigationItem, result);

            return result;            
        }
                
        /// <summary>
        /// Updates a <see cref="NavigationItem"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<Result<NavigationItem, Error>> UpdateAsync(string id, NavigationItem request)
        {
            // get existing view, based on id
            var navigationItem = await _navigationItemRepository.GetAsync(id);
            if (navigationItem == null)
            {
                return new NotFoundError();
            }

            // map from model to database
            _mapper.Map(request, navigationItem);

            // start transaction
            using (var ts = TransactionUtility.CreateTransactionScope())
            {
                // update view                
                await _navigationItemRepository.UpdateAsync(navigationItem);

                // commit transaction
                ts.Complete();
            }
            
            var result = new NavigationItem();
            _mapper.Map(navigationItem, result);

            return result;
        }

        /// <summary>
        /// Deletes a <see cref="NavigationItem"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Result<Error>> DeleteAsync(string id)
        {
            // get item from datastore
            var view = await _navigationItemRepository.GetAsync(id);
                        
            if (view != null)
            {   
                // delete item
                await _navigationItemRepository.DeleteAsync(view.Id);
                return Result<Error>.Success();
            }
            else
            {
                return new NotFoundError();
            }
        }

        /// <summary>
        /// Updates the ID of a <see cref="NavigationItem"/>.
        /// </summary>
        public async Task<Result<NavigationItem, Error>> UpdateIdAsync(UpdateNavigationItemIdRequest request)
        {   
            // get item from datastore
            var navigationItem = await _navigationItemRepository.GetAsync(request.FromId);

            if (navigationItem == null)
            {
                return new NotFoundError();
            }

            // change ID
            await _navigationItemRepository.UpdateIdAsync(request.FromId, request.ToId);

            // return result
            return await GetAsync(request.ToId);
        }
    }
}
