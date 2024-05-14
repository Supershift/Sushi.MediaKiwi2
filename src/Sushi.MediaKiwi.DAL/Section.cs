using Sushi.MicroORM.Mapping;
using System.Text.RegularExpressions;

namespace Sushi.MediaKiwi.DAL
{
    /// <summary>
    /// Represents a section containing related screens within a portal.
    /// </summary>
    public class Section
    {
        /// <summary>
        /// Regular expression used to validate a section ID.
        /// </summary>
        public const string SectionIdRegex = @"^\w+$";

        /// <summary>
        /// Maximum number of characters allowed in a setion Id;
        /// </summary>
        public const int SectionIdMaxLength = 64;

        

        /// <summary>
        /// Represents the mapping between a <see cref="Section"/> and the database.
        /// </summary>
        public class SectionMap : DataMap<Section>
        {
            /// <summary>
            /// Creates a new instance of <see cref="SectionMap"/>.
            /// </summary>
            public SectionMap()
            {
                Table("mk_Sections");
                Id(x => x.Id, "SectionID").Assigned().SqlType(System.Data.SqlDbType.VarChar);
                Map(x => x.Name, "Name").SqlType(System.Data.SqlDbType.NVarChar);
                Map(x => x.SortOrder, "SortOrder");
                Map(x => x.Icon, "Icon").SqlType(System.Data.SqlDbType.VarChar);
            }
        }

        /// <summary>
        /// Gets or sets the unique identifier for this section.
        /// </summary>
        public string Id { get; set; } = null!;

        /// <summary>
        /// Gets or sets the name for this section.
        /// </summary>
        public string Name { get; set; } = null!;

        /// <summary>
        /// Gets or sets a value used when sorting sections.
        /// </summary>
        public int SortOrder { get; set; }

        /// <summary>
        /// ID of the icon to display for this section.
        /// </summary>
        public string? Icon { get; set; }

        /// <summary>
        /// Validates if a section ID is valid.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Null if valid, error message if invalid.</returns>
        public static string? ValidateSectionId(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return "New ID is empty";
            if (id.Length > SectionIdMaxLength)
                return "New ID is too long";
            if (!Regex.IsMatch(id, SectionIdRegex))
                return "New ID contains invalid characters.";

            return null;
        }
    }
}