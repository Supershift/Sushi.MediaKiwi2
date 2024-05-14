using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;
using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/sections")]
    public class SectionController : MediaKiwiControllerBase
    {
        private readonly SectionService _sectionService;
        private readonly PagingRetriever _pagingRetriever;

        public SectionController(SectionService sectionService, PagingRetriever pagingRetriever)
        {
            _sectionService = sectionService;
            _pagingRetriever = pagingRetriever;
        }

        /// <summary>
        /// Deletes a Section.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{id}")]
        [Authorize(Policy = Constants.AdminPolicyName)]
        public async Task<ActionResult<Section>> DeleteSection(string id)
        {
            var result = await _sectionService.DeleteAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets all sections.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [QueryStringPaging]
        public async Task<ActionResult<ListResult<Section>>> GetSections()
        {
            var pagingValues = _pagingRetriever.GetPaging();
            var result = await _sectionService.GetAllAsync(pagingValues);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets a Section.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<Section>> GetSection(string id)
        {
            var result = await _sectionService.GetAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Creates a new Section.
        /// </summary>        
        /// <returns></returns>
        [HttpPost]
        [Route("{id}")]
        [Authorize(Policy = Constants.AdminPolicyName)]
        public async Task<ActionResult<Section>> CreateSection(
            [Required, StringLength(DAL.Section.SectionIdMaxLength), RegularExpression(DAL.Section.SectionIdRegex)] string id, 
            Section request)
        {
            request.Id = id;
            var result = await _sectionService.SaveAsync(null, request);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Updates an existing Section.
        /// </summary>        
        /// <returns></returns>
        [HttpPut]
        [Route("{id}")]
        [Authorize(Policy = Constants.AdminPolicyName)]
        public async Task<ActionResult<Section>> UpdateSection(string id, Section request)
        {
            var result = await _sectionService.SaveAsync(id, request);
            return this.CreateResponse(result);
        }

        [HttpPost]
        public async Task<ActionResult<Section>> ChangeId(string oldId, string newId)
        {
            var result = await _sectionService.UpdateSectionId(oldId, newId);
            return this.CreateResponse(result);
        }
    }
}