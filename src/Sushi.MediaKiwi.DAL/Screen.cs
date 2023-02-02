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
                Map(x => x.Name, "Name").SqlType(SqlDbType.NVarChar);
                Map(x => x.SectionId, "SectionID");
                Map(x => x.ExternalId, "ExternalID").SqlType(SqlDbType.VarChar);
                Map(x => x.FilePath, "FilePath").SqlType(SqlDbType.VarChar);
            }
        }
        
        public int Id { get; set; }
        public string ExternalId { get; set; }
        public string Name { get; set; }
        public string FilePath { get; set; }
        public int SectionId { get; set; }
    }
}
