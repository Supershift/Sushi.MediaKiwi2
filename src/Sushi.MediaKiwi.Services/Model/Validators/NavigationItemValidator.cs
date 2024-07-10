using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Model.Validators
{   
    internal class NavigationItemValidator : AbstractValidator<NavigationItem>
    {        
        public NavigationItemValidator()
        {
            RuleFor(x => x.Name).MaximumLength(64).NotEmpty();
            RuleFor(x => x.SectionId).MaximumLength(64).NotEmpty();
            RuleFor(x => x.ParentNavigationItemId).MaximumLength(64);
            RuleFor(x => x.ViewId).MaximumLength(64);
            RuleFor(x => x.Icon).MaximumLength(255);
        }
    }
}
