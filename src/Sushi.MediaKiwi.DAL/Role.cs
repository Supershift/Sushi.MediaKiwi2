using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL
{
    /// <summary>
    /// Represents a user role as registered in the identity provider.
    /// </summary>
    public class Role
    {
        /// <summary>
        /// Represents the mapping between <see cref="Role"/> and the database.
        /// </summary>
        public class RoleMap : DataMap<Role>
        {
            /// <summary>
            /// Creates a new instance of <see cref="RoleMap"/>
            /// </summary>
            public RoleMap()
            {
                Table("mk_Roles");
                Id(x => x.Id, "RoleID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
            }
        }
        
        /// <summary>
        /// Unique identifier for the role as registered in the identity provider.
        /// </summary>
        public string Id { get; set; } = null!;
    }
}
