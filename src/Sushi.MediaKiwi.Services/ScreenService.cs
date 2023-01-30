using AutoMapper;
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
    /// Provides methods to interact with Screen objects.
    /// </summary>
    public class ScreenService
    {
        private readonly IScreenRepository _screenRepository;
        private readonly IMapper _mapper;

        /// <summary>
        /// Creates a new instance of <see cref="ScreenRepository"/>.
        /// </summary>
        /// <param name="screenRepository"></param>
        /// <param name="mapper"></param>
        public ScreenService(
            IScreenRepository screenRepository,
            IMapper mapper)
        {
            _screenRepository = screenRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Gets all screens matching the provided filter parameters.
        /// </summary>
        /// <param name="sectionID"></param>
        /// <returns></returns>
        public async Task<Result<ListResult<Screen>>> GetAllAsync(int? sectionID)
        {
            // get sections from datastore
            var sections = await _screenRepository.GetAllAsync(sectionID);

            // create result object
            var result = new ListResult<Screen>(sections.TotalNumberOfRows, sections.TotalNumberOfPages);

            // map to result
            _mapper.Map(sections, result.Result);

            return new Result<ListResult<Screen>>(result);
        }
    }
}
