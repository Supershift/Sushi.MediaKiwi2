using Microsoft.AspNetCore.Http;
using Microsoft.Identity.Web;
using Sushi.MediaKiwi.DAL.User;

namespace Sushi.MediaKiwi.WebAPI.User
{
    public class UserProvider : IUserProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Actor GetActor()
        {
            // Make sure we can access the HTTP Context
            if (_httpContextAccessor?.HttpContext == null)
            {
                throw new InvalidOperationException("HTTP context could not be accessed");
            }

            // get app id, if user is an application
            var appIdClaim = _httpContextAccessor.HttpContext.User.FindFirst(Constants.ApplicationIdClaim);

            if (appIdClaim != null)
            {
                if (Guid.TryParse(appIdClaim.Value, out Guid appId))
                {
                    return new Actor(ActorType.Application, appId);
                }
                else
                {
                    throw new Exception($"appid found on claim, but it was not a guid: {appIdClaim.Value}");
                }
            }
            else
            {
                var objectId = _httpContextAccessor.HttpContext.User.GetObjectId();
                if (objectId != null)
                {
                    if (Guid.TryParse(objectId, out var userId))
                    {
                        return new Actor(ActorType.User, userId);
                    }
                    else
                    {
                        throw new Exception($"oid found on claim, but it was not a guid: {objectId}");
                    }
                }
            }

            throw new Exception("No oid or appid found on claim");
        }

        public string GetRole()
        {
            // Make sure we can access the HTTP Context
            if (_httpContextAccessor?.HttpContext == null)
            {
                throw new InvalidOperationException("HTTP context could not be accessed");
            }

            // get role claim
            var roleClaim = _httpContextAccessor.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Role);

            if (!string.IsNullOrWhiteSpace(roleClaim?.Value))
            {
                return roleClaim.Value;
            }

            throw new Exception("No role found on claim");
        }
    }
}
