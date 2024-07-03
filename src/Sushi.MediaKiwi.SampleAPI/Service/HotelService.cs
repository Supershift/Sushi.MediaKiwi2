using AutoMapper;
using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.MediaKiwi.SampleAPI.Controllers;
using Sushi.MediaKiwi.SampleAPI.DAL.Repository;
using Sushi.MediaKiwi.SampleAPI.Domain;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
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
        public async Task<Result<ListResult<HotelDto>, Error>> GetAllAsync(GetHotelsQuery query)
        {
            // get hotels from datastore
            var items = await _hotelRepository.GetAllAsync(query.Page, query.CountryCode, query.IsActive);

            // map to result
            var itemsDto = _mapper.Map<List<HotelDto>>(items);

            // create result object
            var result = new ListResult<HotelDto>(itemsDto, items);

            return result;
        }


        /// <summary>
        /// Deletes a single hotel.
        /// </summary>
        /// <param name="id">The Id for the hotel to delete</param>
        /// <returns></returns>
        public async Task<Result<Error>> DeleteAsync(int id)
        {
            // get item from datastore
            var hotel = await _hotelRepository.GetAsync(id);

            if (hotel != null)
            {
                // delete item
                await _hotelRepository.DeleteAsync(hotel.Id);
                return Result<Error>.Success();
            }
            else
            {
                return new NotFoundError();
            }
        }

        /// <summary>
        /// Gets a single hotel from the database
        /// </summary>
        /// <param name="id">The Id of the hotel to retrieve</param>
        /// <returns></returns>
        public async Task<Result<HotelDto, Error>> GetAsync(int id)
        {
            // get item from datastore
            var section = await _hotelRepository.GetAsync(id);

            if (section != null)
            {
                // map to result
                var result = new HotelDto();
                _mapper.Map(section, result);
                return result;
            }
            else
            {
                return new NotFoundError();
            }
        }

        /// <summary>
        /// Saves a single Hotel to the database
        /// </summary>
        /// <param name="id">The Id of the hotel to save, or NULL when creating a new one</param>
        /// <param name="request">The request containing all hotel information</param>
        /// <returns></returns>
        public async Task<Result<HotelDto, Error>> UpdateAsync(int id, CreateHotelRequest request)
        {
            // get existing 

            var hotel = await _hotelRepository.GetAsync(id);
            if (hotel == null)
            {
                return new NotFoundError();
            }

            // hotel.SetMetaDat();


            // save hotel
            await _hotelRepository.SaveAsync(hotel);

            var result = new HotelDto();
            _mapper.Map(hotel, result);
            return result;
        }

        public async Task<Result<HotelDto, Error>> CreateAsync(CreateHotelRequest request)
        {   
            var createHotelResult = Domain.Hotel.Create(request);
            if(createHotelResult.IsSuccess)
            {
                var hotel = createHotelResult.Value!;
                await _hotelRepository.SaveAsync(hotel);
                var result = new HotelDto();
                _mapper.Map(hotel, result);
                return result;
            }
            else
            {
                return createHotelResult.Error!;
            }
        }
    }
}
