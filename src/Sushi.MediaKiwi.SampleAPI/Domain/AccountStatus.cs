using System.Text.Json.Serialization;

namespace Sushi.MediaKiwi.SampleAPI.Domain
{
    [JsonConverter(typeof(JsonStringEnumConverter<AccountStatus>))]
    public enum AccountStatus
    { 
        Open = 1, 
        Closed = 2
    }
}
