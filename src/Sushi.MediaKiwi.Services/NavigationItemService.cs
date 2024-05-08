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

        public async Task<Result<ListResult<NavigationItem>>> GetAllAsync(string? sectionID, PagingValues pagingValues)
        {
            // get navigationitems from datastore
            var items = await _navigationItemRepository.GetAllAsync(sectionID, pagingValues);

            // map to result
            var itemsDto = _mapper.Map<List<NavigationItem>>(items);

            // create result object
            var result = new ListResult<NavigationItem>(itemsDto, items);            

            return new Result<ListResult<NavigationItem>>(result);
        }       
                
        public async Task<Result<NavigationItem>> GetAsync(string id)
        {
            // get item from datastore
            var navigationItem = await _navigationItemRepository.GetAsync(id);
            
            if (navigationItem != null)
            {
                // map to result
                var result = new NavigationItem();
                _mapper.Map(navigationItem, result);
                
                return new Result<NavigationItem>(result);
            }
            else
            {
                return new Result<NavigationItem>(ResultCode.NotFound);
            }
        }
                
        public async Task<Result<NavigationItem>> CreateAsync(string id, NavigationItem request)
        {
            var navigationItem = new DAL.NavigationItem();

            // map from model to database
            _mapper.Map(request, navigationItem);

            // set id
            navigationItem.Id = id;

            // start transaction
            using (var ts = DAL.Utility.CreateTransactionScope())
            {                
                await _navigationItemRepository.InsertAsync(navigationItem);

                // commit transaction
                ts.Complete();
            }

            // return item
            var result = new NavigationItem();
            _mapper.Map(navigationItem, result);

            return new Result<NavigationItem>(result);            
        }
                
        public async Task<Result<NavigationItem>> UpdateAsync(string id, NavigationItem request)
        {
            // get existing view, based on id
            DAL.NavigationItem navigationItem = await _navigationItemRepository.GetAsync(id);
            if (navigationItem == null)
            {
                return new Result<NavigationItem>(ResultCode.NotFound);
            }

            // map from model to database
            _mapper.Map(request, navigationItem);

            // start transaction
            using (var ts = DAL.Utility.CreateTransactionScope())
            {
                // update view                
                await _navigationItemRepository.UpdateAsync(navigationItem);

                // commit transaction
                ts.Complete();
            }
            
            var result = new NavigationItem();
            _mapper.Map(navigationItem, result);

            return new Result<NavigationItem>(result);
        }

        public async Task<Result> DeleteAsync(string id)
        {
            // get item from datastore
            var view = await _navigationItemRepository.GetAsync(id);
                        
            if (view != null)
            {   
                // delete item
                await _navigationItemRepository.DeleteAsync(view.Id);
                return new Result(ResultCode.Success);
            }
            else
            {
                return new Result(ResultCode.NotFound);
            }
        }
    }
}
