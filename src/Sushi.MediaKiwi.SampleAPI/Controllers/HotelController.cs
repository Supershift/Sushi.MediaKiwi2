using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.SampleAPI.Service;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI;

namespace Sushi.MediaKiwi.SampleAPI.Controllers
{
    public class HotelController : SampleControllerBase
    {
        private readonly HotelService _hotelService;
        private readonly IValidator<CreateHotelRequest> _createHotelValidator;

        public HotelController(HotelService hotelService, IValidator<CreateHotelRequest> createHotelValidator)
        {
            _hotelService = hotelService;
            _createHotelValidator = createHotelValidator;
        }

        /// <summary>
        /// Gets all hotels.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<ListResult<HotelDto>>> GetHotels(string? countryCode, bool? isActive, [FromQuery] PagingValues pagingValues)
        {
            await Task.Delay(10000);
            var result = await _hotelService.GetAllAsync(countryCode, isActive, pagingValues);
            return this.ToResponse(result);
        }


        /// <summary>
        /// Gets a single Hotel.
        /// </summary>
        /// <param name="id">The Id for the hotel to retrieve</param>
        /// <returns></returns>
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<HotelDto>> GetHotel(int id)
        {
            var result = await _hotelService.GetAsync(id);
            return this.ToResponse(result);
        }

        /// <summary>
        /// Deletes a Hotel.
        /// </summary>
        /// <param name="id">The Id for the hotel to delete</param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<HotelDto>> DeleteHotel(int id)
        {
            var result = await _hotelService.DeleteAsync(id);
            return this.ToResponse(result);
        }


        /// <summary>
        /// Creates a new Hotel.
        /// </summary>
        /// <param name="request">The request containing all Hotel information</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<HotelDto>> CreateHotel(CreateHotelRequest request)
        {   
            var validationResult = await _createHotelValidator.ValidateAsync(request);

            if (validationResult.IsValid == false)
            {
                return this.ToResponse(validationResult.ToError());
            }

            var result = await _hotelService.CreateAsync(request);
            return this.ToResponse(result);
        }

        /// <summary>
        /// Updates an existing Hotel.
        /// </summary>        
        /// <returns></returns>
        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<HotelDto>> UpdateHotel(int id, CreateHotelRequest request)
        {
            var result = await _hotelService.UpdateAsync(id, request);
            return this.ToResponse(result);
        }
    }
}
