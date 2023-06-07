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
        private readonly ITranslationRepository _translationRepository;
        private readonly IMapper _mapper;

        /// <summary>
        /// Creates a new instance of <see cref="LocaleService"/>.
        /// </summary>        
        public LocaleService(ILocaleRepository localeRepository, ITranslationRepository translationRepository, IMapper mapper)
        {
            _localeRepository = localeRepository;
            _translationRepository = translationRepository;
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

        /// <summary>
        /// Gets a <see cref="Locale"/> instance.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result<Locale>> GetAsync(string id)
        {
            // get locale from repository
            var locale = await _localeRepository.GetAsync(id);

            if (locale == null)
                return new Result<Locale>(ResultCode.NotFound);

            // map to result            
            var result = _mapper.Map<Locale>(locale);

            return new Result<Locale>(result);
        }

        /// <summary>
        /// Creates a new <see cref="Locale"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="locale"></param>
        /// <returns></returns>
        public async Task<Result<Locale>> CreateAsync(string id, Locale locale)
        {
            // get default locale
            var defaultLocale = await _localeRepository.GetDefaultAsync();

            // start transaction
            using (var ts = DAL.Utility.CreateTransactionScope())
            {
                // map to repository model
                var repositoryLocale = _mapper.Map<Locale, DAL.Locale>(locale);
                repositoryLocale.Id = id;

                // insert into repository
                await _localeRepository.InsertAsync(repositoryLocale);

                // duplicate translations from default locale, if it exists
                if (defaultLocale != null)
                {
                    await _translationRepository.DuplicateAsync(defaultLocale.Id, repositoryLocale.Id);
                }

                // create result
                var result = new Locale();
                _mapper.Map(repositoryLocale, result);

                // commit
                ts.Complete();

                return new Result<Locale>(result);
            }
        }

        /// <summary>
        /// Deletes a <see cref="Locale"/> instance.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result> DeleteAsync(string id)
        {
            // get locale from repository
            var locale = await _localeRepository.GetAsync(id);

            if (locale == null)
                return new Result<Locale>(ResultCode.NotFound);

            // delete
            await _localeRepository.DeleteAsync(locale);

            return new Result(ResultCode.Success);
        }

        /// <summary>
        /// Updates an existing <see cref="Locale"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="locale"></param>
        /// <returns></returns>
        public async Task<Result<Locale>> UpdateAsync(string id, Locale locale)
        {
            // get existing local
            var repositoryLocale = await _localeRepository.GetAsync(id);            

            if (repositoryLocale == null)
                return new Result<Locale>(ResultCode.NotFound);

            // map to repository model
            _mapper.Map(locale, repositoryLocale);

            // update into repository
            await _localeRepository.UpdateAsync(repositoryLocale);

            // create result
            var result = new Locale();
            _mapper.Map(repositoryLocale, result);

            return new Result<Locale>(result);
        }
    }
}
