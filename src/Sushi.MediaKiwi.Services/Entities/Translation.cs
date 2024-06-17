using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Entities
{
    /// <summary>
    /// Represents a translation for a specific locale, namespace and key.
    /// </summary>
    public record Translation
    {
        /// <summary>
        /// Represents a mapping of the <see cref="Translation"/> class to the database.
        /// </summary>
        public class TranslationMap : DataMap<Translation>
        {
            /// <summary>
            /// Creates a new instance of the <see cref="TranslationMap"/> class.
            /// </summary>
            public TranslationMap()
            {
                Table("mk_Translations");
                Id(x => x.LocaleId, "LocaleID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Id(x => x.Namespace, "Namespace").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Id(x => x.Key, "TranslationKey").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Map(x => x.Value, "Value").SqlType(System.Data.SqlDbType.NVarChar);
                Map(x => x.IsNew, "IsNew");
            }
        }

        /// <summary>
        /// LocaleId of the translation.
        /// </summary>
        public string LocaleId { get; set; } = null!;
        /// <summary>
        /// Namespace of the translation, used for grouping translations for components, instance or other logical groups.
        /// </summary>
        public string Namespace { get; set; } = null!;
        /// <summary>
        /// Unique key of the translation within the namespace.
        /// </summary>
        public string Key { get; set; } = null!;
        /// <summary>
        /// Translation value.
        /// </summary>
        public string Value { get; set; } = null!;
        /// <summary>
        /// If set to true, indicates this translation was added automically and requires translation.
        /// </summary>
        public bool IsNew { get; set; }
    }
}
