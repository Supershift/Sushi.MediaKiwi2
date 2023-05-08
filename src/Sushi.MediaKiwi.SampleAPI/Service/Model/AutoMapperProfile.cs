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
            // from DAL to Model
            CreateMap<DAL.Country, Country>();
            CreateMap<DAL.Hotel, Hotel>();

            // from model to DAL
            CreateMap<Country, DAL.Country>();
            CreateMap<Hotel, DAL.Hotel>();
        }
    }
}
