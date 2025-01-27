using AutoMapper;
using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MediaKiwi.Services.Model;

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
        public async Task<Result<ListResult<Locale>, Error>> GetAllAsync(bool onlyEnabled, PagingValues pagingValues)
        {
            // get locales from repository
            var items = await _localeRepository.GetAllAsync(onlyEnabled, pagingValues);

            // map to result
            var itemsDto = _mapper.Map<List<Locale>>(items);

            // create result object
            var result = new ListResult<Locale>(itemsDto, items);            

            return result;
        }

        /// <summary>
        /// Gets a <see cref="Locale"/> instance.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result<Locale, Error>> GetAsync(string id)
        {
            // get locale from repository
            var locale = await _localeRepository.GetAsync(id);

            if (locale == null)
                return new NotFoundError();

            // map to result            
            var result = _mapper.Map<Locale>(locale);

            return result;
        }

        /// <summary>
        /// Creates a new <see cref="Locale"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="locale"></param>
        /// <returns></returns>
        public async Task<Result<Locale, Error>> CreateAsync(string id, Locale locale)
        {
            // get default locale
            var defaultLocale = await _localeRepository.GetDefaultAsync();

            // start transaction
            using (var ts = TransactionUtility.CreateTransactionScope())
            {
                // map to repository model
                var repositoryLocale = _mapper.Map<Locale, Entities.Locale>(locale);
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

                return result;
            }
        }

        /// <summary>
        /// Deletes a <see cref="Locale"/> instance.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result<Error>> DeleteAsync(string id)
        {
            // get locale from repository
            var locale = await _localeRepository.GetAsync(id);

            if (locale == null)
                return new NotFoundError();

            // delete
            await _localeRepository.DeleteAsync(locale);

            return Result.Success<Error>();
        }

        /// <summary>
        /// Updates an existing <see cref="Locale"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="locale"></param>
        /// <returns></returns>
        public async Task<Result<Locale, Error>> UpdateAsync(string id, Locale locale)
        {
            // get existing local
            var repositoryLocale = await _localeRepository.GetAsync(id);            

            if (repositoryLocale == null)
                return new NotFoundError();

            // map to repository model
            _mapper.Map(locale, repositoryLocale);

            // update into repository
            await _localeRepository.UpdateAsync(repositoryLocale);

            // create result
            var result = new Locale();
            _mapper.Map(repositoryLocale, result);

            return result;
        }
    }
}
