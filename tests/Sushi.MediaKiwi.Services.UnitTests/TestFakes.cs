using AutoMapper;
using Sushi.MediaKiwi.Services.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class TestFakes
    {
        public TestFakes()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            Mapper = config.CreateMapper();
        }

        public IMapper Mapper { get; }
    }
}
