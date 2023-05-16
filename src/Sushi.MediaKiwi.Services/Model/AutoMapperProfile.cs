using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            CreateMap<DAL.Section, Section>();
            CreateMap<DAL.View, View>();
            CreateMap<DAL.NavigationItem, NavigationItem>();
            CreateMap<DAL.Role, Role>();

            // from model to DAL
            CreateMap<Section, DAL.Section>().ForMember(x => x.Id, o => o.Ignore());
            CreateMap<View, DAL.View>().ForMember(x => x.Id, o => o.Ignore());
            CreateMap<NavigationItem, DAL.NavigationItem>().ForMember(x => x.Id, o => o.Ignore());            
            
        }
    }
}
