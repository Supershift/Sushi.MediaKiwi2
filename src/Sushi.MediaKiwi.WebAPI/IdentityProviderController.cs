using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Provides settings for the configured identity providers
    /// </summary>
    [Route($"{BaseRoute}/identityprovider/")]
    public class IdentityProviderController : MediaKiwiControllerBase
    {
        private readonly EntraSettings settings;

        /// <summary></summary>
        public IdentityProviderController(IConfiguration configuration)
        {
            var azureAdSection = configuration.GetSection(Microsoft.Identity.Web.Constants.AzureAd);
            settings = new EntraSettings
            {
                ClientId = azureAdSection.GetSection("ClientId")?.Value ?? "",
                TenantId = azureAdSection.GetSection("TenantId")?.Value ?? "",
                Audience = azureAdSection.GetSection("Audience")?.Value ?? "",
                Instance = azureAdSection.GetSection("Instance")?.Value ?? "",
            };
        }

        /// <summary>
        /// Get the Azure Entra settings
        /// </summary>        
        [HttpGet]
        [Route("entra")]
        [AllowAnonymous]
        public ActionResult<EntraSettings> GetEntra()
        {
            return this.CreateResponse(new Result<EntraSettings>(settings));
        }
    }
}