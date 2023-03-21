using Sushi.MicroORM.Mapping;

namespace Sushi.MediaKiwi.DAL
{
    /// <summary>
    /// Represents a section containing related screens within a portal.
    /// </summary>
    public class Section
    {
        public class SectionMap : DataMap<Section>
        {
            public SectionMap()
            {
                Table("mk_Sections");
                Id(x => x.Id, "SectionID");
                Map(x => x.Name, "Name").SqlType(System.Data.SqlDbType.NVarChar);
                Map(x => x.SortOrder, "SortOrder");
                Map(x => x.Icon, "Icon").SqlType(System.Data.SqlDbType.VarChar);
            }
        }
        
        /// <summary>
        /// Gets or sets the unique identifier for this section.
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// Gets or sets the name for this section.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets a value used when sorting sections.
        /// </summary>
        public int SortOrder { get; set; }

        public string? Icon { get; set; }
    }
}