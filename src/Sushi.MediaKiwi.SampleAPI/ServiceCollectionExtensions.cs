using Microsoft.Extensions.DependencyInjection.Extensions;
using Sushi.MediaKiwi.DAL;

namespace Sushi.MediaKiwi.SampleAPI
{
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Adds all services needed to run MediaKiwi to the <paramref name="collection"/>, including Sushi.MicroOrm.
        /// </summary>        
        /// <returns></returns>
        public static IServiceCollection AddSampleApiServices(this IServiceCollection collection)
        {
            // add repositories
            collection.TryAddTransient<DAL.Repository.CountryRepository>();
            collection.TryAddTransient<DAL.Repository.HotelRepository>();

            // add services
            collection.TryAddTransient<Service.CountryService>();
            collection.TryAddTransient<Service.HotelService>();
            collection.TryAddTransient<Service.FileUploadService>();

            // add infrastructure
            collection.AddMediaKiwiDAL();

            return collection;
        }
    }
}
