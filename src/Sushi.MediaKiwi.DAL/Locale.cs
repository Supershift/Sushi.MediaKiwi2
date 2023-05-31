using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL
{
    public class Locale
    {
        public class LocaleMap : DataMap<Locale>
        {
            public LocaleMap()
            {
                Table("mk_Locales");
                Id(x => x.Id, "LocaleID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Map(x => x.Name, "Name").SqlType(System.Data.SqlDbType.NVarChar);
                Map(x => x.IsEnabled, "IsEnabled");
            }
        }
        
        public string Id { get; set; }
        public string Name { get; set; }
        public bool IsEnabled { get; set; }
    }
}
