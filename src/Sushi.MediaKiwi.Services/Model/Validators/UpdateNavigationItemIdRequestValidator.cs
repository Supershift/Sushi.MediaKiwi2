using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Model.Validators
{
    internal class UpdateNavigationItemIdRequestValidator : AbstractValidator<UpdateNavigationItemIdRequest>
    {
        public UpdateNavigationItemIdRequestValidator()
        {
            RuleFor(x => x.FromId).NotEmpty();
            RuleFor(x => x.ToId).NotEmpty().MaximumLength(64);
        }
    }
}
