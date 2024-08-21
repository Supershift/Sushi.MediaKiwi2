using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Provides endpoints for managing NavigationItems.
    /// </summary>
    [Route($"{BaseRoute}/navigationitems")]
    [Authorize(Policy = Constants.AdminPolicyName)]
    public class AdminNavigationItemController : MediaKiwiControllerBase
    {
        private readonly NavigationItemService _navigationItemService;        

        /// <summary>
        /// Creates a new instance of the AdminNavigationItemController.
        /// </summary>
        /// <param name="screenService"></param>
        public AdminNavigationItemController(NavigationItemService screenService)
        {
            _navigationItemService = screenService;            
        }

        /// <summary>
        /// Deletes a NavigationItem.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<NavigationItem>> DeleteNavigationItem(string id)
        {
            var result = await _navigationItemService.DeleteAsync(id);
            return this.ToResponse(result);
        }        

        /// <summary>
        /// Creates a new NavigationItem.
        /// </summary>        
        /// <returns></returns>
        [HttpPost]
        [Route("{id}")]
        public async Task<ActionResult<NavigationItem>> CreateNavigationItem(
            [Required, StringLength(64), RegularExpression(@"[\w]*$")] string id, NavigationItem request)
        {
            var result = await _navigationItemService.CreateAsync(id, request);
            return this.ToResponse(result);
        }

        /// <summary>
        /// Updates an existing NavigationItem.
        /// </summary>        
        /// <returns></returns>
        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<NavigationItem>> UpdateNavigationItem(string id, NavigationItem request)
        {
            var result = await _navigationItemService.UpdateAsync(id, request);
            return this.ToResponse(result);
        }

        /// <summary>
        /// Change section's id.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="newId"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("{id}/updateId")]        
        public async Task<ActionResult<NavigationItem>> UpdateId(string id, [FromBody] string newId)
        {
            var request = new UpdateNavigationItemIdRequest() { FromId = id, ToId = newId };
            var result = await _navigationItemService.UpdateIdAsync(request);
            return this.ToResponse(result);
        }
    }
}