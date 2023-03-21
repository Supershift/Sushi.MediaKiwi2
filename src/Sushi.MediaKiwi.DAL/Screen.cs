using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL
{
    public class Screen
    {
        public class ScreenMap : DataMap<Screen>
        {
            public ScreenMap()
            {
                Table("mk_Screens");
                Id(x => x.Id, "ScreenID");
                Map(x => x.ComponentKey, "ComponentKey").SqlType(SqlDbType.VarChar);
                Map(x => x.Name, "Name").SqlType(SqlDbType.NVarChar);                
                Map(x => x.SectionId, "SectionID");                                
            }
        }
        
        public int Id { get; set; }
        /// <summary>
        /// Gets or sets the filename of the Vue the component implementing this screen, 
        /// relative to the components folder, e.g. MyScreen.vue, checkout/Payment.vue
        /// </summary>
        public string ComponentKey { get; set; }
        public string Name { get; set; }
        public string FilePath { get; set; }
        public int SectionId { get; set; }
    }
}
