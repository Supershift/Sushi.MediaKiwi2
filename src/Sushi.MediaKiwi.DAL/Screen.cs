using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
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
                Id(x => x.Id, "Screen_ID");
                Map(x => x.Name, "Screen_Name").SqlType(System.Data.SqlDbType.NVarChar);
                Map(x => x.SectionId, "Screen_Section_Id");
            }
        }
        
        public int Id { get; set; }
        public string Name { get; set; }
        public int SectionId { get; set; }
    }
}
