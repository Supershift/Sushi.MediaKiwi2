using Sushi.MediaKiwi.SampleAPI.Domain;
using Sushi.MicroORM.Mapping;

namespace Sushi.MediaKiwi.SampleAPI.DAL
{
    internal class AccountMap : DataMap<Account>
    {
        public AccountMap()
        {
            Table("Accounts");
            Id(x => x.Number, "Number").Assigned().SqlType(System.Data.SqlDbType.VarChar);
            Map(x => x.HolderName, "HolderName").SqlType(System.Data.SqlDbType.NVarChar);
            Map(x => x.Balance, "Balance");
            Map(x => x.Status, "Status");
        }
    }
}
