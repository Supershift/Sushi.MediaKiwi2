using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Model
{
    /// <summary>
    /// Represents a user role as registered in the identity provider.
    /// </summary>
    public class Role
    {
        /// <summary>
        /// Unique identifier for the role as registered in the identity provider.
        /// </summary>
        public string Id { get; set; } = null!;
    }
}
