using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Entities
{
    /// <summary>
    /// Represents a locale used in localization.
    /// </summary>
    public record Locale
    {
        /// <summary>
        /// Represents the mapping between a <see cref="Locale"/> and the database.
        /// </summary>
        public class LocaleMap : DataMap<Locale>
        {
            /// <summary>
            /// Creates a new instance of <see cref="LocaleMap"/>
            /// </summary>
            public LocaleMap()
            {
                Table("mk_Locales");
                Id(x => x.Id, "LocaleID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Map(x => x.Name, "Name").SqlType(System.Data.SqlDbType.NVarChar);
                Map(x => x.IsEnabled, "IsEnabled");
                Map(x => x.IsDefault, "IsDefault");
            }
        }

        /// <summary>
        /// Unique id of the locale, following ISO standards, e.g. en, jp, nl-NL, en-US
        /// </summary>
        public string Id { get; set; } = null!;

        /// <summary>
        /// Display name of the locale in its own language.
        /// </summary>
        public string Name { get; set; } = null!;

        /// <summary>
        /// If set to true, this locale can be used.
        /// </summary>
        public bool IsEnabled { get; set; }

        /// <summary>
        /// If set to true, this is the default locale.
        /// </summary>
        public bool IsDefault { get; set; }
    }
}
