using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL
{
    public class View
    {
        public class ViewMap : DataMap<View>
        {
            public ViewMap()
            {
                Table("mk_Views");                
                Id(x => x.Id, "ViewID").Assigned().SqlType(SqlDbType.VarChar);
                Map(x => x.ComponentKey, "ComponentKey").SqlType(SqlDbType.VarChar);
                Map(x => x.Name, "Name").SqlType(SqlDbType.NVarChar);                
                Map(x => x.SectionId, "SectionID");
                Map(x => x.ParameterName, "ParameterName").SqlType(SqlDbType.VarChar);
            }
        }
        
        /// <summary>
        /// Gets or sets a human-readable unique ID.
        /// </summary>
        public string Id { get; set; }                
        /// <summary>
        /// Gets or sets the key of the Vue component implementing this view, e.g. ./views/myView.vue, MyKey
        /// </summary>
        public string ComponentKey { get; set; }
        public string Name { get; set; }        
        public int SectionId { get; set; }        
        public string? ParameterName { get; set; }
    }
}
