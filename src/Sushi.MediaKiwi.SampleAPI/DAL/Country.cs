using Sushi.MicroORM.Mapping;

namespace Sushi.MediaKiwi.SampleAPI.DAL
{
    public class Country
    {
        public class CountryMap : DataMap<Country>
        {
            public CountryMap()
            {
                Table("Countries");
                Id(x => x.Code, "Code").Assigned().SqlType(System.Data.SqlDbType.Char);
                Map(x => x.Name, "Name").SqlType(System.Data.SqlDbType.NVarChar);
            }
        }

        /// <summary>
        /// Gets or sets the ISO country code
        /// </summary>
        public string Code { get; set; } = null!;
        
        /// <summary>
        /// Name of the country
        /// </summary>
        public string Name { get; set; } = null!;
    }
}
