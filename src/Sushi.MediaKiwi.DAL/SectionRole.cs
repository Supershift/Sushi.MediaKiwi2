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
    public class SectionRole
    {
        /// <summary>
        /// Represents the mapping between <see cref="SectionRole"/> and the database.
        /// </summary>
        public class SectionRoleMap : DataMap<SectionRole>
        {
            /// <summary>
            /// Creates a new instance of <see cref="SectionRoleMap"/>.
            /// </summary>
            public SectionRoleMap()
            {
                Table("mk_SectionsRoles");
                Id(x => x.SectionId, "SectionID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Id(x => x.Role, "RoleID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
            }
        }

        /// <summary>
        /// Section to which the role has access.
        /// </summary>
        public string SectionId { get; set; } = null!;

        /// <summary>
        /// Role that has access to the view.
        /// </summary>
        public string Role { get; set; } = null!;
    }
}
