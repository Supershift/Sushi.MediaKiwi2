using Microsoft.AspNetCore.Mvc;

namespace Sushi.MediaKiwi.SampleAPI.Controllers
{   
    public class PingController : SampleControllerBase
    {
        [HttpGet]
        [Route($"{BaseRoute}/ping")]
        public ActionResult<string> Ping()
        {
            return "OK";
        }
    }
}
