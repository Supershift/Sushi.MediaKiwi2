using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
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
    [ApiExplorerSettings(GroupName = "MediaKiwi")]
    [EnableCors("AllowAnyOrigin")]    
    [Authorize(Roles = "Admin")]
    public abstract class MediaKiwiControllerBase : ControllerBase
    {
        /// <summary>
        /// The basepath to be used for all MediaKiwi endpoints.
        /// </summary>
        public const string BaseRoute = "mediakiwi/api";
    }
}
