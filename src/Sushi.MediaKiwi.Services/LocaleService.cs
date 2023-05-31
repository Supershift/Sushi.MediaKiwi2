using AutoMapper;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Provides methods to interact with <see cref="Locale"/> objects.
    /// </summary>
    public class LocaleService
    {
        private readonly ILocaleRepository _localeRepository;
        private readonly IMapper _mapper;

        /// <summary>
        /// Creates a new instance of <see cref="LocaleService"/>.
        /// </summary>
        /// <param name="localeRepository"></param>
        /// <param name="mapper"></param>
        public LocaleService(ILocaleRepository localeRepository, IMapper mapper)
        {
            _localeRepository = localeRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Gets all <see cref="Locale"/> instances.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result<ListResult<Locale>>> GetAllAsync(bool onlyEnabled, PagingValues pagingValues)
        {
            // get locales from repository
            var locales = await _localeRepository.GetAllAsync(onlyEnabled, pagingValues);

            // map to result
            var result = new ListResult<Locale>(locales.TotalNumberOfRows, locales.TotalNumberOfPages);
            _mapper.Map(locales, result.Result);

            return new Result<ListResult<Locale>>(result);
        }
    }
}
