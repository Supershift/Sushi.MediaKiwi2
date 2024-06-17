using AutoMapper;

namespace Sushi.MediaKiwi.Services.Model
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
            CreateMap<Entities.Section, Section>().ForMember(x => x.Roles, o => o.Ignore());
            CreateMap<Entities.View, View>().ForMember(x=>x.Roles, o => o.Ignore());
            CreateMap<Entities.NavigationItem, NavigationItem>();
            CreateMap<Entities.Role, Role>();
            CreateMap<Entities.Locale, Locale>();            
            CreateMap<Entities.Translation, Translation>();

            // from model to DAL
            CreateMap<Section, Entities.Section>().ForMember(x => x.Id, o => o.Ignore());
            CreateMap<View, Entities.View>().ForMember(x => x.Id, o => o.Ignore());
            CreateMap<NavigationItem, Entities.NavigationItem>().ForMember(x => x.Id, o => o.Ignore());
            CreateMap<Locale, Entities.Locale>().ForMember(x => x.Id, o => o.Ignore()).ForMember(x => x.IsDefault, o => o.Ignore());
        }
    }
}
