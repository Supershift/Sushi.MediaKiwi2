using AutoMapper;

namespace Sushi.MediaKiwi.SampleAPI.Service.Model
{
    /// <summary>
    /// Contains Automapper mappings for mapping DAL objects to Model objects.
    /// </summary>
    public class AutoMapperProfile : Profile
    {
        /// <summary>
        /// Creates a new instance of <see cref="AutoMapperProfile"/>.
        /// </summary>
        public AutoMapperProfile()
        {
            // from Domain to DTO
            CreateMap<DAL.Country, Country>();
            CreateMap<Domain.Hotel, HotelDto>();

            // from model to DAL
            CreateMap<Country, DAL.Country>();            
        }
    }
}
