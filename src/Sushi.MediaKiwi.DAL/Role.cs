using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL
{
    public class Role
    {
        public class RoleMap : DataMap<Role>
        {
            public RoleMap()
            {
                Table("mk_Roles");
                Id(x => x.Id, "RoleID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
            }
        }
        
        public string Id { get; set; }
    }
}
