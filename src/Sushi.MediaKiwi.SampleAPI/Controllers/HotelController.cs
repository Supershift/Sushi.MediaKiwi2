using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.SampleAPI.Service;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.SampleAPI.Controllers
{
    [Route($"{BaseRoute}/hotels")]
    public class HotelController : SampleControllerBase
    {
        private readonly HotelService _hotelService;

        public HotelController(HotelService hotelService, PagingRetriever pagingRetriever)
        {
            _hotelService = hotelService;
        }

        /// <summary>
        /// Gets all hotels.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [QueryStringPaging]
        public async Task<ActionResult<ListResult<Hotel>>> GetHotels(GetHotelsQuery query)
        {
            var result = await _hotelService.GetAllAsync(query);
            return this.CreateResponse(result);
        }


        /// <summary>
        /// Gets a single Hotel.
        /// </summary>
        /// <param name="id">The Id for the hotel to retrieve</param>
        /// <returns></returns>
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<Hotel>> GetHotel(int id)
        {
            var result = await _hotelService.GetAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Deletes a Hotel.
        /// </summary>
        /// <param name="id">The Id for the hotel to delete</param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<Hotel>> DeleteHotel(int id)
        {
            var result = await _hotelService.DeleteAsync(id);
            return this.CreateResponse(result);
        }


        /// <summary>
        /// Creates a new Hotel.
        /// </summary>
        /// <param name="request">The request containing all Hotel information</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<Hotel>> CreateHotel(Hotel request)
        {
            var result = await _hotelService.SaveAsync(null, request);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Updates an existing Hotel.
        /// </summary>        
        /// <returns></returns>
        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<Hotel>> UpdateHotel(int id, Hotel request)
        {
            var result = await _hotelService.SaveAsync(id, request);
            return this.CreateResponse(result);
        }
    }

    public class GetHotelsQuery
    {
        public PagingValues? Page { get; set; }
        public string? CountryCode { get; set; }
        public bool? IsActive { get; set; }
    }
}
