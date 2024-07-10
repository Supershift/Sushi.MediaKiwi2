using Sushi.MediaKiwi.SampleAPI.Domain;
using Swashbuckle.AspNetCore.Annotations;

namespace Sushi.MediaKiwi.SampleAPI.Service.Model
{
    public record AccountDto
    {
        [SwaggerSchema(ReadOnly = true)]        
        public required string Number { get; init; }
        [SwaggerSchema(ReadOnly = true)]
        public required string HolderName { get; init; }
        [SwaggerSchema(ReadOnly = true)]
        public required decimal Balance { get; init; }
        [SwaggerSchema(ReadOnly = true)]
        public required AccountStatus Status { get; init; }
    }
}
