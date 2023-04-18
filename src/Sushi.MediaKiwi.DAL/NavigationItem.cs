using Sushi.MicroORM.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL
{
    public class NavigationItem
    {
        public class NavigationItemMap : DataMap<NavigationItem>
        {
            public NavigationItemMap()
            {
                Table("mk_NavigationItems");
                Id(x => x.Id, "NavigationItemID");
                Map(x => x.Name, "Name");                
                Map(x => x.SectionId, "SectionID");
                Map(x => x.ParentNavigationItemId, "ParentNavigationItemID");
                Map(x => x.ViewId, "ViewID");                
            }
        }
        
        public int Id { get; set; }
        public string Name { get; set; }        
        public int SectionId { get; set; }  
        public int? ParentNavigationItemId { get; set; }
        public int? ViewId { get; set; }        
    }
}
