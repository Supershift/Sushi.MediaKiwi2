using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class AutoMapperProfileTest
    {
        [Fact]
        public void AutoMapperProfileTest_ConfigurationIsValid()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<Model.AutoMapperProfile>());
            config.AssertConfigurationIsValid();
        }
    }
}
