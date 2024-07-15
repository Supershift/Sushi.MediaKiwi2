using Swashbuckle.AspNetCore.Annotations;

namespace Sushi.MediaKiwi.Services.Model
{
    /// <summary>
    /// Entra / MSAL settings
    /// </summary>
    public record EntraSettings
    {
        /// <summary>
        /// The client ID for the application, as copied from the Azure portal
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public required string ClientId { get; init; }

        /// <summary>
        /// The tenant GUID obtained from the Azure portal to sign in users in the organization. You can also use a domain name.
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public required string TenantId { get; init; }

        /// <summary>
        /// The audience in the tenant ID. The options vary depending on whether your app is single tenant or multitenant.
        /// organizations to sign in users in any work or school account
        /// common to sign in users with any work or school account or Microsoft personal account
        /// consumers to sign in users with a Microsoft personal account only
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public required string? Audience { get; init; }

        /// <summary>
        /// The cloud instance if you want your app to run in national clouds, for example. The different options include;
        /// https://login.microsoftonline.com/ for Azure public cloud
        /// https://login.microsoftonline.us/ for Azure US government
        /// https://login.microsoftonline.de/ for Microsoft Entra Germany
        /// https://login.partner.microsoftonline.cn/common for Microsoft Entra China operated by 21Vianet
        /// </summary>
        [SwaggerSchema(ReadOnly = true)]
        public required string Instance { get; init; }
    }
}
