using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    public interface IRoleRepository
    {
        Task<QueryListResult<Role>> GetAllAsync();
    }
}
