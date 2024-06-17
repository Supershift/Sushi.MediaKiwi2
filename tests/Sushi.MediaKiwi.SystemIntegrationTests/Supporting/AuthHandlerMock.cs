using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Sushi.MediaKiwi.SystemIntegrationTests.Supporting
{
    public class AuthHandlerMock : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public AuthHandlerMock(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder
        )
            : base(options, logger, encoder) { }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var adminRoleClaim = new List<Claim> { new Claim(ClaimTypes.Role, WebAPI.Constants.AdminRoleName) };
            var identity = new ClaimsIdentity(adminRoleClaim, "System Integration Test");
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, "System Integration Test");

            var result = AuthenticateResult.Success(ticket);

            return Task.FromResult(result);
        }
    }
}
