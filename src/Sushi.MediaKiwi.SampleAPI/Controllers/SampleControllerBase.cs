using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Sushi.MediaKiwi.SampleAPI.Controllers
{
    [ApiController]
    [ApiExplorerSettings(GroupName = "SampleApi")]
    [Authorize]
    public abstract class SampleControllerBase : ControllerBase
    {
        /// <summary>
        /// The basepath to be used for all SampleApi endpoints.
        /// </summary>
        public const string BaseRoute = "sample";
    }
}
