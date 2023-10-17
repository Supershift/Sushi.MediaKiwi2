using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Serves as a base class for all MediaKiwi controllers, setting shared attributes.
    /// </summary>
    [ApiController]
    [ApiVersionNeutral]
    [ApiExplorerSettings(GroupName = "MediaKiwi")]    
    [Authorize]
    public abstract class MediaKiwiControllerBase : ControllerBase
    {
        /// <summary>
        /// The basepath to be used for all MediaKiwi endpoints.
        /// </summary>
        public const string BaseRoute = "mediakiwi/api";
    }
}
