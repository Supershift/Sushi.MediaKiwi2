using Azure.Core;
using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.MediaKiwi.SampleAPI.Domain.Errors;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
using Sushi.MediaKiwi.Services.Entities;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.SampleAPI.Domain
{
    public class Hotel
    {
        private Hotel()
        {

        }

        public static Result<Hotel, Error> Create(CreateHotelRequest request)
        {
            var hotel = new Hotel
            {
                Name = request.Name,
                CountryCode = request.CountryCode,
                IsActive = request.IsActive,
                Created = DateTime.UtcNow,                   
            };

            var setSrpResult = hotel.SetSrp(request.SRP);

            if (setSrpResult.Error != null)
                return setSrpResult.Error;

            return hotel;
        }

        public Result<Error> SetSrp(MoneyValue? srp)
        {
            if (srp?.Amount > 100)
                return new InsufficientFundsError(srp.Amount, 100);

            SRP = srp;

            return Result<Error>.Success();
        }

        public int Id { get; private set; }
        public bool IsActive { get; private set; }
        public string Name { get; private set; } = null!;
        public string CountryCode { get; private set; } = null!;
        public DateTime Created { get; private set; }
        public MoneyValue? SRP { get; private set; }
    }
}
