using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Entities
{
    /// <summary>
    /// Represents a view in the application.
    /// </summary>
    public class View
    {
        /// <summary>
        /// Represents the mapping between <see cref="View"/> and the database.
        /// </summary>
        public class ViewMap : DataMap<View>
        {
            /// <summary>
            /// Creates a new instance of <see cref="ViewMap"/>.
            /// </summary>
            public ViewMap()
            {
                Table("mk_Views");                
                Id(x => x.Id, "ViewID").Assigned().SqlType(SqlDbType.VarChar);
                Map(x => x.ComponentKey, "ComponentKey").SqlType(SqlDbType.VarChar);
                Map(x => x.Name, "Name").SqlType(SqlDbType.NVarChar);                                
                Map(x => x.ParameterName, "ParameterName").SqlType(SqlDbType.VarChar);
            }
        }

        /// <summary>
        /// Gets or sets a human-readable unique ID.
        /// </summary>
        public string Id { get; set; } = null!;
        /// <summary>
        /// Gets or sets the key of the Vue component implementing this view, e.g. ./views/myView.vue, MyKey
        /// </summary>
        public string ComponentKey { get; set; } = null!;

        /// <summary>
        /// Name for this view.
        /// </summary>
        public string Name { get; set; } = null!;

        /// <summary>
        /// Name of the URL parameter required by this view.
        /// </summary>
        public string? ParameterName { get; set; } = null!;
    }
}
