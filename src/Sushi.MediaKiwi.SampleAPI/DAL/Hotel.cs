using Sushi.MediaKiwi.DAL;
using Sushi.MicroORM.Mapping;

namespace Sushi.MediaKiwi.SampleAPI.DAL
{
    public class Hotel
    {
        public class HotelMap : DataMap<Hotel>
        {
            public HotelMap()
            {
                Table("Hotels");
                Id(x => x.Id, "HotelID").Identity();
                Map(x => x.IsActive, "IsActive");
                Map(x => x.Name, "Name").SqlType(System.Data.SqlDbType.NVarChar).Length(256);
                Map(x => x.CountryCode, "CountryCode").SqlType(System.Data.SqlDbType.Char).Length(2);
                Map(x => x.Created, "Created").ReadOnly();
                Map(x => x.SRP!.Currency, "SRP_Currency").SqlType(System.Data.SqlDbType.Char).Length(3);
                Map(x => x.SRP!.Amount, "SRP_Amount");
            }
        }

        public int Id { get; set; }
        public bool IsActive { get; set; }
        public string Name { get; set; } = null!;
        public string CountryCode { get; set; } = null!;
        public DateTime Created { get; set; }
        public MoneyValue? SRP { get; set; }
    }
}
