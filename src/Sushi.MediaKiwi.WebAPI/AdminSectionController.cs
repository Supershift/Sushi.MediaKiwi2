using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Defines endpoints to manage Sections.
    /// </summary>
    [Route($"{BaseRoute}/sections")]
    [Authorize(Policy = Constants.AdminPolicyName)]
    public class AdminSectionController : MediaKiwiControllerBase
    {
        private readonly SectionService _sectionService;

        /// <summary>
        /// Creates a new instance of the AdminSectionController.
        /// </summary>
        /// <param name="sectionService"></param>
        public AdminSectionController(SectionService sectionService)
        {
            _sectionService = sectionService;
        }

        /// <summary>
        /// Deletes a Section.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{id}")]        
        public async Task<ActionResult<Section>> DeleteSection(string id)
        {
            var result = await _sectionService.DeleteAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Creates a new Section.
        /// </summary>        
        /// <returns></returns>
        [HttpPost]
        [Route("{id}")]        
        public async Task<ActionResult<Section>> CreateSection(
            [Required, StringLength(Services.Entities.Section.SectionIdMaxLength), RegularExpression(Services.Entities.Section.SectionIdRegex)] string id, 
            Section request)
        {   
            var result = await _sectionService.CreateAsync(id, request);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Updates an existing Section.
        /// </summary>        
        /// <returns></returns>
        [HttpPut]
        [Route("{id}")]        
        public async Task<ActionResult<Section>> UpdateSection(string id, Section request)
        {
            var result = await _sectionService.UpdateAsync(id, request);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Change section's id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="newId"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("{id}/updateId")]        
        public async Task<ActionResult<Section>> UpdateId(string id, [FromBody] string newId)
        {
            var result = await _sectionService.UpdateIdAsync(id, newId);
            return this.CreateResponse(result);
        }
    }
}