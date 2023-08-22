using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL
{
    /// <summary>
    /// Represents the relation between a view and a role. 
    /// </summary>
    public class ViewRole
    {
        /// <summary>
        /// Represents the mapping between <see cref="ViewRole"/> and the database.
        /// </summary>
        public class ViewRoleMap : DataMap<ViewRole>
        {
            /// <summary>
            /// Creates a new instance of <see cref="ViewRoleMap"/>.
            /// </summary>
            public ViewRoleMap()
            {
                Table("mk_ViewsRoles");
                Id(x => x.ViewId, "ViewID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Id(x => x.Role, "RoleID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
            }
        }

        /// <summary>
        /// View to which the role has access.
        /// </summary>
        public string ViewId { get; set; } = null!;

        /// <summary>
        /// Role that has access to the view.
        /// </summary>
        public string Role { get; set; } = null!;
    }
}
