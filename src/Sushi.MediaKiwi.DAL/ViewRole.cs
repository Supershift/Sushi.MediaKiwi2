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
        public class ViewRoleMap : DataMap<ViewRole>
        {
            public ViewRoleMap()
            {
                Table("mk_ViewsRoles");
                Id(x => x.ViewId, "ViewID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Id(x => x.Role, "RoleID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
            }
        }
        
        public string ViewId { get; set; }
        public string Role { get; set; }
    }
}
