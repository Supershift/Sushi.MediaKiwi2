using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL
{
    public record Translation
    {
        public class TranslationMap : DataMap<Translation>
        {
            public TranslationMap()
            {
                Table("mk_Translations");
                Id(x => x.LocaleId, "LocaleID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Id(x => x.Namespace, "Namespace").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Id(x => x.Key, "TranslationKey").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Map(x => x.Value, "Value").Assigned().SqlType(System.Data.SqlDbType.NVarChar);
            }
        }
        
        public string LocaleId { get; set; }
        public string Namespace { get; set; }
        public string Key { get; set; }        
        public string Value { get; set; }
    }
}
