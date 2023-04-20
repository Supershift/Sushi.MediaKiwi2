using Microsoft.AspNetCore.Mvc;

namespace Sushi.MediaKiwi.SampleAPI.Controllers
{
    [ApiController]
    public class PingController
    {
        [HttpGet]
        [Route("/ping")]
        public ActionResult<string> Ping()
        {
            return "OK";
        }
    }
}
