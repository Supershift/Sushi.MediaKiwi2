using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL
{
    /// <summary>
    /// Represents the relation between a screen and a role. 
    /// </summary>
    public class ScreenRole
    {
        public class ScreenRoleMap : DataMap<ScreenRole>
        {
            public ScreenRoleMap()
            {
                Table("mk_ScreensRoles");
                Id(x => x.ScreenId, "ScreenID").Assigned();
                Id(x => x.Role, "RoleID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
            }
        }
        
        public int ScreenId { get; set; }
        public string Role { get; set; }
    }
}
