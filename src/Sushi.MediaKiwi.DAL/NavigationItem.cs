using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL
{
    /// <summary>
    /// Represents an item in the navigation tree
    /// </summary>
    public class NavigationItem
    {
        /// <summary>
        /// Regular expression used to validate an ID.
        /// </summary>
        public const string IdRegex = @"^\w+$";

        /// <summary>
        /// Maximum number of characters allowed in an Id;
        /// </summary>
        public const int IdMaxLength = 64;

        /// <summary>
        /// Represents the mapping between <see cref="NavigationItem"/> and the database
        /// </summary>
        public class NavigationItemMap : DataMap<NavigationItem>
        {
            /// <summary>
            /// Creates a new instance of <see cref="NavigationItemMap"/>
            /// </summary>
            public NavigationItemMap()
            {
                Table("mk_NavigationItems");
                Id(x => x.Id, "NavigationItemID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Map(x => x.Name, "Name");
                Map(x => x.SectionId, "SectionID").SqlType(System.Data.SqlDbType.VarChar);
                Map(x => x.ParentNavigationItemId, "ParentNavigationItemID").SqlType(System.Data.SqlDbType.VarChar);
                Map(x => x.ViewId, "ViewID").SqlType(System.Data.SqlDbType.VarChar);
                Map(x => x.Icon, "Icon");
                Map(x => x.SortOrder, "SortOrder");
            }
        }

        /// <summary>
        /// Unique identifier for the item.
        /// </summary>
        public string Id { get; set; } = null!;
        /// <summary>
        /// Default display name for the item.
        /// </summary>
        public string Name { get; set; } = null!;
        /// <summary>
        /// Section to which this item belongs.
        /// </summary>
        public string SectionId { get; set; } = null!;
        /// <summary>
        /// If set, parent of the item in the tree.
        /// </summary>
        public string? ParentNavigationItemId { get; set; }
        /// <summary>
        /// If set, id of the view to which this item navigates.
        /// </summary>
        public string? ViewId { get; set; } = null!;

        /// <summary>
        /// If set, adds an Icon infront of the navigation Item
        /// </summary>
        public string? Icon { get; set; } = null!;

        /// <summary>
        /// Gets or sets a value used when sorting navigation items.
        /// </summary>
        public int SortOrder { get; set; }

        /// <summary>
        /// Validates if an ID is valid.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Null if valid, error message if invalid.</returns>
        public static string? ValidateId(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return "New ID is empty";
            if (id.Length > IdMaxLength)
                return "New ID is too long";
            if (!Regex.IsMatch(id, IdRegex))
                return "New ID contains invalid characters.";

            return null;
        }
    }
}
