using AutoMapper;
using Sushi.MediaKiwi.SampleAPI.Controllers;
using Sushi.MediaKiwi.SampleAPI.DAL.Repository;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.SampleAPI.Service
{
    public class HotelService
    {
        private readonly HotelRepository _hotelRepository;
        private readonly IMapper _mapper;

        public HotelService(
            HotelRepository hotelRepository,
            IMapper mapper)
        { 
            _hotelRepository = hotelRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Retrieves all Hotels from the database
        /// </summary>
        /// <param name="pagingValues">Paging values containing page limitations</param>
        /// <param name="countryCode">Limit results to supplied country codes</param>
        /// <param name="isActive">Limit results to supplied isactive state</param>
        /// <returns></returns>
        public async Task<Result<ListResult<Hotel>>> GetAllAsync(GetHotelsQuery query)
        {
            // get hotels from datastore
            var items = await _hotelRepository.GetAllAsync(query.Page, query.CountryCode, query.IsActive);

            // map to result
            var itemsDto = _mapper.Map<List<Hotel>>(items);

            // create result object
            var result = new ListResult<Hotel>(itemsDto, items);
            
            return new Result<ListResult<Hotel>>(result);
        }


        /// <summary>
        /// Deletes a single hotel.
        /// </summary>
        /// <param name="id">The Id for the hotel to delete</param>
        /// <returns></returns>
        public async Task<Result> DeleteAsync(int id)
        {
            // get item from datastore
            var hotel = await _hotelRepository.GetAsync(id);

            if (hotel != null)
            {
                // delete item
                await _hotelRepository.DeleteAsync(hotel.Id);
                return new Result(ResultCode.Success);
            }
            else
            {
                return new Result(ResultCode.NotFound);
            }
        }

        /// <summary>
        /// Gets a single hotel from the database
        /// </summary>
        /// <param name="id">The Id of the hotel to retrieve</param>
        /// <returns></returns>
        public async Task<Result<Hotel>> GetAsync(int id)
        {
            // get item from datastore
            var section = await _hotelRepository.GetAsync(id);

            if (section != null)
            {
                // map to result
                var result = new Hotel();
                _mapper.Map(section, result);
                return new Result<Hotel>(result);
            }
            else
            {
                return new Result<Hotel>(ResultCode.NotFound);
            }
        }

        /// <summary>
        /// Saves a single Hotel to the database
        /// </summary>
        /// <param name="id">The Id of the hotel to save, or NULL when creating a new one</param>
        /// <param name="request">The request containing all hotel information</param>
        /// <returns></returns>
        public async Task<Result<Hotel>> SaveAsync(int? id, Hotel request)
        {
            // get existing or create new hotel, based on id
            DAL.Hotel hotel;
            if (id.HasValue)
            {
                var candidate = await _hotelRepository.GetAsync(id.Value);
                if (candidate == null)
                {
                    return new Result<Hotel>(ResultCode.NotFound);
                }
                hotel = candidate;

            }
            else
            {
                hotel = new DAL.Hotel();
            }

            // map from model to database
            _mapper.Map(request, hotel);

            // start transaction
            using (var ts = Utility.CreateTransactionScope())
            {
                // save hotel
                await _hotelRepository.SaveAsync(hotel);

                // commit transaction
                ts.Complete();
            }

            var result = new Hotel();
            _mapper.Map(hotel, result);
            return new Result<Hotel>(result);
        }
    }
}
