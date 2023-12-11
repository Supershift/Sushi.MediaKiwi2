using Sushi.MediaKiwi.DAL.User;

namespace Sushi.MediaKiwi.Services.UnitTests.Mocks
{
    public class UserProvider : IUserProvider
    {
        public Actor GetActor()
        {
            return new Actor(ActorType.User, Guid.NewGuid());
        }

        public string GetRole()
        {
            return "Admin";
        }
    }
}
